-- Fix Invalid Context Types
-- This script removes any book_detailed_contexts entries that have invalid context_type values
-- Run this in your Supabase SQL Editor to clean up any existing invalid data

-- First, let's see what invalid context types exist (if any)
-- Valid types are: 'historical', 'political', 'biographical', 'philosophical'

-- Delete any rows with invalid context types
DELETE FROM public.book_detailed_contexts 
WHERE context_type NOT IN ('historical', 'political', 'biographical', 'philosophical');

-- Show remaining context types to verify cleanup
SELECT DISTINCT context_type, COUNT(*) as count
FROM public.book_detailed_contexts
GROUP BY context_type
ORDER BY context_type;