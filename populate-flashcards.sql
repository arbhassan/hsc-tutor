-- Populate flashcards data for testing
-- This script should be run after the database schema is set up

-- Note: This will only work if you have actual user IDs from your auth.users table
-- Replace 'your-user-id-here' with an actual user ID from your system

-- Sample flashcard sets for 1984
INSERT INTO public.flashcard_sets (id, user_id, title, description, type, book_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'bde94346-e437-4fee-b99e-5388f4f89de5', '1984 Key Quotes', 'Essential quotes from George Orwell''s 1984', 'quote', '1984', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'bde94346-e437-4fee-b99e-5388f4f89de5', '1984 Surveillance Themes', 'Quotes about surveillance and control', 'quote', '1984', NOW(), NOW());

-- Sample passages for 1984 Key Quotes set
INSERT INTO public.passages (id, flashcard_set_id, text, source, attempts, correct_attempts, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'War is peace. Freedom is slavery. Ignorance is strength.', '1984, George Orwell', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Big Brother is watching you.', '1984, George Orwell', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'It was a bright cold day in April, and the clocks were striking thirteen.', '1984, George Orwell - Opening line', 0, 0, NOW(), NOW());

-- Sample passages for 1984 Surveillance Themes set
INSERT INTO public.passages (id, flashcard_set_id, text, source, attempts, correct_attempts, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Big Brother is watching you.', '1984, George Orwell', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Nothing was your own except the few cubic centimeters inside your skull.', '1984, George Orwell', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'The telescreen received and transmitted simultaneously.', '1984, George Orwell', 0, 0, NOW(), NOW());

-- Sample flashcard sets for Hamlet
INSERT INTO public.flashcard_sets (id, user_id, title, description, type, book_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'bde94346-e437-4fee-b99e-5388f4f89de5', 'Hamlet Key Quotes', 'Essential quotes from Shakespeare''s Hamlet', 'quote', 'hamlet', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'bde94346-e437-4fee-b99e-5388f4f89de5', 'Hamlet PETAL Paragraphs', 'Model PETAL paragraphs for Hamlet essays', 'analysis', 'hamlet', NOW(), NOW());

-- Sample passages for Hamlet Key Quotes set
INSERT INTO public.passages (id, flashcard_set_id, text, source, attempts, correct_attempts, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'To be or not to be, that is the question.', 'Hamlet, Act 3 Scene 1', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Something is rotten in the state of Denmark.', 'Hamlet, Act 1 Scene 4', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Though this be madness, yet there is method in''t.', 'Hamlet, Act 2 Scene 2', 0, 0, NOW(), NOW());

-- Sample passages for Hamlet PETAL Paragraphs set
INSERT INTO public.passages (id, flashcard_set_id, text, source, attempts, correct_attempts, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Shakespeare explores the corrupting influence of power through the character of Claudius. The metaphor "that have a father killed, a mother stained" emphasizes how Claudius''s actions have corrupted the natural order and the sanctity of family.', 'Hamlet, Theme of Corruption', 0, 0, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'The theme of appearance versus reality is central to Hamlet. Hamlet''s use of the metaphor "I know not seems" highlights his struggle to distinguish between what appears to be true and what is actually true in the corrupt Danish court.', 'Hamlet, Theme of Appearance vs Reality', 0, 0, NOW(), NOW());

-- Instructions for use:
-- 1. First, run this in your Supabase SQL editor to create the tables: database-schema.sql
-- 2. This script uses user ID: bde94346-e437-4fee-b99e-5388f4f89de5
-- 3. Run this script to populate sample data
-- 4. The flashcard service will automatically create default sets for new users going forward 