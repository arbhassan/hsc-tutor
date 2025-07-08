-- Fix flashcard_cards table column names to match service expectations
-- This renames the columns from the old names to the new names

-- Rename columns in flashcard_cards table
ALTER TABLE public.flashcard_cards RENAME COLUMN blank_position TO missing_position;
ALTER TABLE public.flashcard_cards RENAME COLUMN answer_text TO missing_word;

-- Success message
SELECT 'Flashcard table columns renamed successfully!' as message; 