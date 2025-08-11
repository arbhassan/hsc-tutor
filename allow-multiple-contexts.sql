-- Allow Multiple Context Types
-- This script removes the unique constraint on (book_id, context_type) 
-- to allow multiple contexts of the same type per book

-- Drop the unique constraint
ALTER TABLE public.book_detailed_contexts 
DROP CONSTRAINT IF EXISTS book_detailed_contexts_book_id_context_type_key;

-- Verify the constraint has been removed
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.book_detailed_contexts'::regclass;