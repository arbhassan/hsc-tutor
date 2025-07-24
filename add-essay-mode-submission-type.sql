-- Migration: Add 'essay_mode' to submission_type check constraint
-- Run this script in your Supabase SQL Editor to allow essay mode submissions

-- Drop the existing check constraint
ALTER TABLE public.user_submissions 
DROP CONSTRAINT IF EXISTS user_submissions_submission_type_check;

-- Add the new check constraint that includes 'essay_mode'
ALTER TABLE public.user_submissions 
ADD CONSTRAINT user_submissions_submission_type_check 
CHECK (submission_type IN ('daily_drill', 'exam_simulator', 'essay_mode'));

-- Confirmation message
SELECT 'Essay mode submission type added successfully!' as status; 