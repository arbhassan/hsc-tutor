-- Fix the foreign key relationship between flashcard_sets and books tables
-- This will allow Supabase PostgREST to properly join these tables

-- Check if the foreign key constraint already exists and add it if it doesn't
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

-- Check if the trigger already exists and add it if it doesn't
DO $$
BEGIN
    -- Check if the trigger already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_books_updated_at'
        AND event_object_table = 'books'
        AND event_object_schema = 'public'
    ) THEN
        -- Create trigger for updating the updated_at column on books
        CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
        RAISE NOTICE 'Trigger update_books_updated_at added successfully';
    ELSE
        RAISE NOTICE 'Trigger update_books_updated_at already exists';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger update_books_updated_at already exists (caught exception)';
END
$$; 