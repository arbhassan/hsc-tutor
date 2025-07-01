-- Fix books table access after RLS was disabled
-- Run this in your Supabase SQL Editor

-- Step 1: Ensure books table has proper permissions for anonymous and authenticated users
GRANT SELECT ON public.books TO anon;
GRANT SELECT ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;

-- Step 2: Re-enable RLS on books table (recommended for security)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a simple policy that allows everyone to read books
-- (since books are public data that everyone should be able to access)
DROP POLICY IF EXISTS "Books are publicly readable" ON public.books;
CREATE POLICY "Books are publicly readable" ON public.books
    FOR SELECT USING (true);

-- Step 4: If you want to allow authenticated users to add books (optional)
-- Uncomment the following lines:
-- DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
-- CREATE POLICY "Authenticated users can insert books" ON public.books
--     FOR INSERT TO authenticated WITH CHECK (true);
-- 
-- GRANT INSERT ON public.books TO authenticated;

-- Step 5: Verify the books exist by checking count
SELECT COUNT(*) as total_books FROM public.books;

-- Step 6: Show first few books to verify data
SELECT id, title, author FROM public.books ORDER BY title LIMIT 5;

-- Step 7: If no books exist, insert some sample data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.books LIMIT 1) THEN
        INSERT INTO public.books (id, title, author, year, description, category, themes, popular) VALUES
        ('nineteen-eighty-four', 'Nineteen Eighty-Four', 'George Orwell', '1949', 
         'A dystopian novel that examines totalitarianism, surveillance, and the manipulation of truth.', 
         'prose', ARRAY['Totalitarianism', 'Surveillance', 'Freedom', 'Language and Reality'], true),
        
        ('frankenstein', 'Frankenstein', 'Mary Shelley', '1818', 
         'A Gothic novel that explores themes of creation, responsibility, isolation, and the dangers of unchecked ambition.', 
         'prose', ARRAY['Creation', 'Responsibility', 'Isolation', 'Scientific Ethics'], true),
        
        ('great-gatsby', 'The Great Gatsby', 'F. Scott Fitzgerald', '1925', 
         'A novel that explores themes of wealth, class, love, and the American Dream in the Jazz Age.', 
         'prose', ARRAY['American Dream', 'Wealth', 'Class', 'Love'], true),
        
        ('hamlet', 'Hamlet', 'William Shakespeare', '1601', 
         'A tragedy that explores themes of revenge, madness, mortality, and the complexity of action versus inaction.', 
         'drama', ARRAY['Revenge', 'Madness', 'Mortality', 'Action vs Inaction'], true),
        
        ('slessor-poems', 'Selected Poems', 'Kenneth Slessor', 'Various', 
         'Poetry that explores themes of time, memory, and Australian landscape.', 
         'poetry', ARRAY['Time', 'Memory', 'Australian landscape', 'War'], true);
    END IF;
END $$;

-- Final verification
SELECT 
    'Books table setup complete!' as status,
    COUNT(*) as total_books,
    COUNT(*) FILTER (WHERE popular = true) as popular_books
FROM public.books; 