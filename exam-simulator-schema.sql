-- Exam Simulator Database Schema
-- Tables for managing HSC Paper 1 exam simulator content

-- Create exam_unseen_texts table
CREATE TABLE public.exam_unseen_texts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    text_type TEXT NOT NULL CHECK (text_type IN ('Prose Fiction', 'Poetry', 'Drama Extract', 'Literary Nonfiction')),
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    difficulty_level TEXT DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create exam_unseen_questions table
CREATE TABLE public.exam_unseen_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unseen_text_id UUID REFERENCES public.exam_unseen_texts(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    marks INTEGER NOT NULL CHECK (marks >= 1 AND marks <= 10),
    question_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create exam_essay_questions table
CREATE TABLE public.exam_essay_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module TEXT NOT NULL,
    question_text TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create exam_thematic_quotes table
CREATE TABLE public.exam_thematic_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text_name TEXT NOT NULL, -- e.g., "Nineteen Eighty-Four", "The Merchant of Venice"
    theme TEXT NOT NULL,
    quote TEXT NOT NULL,
    context TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_exam_unseen_texts_type ON public.exam_unseen_texts(text_type);
CREATE INDEX idx_exam_unseen_texts_difficulty ON public.exam_unseen_texts(difficulty_level);
CREATE INDEX idx_exam_unseen_questions_text_id ON public.exam_unseen_questions(unseen_text_id);
CREATE INDEX idx_exam_unseen_questions_order ON public.exam_unseen_questions(question_order);
CREATE INDEX idx_exam_essay_questions_module ON public.exam_essay_questions(module);
CREATE INDEX idx_exam_essay_questions_difficulty ON public.exam_essay_questions(difficulty);
CREATE INDEX idx_exam_thematic_quotes_text_name ON public.exam_thematic_quotes(text_name);
CREATE INDEX idx_exam_thematic_quotes_theme ON public.exam_thematic_quotes(theme);

-- Create triggers for updating the updated_at column
CREATE TRIGGER update_exam_unseen_texts_updated_at BEFORE UPDATE ON public.exam_unseen_texts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_unseen_questions_updated_at BEFORE UPDATE ON public.exam_unseen_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_essay_questions_updated_at BEFORE UPDATE ON public.exam_essay_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_thematic_quotes_updated_at BEFORE UPDATE ON public.exam_thematic_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- No RLS needed as this is admin-managed content that should be publicly readable
-- but only admin writable (implement admin role check in the API routes) 