-- Migration script: Transition from old quotes table to new quote-first flashcard system
-- SAFE VERSION: Handles book ID mapping and skips invalid references

-- Step 1: Backup existing quotes data (if any exists)
CREATE TABLE IF NOT EXISTS quotes_backup AS 
SELECT * FROM quotes;

-- Step 2: Drop existing quotes table and related objects
DROP TRIGGER IF EXISTS quotes_updated_at_trigger ON quotes;
DROP FUNCTION IF EXISTS update_quotes_updated_at();
DROP TABLE IF EXISTS quotes CASCADE;

-- Step 3: Create theme management system FIRST (needed for foreign keys)
CREATE TABLE public.flashcard_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g., "Power", "Love", "Betrayal"
    color_code TEXT DEFAULT '#3B82F6', -- Hex color for UI
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create the new comprehensive quote-first flashcard system

-- Master quote storage - raw quotes uploaded by admins
CREATE TABLE public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    text_title TEXT NOT NULL, -- Short title for the quote (e.g., "Winston's Rebellion")
    quote_text TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE -- Admin can hide quotes
);

-- Quote-theme relationships (many-to-many)
CREATE TABLE public.quote_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
    theme_id UUID REFERENCES public.flashcard_themes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quote_id, theme_id)
);

-- Auto-generated flashcard cards from quotes
CREATE TABLE public.flashcard_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
    card_text TEXT NOT NULL, -- Quote with [BLANK] markers
    answer_text TEXT NOT NULL, -- Original word/phrase that was blanked
    blank_position INTEGER NOT NULL, -- Position of the blank in the text
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student personal flashcard sets
CREATE TABLE public.student_flashcard_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., "Macbeth Exam Week"
    description TEXT,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards in student personal sets (many-to-many)
CREATE TABLE public.student_set_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID REFERENCES public.student_flashcard_sets(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.flashcard_cards(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(set_id, card_id)
);

-- Student progress tracking with spaced repetition
CREATE TABLE public.flashcard_progress_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.flashcard_cards(id) ON DELETE CASCADE NOT NULL,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    ease_factor DECIMAL(3,2) DEFAULT 2.50, -- For spaced repetition algorithm
    interval_days INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, card_id)
);

-- Indexes for performance
CREATE INDEX idx_quotes_book_id ON public.quotes(book_id);
CREATE INDEX idx_quotes_created_by ON public.quotes(created_by);
CREATE INDEX idx_quotes_is_active ON public.quotes(is_active);
CREATE INDEX idx_quote_themes_quote_id ON public.quote_themes(quote_id);
CREATE INDEX idx_quote_themes_theme_id ON public.quote_themes(theme_id);
CREATE INDEX idx_flashcard_cards_quote_id ON public.flashcard_cards(quote_id);
CREATE INDEX idx_flashcard_cards_is_active ON public.flashcard_cards(is_active);
CREATE INDEX idx_student_flashcard_sets_user_id ON public.student_flashcard_sets(user_id);
CREATE INDEX idx_student_flashcard_sets_book_id ON public.student_flashcard_sets(book_id);
CREATE INDEX idx_student_set_cards_set_id ON public.student_set_cards(set_id);
CREATE INDEX idx_student_set_cards_card_id ON public.student_set_cards(card_id);
CREATE INDEX idx_flashcard_progress_new_user_id ON public.flashcard_progress_new(user_id);
CREATE INDEX idx_flashcard_progress_new_card_id ON public.flashcard_progress_new(card_id);
CREATE INDEX idx_flashcard_progress_new_next_review ON public.flashcard_progress_new(next_review_at);

-- Enable RLS on all tables
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_set_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress_new ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Quotes: Read-all for authenticated users, write for admins only
CREATE POLICY "All users can view active quotes" ON public.quotes
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Admins can manage quotes" ON public.quotes
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (auth.jwt() ->> 'role' = 'admin' OR 
         EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data ->> 'role' = 'admin'))
    );

-- Quote themes: Read for all, write for admins
CREATE POLICY "All users can view quote themes" ON public.quote_themes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage quote themes" ON public.quote_themes
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (auth.jwt() ->> 'role' = 'admin' OR 
         EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data ->> 'role' = 'admin'))
    );

-- Flashcard cards: Read for all, write for admins
CREATE POLICY "All users can view active flashcard cards" ON public.flashcard_cards
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Admins can manage flashcard cards" ON public.flashcard_cards
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (auth.jwt() ->> 'role' = 'admin' OR 
         EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data ->> 'role' = 'admin'))
    );

-- Flashcard themes: Read for all, write for admins
CREATE POLICY "All users can view flashcard themes" ON public.flashcard_themes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage flashcard themes" ON public.flashcard_themes
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (auth.jwt() ->> 'role' = 'admin' OR 
         EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data ->> 'role' = 'admin'))
    );

-- Student flashcard sets: Users can only see/edit their own
CREATE POLICY "Users can manage their own flashcard sets" ON public.student_flashcard_sets
    FOR ALL USING (auth.uid() = user_id);

-- Student set cards: Users can only manage cards in their own sets
CREATE POLICY "Users can manage cards in their own sets" ON public.student_set_cards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.student_flashcard_sets 
            WHERE student_flashcard_sets.id = student_set_cards.set_id 
            AND student_flashcard_sets.user_id = auth.uid()
        )
    );

-- Flashcard progress: Users can only see/edit their own progress
CREATE POLICY "Users can manage their own flashcard progress" ON public.flashcard_progress_new
    FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps (use existing function)
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_cards_updated_at BEFORE UPDATE ON public.flashcard_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_themes_updated_at BEFORE UPDATE ON public.flashcard_themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_flashcard_sets_updated_at BEFORE UPDATE ON public.student_flashcard_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_progress_new_updated_at BEFORE UPDATE ON public.flashcard_progress_new
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generation function for creating flashcards from quotes
CREATE OR REPLACE FUNCTION generate_flashcards_from_quote()
RETURNS TRIGGER AS $$
DECLARE
    words TEXT[];
    word TEXT;
    word_count INTEGER;
    cards_to_create INTEGER;
    i INTEGER;
    card_text TEXT;
    word_position INTEGER;
    filtered_words TEXT[] := ARRAY[]::TEXT[];
    common_words TEXT[] := ARRAY['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'a', 'an', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
BEGIN
    -- Split quote into words (basic tokenization)
    words := string_to_array(lower(regexp_replace(NEW.quote_text, '[^\w\s]', '', 'g')), ' ');
    
    -- Filter out common words and very short words
    FOREACH word IN ARRAY words LOOP
        IF length(word) > 3 AND NOT (word = ANY(common_words)) THEN
            filtered_words := array_append(filtered_words, word);
        END IF;
    END LOOP;
    
    word_count := array_length(filtered_words, 1);
    
    -- Determine number of cards to create (1-5 based on word count)
    IF word_count <= 5 THEN
        cards_to_create := GREATEST(1, word_count);
    ELSIF word_count <= 15 THEN
        cards_to_create := 3;
    ELSIF word_count <= 25 THEN
        cards_to_create := 4;
    ELSE
        cards_to_create := 5;
    END IF;
    
    -- Create flashcards by randomly selecting words to blank out
    FOR i IN 1..cards_to_create LOOP
        -- Select a random word from filtered words
        word := filtered_words[floor(random() * array_length(filtered_words, 1) + 1)];
        
        -- Find the position of this word in the original text (case insensitive)
        word_position := position(lower(word) in lower(NEW.quote_text));
        
        -- Create card text with [BLANK] placeholder
        card_text := regexp_replace(
            NEW.quote_text, 
            '\m' || word || '\M', 
            '[BLANK]', 
            'gi'
        );
        
        -- Only create the card if we successfully created a blank
        IF card_text != NEW.quote_text THEN
            INSERT INTO public.flashcard_cards (
                quote_id,
                card_text,
                answer_text,
                blank_position,
                difficulty_level
            ) VALUES (
                NEW.id,
                card_text,
                word,
                word_position,
                CASE 
                    WHEN length(word) <= 4 THEN 1
                    WHEN length(word) <= 6 THEN 2
                    WHEN length(word) <= 8 THEN 3
                    WHEN length(word) <= 10 THEN 4
                    ELSE 5
                END
            );
        END IF;
        
        -- Remove the used word to avoid duplicates
        filtered_words := array_remove(filtered_words, word);
        
        -- Exit if no more words available
        EXIT WHEN array_length(filtered_words, 1) = 0;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generation
CREATE TRIGGER auto_generate_flashcards
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION generate_flashcards_from_quote();

-- Step 5: Insert default themes
INSERT INTO public.flashcard_themes (name, color_code, description) VALUES
('Power', '#EF4444', 'Themes related to authority, control, and dominance'),
('Love', '#EC4899', 'Romantic love, familial bonds, and relationships'),
('Betrayal', '#8B5CF6', 'Deception, broken trust, and disloyalty'),
('Ambition', '#F59E0B', 'Drive for success, goals, and personal advancement'),
('Corruption', '#6B7280', 'Moral decay, dishonesty, and ethical decline'),
('Identity', '#10B981', 'Self-discovery, personal growth, and belonging'),
('Justice', '#3B82F6', 'Fairness, law, punishment, and moral righteousness'),
('Freedom', '#06B6D4', 'Liberation, independence, and breaking constraints'),
('Sacrifice', '#DC2626', 'Giving up something valuable for a greater cause'),
('Redemption', '#059669', 'Atonement, forgiveness, and making amends'),
('Appearance vs Reality', '#7C3AED', 'Contrast between how things seem and how they are'),
('Loyalty', '#0891B2', 'Faithfulness, allegiance, and dedication');

-- Step 6: Safe migration with book ID mapping
DO $$
DECLARE
    backup_exists BOOLEAN;
    old_quote RECORD;
    new_quote_id UUID;
    theme_id UUID;
    admin_user_id UUID;
    mapped_book_id TEXT;
    skipped_count INTEGER := 0;
    migrated_count INTEGER := 0;
BEGIN
    -- Check if backup table exists and has data
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'quotes_backup'
    ) INTO backup_exists;
    
    IF backup_exists THEN
        -- Get an admin user ID for migration (fallback if created_by is null)
        SELECT id INTO admin_user_id 
        FROM auth.users 
        WHERE raw_user_meta_data ->> 'role' = 'admin' 
        LIMIT 1;
        
        -- If no admin user, get the first user
        IF admin_user_id IS NULL THEN
            SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
        END IF;
        
        -- Migrate old quotes to new structure with book ID mapping
        FOR old_quote IN SELECT * FROM quotes_backup LOOP
            -- Map old book IDs to new book IDs
            mapped_book_id := CASE 
                WHEN old_quote.book_id = '1984' THEN 'nineteen-eighty-four'
                WHEN old_quote.book_id = 'hamlet' THEN 'hamlet'
                WHEN old_quote.book_id = 'frankenstein' THEN 'frankenstein'
                WHEN old_quote.book_id = 'gatsby' THEN 'great-gatsby'
                WHEN old_quote.book_id = 'macbeth' THEN 'macbeth'
                WHEN old_quote.book_id = 'crucible' THEN 'crucible'
                -- Add more mappings as needed
                ELSE old_quote.book_id -- Keep original if no mapping needed
            END;
            
            -- Check if the mapped book ID exists in the books table
            IF EXISTS (SELECT 1 FROM public.books WHERE id = mapped_book_id) THEN
                -- Insert quote into new quotes table
                INSERT INTO public.quotes (
                    book_id,
                    text_title,
                    quote_text,
                    created_by,
                    created_at,
                    updated_at
                ) VALUES (
                    mapped_book_id,
                    COALESCE(old_quote.context, 'Migrated Quote'),
                    old_quote.quote_text,
                    COALESCE(old_quote.created_by, admin_user_id),
                    COALESCE(old_quote.created_at, NOW()),
                    COALESCE(old_quote.updated_at, NOW())
                ) RETURNING id INTO new_quote_id;
                
                -- Try to map old theme to new theme system
                IF old_quote.theme IS NOT NULL THEN
                    SELECT id INTO theme_id 
                    FROM public.flashcard_themes 
                    WHERE lower(name) = lower(old_quote.theme)
                    LIMIT 1;
                    
                    IF theme_id IS NOT NULL THEN
                        INSERT INTO public.quote_themes (quote_id, theme_id)
                        VALUES (new_quote_id, theme_id)
                        ON CONFLICT DO NOTHING;
                    END IF;
                END IF;
                
                migrated_count := migrated_count + 1;
            ELSE
                -- Skip quotes with invalid book IDs
                RAISE NOTICE 'Skipping quote with invalid book_id: % (original: %)', mapped_book_id, old_quote.book_id;
                skipped_count := skipped_count + 1;
            END IF;
        END LOOP;
        
        -- Drop the backup table after successful migration
        DROP TABLE quotes_backup;
        
        RAISE NOTICE 'Migration completed: % quotes migrated, % quotes skipped due to invalid book IDs', migrated_count, skipped_count;
    ELSE
        RAISE NOTICE 'No backup table found - starting with fresh quote system';
    END IF;
END $$;

-- Success message
SELECT 'Quote-first flashcard system migration completed successfully!' as message; 