-- Fix essay_progress table by adding missing columns
-- Run this script in your Supabase SQL Editor

-- First, let's check if the table exists and what columns it has
-- You can comment out this section after reviewing
/*
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'essay_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position;
*/

-- Add missing columns to essay_progress table if they don't exist
-- This script is safe to run multiple times

-- Add average_score column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'essay_progress' 
        AND column_name = 'average_score'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.essay_progress 
        ADD COLUMN average_score INTEGER DEFAULT 0 NOT NULL 
        CHECK (average_score >= 0 AND average_score <= 100);
        
        RAISE NOTICE 'Added average_score column to essay_progress table';
    ELSE
        RAISE NOTICE 'average_score column already exists in essay_progress table';
    END IF;
END $$;

-- Add average_word_count column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'essay_progress' 
        AND column_name = 'average_word_count'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.essay_progress 
        ADD COLUMN average_word_count INTEGER DEFAULT 0 NOT NULL;
        
        RAISE NOTICE 'Added average_word_count column to essay_progress table';
    ELSE
        RAISE NOTICE 'average_word_count column already exists in essay_progress table';
    END IF;
END $$;

-- Ensure all existing records have default values
UPDATE public.essay_progress 
SET 
    average_score = COALESCE(average_score, 0),
    average_word_count = COALESCE(average_word_count, 0)
WHERE average_score IS NULL 
   OR average_word_count IS NULL;

-- Verify the table structure
SELECT 'Essay Progress Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'essay_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position; 