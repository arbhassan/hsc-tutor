-- HSC Tutor Database Schema
-- Run this script in your Supabase SQL Editor to create the required tables

-- Create books table
CREATE TABLE public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL CHECK (category IN ('prose', 'poetry', 'drama', 'nonfiction', 'film')),
    themes TEXT[] NOT NULL DEFAULT '{}',
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    selected_book_id TEXT NOT NULL,
    selected_book_title TEXT NOT NULL,
    selected_book_author TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_progress table
CREATE TABLE public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    study_streak INTEGER DEFAULT 0 NOT NULL,
    total_study_time DECIMAL(10,2) DEFAULT 0.0 NOT NULL,
    completion_rate INTEGER DEFAULT 0 NOT NULL CHECK (completion_rate >= 0 AND completion_rate <= 100),
    overall_mastery INTEGER DEFAULT 0 NOT NULL CHECK (overall_mastery >= 0 AND overall_mastery <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create flashcard_progress table
CREATE TABLE public.flashcard_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text_name TEXT NOT NULL,
    total_flashcards INTEGER DEFAULT 0 NOT NULL,
    mastered_flashcards INTEGER DEFAULT 0 NOT NULL,
    average_accuracy INTEGER DEFAULT 0 NOT NULL CHECK (average_accuracy >= 0 AND average_accuracy <= 100),
    completion_time DECIMAL(5,2) DEFAULT 0.0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create short_answer_progress table
CREATE TABLE public.short_answer_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_questions INTEGER DEFAULT 0 NOT NULL,
    average_score INTEGER DEFAULT 0 NOT NULL CHECK (average_score >= 0 AND average_score <= 100),
    average_completion_time DECIMAL(5,2) DEFAULT 0.0 NOT NULL,
    multiple_attempts_rate INTEGER DEFAULT 0 NOT NULL CHECK (multiple_attempts_rate >= 0 AND multiple_attempts_rate <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create essay_progress table
CREATE TABLE public.essay_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_essays INTEGER DEFAULT 0 NOT NULL,
    average_score INTEGER DEFAULT 0 NOT NULL CHECK (average_score >= 0 AND average_score <= 100),
    average_word_count INTEGER DEFAULT 0 NOT NULL,
    average_quote_usage DECIMAL(3,1) DEFAULT 0.0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create weekly_reports table
CREATE TABLE public.weekly_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    highlights TEXT[] DEFAULT '{}' NOT NULL,
    action_points TEXT[] DEFAULT '{}' NOT NULL,
    time_recommendations TEXT[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_books_category ON public.books(category);
CREATE INDEX idx_books_popular ON public.books(popular);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_flashcard_progress_user_id ON public.flashcard_progress(user_id);
CREATE INDEX idx_flashcard_progress_text_name ON public.flashcard_progress(text_name);
CREATE INDEX idx_short_answer_progress_user_id ON public.short_answer_progress(user_id);
CREATE INDEX idx_essay_progress_user_id ON public.essay_progress(user_id);
CREATE INDEX idx_weekly_reports_user_id ON public.weekly_reports(user_id);
CREATE INDEX idx_weekly_reports_week_start ON public.weekly_reports(week_start);

-- Enable Row Level Security (RLS) on all tables
-- Books table is public readable, no RLS needed
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_answer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to ensure users can only access their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own flashcard progress" ON public.flashcard_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard progress" ON public.flashcard_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard progress" ON public.flashcard_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own short answer progress" ON public.short_answer_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own short answer progress" ON public.short_answer_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own short answer progress" ON public.short_answer_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own essay progress" ON public.essay_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essay progress" ON public.essay_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own essay progress" ON public.essay_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly reports" ON public.weekly_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly reports" ON public.weekly_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly reports" ON public.weekly_reports
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating the updated_at column
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcard_progress_updated_at BEFORE UPDATE ON public.flashcard_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_short_answer_progress_updated_at BEFORE UPDATE ON public.short_answer_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_essay_progress_updated_at BEFORE UPDATE ON public.essay_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically create user profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name, selected_book_id, selected_book_title, selected_book_author)
  VALUES (NEW.id, 'New', 'User', '', '', '');
  
  INSERT INTO public.user_progress (user_id, study_streak, total_study_time, completion_rate, overall_mastery)
  VALUES (NEW.id, 0, 0.0, 0, 0);
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add new tables for quotes and flashcard sets
CREATE TABLE public.flashcard_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('quote', 'paragraph', 'analysis')),
    book_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.passages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flashcard_set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    source TEXT NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    correct_attempts INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_flashcard_sets_user_id ON public.flashcard_sets(user_id);
CREATE INDEX idx_flashcard_sets_book_id ON public.flashcard_sets(book_id);
CREATE INDEX idx_passages_flashcard_set_id ON public.passages(flashcard_set_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own flashcard sets" ON public.flashcard_sets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard sets" ON public.flashcard_sets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard sets" ON public.flashcard_sets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard sets" ON public.flashcard_sets
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view passages in their flashcard sets" ON public.passages
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.flashcard_sets WHERE id = flashcard_set_id));

CREATE POLICY "Users can insert passages in their flashcard sets" ON public.passages
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.flashcard_sets WHERE id = flashcard_set_id));

CREATE POLICY "Users can update passages in their flashcard sets" ON public.passages
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.flashcard_sets WHERE id = flashcard_set_id));

CREATE POLICY "Users can delete passages in their flashcard sets" ON public.passages
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.flashcard_sets WHERE id = flashcard_set_id));

-- Create triggers for updating the updated_at column
CREATE TRIGGER update_flashcard_sets_updated_at BEFORE UPDATE ON public.flashcard_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passages_updated_at BEFORE UPDATE ON public.passages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Enable RLS on past_exam_questions table (public read, admin write)
-- For now, allow all authenticated users to read, but this can be restricted later
-- Past exam questions are generally public information 