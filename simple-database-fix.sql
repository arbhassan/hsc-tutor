-- Simple fix for book selection (if the previous script has constraint errors)
-- Run this in your Supabase SQL Editor

-- Add the book columns to user_profiles table if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS selected_book_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_book_title TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_book_author TEXT DEFAULT '';

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

-- For existing users, update their profiles with empty book data if they don't have any
UPDATE public.user_profiles 
SET 
  selected_book_id = COALESCE(selected_book_id, ''),
  selected_book_title = COALESCE(selected_book_title, ''),
  selected_book_author = COALESCE(selected_book_author, '')
WHERE selected_book_id IS NULL; 