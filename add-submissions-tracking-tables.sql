-- Migration: Add submission tracking tables for Daily Drills and Exam Simulator
-- Run this script in your Supabase SQL Editor to add submission tracking functionality

-- Create user submission tracking tables
-- Main submissions table
CREATE TABLE public.user_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('daily_drill', 'exam_simulator')),
    content_type TEXT NOT NULL CHECK (content_type IN ('questions', 'essay')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    total_score INTEGER,
    max_score INTEGER,
    completion_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Individual question responses table
CREATE TABLE public.submission_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES public.user_submissions(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    user_response TEXT NOT NULL,
    correct_answer TEXT,
    ai_feedback TEXT,
    marks_awarded INTEGER,
    max_marks INTEGER,
    text_title TEXT,
    text_author TEXT,
    text_type TEXT,
    text_content TEXT,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Essay submissions table
CREATE TABLE public.submission_essays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES public.user_submissions(id) ON DELETE CASCADE NOT NULL,
    essay_question TEXT NOT NULL,
    essay_response TEXT NOT NULL,
    word_count INTEGER,
    quote_count INTEGER,
    ai_feedback TEXT,
    overall_score INTEGER,
    max_score INTEGER DEFAULT 20,
    criteria_scores JSONB, -- Store detailed scoring criteria
    band_level INTEGER,
    module TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for submission tables
CREATE INDEX idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX idx_user_submissions_type ON public.user_submissions(submission_type);
CREATE INDEX idx_user_submissions_content_type ON public.user_submissions(content_type);
CREATE INDEX idx_user_submissions_date ON public.user_submissions(submission_date);
CREATE INDEX idx_submission_questions_submission_id ON public.submission_questions(submission_id);
CREATE INDEX idx_submission_questions_order ON public.submission_questions(question_order);
CREATE INDEX idx_submission_essays_submission_id ON public.submission_essays(submission_id);

-- Enable RLS for submission tables
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_essays ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for submission tables
CREATE POLICY "Users can view own submissions" ON public.user_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.user_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" ON public.user_submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own question responses" ON public.submission_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_submissions 
            WHERE user_submissions.id = submission_questions.submission_id 
            AND user_submissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own question responses" ON public.submission_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_submissions 
            WHERE user_submissions.id = submission_questions.submission_id 
            AND user_submissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own essay submissions" ON public.submission_essays
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_submissions 
            WHERE user_submissions.id = submission_essays.submission_id 
            AND user_submissions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own essay submissions" ON public.submission_essays
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_submissions 
            WHERE user_submissions.id = submission_essays.submission_id 
            AND user_submissions.user_id = auth.uid()
        )
    );

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_submissions_updated_at BEFORE UPDATE ON public.user_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submission_questions_updated_at BEFORE UPDATE ON public.submission_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submission_essays_updated_at BEFORE UPDATE ON public.submission_essays
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Confirmation message
SELECT 'Submission tracking tables created successfully!' as status; 