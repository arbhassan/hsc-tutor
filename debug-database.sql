-- DEBUG: Check current database state
-- Run this in Supabase SQL Editor to see what's happening

-- 1. Check what columns exist in flashcard_cards table
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'flashcard_cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quotes'
AND trigger_schema = 'public';

-- 3. Check if the function exists and what it does
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%flashcard%'
AND routine_schema = 'public';

-- 4. Force drop any remaining old triggers/functions
DROP TRIGGER IF EXISTS auto_generate_flashcards ON public.quotes;
DROP TRIGGER IF EXISTS generate_flashcard_cards_trigger ON public.quotes;
DROP TRIGGER IF EXISTS flashcard_generation_trigger ON public.quotes;
DROP FUNCTION IF EXISTS generate_flashcards_from_quote();
DROP FUNCTION IF EXISTS public.generate_flashcard_cards_for_quote();

-- 5. Check for any remaining triggers after cleanup
SELECT 
    trigger_name,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'quotes'
AND trigger_schema = 'public'; 