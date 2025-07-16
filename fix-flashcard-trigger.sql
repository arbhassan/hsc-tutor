-- Fix flashcard trigger to use new column structure
-- Run this to fix the remaining column reference issues

-- Drop and recreate the trigger function with correct column names
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();

-- Verify table structure
DO $$
BEGIN
    -- Check if old columns still exist and drop them
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_word'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_word;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_position'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_position;
    END IF;
    
    -- Add new columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_words'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_words TEXT[] DEFAULT '{}' NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' 
        AND column_name = 'missing_positions'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_positions INTEGER[] DEFAULT '{}' NOT NULL;
    END IF;
END $$;

-- Create the corrected trigger function
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
BEGIN
    quote_text := NEW.text;
    
    -- Skip if quote text is too short
    IF length(quote_text) < 20 THEN
        RETURN NEW;
    END IF;
    
    -- Split into words and clean
    words := string_to_array(regexp_replace(quote_text, '[^\w\s]', '', 'g'), ' ');
    
    -- Filter meaningful words (length >= 3, not common words)
    meaningful_words := ARRAY[]::TEXT[];
    FOR i IN 1..array_length(words, 1) LOOP
        IF words[i] IS NOT NULL AND 
           length(words[i]) >= 3 AND
           words[i] NOT IN ('the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 
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
        card_text := quote_text;
        FOR j IN 1..array_length(selected_words, 1) LOOP
            word := selected_words[j];
            card_text := regexp_replace(
                card_text, 
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
            card_text, 
            selected_words, 
            ARRAY[]::INTEGER[], -- Simplified - not tracking exact positions
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

-- Recreate the trigger
CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- Test the function by checking existing structure
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'flashcard_cards' 
AND table_schema = 'public'
ORDER BY ordinal_position; 