-- Fix the database trigger for book selection (corrected version)
-- Run this in your Supabase SQL Editor

-- Add the book columns to user_profiles table if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS selected_book_id TEXT,
ADD COLUMN IF NOT EXISTS selected_book_title TEXT,
ADD COLUMN IF NOT EXISTS selected_book_author TEXT;

-- Add unique constraint on user_id if it doesn't exist
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

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

-- If you have existing users without profiles, create them one by one
-- First, let's check if there are any existing users without profiles
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id, raw_user_meta_data
        FROM auth.users 
        WHERE id NOT IN (SELECT user_id FROM public.user_profiles WHERE user_id IS NOT NULL)
    LOOP
        INSERT INTO public.user_profiles (
            user_id, 
            first_name, 
            last_name, 
            selected_book_id, 
            selected_book_title, 
            selected_book_author
        )
        VALUES (
            user_record.id,
            COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'last_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'selected_book_id', ''),
            COALESCE(user_record.raw_user_meta_data->>'selected_book_title', ''),
            COALESCE(user_record.raw_user_meta_data->>'selected_book_author', '')
        );
    END LOOP;
END $$; 