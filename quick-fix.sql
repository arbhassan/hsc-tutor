-- QUICK FIX: Run these commands ONE BY ONE in Supabase SQL Editor

-- Step 1: Remove ALL triggers first
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP TRIGGER IF EXISTS auto_generate_flashcards ON public.quotes;
DROP TRIGGER IF EXISTS generate_flashcard_cards_trigger ON public.quotes;
DROP TRIGGER IF EXISTS flashcard_generation_trigger ON public.quotes;

-- Step 2: Remove ALL functions
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();
DROP FUNCTION IF EXISTS public.generate_flashcards_from_quote();
DROP FUNCTION IF EXISTS public.generate_flashcard_cards_for_quote();

-- Step 3: Now try creating a quote - it should work (no flashcards will be generated yet)
-- Test this step before continuing!

-- Step 4: Fix the table columns (run this only after Step 3 works)
DO $$
BEGIN
    -- Remove old columns if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' AND column_name = 'missing_word'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_word;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' AND column_name = 'missing_position'
    ) THEN
        ALTER TABLE public.flashcard_cards DROP COLUMN missing_position;
    END IF;
    
    -- Add new columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' AND column_name = 'missing_words'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_words TEXT[] DEFAULT '{}' NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flashcard_cards' AND column_name = 'missing_positions'
    ) THEN
        ALTER TABLE public.flashcard_cards ADD COLUMN missing_positions INTEGER[] DEFAULT '{}' NOT NULL;
    END IF;
END $$;

-- Step 5: Create the new function (only run after Step 4)
CREATE OR REPLACE FUNCTION public.generate_flashcards_for_quote()
RETURNS TRIGGER AS $$
DECLARE
    quote_text TEXT;
    words TEXT[];
    meaningful_words TEXT[];
    word_count INTEGER;
    cards_to_create INTEGER;
    selected_words TEXT[];
    temp_card_text TEXT;
    word TEXT;
    i INTEGER;
    j INTEGER;
BEGIN
    quote_text := NEW.text;
    
    IF length(quote_text) < 20 THEN
        RETURN NEW;
    END IF;
    
    -- Simple word extraction
    words := string_to_array(regexp_replace(quote_text, '[^\w\s]', '', 'g'), ' ');
    
    -- Filter meaningful words
    meaningful_words := ARRAY[]::TEXT[];
    FOR i IN 1..array_length(words, 1) LOOP
        IF words[i] IS NOT NULL AND length(words[i]) >= 4 THEN
            meaningful_words := array_append(meaningful_words, words[i]);
        END IF;
    END LOOP;
    
    word_count := array_length(meaningful_words, 1);
    
    IF word_count < 2 THEN
        RETURN NEW;
    END IF;
    
    -- Create 1-2 simple cards
    cards_to_create := LEAST(2, word_count);
    
    FOR i IN 1..cards_to_create LOOP
        -- Pick 1-2 words
        selected_words := ARRAY[]::TEXT[];
        FOR j IN 1..LEAST(2, word_count) LOOP
            word := meaningful_words[j + (i-1)];
            IF word IS NOT NULL THEN
                selected_words := array_append(selected_words, word);
            END IF;
        END LOOP;
        
        -- Create card text
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
        
        -- Insert with new column names
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
            1,
            true
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create the trigger (only run after Step 5)
CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION public.generate_flashcards_for_quote(); 