-- New Flashcard Workflow Database Schema
-- This replaces the existing flashcard system with a quote-first approach

-- ============================================================================
-- CORE CONTENT TABLES
-- ============================================================================

-- Master quote storage - raw quotes uploaded by admins
CREATE TABLE public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, -- e.g. "Macbeth Opening Quote"
    text TEXT NOT NULL, -- The raw quote text
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    source TEXT, -- Chapter, Act, Scene, etc.
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Admin can hide quotes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Theme management - admin-controlled themes
CREATE TABLE public.themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g. "Ambition", "Love", "Betrayal"
    description TEXT,
    color TEXT DEFAULT '#6366f1', -- Hex color for UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Junction table for quote-theme relationships (many-to-many)
CREATE TABLE public.quote_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
    theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(quote_id, theme_id)
);

-- Auto-generated flashcard cards from quotes
CREATE TABLE public.flashcard_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
    card_text TEXT NOT NULL, -- Quote with cloze deletions (marked with placeholders)
    missing_word TEXT NOT NULL, -- The word/phrase to fill in
    missing_position INTEGER NOT NULL, -- Position in the text where word is missing
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_active BOOLEAN DEFAULT TRUE, -- Admin can hide specific cards
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- STUDENT WORKSPACE TABLES  
-- ============================================================================

-- Student personal card collections
CREATE TABLE public.student_card_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g. "Macbeth Exam Week"
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Items in student collections (many-to-many with cards)
CREATE TABLE public.student_card_set_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    set_id UUID REFERENCES public.student_card_sets(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.flashcard_cards(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(set_id, card_id)
);

-- Study progress tracking for spaced repetition
CREATE TABLE public.card_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.flashcard_cards(id) ON DELETE CASCADE NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    correct_attempts INTEGER DEFAULT 0 NOT NULL,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE,
    ease_factor DECIMAL(3,2) DEFAULT 2.5, -- Spaced repetition factor
    interval_days INTEGER DEFAULT 1, -- Days until next review
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, card_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_quotes_book_id ON public.quotes(book_id);
CREATE INDEX idx_quotes_created_by ON public.quotes(created_by);
CREATE INDEX idx_quotes_is_active ON public.quotes(is_active);
CREATE INDEX idx_quote_themes_quote_id ON public.quote_themes(quote_id);
CREATE INDEX idx_quote_themes_theme_id ON public.quote_themes(theme_id);
CREATE INDEX idx_flashcard_cards_quote_id ON public.flashcard_cards(quote_id);
CREATE INDEX idx_flashcard_cards_is_active ON public.flashcard_cards(is_active);
CREATE INDEX idx_student_card_sets_user_id ON public.student_card_sets(user_id);
CREATE INDEX idx_student_card_set_items_set_id ON public.student_card_set_items(set_id);
CREATE INDEX idx_student_card_set_items_card_id ON public.student_card_set_items(card_id);
CREATE INDEX idx_card_progress_user_id ON public.card_progress(user_id);
CREATE INDEX idx_card_progress_card_id ON public.card_progress(card_id);
CREATE INDEX idx_card_progress_next_review ON public.card_progress(next_review_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_card_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_card_set_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_progress ENABLE ROW LEVEL SECURITY;

-- Quotes: Read-all for authenticated users, write for admins only
CREATE POLICY "All users can view active quotes" ON public.quotes
    FOR SELECT USING (is_active = true OR auth.uid() = created_by);

CREATE POLICY "Admins can manage quotes" ON public.quotes
    FOR ALL USING (auth.uid() = created_by);

-- Themes: Read-all, admin-write
CREATE POLICY "All users can view themes" ON public.themes FOR SELECT TO authenticated USING (true);
CREATE POLICY "System manages themes" ON public.themes FOR ALL TO service_role USING (true);

-- Quote-themes: Read-all, admin-write  
CREATE POLICY "All users can view quote themes" ON public.quote_themes FOR SELECT TO authenticated USING (true);
CREATE POLICY "System manages quote themes" ON public.quote_themes FOR ALL TO service_role USING (true);

-- Cards: Read active cards, admin-write
CREATE POLICY "All users can view active cards" ON public.flashcard_cards
    FOR SELECT USING (is_active = true);

CREATE POLICY "System manages cards" ON public.flashcard_cards FOR ALL TO service_role USING (true);

-- Student sets: User owns their sets
CREATE POLICY "Users manage own card sets" ON public.student_card_sets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own card set items" ON public.student_card_set_items
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.student_card_sets WHERE id = set_id));

-- Progress: User owns their progress
CREATE POLICY "Users manage own progress" ON public.card_progress
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Update triggers for updated_at columns
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON public.themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_cards_updated_at BEFORE UPDATE ON public.flashcard_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_card_sets_updated_at BEFORE UPDATE ON public.student_card_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_progress_updated_at BEFORE UPDATE ON public.card_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate flashcards when a quote is added
CREATE OR REPLACE FUNCTION public.generate_flashcards_for_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word TEXT;
    word_count INTEGER;
    cards_to_create INTEGER;
    i INTEGER;
    card_text TEXT;
    position INTEGER;
BEGIN
    -- Split quote into words, excluding common words
    words := string_to_array(
        regexp_replace(NEW.text, '[^\w\s]', '', 'g'), -- Remove punctuation
        ' '
    );
    
    -- Filter out common words and get meaningful words
    words := ARRAY(
        SELECT unnest(words) 
        WHERE length(unnest(words)) > 2 
        AND lower(unnest(words)) NOT IN ('the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'that', 'this', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should')
    );
    
    word_count := array_length(words, 1);
    
    -- Determine number of cards to create (1-5 based on quote length)
    IF word_count <= 5 THEN
        cards_to_create := 1;
    ELSIF word_count <= 15 THEN
        cards_to_create := 2;
    ELSIF word_count <= 25 THEN
        cards_to_create := 3;
    ELSIF word_count <= 40 THEN
        cards_to_create := 4;
    ELSE
        cards_to_create := 5;
    END IF;
    
    -- Create cards with random word selections
    FOR i IN 1..cards_to_create LOOP
        -- Pick a random meaningful word
        word := words[1 + floor(random() * word_count)::int];
        
        -- Find position of word in original text
        position := position(lower(NEW.text) in lower(word));
        
        -- Create card with missing word replaced by placeholder
        card_text := regexp_replace(
            NEW.text, 
            '\y' || word || '\y', 
            '_____', 
            'gi'
        );
        
        -- Insert the card
        INSERT INTO public.flashcard_cards (quote_id, card_text, missing_word, missing_position)
        VALUES (NEW.id, card_text, word, position);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-generate cards when quote is created
CREATE TRIGGER generate_flashcards_on_quote_insert
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION public.generate_flashcards_for_quote();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample themes
INSERT INTO public.themes (name, description, color) VALUES
('Ambition', 'Themes related to ambition, power, and achievement', '#ef4444'),
('Love', 'Themes of romantic love, familial love, and relationships', '#ec4899'),
('Betrayal', 'Themes of betrayal, deception, and broken trust', '#8b5cf6'),
('Death', 'Themes of mortality, loss, and the afterlife', '#374151'),
('Justice', 'Themes of justice, fairness, and moral order', '#059669'),
('Corruption', 'Themes of moral decay and institutional corruption', '#dc2626'),
('Identity', 'Themes of self-discovery and personal identity', '#2563eb'),
('Nature', 'Themes related to the natural world and environment', '#16a34a'); 