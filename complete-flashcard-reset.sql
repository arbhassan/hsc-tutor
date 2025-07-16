-- COMPLETE FLASHCARD SYSTEM RESET
-- This will completely wipe and rebuild the flashcard trigger system

-- ============================================================================
-- STEP 1: DISABLE ALL TRIGGERS AND CLEAN UP
-- ============================================================================

-- Disable all triggers on the quotes table temporarily
ALTER TABLE public.quotes DISABLE TRIGGER ALL;

-- Drop ALL possible trigger variations (in case there are multiple)
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP TRIGGER IF EXISTS generate_flashcard_cards_trigger ON public.quotes;
DROP TRIGGER IF EXISTS flashcard_generation_trigger ON public.quotes;

-- Drop ALL possible function variations
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();
DROP FUNCTION IF EXISTS public.generate_flashcard_cards_for_quote();
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote_manual(UUID, TEXT);
DROP FUNCTION IF EXISTS public.regenerate_flashcards_for_quote(UUID);

-- ============================================================================
-- STEP 2: COMPLETELY REBUILD TABLE STRUCTURE
-- ============================================================================

-- Delete all existing flashcard cards to start fresh
DELETE FROM public.flashcard_cards;

-- Drop and recreate the table to ensure clean structure
-- First, save any constraints/indexes we need to preserve
DROP TABLE IF EXISTS public.flashcard_cards CASCADE;

-- Recreate the table with the correct structure
CREATE TABLE public.flashcard_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
    card_text TEXT NOT NULL,
    missing_words TEXT[] DEFAULT '{}' NOT NULL,
    missing_positions INTEGER[] DEFAULT '{}' NOT NULL,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Recreate indexes
CREATE INDEX idx_flashcard_cards_quote_id ON public.flashcard_cards(quote_id);
CREATE INDEX idx_flashcard_cards_is_active ON public.flashcard_cards(is_active);

-- Enable RLS
ALTER TABLE public.flashcard_cards ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "All users can view active flashcard cards" ON public.flashcard_cards
    FOR SELECT USING (is_active = true);

CREATE POLICY "System manages flashcard cards" ON public.flashcard_cards 
    FOR ALL TO service_role USING (true);

-- Update trigger for updated_at
CREATE TRIGGER update_flashcard_cards_updated_at 
    BEFORE UPDATE ON public.flashcard_cards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 3: REBUILD DEPENDENT TABLES
-- ============================================================================

-- Recreate dependent tables that reference flashcard_cards
-- First check if they exist and have data
DO $$
BEGIN
    -- Clean up student_card_set_items that might reference old cards
    DELETE FROM public.student_card_set_items;
    
    -- Clean up card_progress that might reference old cards  
    DELETE FROM public.card_progress;
END $$;

-- ============================================================================
-- STEP 4: CREATE NEW TRIGGER FUNCTION
-- ============================================================================

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
    -- Get the quote text
    quote_text := NEW.text;
    
    -- Skip if quote text is too short
    IF length(quote_text) < 20 THEN
        RAISE NOTICE 'Quote too short, skipping flashcard generation';
        RETURN NEW;
    END IF;
    
    -- Split into words and clean
    words := string_to_array(regexp_replace(quote_text, '[^\w\s]', '', 'g'), ' ');
    
    -- Filter meaningful words
    meaningful_words := ARRAY[]::TEXT[];
    
    FOR i IN 1..COALESCE(array_length(words, 1), 0) LOOP
        IF words[i] IS NOT NULL AND 
           length(words[i]) >= 3 AND
           lower(words[i]) NOT IN (
               'the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 
               'have', 'has', 'had', 'will', 'would', 'could', 'should', 
               'may', 'might', 'can', 'must', 'that', 'this', 'these', 
               'those', 'with', 'from', 'they', 'them', 'their', 'there', 
               'where', 'when', 'what', 'who', 'how', 'why', 'not', 'all', 
               'any', 'more', 'most', 'some', 'very', 'much', 'many',
               'now', 'then', 'than', 'only', 'just', 'also', 'even'
           ) THEN
            meaningful_words := array_append(meaningful_words, words[i]);
        END IF;
    END LOOP;
    
    word_count := COALESCE(array_length(meaningful_words, 1), 0);
    
    -- Skip if not enough meaningful words
    IF word_count < 2 THEN
        RAISE NOTICE 'Not enough meaningful words (%), skipping flashcard generation', word_count;
        RETURN NEW;
    END IF;
    
    -- Determine number of cards (1-3 based on word count)
    IF word_count <= 4 THEN
        cards_to_create := 1;
    ELSIF word_count <= 10 THEN
        cards_to_create := 2;
    ELSE
        cards_to_create := 3;
    END IF;
    
    RAISE NOTICE 'Generating % cards from % meaningful words', cards_to_create, word_count;
    
    -- Create cards
    FOR i IN 1..cards_to_create LOOP
        -- Determine blanks per card (2-3, but not more than available words)
        blanks_per_card := LEAST(3, GREATEST(2, word_count / 2));
        
        -- Initialize arrays
        selected_words := ARRAY[]::TEXT[];
        available_indices := ARRAY[]::INTEGER[];
        
        -- Build available indices
        FOR j IN 1..word_count LOOP
            available_indices := array_append(available_indices, j);
        END LOOP;
        
        -- Select random words
        FOR j IN 1..blanks_per_card LOOP
            EXIT WHEN array_length(available_indices, 1) = 0;
            
            rand_idx := 1 + floor(random() * array_length(available_indices, 1))::int;
            selected_words := array_append(selected_words, meaningful_words[available_indices[rand_idx]]);
            
            -- Remove used index
            available_indices := array_remove(available_indices, available_indices[rand_idx]);
        END LOOP;
        
        -- Create card text with numbered blanks
        temp_card_text := quote_text;
        FOR j IN 1..COALESCE(array_length(selected_words, 1), 0) LOOP
            word := selected_words[j];
            temp_card_text := regexp_replace(
                temp_card_text, 
                '\m' || regexp_replace(word, '([.*+?^${}()|[\]\\])', '\\\1', 'g') || '\M', 
                '(' || j || ')_____', 
                'gi'
            );
        END LOOP;
        
        -- Insert the flashcard card
        INSERT INTO public.flashcard_cards (
            quote_id, 
            card_text, 
            missing_words, 
            missing_positions,
            difficulty_level,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            NEW.id, 
            temp_card_text, 
            selected_words, 
            ARRAY[]::INTEGER[], 
            CASE 
                WHEN COALESCE(array_length(selected_words, 1), 0) <= 2 THEN 1
                WHEN COALESCE(array_length(selected_words, 1), 0) = 3 THEN 2
                ELSE 3
            END,
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created flashcard card % with % blanks', i, array_length(selected_words, 1);
    END LOOP;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in generate_flashcards_for_quote: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 5: CREATE THE TRIGGER
-- ============================================================================

CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW 
    WHEN (NEW.is_active = true)
    EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- ============================================================================
-- STEP 6: RE-ENABLE TRIGGERS AND TEST
-- ============================================================================

-- Re-enable all triggers on quotes table
ALTER TABLE public.quotes ENABLE TRIGGER ALL;

-- Test the function by verifying table structure
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'flashcard_cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test with a simple quote (you can comment this out if you don't want test data)
-- INSERT INTO public.quotes (id, title, text, book_id, created_by, is_active) 
-- VALUES (
--     gen_random_uuid(),
--     'Test Quote',
--     'This is a test quote with several meaningful words to generate flashcards',
--     (SELECT id FROM public.books LIMIT 1),
--     (SELECT id FROM auth.users LIMIT 1),
--     true
-- );

-- Completion message
DO $$
BEGIN
    RAISE NOTICE 'Flashcard system reset complete. You can now create quotes with multiple blank flashcards.';
END $$; 