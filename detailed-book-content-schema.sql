-- Detailed Book Content Database Schema
-- This schema stores all the comprehensive content for the Text Mastery feature
-- Run this script in your Supabase SQL Editor

-- ============================================================================
-- DETAILED CONTEXTS TABLE
-- ============================================================================
CREATE TABLE public.book_detailed_contexts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    context_type TEXT NOT NULL CHECK (context_type IN ('historical', 'political', 'biographical', 'philosophical')),
    title TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]', -- Array of {title?, content: string[]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id, context_type)
);

-- ============================================================================
-- DETAILED RUBRIC CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE public.book_rubric_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    rubric_type TEXT NOT NULL CHECK (rubric_type IN ('anomaliesAndParadoxes', 'emotionalExperiences', 'relationships', 'humanCapacityForUnderstanding')),
    title TEXT NOT NULL,
    subsections JSONB NOT NULL DEFAULT '[]', -- Array of {title: string, content: string[]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id, rubric_type)
);

-- ============================================================================
-- PLOT SUMMARY TABLE
-- ============================================================================
CREATE TABLE public.book_plot_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    parts JSONB NOT NULL DEFAULT '[]', -- Array of plot parts with chapters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id)
);

-- ============================================================================
-- DETAILED CONTEMPORARY CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE public.book_contemporary_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]', -- Array of {title: string, subsections: {title: string, content: string[]}[]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id)
);

-- ============================================================================
-- ESSAY GUIDE TABLE
-- ============================================================================
CREATE TABLE public.book_essay_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    structure JSONB NOT NULL DEFAULT '{}', -- {title, parts: {title, wordCount?, content: string[], example?}[]}
    techniques JSONB NOT NULL DEFAULT '{}', -- {title, categories: {title, techniques: {name, description}[]}[]}
    mistakes JSONB NOT NULL DEFAULT '{}', -- {title, dontDo: string[], doInstead: string[]}
    sample_question JSONB NOT NULL DEFAULT '{}', -- {title, question, approach: string[]}
    tips JSONB NOT NULL DEFAULT '{}', -- {title, phases: {title, tips: string[]}[]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id)
);

-- ============================================================================
-- ENHANCED QUOTES TABLE (to replace the simple quotes structure)
-- ============================================================================
CREATE TABLE public.book_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    quote_id TEXT NOT NULL, -- Original quote ID from the static data
    text TEXT NOT NULL,
    reference TEXT NOT NULL,
    technique TEXT NOT NULL,
    themes TEXT[] NOT NULL DEFAULT '{}',
    explanation TEXT NOT NULL,
    rubric_connection TEXT NOT NULL,
    chapter TEXT NOT NULL,
    character TEXT NOT NULL,
    significance TEXT NOT NULL CHECK (significance IN ('high', 'medium', 'low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(book_id, quote_id)
);

-- ============================================================================
-- TECHNIQUES TABLE
-- ============================================================================
CREATE TABLE public.book_techniques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    definition TEXT NOT NULL,
    example TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================================================
CREATE INDEX idx_book_detailed_contexts_book_id ON public.book_detailed_contexts(book_id);
CREATE INDEX idx_book_rubric_connections_book_id ON public.book_rubric_connections(book_id);
CREATE INDEX idx_book_plot_summaries_book_id ON public.book_plot_summaries(book_id);
CREATE INDEX idx_book_contemporary_connections_book_id ON public.book_contemporary_connections(book_id);
CREATE INDEX idx_book_essay_guides_book_id ON public.book_essay_guides(book_id);
CREATE INDEX idx_book_quotes_book_id ON public.book_quotes(book_id);
CREATE INDEX idx_book_quotes_themes ON public.book_quotes USING GIN(themes);
CREATE INDEX idx_book_techniques_book_id ON public.book_techniques(book_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
CREATE TRIGGER update_book_detailed_contexts_updated_at BEFORE UPDATE ON public.book_detailed_contexts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_rubric_connections_updated_at BEFORE UPDATE ON public.book_rubric_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_plot_summaries_updated_at BEFORE UPDATE ON public.book_plot_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_contemporary_connections_updated_at BEFORE UPDATE ON public.book_contemporary_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_essay_guides_updated_at BEFORE UPDATE ON public.book_essay_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_quotes_updated_at BEFORE UPDATE ON public.book_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_techniques_updated_at BEFORE UPDATE ON public.book_techniques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.book_detailed_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_rubric_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_plot_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_contemporary_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_essay_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_techniques ENABLE ROW LEVEL SECURITY;

-- Public read access for all book content
CREATE POLICY "Book content is publicly readable" ON public.book_detailed_contexts
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_rubric_connections
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_plot_summaries
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_contemporary_connections
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_essay_guides
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_quotes
    FOR SELECT USING (true);

CREATE POLICY "Book content is publicly readable" ON public.book_techniques
    FOR SELECT USING (true);

-- Admin write access (you'll need to adjust this based on your admin role setup)
-- For now, allowing authenticated users to write - you can make this more restrictive
CREATE POLICY "Authenticated users can modify book content" ON public.book_detailed_contexts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_rubric_connections
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_plot_summaries
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_contemporary_connections
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_essay_guides
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_quotes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can modify book content" ON public.book_techniques
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON public.book_detailed_contexts TO anon, authenticated;
GRANT SELECT ON public.book_rubric_connections TO anon, authenticated;
GRANT SELECT ON public.book_plot_summaries TO anon, authenticated;
GRANT SELECT ON public.book_contemporary_connections TO anon, authenticated;
GRANT SELECT ON public.book_essay_guides TO anon, authenticated;
GRANT SELECT ON public.book_quotes TO anon, authenticated;
GRANT SELECT ON public.book_techniques TO anon, authenticated;

GRANT ALL ON public.book_detailed_contexts TO authenticated;
GRANT ALL ON public.book_rubric_connections TO authenticated;
GRANT ALL ON public.book_plot_summaries TO authenticated;
GRANT ALL ON public.book_contemporary_connections TO authenticated;
GRANT ALL ON public.book_essay_guides TO authenticated;
GRANT ALL ON public.book_quotes TO authenticated;
GRANT ALL ON public.book_techniques TO authenticated; 