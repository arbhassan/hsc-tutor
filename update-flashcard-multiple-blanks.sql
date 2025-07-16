-- Migration: Update flashcard system to support multiple blanks
-- This script updates the flashcard_cards table and generation function to support randomized multiple blanks

-- ============================================================================
-- BACKUP AND ALTER TABLE STRUCTURE
-- ============================================================================

-- First, let's backup the existing data
CREATE TEMP TABLE flashcard_cards_backup AS
SELECT * FROM public.flashcard_cards;

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS generate_flashcards_on_quote_insert ON public.quotes;
DROP FUNCTION IF EXISTS public.generate_flashcards_for_quote();

-- Alter the table structure to support multiple blanks
ALTER TABLE public.flashcard_cards 
DROP COLUMN IF EXISTS missing_word,
DROP COLUMN IF EXISTS missing_position;

ALTER TABLE public.flashcard_cards 
ADD COLUMN missing_words TEXT[] DEFAULT '{}' NOT NULL,
ADD COLUMN missing_positions INTEGER[] DEFAULT '{}' NOT NULL;

-- ============================================================================
-- NEW FLASHCARD GENERATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_flashcards_for_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word_count INTEGER;
    cards_to_create INTEGER;
    blanks_per_card INTEGER;
    card_text TEXT;
    selected_words TEXT[];
    selected_positions INTEGER[];
    word TEXT;
    position_in_text INTEGER;
    i INTEGER;
    j INTEGER;
    word_indices INTEGER[];
    random_index INTEGER;
    current_text TEXT;
BEGIN
    -- Skip if quote text is too short
    IF length(NEW.text) < 10 THEN
        RETURN NEW;
    END IF;
    
    -- Split text into words (filtering out short words and common words)
    words := string_to_array(
        regexp_replace(NEW.text, '[^\w\s]', '', 'g'), 
        ' '
    );
    
    -- Filter out short words, common words, and empty strings
    words := array(
        SELECT word 
        FROM unnest(words) AS word 
        WHERE length(word) >= 3 
        AND word NOT IN ('the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'that', 'this', 'these', 'those', 'with', 'from', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'his', 'her', 'him', 'she', 'you', 'your', 'our', 'not', 'all', 'any', 'more', 'most', 'some', 'very', 'much', 'many', 'now', 'then', 'than', 'only', 'just', 'also', 'even', 'still', 'again', 'back', 'here', 'out', 'off', 'down', 'over', 'after', 'before', 'through', 'during', 'above', 'below', 'between', 'among', 'into', 'onto', 'upon', 'about', 'around', 'across', 'along', 'beside', 'beyond', 'within', 'without')
        AND word ~ '^[A-Za-z]+$'
    );
    
    word_count := array_length(words, 1);
    
    -- Skip if not enough meaningful words
    IF word_count < 3 THEN
        RETURN NEW;
    END IF;
    
    -- Determine number of cards to create (1-4 based on quote length)
    IF word_count <= 8 THEN
        cards_to_create := 1;
    ELSIF word_count <= 15 THEN
        cards_to_create := 2;
    ELSIF word_count <= 25 THEN
        cards_to_create := 3;
    ELSE
        cards_to_create := 4;
    END IF;
    
    -- Create cards with randomized multiple blanks
    FOR i IN 1..cards_to_create LOOP
        -- Determine number of blanks for this card (2-4 blanks, but not more than half the available words)
        blanks_per_card := LEAST(4, GREATEST(2, word_count / 3));
        
        -- Reset arrays for this card
        selected_words := '{}';
        selected_positions := '{}';
        current_text := NEW.text;
        
        -- Create array of available word indices
        word_indices := array(SELECT generate_series(1, word_count));
        
        -- Select random words for blanks
        FOR j IN 1..blanks_per_card LOOP
            EXIT WHEN array_length(word_indices, 1) = 0;
            
            -- Pick a random word index
            random_index := 1 + floor(random() * array_length(word_indices, 1))::int;
            word := words[word_indices[random_index]];
            
            -- Find the position of this word in the original text (case insensitive)
            position_in_text := position(lower(word) in lower(NEW.text));
            
            -- Add to selected arrays
            selected_words := array_append(selected_words, word);
            selected_positions := array_append(selected_positions, position_in_text);
            
            -- Remove this word index from available options
            word_indices := array_remove(word_indices, word_indices[random_index]);
        END LOOP;
        
        -- Create card text with multiple blanks (process in reverse order to maintain positions)
        card_text := NEW.text;
        FOR j IN REVERSE array_length(selected_words, 1)..1 LOOP
            word := selected_words[j];
            -- Replace word with numbered blank placeholder
            card_text := regexp_replace(
                card_text, 
                '\y' || regexp_replace(word, '[.*+?^${}()|[\]\\]', '\\\&', 'g') || '\y', 
                '(' || j || ')_____', 
                'gi'
            );
        END LOOP;
        
        -- Insert the card
        INSERT INTO public.flashcard_cards (quote_id, card_text, missing_words, missing_positions, difficulty_level)
        VALUES (
            NEW.id, 
            card_text, 
            selected_words, 
            selected_positions,
            CASE 
                WHEN blanks_per_card <= 2 THEN 1
                WHEN blanks_per_card = 3 THEN 2
                ELSE 3
            END
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RECREATE TRIGGER
-- ============================================================================

CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- ============================================================================
-- REGENERATE EXISTING FLASHCARDS
-- ============================================================================

-- Delete all existing flashcard cards
DELETE FROM public.flashcard_cards;

-- Regenerate all flashcards from existing quotes
DO $$
DECLARE
    quote_record RECORD;
BEGIN
    FOR quote_record IN SELECT * FROM public.quotes WHERE is_active = true LOOP
        PERFORM public.generate_flashcards_for_quote();
        -- Simulate the trigger by inserting into a temp record
        INSERT INTO public.flashcard_cards (quote_id, card_text, missing_words, missing_positions, difficulty_level)
        SELECT 
            quote_record.id,
            'temp_card_text',
            '{temp_word}',
            '{1}',
            1;
        -- Then immediately delete and regenerate properly
        DELETE FROM public.flashcard_cards WHERE quote_id = quote_record.id;
        
        -- Call the function manually for each quote
        DECLARE
            words TEXT[];
            word_count INTEGER;
            cards_to_create INTEGER;
            blanks_per_card INTEGER;
            card_text TEXT;
            selected_words TEXT[];
            selected_positions INTEGER[];
            word TEXT;
            position_in_text INTEGER;
            i INTEGER;
            j INTEGER;
            word_indices INTEGER[];
            random_index INTEGER;
            current_text TEXT;
        BEGIN
            -- Filter meaningful words
            words := string_to_array(
                regexp_replace(quote_record.text, '[^\w\s]', '', 'g'), 
                ' '
            );
            
            words := array(
                SELECT word 
                FROM unnest(words) AS word 
                WHERE length(word) >= 3 
                AND word NOT IN ('the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'that', 'this', 'these', 'those', 'with', 'from', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'his', 'her', 'him', 'she', 'you', 'your', 'our', 'not', 'all', 'any', 'more', 'most', 'some', 'very', 'much', 'many', 'now', 'then', 'than', 'only', 'just', 'also', 'even', 'still', 'again', 'back', 'here', 'out', 'off', 'down', 'over', 'after', 'before', 'through', 'during', 'above', 'below', 'between', 'among', 'into', 'onto', 'upon', 'about', 'around', 'across', 'along', 'beside', 'beyond', 'within', 'without')
                AND word ~ '^[A-Za-z]+$'
            );
            
            word_count := array_length(words, 1);
            
            IF word_count >= 3 THEN
                -- Determine cards to create
                IF word_count <= 8 THEN
                    cards_to_create := 1;
                ELSIF word_count <= 15 THEN
                    cards_to_create := 2;
                ELSIF word_count <= 25 THEN
                    cards_to_create := 3;
                ELSE
                    cards_to_create := 4;
                END IF;
                
                -- Create cards
                FOR i IN 1..cards_to_create LOOP
                    blanks_per_card := LEAST(4, GREATEST(2, word_count / 3));
                    selected_words := '{}';
                    selected_positions := '{}';
                    word_indices := array(SELECT generate_series(1, word_count));
                    
                    FOR j IN 1..blanks_per_card LOOP
                        EXIT WHEN array_length(word_indices, 1) = 0;
                        random_index := 1 + floor(random() * array_length(word_indices, 1))::int;
                        word := words[word_indices[random_index]];
                        position_in_text := position(lower(word) in lower(quote_record.text));
                        selected_words := array_append(selected_words, word);
                        selected_positions := array_append(selected_positions, position_in_text);
                        word_indices := array_remove(word_indices, word_indices[random_index]);
                    END LOOP;
                    
                    card_text := quote_record.text;
                    FOR j IN REVERSE array_length(selected_words, 1)..1 LOOP
                        word := selected_words[j];
                        card_text := regexp_replace(
                            card_text, 
                            '\y' || regexp_replace(word, '[.*+?^${}()|[\]\\]', '\\\&', 'g') || '\y', 
                            '(' || j || ')_____', 
                            'gi'
                        );
                    END LOOP;
                    
                    INSERT INTO public.flashcard_cards (quote_id, card_text, missing_words, missing_positions, difficulty_level)
                    VALUES (
                        quote_record.id, 
                        card_text, 
                        selected_words, 
                        selected_positions,
                        CASE 
                            WHEN blanks_per_card <= 2 THEN 1
                            WHEN blanks_per_card = 3 THEN 2
                            ELSE 3
                        END
                    );
                END LOOP;
            END IF;
        END;
    END LOOP;
END $$;

-- ============================================================================
-- ADD HELPER FUNCTION FOR CARD REGENERATION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.regenerate_flashcards_for_quote(quote_id_param UUID)
RETURNS void AS $$
DECLARE
    quote_record RECORD;
    words TEXT[];
    word_count INTEGER;
    cards_to_create INTEGER;
    blanks_per_card INTEGER;
    card_text TEXT;
    selected_words TEXT[];
    selected_positions INTEGER[];
    word TEXT;
    position_in_text INTEGER;
    i INTEGER;
    j INTEGER;
    word_indices INTEGER[];
    random_index INTEGER;
BEGIN
    -- Get the quote
    SELECT * INTO quote_record FROM public.quotes WHERE id = quote_id_param;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Delete existing cards for this quote
    DELETE FROM public.flashcard_cards WHERE quote_id = quote_id_param;
    
    -- Generate new cards using the same logic as the trigger
    words := string_to_array(
        regexp_replace(quote_record.text, '[^\w\s]', '', 'g'), 
        ' '
    );
    
    words := array(
        SELECT word 
        FROM unnest(words) AS word 
        WHERE length(word) >= 3 
        AND word NOT IN ('the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'that', 'this', 'these', 'those', 'with', 'from', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'his', 'her', 'him', 'she', 'you', 'your', 'our', 'not', 'all', 'any', 'more', 'most', 'some', 'very', 'much', 'many', 'now', 'then', 'than', 'only', 'just', 'also', 'even', 'still', 'again', 'back', 'here', 'out', 'off', 'down', 'over', 'after', 'before', 'through', 'during', 'above', 'below', 'between', 'among', 'into', 'onto', 'upon', 'about', 'around', 'across', 'along', 'beside', 'beyond', 'within', 'without')
        AND word ~ '^[A-Za-z]+$'
    );
    
    word_count := array_length(words, 1);
    
    IF word_count >= 3 THEN
        -- Determine cards to create
        IF word_count <= 8 THEN
            cards_to_create := 1;
        ELSIF word_count <= 15 THEN
            cards_to_create := 2;
        ELSIF word_count <= 25 THEN
            cards_to_create := 3;
        ELSE
            cards_to_create := 4;
        END IF;
        
        -- Create cards
        FOR i IN 1..cards_to_create LOOP
            blanks_per_card := LEAST(4, GREATEST(2, word_count / 3));
            selected_words := '{}';
            selected_positions := '{}';
            word_indices := array(SELECT generate_series(1, word_count));
            
            FOR j IN 1..blanks_per_card LOOP
                EXIT WHEN array_length(word_indices, 1) = 0;
                random_index := 1 + floor(random() * array_length(word_indices, 1))::int;
                word := words[word_indices[random_index]];
                position_in_text := position(lower(word) in lower(quote_record.text));
                selected_words := array_append(selected_words, word);
                selected_positions := array_append(selected_positions, position_in_text);
                word_indices := array_remove(word_indices, word_indices[random_index]);
            END LOOP;
            
            card_text := quote_record.text;
            FOR j IN REVERSE array_length(selected_words, 1)..1 LOOP
                word := selected_words[j];
                card_text := regexp_replace(
                    card_text, 
                    '\y' || regexp_replace(word, '[.*+?^${}()|[\]\\]', '\\\&', 'g') || '\y', 
                    '(' || j || ')_____', 
                    'gi'
                );
            END LOOP;
            
            INSERT INTO public.flashcard_cards (quote_id, card_text, missing_words, missing_positions, difficulty_level)
            VALUES (
                quote_id_param, 
                card_text, 
                selected_words, 
                selected_positions,
                CASE 
                    WHEN blanks_per_card <= 2 THEN 1
                    WHEN blanks_per_card = 3 THEN 2
                    ELSE 3
                END
            );
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 