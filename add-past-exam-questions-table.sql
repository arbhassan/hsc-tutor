-- Add past_exam_questions table to existing database
-- Run this script in your Supabase SQL Editor

-- Create past_exam_questions table
CREATE TABLE public.past_exam_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    theme TEXT NOT NULL,
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    year INTEGER,
    exam_type TEXT DEFAULT 'HSC' CHECK (exam_type IN ('HSC', 'Trial', 'Practice')),
    difficulty_level TEXT DEFAULT 'Standard' CHECK (difficulty_level IN ('Foundation', 'Standard', 'Advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for past exam questions
CREATE INDEX idx_past_exam_questions_book_id ON public.past_exam_questions(book_id);
CREATE INDEX idx_past_exam_questions_theme ON public.past_exam_questions(theme);
CREATE INDEX idx_past_exam_questions_exam_type ON public.past_exam_questions(exam_type);
CREATE INDEX idx_past_exam_questions_year ON public.past_exam_questions(year);

-- Create trigger for updating the updated_at column
CREATE TRIGGER update_past_exam_questions_updated_at BEFORE UPDATE ON public.past_exam_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional) - Add some example questions
INSERT INTO public.past_exam_questions (question, theme, book_id, year, exam_type, difficulty_level) VALUES
('How does Shelley explore the theme of responsibility in Frankenstein?', 'Creation and Responsibility', 'frankenstein', 2023, 'HSC', 'Standard'),
('To what extent does Victor Frankenstein embody the dangers of unchecked ambition?', 'Power', 'frankenstein', 2022, 'HSC', 'Standard'),
('How does Orwell present the individual''s struggle against totalitarian control in 1984?', 'Individual vs. Society', '1984', 2023, 'HSC', 'Standard'),
('Analyze the role of language as a tool of oppression in 1984.', 'Language and Truth', '1984', 2022, 'HSC', 'Advanced'),
('How does Fitzgerald critique the American Dream through the character of Jay Gatsby?', 'The American Dream', 'great-gatsby', 2023, 'HSC', 'Standard'); 