-- Daily Drill Database Schema
-- Tables for managing Daily Drill practice texts and questions
-- Run this script in your Supabase SQL Editor

-- Create daily_drill_texts table
CREATE TABLE public.daily_drill_texts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    text_type TEXT NOT NULL CHECK (text_type IN ('Prose Fiction Extract', 'Poetry', 'Drama Extract', 'Literary Nonfiction')),
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    difficulty_level TEXT DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create daily_drill_questions table
CREATE TABLE public.daily_drill_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text_id UUID REFERENCES public.daily_drill_texts(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    marks INTEGER NOT NULL CHECK (marks >= 1 AND marks <= 10),
    question_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create daily_drill_model_answers table (optional but recommended for reference)
CREATE TABLE public.daily_drill_model_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.daily_drill_questions(id) ON DELETE CASCADE NOT NULL,
    answer TEXT NOT NULL,
    commentary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(question_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_daily_drill_texts_active ON public.daily_drill_texts(is_active);
CREATE INDEX idx_daily_drill_texts_order ON public.daily_drill_texts(display_order);
CREATE INDEX idx_daily_drill_questions_text_id ON public.daily_drill_questions(text_id);
CREATE INDEX idx_daily_drill_questions_order ON public.daily_drill_questions(question_order);

-- Enable Row Level Security (RLS)
ALTER TABLE public.daily_drill_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_drill_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_drill_model_answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to daily drill texts"
    ON public.daily_drill_texts
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to daily drill questions"
    ON public.daily_drill_questions
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to daily drill model answers"
    ON public.daily_drill_model_answers
    FOR SELECT
    TO public
    USING (true);

-- Create RLS policies for authenticated users to write (admins)
-- Note: You might want to add additional role checking here
CREATE POLICY "Allow authenticated users to insert daily drill texts"
    ON public.daily_drill_texts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update daily drill texts"
    ON public.daily_drill_texts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete daily drill texts"
    ON public.daily_drill_texts
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert daily drill questions"
    ON public.daily_drill_questions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update daily drill questions"
    ON public.daily_drill_questions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete daily drill questions"
    ON public.daily_drill_questions
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert daily drill model answers"
    ON public.daily_drill_model_answers
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update daily drill model answers"
    ON public.daily_drill_model_answers
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete daily drill model answers"
    ON public.daily_drill_model_answers
    FOR DELETE
    TO authenticated
    USING (true);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_drill_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_drill_texts_updated_at
    BEFORE UPDATE ON public.daily_drill_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_drill_updated_at();

CREATE TRIGGER update_daily_drill_questions_updated_at
    BEFORE UPDATE ON public.daily_drill_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_drill_updated_at();

CREATE TRIGGER update_daily_drill_model_answers_updated_at
    BEFORE UPDATE ON public.daily_drill_model_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_drill_updated_at();

-- Insert sample data (migrate existing hardcoded data)
INSERT INTO public.daily_drill_texts (title, author, text_type, content, source, difficulty_level, is_active, display_order)
VALUES 
    ('Miss This Place', 'Anonymous', 'Prose Fiction Extract', 
     E'Leaving the mountains wasn\'t going to be easy. James had lived there since he was three years old. Someone told him once that you don\'t start making memories until you are three. That made sense. After all, he couldn\'t remember living anywhere else.\n\nHis father asked him if he was ready to go. James didn\'t say anything. He just nodded. His father tossed him the last bag. It flew over the water. He caught it just before it touched down. He handed it off to his brother, Tom. Tom put the bag into the luggage compartment of the orange floatplane. It was the last one.\n\nJames looked at his father. Then he looked at the mountains behind him. They jutted up into the sky. They were so beautiful. They were so severe. How could anything else compare?',
     'Original work for HSC practice', 'Medium', true, 1),
    
    ('The Crossing', 'Emily Chen', 'Poetry',
     E'The bridge stretches before me,\nA thin line between what was and what will be.\nEach step forward echoes with memory,\nEach step back impossible to see.\n\nThe water below churns dark and deep,\nSecrets and stories it promises to keep.\nI stand at the center, caught between shores,\nThe weight of decision heavy on weary feet.\n\nBehind: the comfort of familiar pain.\nAhead: the terror of unknown terrain.\nThe bridge sways gently, urging me on,\nWhile whispers of doubt fall like rain.',
     'Contemporary Voices Anthology, 2023', 'Medium', true, 2),
    
    ('The Waiting Room', 'David Nguyen', 'Drama Extract',
     E'[A sparsely furnished waiting room. Three chairs against the wall. A clock that reads 3:45. MARCUS (40s) sits nervously, checking his watch repeatedly. ELIZA (30s) enters.]\n\nELIZA: [Pausing at the doorway] Is this seat taken?\n\nMARCUS: [Not looking up] Does it look taken?\n\nELIZA: [Sitting down] No need for that tone. We\'re all in the same boat here.\n\nMARCUS: [Finally looking at her] Are we? Do you know why I\'m here?\n\nELIZA: No, but I know that clock hasn\'t moved in twenty minutes. [Points to the wall clock]\n\nMARCUS: [Laughs unexpectedly] I\'ve been watching it too. Thought I was going crazy.\n\nELIZA: Maybe we both are. [Beat] How long have you been waiting?\n\nMARCUS: [Returning to seriousness] My whole life, it feels like.\n\n[The lights flicker briefly. Both look up.]',
     'From ''Liminal Spaces'', New Theatre Collection, 2022', 'Medium', true, 3);

-- Note: You'll need to get the UUIDs from the inserted texts to add questions
-- This is a placeholder - in the admin interface, you'll create these relationships dynamically

