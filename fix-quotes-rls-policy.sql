-- Fix RLS policy for quotes table to allow admin operations
-- This addresses the "new row violates row-level security policy" error

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can update quotes they created" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete quotes they created" ON public.quotes;
DROP POLICY IF EXISTS "quotes_update_creator" ON public.quotes;
DROP POLICY IF EXISTS "quotes_delete_creator" ON public.quotes;

-- Create more permissive policies for authenticated users
-- (You can restrict this later by implementing proper admin role checks)

-- Allow authenticated users to update any quote
CREATE POLICY "authenticated_users_can_update_quotes" ON public.quotes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete any quote  
CREATE POLICY "authenticated_users_can_delete_quotes" ON public.quotes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Keep existing insert policy
DROP POLICY IF EXISTS "quotes_insert_authenticated" ON public.quotes;
CREATE POLICY "quotes_insert_authenticated" ON public.quotes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Keep existing select policy for active quotes
DROP POLICY IF EXISTS "quotes_select_active" ON public.quotes;
CREATE POLICY "quotes_select_active" ON public.quotes
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

-- Success message
SELECT 'RLS policies updated - authenticated users can now manage quotes!' as message; 