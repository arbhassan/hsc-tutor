-- Add missing books to the books table
-- Run this in your Supabase SQL Editor

INSERT INTO public.books (id, title, author, year, description, image, category, themes, popular) VALUES

-- Amanda Lohrey - Vertigo (Prose/Novel)
('vertigo', 'Vertigo', 'Amanda Lohrey', '2008', 
 'A novel exploring themes of anxiety, modern life, spirituality, and the search for meaning in contemporary Australia.', 
 null, 'prose', 
 ARRAY['Anxiety', 'Spirituality', 'Modern life', 'Meaning', 'Australian identity'], false),

-- Ivan O'Mahoney - Go Back to Where You Came From (Documentary Series)
('go-back-where-you-came-from', 'Go Back to Where You Came From Series 1: Episodes 1, 2 and 3 and The Response', 'Ivan O''Mahoney', '2011', 
 'A documentary series that follows six Australians as they are confronted with the issues faced by refugees and asylum seekers.', 
 null, 'film', 
 ARRAY['Refugees', 'Asylum seekers', 'Empathy', 'Social justice', 'Human rights', 'Immigration'], false)

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

-- Verification query
SELECT id, title, author, year, category 
FROM public.books 
WHERE id IN ('vertigo', 'go-back-where-you-came-from')
ORDER BY title;

