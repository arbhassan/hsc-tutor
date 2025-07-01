-- Create quotes table for storing textual quotes organized by book and theme
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    book_id TEXT NOT NULL,
    theme TEXT NOT NULL,
    quote_text TEXT NOT NULL,
    context TEXT NOT NULL,
    page_reference TEXT,
    chapter_reference TEXT,
    literary_techniques TEXT[],
    importance_level INTEGER DEFAULT 3 CHECK (importance_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Ensure we don't have duplicate quotes
    UNIQUE(book_id, quote_text)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quotes_book_theme ON quotes(book_id, theme);
CREATE INDEX IF NOT EXISTS idx_quotes_book ON quotes(book_id);
CREATE INDEX IF NOT EXISTS idx_quotes_theme ON quotes(theme);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at_trigger
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for quotes table
CREATE POLICY "Allow authenticated users to view quotes" ON quotes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert quotes" ON quotes
    FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update their own quotes" ON quotes
    FOR UPDATE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Allow users to delete their own quotes" ON quotes
    FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Insert some sample data for testing
INSERT INTO quotes (book_id, theme, quote_text, context, page_reference, importance_level) VALUES
('frankenstein', 'Creation and Responsibility', 'I ought to be thy Adam, but I am rather the fallen angel.', 'The creature comparing himself to Satan from Paradise Lost', 'Chapter 10', 5),
('frankenstein', 'Creation and Responsibility', 'Did I request thee, Maker, from my clay to mould me, man?', 'Epigraph from Paradise Lost that questions creator''s responsibility', 'Epigraph', 5),
('frankenstein', 'Isolation and Alienation', 'I am alone and miserable; man will not associate with me.', 'The creature lamenting his isolation from society', 'Chapter 17', 4),
('1984', 'Totalitarianism', 'Big Brother is watching you.', 'The ubiquitous Party slogan representing constant surveillance', 'Part 1, Chapter 1', 5),
('1984', 'Individual vs. Society', 'Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.', 'Winston''s belief in objective truth as resistance', 'Part 1, Chapter 7', 5),
('great-gatsby', 'The American Dream', 'Gatsby believed in the green light, the orgastic future that year by year recedes before us.', 'Nick''s reflection on Gatsby''s hope and the elusiveness of the American Dream', 'Chapter 9', 5),
('hamlet', 'Revenge', 'The time is out of joint. O cursèd spite, That ever I was born to set it right!', 'Hamlet lamenting his duty to avenge his father', 'Act 1, Scene 5', 4),
('jane-eyre', 'Individual vs. Society', 'I am no bird; and no net ensnares me: I am a free human being with an independent will.', 'Jane asserting her independence and equality', 'Chapter 23', 5); 