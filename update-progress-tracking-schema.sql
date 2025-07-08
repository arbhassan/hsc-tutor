-- Update progress tracking schema to support detailed short answer and essay component tracking
-- Run this script to add the new tracking tables to your database

-- Create detailed short answer progress table by marker type
CREATE TABLE IF NOT EXISTS public.short_answer_progress_detailed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    marker_type INTEGER NOT NULL CHECK (marker_type IN (2, 3, 4, 5)),
    total_questions INTEGER DEFAULT 0 NOT NULL,
    correct_answers INTEGER DEFAULT 0 NOT NULL,
    average_score INTEGER DEFAULT 0 NOT NULL CHECK (average_score >= 0 AND average_score <= 100),
    average_completion_time DECIMAL(5,2) DEFAULT 0.0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, marker_type)
);

-- Create detailed essay component progress table
CREATE TABLE IF NOT EXISTS public.essay_component_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    component_type TEXT NOT NULL CHECK (component_type IN ('introduction', 'body_paragraphs', 'conclusion', 'question_analysis')),
    total_assessments INTEGER DEFAULT 0 NOT NULL,
    average_score INTEGER DEFAULT 0 NOT NULL CHECK (average_score >= 0 AND average_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, component_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_short_answer_progress_detailed_user_id ON public.short_answer_progress_detailed(user_id);
CREATE INDEX IF NOT EXISTS idx_short_answer_progress_detailed_marker_type ON public.short_answer_progress_detailed(marker_type);
CREATE INDEX IF NOT EXISTS idx_essay_component_progress_user_id ON public.essay_component_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_essay_component_progress_component_type ON public.essay_component_progress(component_type);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE public.short_answer_progress_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_component_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view own detailed short answer progress" ON public.short_answer_progress_detailed
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own detailed short answer progress" ON public.short_answer_progress_detailed
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own detailed short answer progress" ON public.short_answer_progress_detailed
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own essay component progress" ON public.essay_component_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essay component progress" ON public.essay_component_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own essay component progress" ON public.essay_component_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updating the updated_at column
CREATE TRIGGER update_short_answer_progress_detailed_updated_at BEFORE UPDATE ON public.short_answer_progress_detailed
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_essay_component_progress_updated_at BEFORE UPDATE ON public.essay_component_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.short_answer_progress_detailed TO anon, authenticated;
GRANT ALL ON public.essay_component_progress TO anon, authenticated; 