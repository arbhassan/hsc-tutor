-- FIX FOR FLASHCARD SCHEMA MISMATCH
-- Copy and paste this into your Supabase SQL editor

-- Step 1: Drop the old trigger and function
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();

-- Step 2: Fix table columns
DO $$
BEGIN
    -- Remove old columns if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_word'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_word;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_position'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_position;
    END IF;
    
    -- Add new columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_words'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_words TEXT[] DEFAULT '{}' NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_positions'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_positions INTEGER[] DEFAULT '{}' NOT NULL;
    END IF;
END $$;

-- Step 3: Create the corrected trigger function
CREATE OR REPLACE FUNCTION public.generate_flashcards_for_quote()
RETURNS TRIGGER AS $$
DECLARE
    quote_text TEXT;
    words TEXT[];
    meaningful_words TEXT[];
    word_count INTEGER;
    cards_to_create INTEGER;
    blanks_per_card INTEGER;
    card_text TEXT;
    selected_words TEXT[];
    word TEXT;
    i INTEGER;
    j INTEGER;
    rand_idx INTEGER;
    available_indices INTEGER[];
    temp_card_text TEXT;
BEGIN
    quote_text := NEW.text;
    
    -- Skip if quote text is too short
    IF length(quote_text) < 20 THEN
        RETURN NEW;
    END IF;
    
    -- Split into words and clean
    words := string_to_array(regexp_replace(quote_text, '[^\w\s]', '', 'g'), ' ');
    
    -- Filter meaningful words
    meaningful_words := ARRAY[]::TEXT[];
    FOR i IN 1..array_length(words, 1) LOOP
        IF words[i] IS NOT NULL AND 
           length(words[i]) >= 3 AND
           lower(words[i]) NOT IN ('the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 
                           'have', 'has', 'had', 'will', 'would', 'could', 'should', 
                           'may', 'might', 'can', 'must', 'that', 'this', 'these', 
                           'those', 'with', 'from', 'they', 'them', 'their', 'there', 
                           'where', 'when', 'what', 'who', 'how', 'why', 'not', 'all', 
                           'any', 'more', 'most', 'some', 'very', 'much', 'many') THEN
            meaningful_words := array_append(meaningful_words, words[i]);
        END IF;
    END LOOP;
    
    word_count := array_length(meaningful_words, 1);
    
    -- Skip if not enough meaningful words
    IF word_count < 3 THEN
        RETURN NEW;
    END IF;
    
    -- Determine number of cards (1-3 based on word count)
    IF word_count <= 6 THEN
        cards_to_create := 1;
    ELSIF word_count <= 12 THEN
        cards_to_create := 2;
    ELSE
        cards_to_create := 3;
    END IF;
    
    -- Create cards
    FOR i IN 1..cards_to_create LOOP
        -- Determine blanks per card (2-3)
        blanks_per_card := CASE 
            WHEN word_count >= 6 THEN 3
            ELSE 2
        END;
        
        IF blanks_per_card > word_count THEN
            blanks_per_card := word_count;
        END IF;
        
        -- Select random words
        selected_words := ARRAY[]::TEXT[];
        available_indices := ARRAY[]::INTEGER[];
        
        -- Build available indices array
        FOR j IN 1..word_count LOOP
            available_indices := array_append(available_indices, j);
        END LOOP;
        
        -- Pick random words
        FOR j IN 1..blanks_per_card LOOP
            IF array_length(available_indices, 1) > 0 THEN
                rand_idx := 1 + floor(random() * array_length(available_indices, 1))::int;
                selected_words := array_append(selected_words, meaningful_words[available_indices[rand_idx]]);
                
                -- Remove used index
                available_indices := array_remove(available_indices, available_indices[rand_idx]);
            END IF;
        END LOOP;
        
        -- Create card text with blanks
        temp_card_text := quote_text;
        FOR j IN 1..array_length(selected_words, 1) LOOP
            word := selected_words[j];
            temp_card_text := regexp_replace(
                temp_card_text, 
                '\m' || word || '\M', 
                '(' || j || ')_____', 
                'gi'
            );
        END LOOP;
        
        -- Insert the card with correct column names
        INSERT INTO public.flashcard_cards (
            quote_id, 
            card_text, 
            missing_words, 
            missing_positions,
            difficulty_level,
            is_active
        ) VALUES (
            NEW.id, 
            temp_card_text, 
            selected_words, 
            ARRAY[]::INTEGER[], 
            CASE 
                WHEN array_length(selected_words, 1) <= 2 THEN 1
                WHEN array_length(selected_words, 1) = 3 THEN 2
                ELSE 3
            END,
            true
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Recreate the trigger
CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- Step 5: Verify the fix worked
SELECT 'Database schema fix completed successfully!' as message; 