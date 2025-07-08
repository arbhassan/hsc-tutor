-- Fix quotes table columns to match service expectations
-- This script updates the column names to match what the QuoteFlashcardService expects

-- Add missing 'source' column
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS source TEXT;

-- Rename columns to match service expectations
ALTER TABLE public.quotes RENAME COLUMN text_title TO title;
ALTER TABLE public.quotes RENAME COLUMN quote_text TO text;

-- Update the auto-generation function to use correct column names
CREATE OR REPLACE FUNCTION generate_flashcards_from_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word TEXT;
    word_count INTEGER;
    cards_to_create INTEGER;
    i INTEGER;
    card_text TEXT;
    word_position INTEGER;
    filtered_words TEXT[] := ARRAY[]::TEXT[];
    common_words TEXT[] := ARRAY['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'a', 'an', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
BEGIN
    -- Split quote into words (basic tokenization) - use 'text' column name
    words := string_to_array(lower(regexp_replace(NEW.text, '[^\w\s]', '', 'g')), ' ');
    
    -- Filter out common words and very short words
    FOREACH word IN ARRAY words LOOP
        IF length(word) > 3 AND NOT (word = ANY(common_words)) THEN
            filtered_words := array_append(filtered_words, word);
        END IF;
    END LOOP;
    
    word_count := array_length(filtered_words, 1);
    
    -- Determine number of cards to create (1-5 based on word count)
    IF word_count <= 5 THEN
        cards_to_create := GREATEST(1, word_count);
    ELSIF word_count <= 15 THEN
        cards_to_create := 3;
    ELSIF word_count <= 25 THEN
        cards_to_create := 4;
    ELSE
        cards_to_create := 5;
    END IF;
    
    -- Create flashcards by randomly selecting words to blank out
    FOR i IN 1..cards_to_create LOOP
        -- Select a random word from filtered words
        word := filtered_words[floor(random() * array_length(filtered_words, 1) + 1)];
        
        -- Find the position of this word in the original text (case insensitive)
        word_position := position(lower(word) in lower(NEW.text));
        
        -- Create card text with [BLANK] placeholder - use 'text' column name
        card_text := regexp_replace(
            NEW.text, 
            '\m' || word || '\M', 
            '[BLANK]', 
            'gi'
        );
        
        -- Only create the card if we successfully created a blank
        IF card_text != NEW.text THEN
            INSERT INTO public.flashcard_cards (
                quote_id,
                card_text,
                answer_text,
                blank_position,
                difficulty_level
            ) VALUES (
                NEW.id,
                card_text,
                word,
                word_position,
                CASE 
                    WHEN length(word) <= 4 THEN 1
                    WHEN length(word) <= 6 THEN 2
                    WHEN length(word) <= 8 THEN 3
                    WHEN length(word) <= 10 THEN 4
                    ELSE 5
                END
            );
        END IF;
        
        -- Remove the used word to avoid duplicates
        filtered_words := array_remove(filtered_words, word);
        
        -- Exit if no more words available
        EXIT WHEN array_length(filtered_words, 1) = 0;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Quotes table columns fixed successfully!' as message; 