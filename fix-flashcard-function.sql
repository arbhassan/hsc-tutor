-- Fix flashcard generation function to use correct column names
-- This updates the function to use missing_word and missing_position instead of answer_text and blank_position

CREATE OR REPLACE FUNCTION public.generate_flashcards_for_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word TEXT;
    word_count INTEGER;
    cards_to_create INTEGER;
    i INTEGER;
    card_text TEXT;
    position INTEGER;
    filtered_words TEXT[] := ARRAY[]::TEXT[];
    common_words TEXT[] := ARRAY['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'that', 'this', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'a', 'an', 'is', 'be', 'do', 'does', 'did', 'can', 'may', 'might', 'must', 'shall', 'his', 'her', 'its', 'my', 'your', 'our', 'their', 'me', 'him', 'us', 'them', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
BEGIN
    -- Split quote into words, removing punctuation
    words := string_to_array(
        regexp_replace(NEW.text, '[^\w\s]', '', 'g'), 
        ' '
    );
    
    -- Filter out common words and short words using a loop
    FOREACH word IN ARRAY words LOOP
        IF length(word) > 2 AND NOT (lower(word) = ANY(common_words)) THEN
            filtered_words := array_append(filtered_words, word);
        END IF;
    END LOOP;
    
    word_count := array_length(filtered_words, 1);
    
    -- Handle case where no meaningful words found
    IF word_count IS NULL OR word_count = 0 THEN
        RETURN NEW;
    END IF;
    
    -- Determine number of cards to create (1-5 based on quote length)
    IF word_count <= 5 THEN
        cards_to_create := 1;
    ELSIF word_count <= 15 THEN
        cards_to_create := 2;
    ELSIF word_count <= 25 THEN
        cards_to_create := 3;
    ELSIF word_count <= 40 THEN
        cards_to_create := 4;
    ELSE
        cards_to_create := 5;
    END IF;
    
    -- Create cards with random word selections
    FOR i IN 1..cards_to_create LOOP
        -- Skip if no words left
        IF word_count = 0 THEN
            EXIT;
        END IF;
        
        -- Pick a random meaningful word
        word := filtered_words[1 + floor(random() * word_count)::int];
        
        -- Find position of word in original text
        position := position(lower(word) in lower(NEW.text));
        
        -- Create card with missing word replaced by placeholder
        card_text := regexp_replace(
            NEW.text, 
            '\y' || word || '\y', 
            '_____', 
            'gi'
        );
        
        -- Only insert if the replacement was successful
        IF card_text != NEW.text THEN
            INSERT INTO public.flashcard_cards (quote_id, card_text, missing_word, missing_position)
            VALUES (NEW.id, card_text, word, position);
        END IF;
        
        -- Remove the used word to avoid duplicates
        filtered_words := array_remove(filtered_words, word);
        word_count := array_length(filtered_words, 1);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update the legacy function name if it exists
CREATE OR REPLACE FUNCTION generate_flashcards_from_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word TEXT;
    word_count INTEGER;
    cards_to_create INTEGER;
    i INTEGER;
    card_text TEXT;
    position INTEGER;
    filtered_words TEXT[] := ARRAY[]::TEXT[];
    common_words TEXT[] := ARRAY['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'that', 'this', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'a', 'an', 'is', 'be', 'do', 'does', 'did', 'can', 'may', 'might', 'must', 'shall', 'his', 'her', 'its', 'my', 'your', 'our', 'their', 'me', 'him', 'us', 'them', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
BEGIN
    -- Split quote into words, removing punctuation
    words := string_to_array(
        regexp_replace(NEW.text, '[^\w\s]', '', 'g'), 
        ' '
    );
    
    -- Filter out common words and short words using a loop
    FOREACH word IN ARRAY words LOOP
        IF length(word) > 2 AND NOT (lower(word) = ANY(common_words)) THEN
            filtered_words := array_append(filtered_words, word);
        END IF;
    END LOOP;
    
    word_count := array_length(filtered_words, 1);
    
    -- Handle case where no meaningful words found
    IF word_count IS NULL OR word_count = 0 THEN
        RETURN NEW;
    END IF;
    
    -- Determine number of cards to create (1-5 based on quote length)
    IF word_count <= 5 THEN
        cards_to_create := 1;
    ELSIF word_count <= 15 THEN
        cards_to_create := 2;
    ELSIF word_count <= 25 THEN
        cards_to_create := 3;
    ELSIF word_count <= 40 THEN
        cards_to_create := 4;
    ELSE
        cards_to_create := 5;
    END IF;
    
    -- Create cards with random word selections
    FOR i IN 1..cards_to_create LOOP
        -- Skip if no words left
        IF word_count = 0 THEN
            EXIT;
        END IF;
        
        -- Pick a random meaningful word
        word := filtered_words[1 + floor(random() * word_count)::int];
        
        -- Find position of word in original text
        position := position(lower(word) in lower(NEW.text));
        
        -- Create card with missing word replaced by placeholder
        card_text := regexp_replace(
            NEW.text, 
            '\y' || word || '\y', 
            '_____', 
            'gi'
        );
        
        -- Only insert if the replacement was successful
        IF card_text != NEW.text THEN
            INSERT INTO public.flashcard_cards (quote_id, card_text, missing_word, missing_position)
            VALUES (NEW.id, card_text, word, position);
        END IF;
        
        -- Remove the used word to avoid duplicates
        filtered_words := array_remove(filtered_words, word);
        word_count := array_length(filtered_words, 1);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Flashcard generation function updated successfully!' as message; 