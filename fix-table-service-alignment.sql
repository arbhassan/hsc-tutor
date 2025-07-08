-- Targeted fix to align database with service expectations
-- Run this AFTER the column fix script (fix-quotes-table-columns.sql)

-- The quotes table should already be fixed by the previous script
-- Now we need to rename tables to match service expectations

-- 1. Rename theme table (flashcard_themes -> themes)
ALTER TABLE public.flashcard_themes RENAME TO themes;

-- 2. Rename student flashcard sets table
ALTER TABLE public.student_flashcard_sets RENAME TO student_card_sets;

-- 3. Rename student set cards table  
ALTER TABLE public.student_set_cards RENAME TO student_card_set_items;

-- 4. Rename progress table
ALTER TABLE public.flashcard_progress_new RENAME TO card_progress;

-- 5. Update foreign key references and constraints
-- The foreign keys should automatically update with table renames

-- 6. Update quote_themes table to reference renamed themes table
-- Foreign keys should automatically update

-- 7. Drop old indexes
DROP INDEX IF EXISTS idx_flashcard_themes_name;
DROP INDEX IF EXISTS idx_student_flashcard_sets_user_id;
DROP INDEX IF EXISTS idx_student_flashcard_sets_book_id;
DROP INDEX IF EXISTS idx_student_set_cards_set_id;
DROP INDEX IF EXISTS idx_student_set_cards_card_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_user_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_card_id;
DROP INDEX IF EXISTS idx_flashcard_progress_new_next_review;

-- 8. Create new indexes with updated table names
CREATE INDEX idx_themes_name ON public.themes(name);
CREATE INDEX idx_student_card_sets_user_id ON public.student_card_sets(user_id);
CREATE INDEX idx_student_card_sets_book_id ON public.student_card_sets(book_id);
CREATE INDEX idx_student_card_set_items_set_id ON public.student_card_set_items(set_id);
CREATE INDEX idx_student_card_set_items_card_id ON public.student_card_set_items(card_id);
CREATE INDEX idx_card_progress_user_id ON public.card_progress(user_id);
CREATE INDEX idx_card_progress_card_id ON public.card_progress(card_id);
CREATE INDEX idx_card_progress_next_review ON public.card_progress(next_review_at);

-- 9. Update triggers
DROP TRIGGER IF EXISTS update_flashcard_themes_updated_at ON public.themes;
DROP TRIGGER IF EXISTS update_student_flashcard_sets_updated_at ON public.student_card_sets;
DROP TRIGGER IF EXISTS update_flashcard_progress_new_updated_at ON public.card_progress;

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON public.themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_card_sets_updated_at BEFORE UPDATE ON public.student_card_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_progress_updated_at BEFORE UPDATE ON public.card_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Update RLS policies
-- Note: May need to recreate policies with new table names
-- Drop old policies first
DROP POLICY IF EXISTS "All users can view flashcard themes" ON public.themes;
DROP POLICY IF EXISTS "Admins can manage flashcard themes" ON public.themes;
DROP POLICY IF EXISTS "Users can manage their own flashcard sets" ON public.student_card_sets;
DROP POLICY IF EXISTS "Users can manage cards in their own sets" ON public.student_card_set_items;
DROP POLICY IF EXISTS "Users can manage their own flashcard progress" ON public.card_progress;

-- Create new policies
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

-- Success message
SELECT 'Database schema aligned with service expectations!' as message; 