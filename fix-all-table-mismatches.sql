-- Comprehensive fix for all table and column name mismatches
-- This aligns the database with what the service expects

-- Fix flashcard_cards table column names
ALTER TABLE public.flashcard_cards RENAME COLUMN blank_position TO missing_position;
ALTER TABLE public.flashcard_cards RENAME COLUMN answer_text TO missing_word;

-- Rename tables to match service expectations
ALTER TABLE public.flashcard_themes RENAME TO themes;
ALTER TABLE public.student_flashcard_sets RENAME TO student_card_sets;
ALTER TABLE public.student_set_cards RENAME TO student_card_set_items;
ALTER TABLE public.flashcard_progress_new RENAME TO card_progress;

-- Update foreign key references in renamed tables
-- Fix student_card_set_items foreign key column name
ALTER TABLE public.student_card_set_items RENAME COLUMN set_id TO set_id;
ALTER TABLE public.student_card_set_items RENAME COLUMN card_id TO card_id;
ALTER TABLE public.student_card_set_items RENAME COLUMN added_at TO added_at;

-- Add missing columns if needed
ALTER TABLE public.student_card_sets ADD COLUMN IF NOT EXISTS book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE;

-- Update indexes to match new table names
DROP INDEX IF EXISTS idx_flashcard_themes_name;
DROP INDEX IF EXISTS idx_student_flashcard_sets_user_id;
DROP INDEX IF EXISTS idx_student_flashcard_sets_book_id;
DROP INDEX IF EXISTS idx_student_set_cards_set_id;
DROP INDEX IF EXISTS idx_student_set_cards_card_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_user_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_card_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_next_review;

-- Create new indexes with correct names
CREATE INDEX idx_themes_name ON public.themes(name);
CREATE INDEX idx_student_card_sets_user_id ON public.student_card_sets(user_id);
CREATE INDEX idx_student_card_sets_book_id ON public.student_card_sets(book_id);
CREATE INDEX idx_student_card_set_items_set_id ON public.student_card_set_items(set_id);
CREATE INDEX idx_student_card_set_items_card_id ON public.student_card_set_items(card_id);
CREATE INDEX idx_card_progress_user_id ON public.card_progress(user_id);
CREATE INDEX idx_card_progress_card_id ON public.card_progress(card_id);
CREATE INDEX idx_card_progress_next_review ON public.card_progress(next_review_at);

-- Update triggers to use new table names
DROP TRIGGER IF EXISTS update_flashcard_themes_updated_at ON public.themes;
DROP TRIGGER IF EXISTS update_student_flashcard_sets_updated_at ON public.student_card_sets;
DROP TRIGGER IF EXISTS update_flashcard_progress_new_updated_at ON public.card_progress;

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON public.themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_card_sets_updated_at BEFORE UPDATE ON public.student_card_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_progress_updated_at BEFORE UPDATE ON public.card_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies to use new table names
DROP POLICY IF EXISTS "All users can view flashcard themes" ON public.themes;
DROP POLICY IF EXISTS "Admins can manage flashcard themes" ON public.themes;
DROP POLICY IF EXISTS "Users can manage their own flashcard sets" ON public.student_card_sets;
DROP POLICY IF EXISTS "Users can manage cards in their own sets" ON public.student_card_set_items;
DROP POLICY IF EXISTS "Users can manage their own flashcard progress" ON public.card_progress;

-- Create new RLS policies
CREATE POLICY "All users can view themes" ON public.themes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage themes" ON public.themes
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (auth.jwt() ->> 'role' = 'admin' OR 
         EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data ->> 'role' = 'admin'))
    );

CREATE POLICY "Users can manage their own card sets" ON public.student_card_sets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage cards in their own sets" ON public.student_card_set_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.student_card_sets 
            WHERE student_card_sets.id = student_card_set_items.set_id 
            AND student_card_sets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own card progress" ON public.card_progress
    FOR ALL USING (auth.uid() = user_id);

-- Update quote_themes table to reference the renamed themes table
-- (This should still work since we just renamed the table)

-- Success message
SELECT 'All table and column mismatches fixed successfully!' as message; 