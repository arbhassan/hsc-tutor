-- Populate books table with initial data
-- Run this after creating the books table

INSERT INTO public.books (id, title, author, year, description, image, category, themes, popular) VALUES
-- Prose Fiction
('nineteen-eighty-four', 'Nineteen Eighty-Four', 'George Orwell', '1949', 'A dystopian novel that examines totalitarianism, surveillance, and the manipulation of truth.', '/big-brother-eye.png', 'prose', ARRAY['Totalitarianism', 'Surveillance', 'Freedom', 'Language and Reality'], true),
('frankenstein', 'Frankenstein', 'Mary Shelley', '1818', 'A Gothic novel that explores themes of creation, responsibility, isolation, and the dangers of unchecked ambition.', '/frankenstein-book-cover.png', 'prose', ARRAY['Creation', 'Responsibility', 'Isolation', 'Scientific Ethics'], true),
('great-gatsby', 'The Great Gatsby', 'F. Scott Fitzgerald', '1925', 'A novel that explores themes of wealth, class, love, and the American Dream in the Jazz Age.', '/placeholder.svg?height=120&width=200', 'prose', ARRAY['American Dream', 'Wealth', 'Class', 'Love'], true),
('all-the-light', 'All the Light We Cannot See', 'Anthony Doerr', '2014', 'A novel about a blind French girl and German boy during World War II.', null, 'prose', ARRAY['War', 'Humanity', 'Resilience', 'Connection'], true),
('past-the-shallows', 'Past the Shallows', 'Favel Parrett', '2011', 'A haunting story of three brothers growing up on the Tasmanian coast.', null, 'prose', ARRAY['Family', 'Loss', 'Survival', 'Nature'], false),

-- Drama/Shakespeare
('hamlet', 'Hamlet', 'William Shakespeare', '1601', 'A tragedy that explores themes of revenge, madness, mortality, and the complexity of action versus inaction.', '/placeholder.svg?height=120&width=200', 'drama', ARRAY['Revenge', 'Madness', 'Mortality', 'Action vs Inaction'], true),
('crucible', 'The Crucible', 'Arthur Miller', '1953', 'A play about the Salem witch trials that serves as an allegory for McCarthyism.', null, 'drama', ARRAY['Hysteria', 'Reputation', 'Power', 'Truth vs Lies'], true),
('merchant-of-venice', 'The Merchant of Venice', 'William Shakespeare', '1597', 'A play that explores themes of justice, mercy, and prejudice.', null, 'drama', ARRAY['Justice', 'Mercy', 'Prejudice', 'Identity'], false),
('rainbows-end', 'Rainbow''s End', 'Jane Harrison', '1957', 'A play about three generations of Aboriginal women.', null, 'drama', ARRAY['Indigenous identity', 'Family', 'Prejudice', 'Belonging'], false),

-- Poetry
('slessor-poems', 'Selected Poems', 'Kenneth Slessor', 'Various', 'Poetry that explores themes of time, memory, and Australian landscape.', null, 'poetry', ARRAY['Time', 'Memory', 'Australian landscape', 'War'], true),
('dobson-poems', 'Collected Poems', 'Rosemary Dobson', 'Various', 'Poetry exploring themes of art, time, and mortality.', null, 'poetry', ARRAY['Time', 'Art', 'Mortality', 'Nature'], false),

-- Nonfiction
('i-am-malala', 'I Am Malala', 'Malala Yousafzai & Christina Lamb', '2013', 'The story of a girl who stood up for education and was shot by the Taliban.', null, 'nonfiction', ARRAY['Education', 'Courage', 'Activism', 'Women''s Rights'], true),
('boy-behind-curtain', 'The Boy Behind the Curtain', 'Tim Winton', '2016', 'A collection of essays about Australian life and identity.', null, 'nonfiction', ARRAY['Memory', 'Australian identity', 'Environment', 'Family'], false),

-- Prose Fiction (Additional)
('vertigo', 'Vertigo', 'Amanda Lohrey', '2008', 'A novel exploring themes of anxiety, modern life, spirituality, and the search for meaning in contemporary Australia.', null, 'prose', ARRAY['Anxiety', 'Spirituality', 'Modern life', 'Meaning', 'Australian identity'], false),

-- Film/Media
('billy-elliot', 'Billy Elliot', 'Stephen Daldry', '2000', 'A film about a boy who wants to dance ballet despite social expectations.', null, 'film', ARRAY['Identity', 'Gender roles', 'Family', 'Class'], false),
('waste-land', 'Waste Land', 'Lucy Walker', '2010', 'A documentary about artist Vik Muniz working with garbage pickers in Brazil.', null, 'film', ARRAY['Art', 'Poverty', 'Transformation', 'Human Dignity'], false),
('go-back-where-you-came-from', 'Go Back to Where You Came From Series 1: Episodes 1, 2 and 3 and The Response', 'Ivan O''Mahoney', '2011', 'A documentary series that follows six Australians as they are confronted with the issues faced by refugees and asylum seekers.', null, 'film', ARRAY['Refugees', 'Asylum seekers', 'Empathy', 'Social justice', 'Human rights', 'Immigration'], false)

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