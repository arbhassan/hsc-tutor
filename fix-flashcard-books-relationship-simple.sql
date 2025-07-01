-- Fix the foreign key relationship between flashcard_sets and books tables
-- This will allow Supabase PostgREST to properly join these tables

-- Add foreign key constraint to flashcard_sets.book_id if it doesn't exist
DO $$
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_flashcard_sets_book_id'
        AND table_name = 'flashcard_sets'
        AND table_schema = 'public'
    ) THEN
        -- Add foreign key constraint to flashcard_sets.book_id
        ALTER TABLE public.flashcard_sets 
        ADD CONSTRAINT fk_flashcard_sets_book_id 
        FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint fk_flashcard_sets_book_id added successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint fk_flashcard_sets_book_id already exists';
    END IF;
END
$$; 