-- Remove CHECK constraints on context_type and rubric_type to allow custom types
-- Run this migration in your Supabase SQL editor

-- Remove the CHECK constraint on context_type in book_detailed_contexts
ALTER TABLE book_detailed_contexts 
DROP CONSTRAINT IF EXISTS book_detailed_contexts_context_type_check;

-- Remove the CHECK constraint on rubric_type in book_rubric_connections  
ALTER TABLE book_rubric_connections
DROP CONSTRAINT IF EXISTS book_rubric_connections_rubric_type_check;

-- Verify the constraints have been removed
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid IN (
    'book_detailed_contexts'::regclass,
    'book_rubric_connections'::regclass
)
AND contype = 'c';

