-- Clean fix for RLS policies - drops all existing policies first
-- This ensures no conflicts with existing policies

-- Drop ALL existing policies on quotes table
DROP POLICY IF EXISTS "All users can view active quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can manage quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can manage quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update quotes they created" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete quotes they created" ON public.quotes;

-- Drop ALL existing policies on quote_themes table
DROP POLICY IF EXISTS "All users can view quote themes" ON public.quote_themes;
DROP POLICY IF EXISTS "Admins can manage quote themes" ON public.quote_themes;
DROP POLICY IF EXISTS "Authenticated users can manage quote themes" ON public.quote_themes;

-- Drop ALL existing policies on flashcard_cards table
DROP POLICY IF EXISTS "All users can view active flashcard cards" ON public.flashcard_cards;
DROP POLICY IF EXISTS "Admins can manage flashcard cards" ON public.flashcard_cards;
DROP POLICY IF EXISTS "Authenticated users can manage flashcard cards" ON public.flashcard_cards;

-- Drop ALL existing policies on themes table
DROP POLICY IF EXISTS "All users can view themes" ON public.themes;
DROP POLICY IF EXISTS "Admins can manage themes" ON public.themes;
DROP POLICY IF EXISTS "Authenticated users can manage themes" ON public.themes;
DROP POLICY IF EXISTS "All users can view flashcard themes" ON public.themes;
DROP POLICY IF EXISTS "Admins can manage flashcard themes" ON public.themes;

-- Now create the new simplified policies

-- Quotes: Allow authenticated users to create/update, everyone can read active quotes
CREATE POLICY "quotes_select_active" ON public.quotes
    FOR SELECT USING (is_active = true);

CREATE POLICY "quotes_insert_authenticated" ON public.quotes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "quotes_update_creator" ON public.quotes
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "quotes_delete_creator" ON public.quotes
    FOR DELETE USING (auth.uid() = created_by);

-- Quote themes: Allow authenticated users to manage
CREATE POLICY "quote_themes_select" ON public.quote_themes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "quote_themes_all_authenticated" ON public.quote_themes
    FOR ALL USING (auth.role() = 'authenticated');

-- Flashcard cards: Allow everyone to read active cards, authenticated users to manage
CREATE POLICY "flashcard_cards_select_active" ON public.flashcard_cards
    FOR SELECT USING (is_active = true);

CREATE POLICY "flashcard_cards_all_authenticated" ON public.flashcard_cards
    FOR ALL USING (auth.role() = 'authenticated');

-- Themes: Allow everyone to read, authenticated users to manage
CREATE POLICY "themes_select_all" ON public.themes
    FOR SELECT USING (true);

CREATE POLICY "themes_all_authenticated" ON public.themes
    FOR ALL USING (auth.role() = 'authenticated');

-- Success message
SELECT 'RLS policies cleaned and fixed successfully!' as message; 