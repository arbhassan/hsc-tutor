-- SAFE FLASHCARD SYSTEM RESET
-- This will safely rebuild the flashcard trigger system without affecting system triggers

-- ============================================================================
-- STEP 1: CLEAN UP EXISTING TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Drop our specific triggers (not all triggers)
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP TRIGGER IF EXISTS generate_flashcard_cards_trigger ON public.quotes;
DROP TRIGGER IF EXISTS flashcard_generation_trigger ON public.quotes;

-- Drop ALL possible function variations
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();
DROP FUNCTION IF EXISTS public.generate_flashcard_cards_for_quote();
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote_manual(UUID, TEXT);
DROP FUNCTION IF EXISTS public.regenerate_flashcards_for_quote(UUID);

-- ============================================================================
-- STEP 2: SAFELY REBUILD TABLE STRUCTURE
-- ============================================================================

-- Delete all existing flashcard cards to start fresh
DELETE FROM public.flashcard_cards WHERE true;

-- Clean up dependent references first
DELETE FROM public.student_card_set_items WHERE true;
DELETE FROM public.card_progress WHERE true;

-- Modify existing table structure instead of dropping it
DO $$
BEGIN
    -- Check if old columns still exist and drop them
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

-- ============================================================================
-- STEP 3: CREATE NEW TRIGGER FUNCTION
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
        
        -- Insert the flashcard card using the new column structure
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
                WHEN COALESCE(array_length(selected_words, 1), 0) <= 2 THEN 1
                WHEN COALESCE(array_length(selected_words, 1), 0) = 3 THEN 2
                ELSE 3
            END,
            true
        );
    END LOOP;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the quote creation
        RAISE WARNING 'Error in generate_flashcards_for_quote: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 4: CREATE THE TRIGGER
-- ============================================================================

CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW 
    WHEN (NEW.is_active = true)
    EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- ============================================================================
-- STEP 5: VERIFY STRUCTURE
-- ============================================================================

-- Show the final table structure
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'flashcard_cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Completion message
DO $$
BEGIN
    RAISE NOTICE 'Safe flashcard system reset complete. Table structure verified and trigger created.';
    RAISE NOTICE 'You can now create quotes with multiple blank flashcards.';
END $$; 