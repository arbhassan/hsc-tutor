-- Fix the database trigger for book selection
-- Run this in your Supabase SQL Editor

-- First, let's check if the user_profiles table has the book columns
-- If this fails, you need to add the columns first

-- Add the book columns to user_profiles table if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS selected_book_id TEXT,
ADD COLUMN IF NOT EXISTS selected_book_title TEXT,
ADD COLUMN IF NOT EXISTS selected_book_author TEXT;

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with updated book handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    first_name, 
    last_name, 
    selected_book_id, 
    selected_book_title, 
    selected_book_author
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'selected_book_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'selected_book_title', ''),
    COALESCE(NEW.raw_user_meta_data->>'selected_book_author', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- If you have existing users without profiles, this will create them
-- (but without book data since that's only available during signup)
INSERT INTO public.user_profiles (user_id, first_name, last_name, selected_book_id, selected_book_title, selected_book_author)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'first_name', '') as first_name,
  COALESCE(raw_user_meta_data->>'last_name', '') as last_name,
  COALESCE(raw_user_meta_data->>'selected_book_id', '') as selected_book_id,
  COALESCE(raw_user_meta_data->>'selected_book_title', '') as selected_book_title,
  COALESCE(raw_user_meta_data->>'selected_book_author', '') as selected_book_author
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_profiles)
ON CONFLICT (user_id) DO NOTHING; 