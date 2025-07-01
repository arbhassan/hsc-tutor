-- Setup script for books database
-- This script creates the books table and populates it with initial data
-- Run this in your Supabase SQL Editor

-- Step 1: Create the books table (if not already created)
CREATE TABLE IF NOT EXISTS public.books (
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_popular ON public.books(popular);
CREATE INDEX IF NOT EXISTS idx_books_themes ON public.books USING GIN(themes);

-- Step 3: Create trigger for updated_at timestamp (if function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
        CREATE TRIGGER update_books_updated_at 
            BEFORE UPDATE ON public.books
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Step 4: Insert initial book data
INSERT INTO public.books (id, title, author, year, description, image, category, themes, popular) VALUES
-- Prose Fiction
('nineteen-eighty-four', 'Nineteen Eighty-Four', 'George Orwell', '1949', 
 'A dystopian novel that examines totalitarianism, surveillance, and the manipulation of truth.', 
 '/big-brother-eye.png', 'prose', 
 ARRAY['Totalitarianism', 'Surveillance', 'Freedom', 'Language and Reality'], true),

('frankenstein', 'Frankenstein', 'Mary Shelley', '1818', 
 'A Gothic novel that explores themes of creation, responsibility, isolation, and the dangers of unchecked ambition.', 
 '/frankenstein-book-cover.png', 'prose', 
 ARRAY['Creation', 'Responsibility', 'Isolation', 'Scientific Ethics'], true),

('great-gatsby', 'The Great Gatsby', 'F. Scott Fitzgerald', '1925', 
 'A novel that explores themes of wealth, class, love, and the American Dream in the Jazz Age.', 
 '/placeholder.svg?height=120&width=200', 'prose', 
 ARRAY['American Dream', 'Wealth', 'Class', 'Love'], true),

('all-the-light', 'All the Light We Cannot See', 'Anthony Doerr', '2014', 
 'A novel about a blind French girl and German boy during World War II.', 
 null, 'prose', 
 ARRAY['War', 'Humanity', 'Resilience', 'Connection'], true),

('past-the-shallows', 'Past the Shallows', 'Favel Parrett', '2011', 
 'A haunting story of three brothers growing up on the Tasmanian coast.', 
 null, 'prose', 
 ARRAY['Family', 'Loss', 'Survival', 'Nature'], false),

-- Drama/Shakespeare
('hamlet', 'Hamlet', 'William Shakespeare', '1601', 
 'A tragedy that explores themes of revenge, madness, mortality, and the complexity of action versus inaction.', 
 '/placeholder.svg?height=120&width=200', 'drama', 
 ARRAY['Revenge', 'Madness', 'Mortality', 'Action vs Inaction'], true),

('crucible', 'The Crucible', 'Arthur Miller', '1953', 
 'A play about the Salem witch trials that serves as an allegory for McCarthyism.', 
 null, 'drama', 
 ARRAY['Hysteria', 'Reputation', 'Power', 'Truth vs Lies'], true),

('merchant-of-venice', 'The Merchant of Venice', 'William Shakespeare', '1597', 
 'A play that explores themes of justice, mercy, and prejudice.', 
 null, 'drama', 
 ARRAY['Justice', 'Mercy', 'Prejudice', 'Identity'], false),

('rainbows-end', 'Rainbow''s End', 'Jane Harrison', '1957', 
 'A play about three generations of Aboriginal women.', 
 null, 'drama', 
 ARRAY['Indigenous identity', 'Family', 'Prejudice', 'Belonging'], false),

-- Poetry
('slessor-poems', 'Selected Poems', 'Kenneth Slessor', 'Various', 
 'Poetry that explores themes of time, memory, and Australian landscape.', 
 null, 'poetry', 
 ARRAY['Time', 'Memory', 'Australian landscape', 'War'], true),

('dobson-poems', 'Collected Poems', 'Rosemary Dobson', 'Various', 
 'Poetry exploring themes of art, time, and mortality.', 
 null, 'poetry', 
 ARRAY['Time', 'Art', 'Mortality', 'Nature'], false),

-- Nonfiction
('i-am-malala', 'I Am Malala', 'Malala Yousafzai & Christina Lamb', '2013', 
 'The story of a girl who stood up for education and was shot by the Taliban.', 
 null, 'nonfiction', 
 ARRAY['Education', 'Courage', 'Activism', 'Women''s Rights'], true),

('boy-behind-curtain', 'The Boy Behind the Curtain', 'Tim Winton', '2016', 
 'A collection of essays about Australian life and identity.', 
 null, 'nonfiction', 
 ARRAY['Memory', 'Australian identity', 'Environment', 'Family'], false),

-- Film/Media
('billy-elliot', 'Billy Elliot', 'Stephen Daldry', '2000', 
 'A film about a boy who wants to dance ballet despite social expectations.', 
 null, 'film', 
 ARRAY['Identity', 'Gender roles', 'Family', 'Class'], false),

('waste-land', 'Waste Land', 'Lucy Walker', '2010', 
 'A documentary about artist Vik Muniz working with garbage pickers in Brazil.', 
 null, 'film', 
 ARRAY['Art', 'Poverty', 'Transformation', 'Human Dignity'], false)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  year = EXCLUDED.year,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  themes = EXCLUDED.themes,
  popular = EXCLUDED.popular,
  updated_at = NOW();

-- Step 5: Enable public read access (since books are public data)
-- Note: This allows anyone to read books data without authentication
-- If you want to restrict access, remove these policies and add appropriate RLS policies

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Books are publicly readable" ON public.books;
CREATE POLICY "Books are publicly readable" ON public.books
    FOR SELECT USING (true);

-- Optional: Allow authenticated users to suggest books (insert)
-- Uncomment the following if you want users to be able to suggest new books
-- DROP POLICY IF EXISTS "Authenticated users can suggest books" ON public.books;
-- CREATE POLICY "Authenticated users can suggest books" ON public.books
--     FOR INSERT TO authenticated WITH CHECK (true);

-- Step 6: Grant necessary permissions
GRANT SELECT ON public.books TO anon;
GRANT SELECT ON public.books TO authenticated;

-- Optional: Grant insert permissions to authenticated users
-- GRANT INSERT ON public.books TO authenticated;

-- Verification query - run this to check if everything worked
SELECT 
    count(*) as total_books,
    count(*) FILTER (WHERE popular = true) as popular_books,
    count(*) FILTER (WHERE category = 'prose') as prose_books,
    count(*) FILTER (WHERE category = 'drama') as drama_books,
    count(*) FILTER (WHERE category = 'poetry') as poetry_books,
    count(*) FILTER (WHERE category = 'nonfiction') as nonfiction_books,
    count(*) FILTER (WHERE category = 'film') as film_books
FROM public.books; 