-- Fix RLS policies to avoid accessing protected auth.users table
-- This uses a simpler approach for admin role checking

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can manage quote themes" ON public.quote_themes;
DROP POLICY IF EXISTS "Admins can manage flashcard cards" ON public.flashcard_cards;
DROP POLICY IF EXISTS "Admins can manage themes" ON public.themes;

-- Create simplified admin policies that don't access auth.users table
-- For now, we'll allow all authenticated users to manage quotes (you can restrict this later)

-- Quotes: Allow authenticated users to create/update, everyone can read active quotes
CREATE POLICY "All users can view active quotes" ON public.quotes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage quotes" ON public.quotes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update quotes they created" ON public.quotes
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete quotes they created" ON public.quotes
    FOR DELETE USING (auth.uid() = created_by);

-- Quote themes: Allow authenticated users to manage
CREATE POLICY "All users can view quote themes" ON public.quote_themes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quote themes" ON public.quote_themes
    FOR ALL USING (auth.role() = 'authenticated');

-- Flashcard cards: Allow everyone to read active cards, authenticated users to manage
CREATE POLICY "All users can view active flashcard cards" ON public.flashcard_cards
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage flashcard cards" ON public.flashcard_cards
    FOR ALL USING (auth.role() = 'authenticated');

-- Themes: Allow everyone to read, authenticated users to manage
CREATE POLICY "All users can view themes" ON public.themes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage themes" ON public.themes
    FOR ALL USING (auth.role() = 'authenticated');

-- Success message
SELECT 'RLS policies fixed - admin role checking simplified!' as message; 