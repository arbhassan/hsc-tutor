-- Populate Exam Simulator Data
-- Run this after creating the exam simulator schema

-- Insert sample unseen texts
INSERT INTO public.exam_unseen_texts (title, author, text_type, content, source, difficulty_level) VALUES
('The Crossing', 'Anonymous', 'Prose Fiction', 'The river had swollen overnight. What was yesterday a gentle, babbling stream was now a churning mass of water and debris. Maya stood at the edge, her toes curling into the mud, calculating the distance to the other side.

"We can''t cross here," said Tomas, appearing at her shoulder. "It''s too dangerous."

Maya didn''t respond. She was remembering another river, another time. The day her father had taught her to swim, his strong hands supporting her as she kicked her legs frantically. "The water will hold you up," he had said, "if you trust it."

But this water was different. It didn''t want to hold anything up. It wanted to drag things down, to sweep them away. Maya could see branches and even what looked like part of a fence being carried downstream at alarming speed.

"There''s a bridge about two kilometers upstream," Tomas continued, already turning away. "We can make it there before nightfall if we leave now."

Maya nodded, but didn''t move. The other side seemed so close. Just a few meters of angry water between her and her destination. Two kilometers upstream and then back down again would cost them hours. Hours they didn''t have.

"You''re not thinking of swimming, are you?" Tomas asked, his voice rising in alarm. "Because that would be suicide."

Maya smiled. "Not swimming," she said, reaching for her backpack. "Building."', 'Original work for HSC practice', 'Medium'),

('Inheritance', 'J. K. Thompson', 'Poetry', 'My grandmother''s hands were maps of her life,
Blue veins like rivers crossing the plains of her palms,
Knuckles rising like mountains, worn smooth by time.

She would press them against my face when I cried,
These hands that had planted gardens, birthed children,
Buried a husband, and still found the strength to hold mine.

I study my own hands now, searching for her.
The same river runs through my left palm,
The same mountain rises on my right.

What else have I inherited? The tilt of her chin,
The way she stood in doorways, hesitating,
As if the world beyond might be too much to bear?

Or her courage, which was quieter than silence,
Moving through her like breath, like blood,
Sustaining her through the long nights of grief.

I press my hands to my daughter''s face,
Feel the rivers flowing, the mountains rising,
This geography of love, passed down.', 'Contemporary Voices Anthology, 2023', 'Medium'),

('The Return', 'Sarah Chen', 'Drama Extract', '[A kitchen in a suburban home. Morning light streams through the window. ELEANOR (60s) is making tea. MICHAEL (30s) enters, carrying a small suitcase.]

MICHAEL: [Pausing at the doorway] The kettle still leaks.

ELEANOR: [Without turning] Some things never change.

MICHAEL: [Moving into the room] And some things do.

ELEANOR: [Finally turning to face him] Five years is a long time.

MICHAEL: I wrote.

ELEANOR: Words on paper aren''t the same as a face across the table.

MICHAEL: [Putting down his suitcase] I''m here now.

ELEANOR: For how long?

MICHAEL: [After a pause] I don''t know.

ELEANOR: [Nodding slowly] At least that''s honest. [She takes another cup from the cupboard] Tea?

MICHAEL: Please.

[ELEANOR pours the tea. Her hands shake slightly. MICHAEL notices but says nothing.]

ELEANOR: Your room is as you left it.

MICHAEL: You didn''t have to do that.

ELEANOR: What else would I do with it?

MICHAEL: Live, Mom. Use the space. Move on.

ELEANOR: [Sharply] Like you did?

[Silence. ELEANOR pushes a cup toward MICHAEL.]

ELEANOR: [More gently] It''s hot. Be careful.

[MICHAEL takes the cup. Their fingers brush briefly.]', 'From ''Homecomings'', New Theatre Collection, 2022', 'Medium'),

('The Art of Noticing', 'Rebecca Liu', 'Literary Nonfiction', 'In an age of distraction, the simple act of noticing has become a radical gesture. To pause, to observe, to give our full attention to the world around us – these are increasingly rare skills. We move through our days with our eyes fixed on screens, our minds already racing ahead to the next task, the next destination, the next milestone.

What do we miss in this perpetual forward motion? The changing light on a familiar street. The subtle shift in a friend''s expression. The quiet transformation of seasons. The world is speaking to us constantly, but we have forgotten how to listen.

My grandfather was a master of noticing. A farmer by trade, he lived his life according to the rhythms of the natural world. He could predict rain by the behavior of his cattle, tell the time by the position of shadows, identify dozens of bird species by their calls alone. His knowledge wasn''t academic – it was embodied, accumulated through decades of patient observation.

I remember walking with him through his orchard when I was seven years old. He stopped suddenly and pointed to a tree. "Look," he said. I looked, seeing nothing unusual. "Look closer," he insisted. And then I saw it: a tiny nest, woven so skillfully into the branches that it seemed part of the tree itself. Inside were three pale blue eggs, each no bigger than my thumbnail.

That moment stays with me as a lesson in the rewards of careful attention. The nest had always been there, but I had not developed the capacity to see it. How many other wonders remain invisible to me because I have not learned to notice them?

The practice of noticing requires us to slow down, to resist the cultural imperative of constant productivity. It asks us to value receptivity as much as activity, observation as much as expression. In a world that privileges doing over being, this is no small challenge.', 'From ''The Attentive Life'', Literary Quarterly, Spring 2023', 'Medium');

-- Get the IDs of the inserted texts for adding questions
-- Note: In a real implementation, you'd need to run this after the above insert and get the actual UUIDs
-- For now, we'll use placeholders that would need to be replaced with actual UUIDs

-- Insert sample questions for The Crossing (you'll need to replace 'text-1-uuid' with actual UUID)
-- INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) VALUES
-- ('text-1-uuid', 'How does the writer use setting to create tension in this extract? In your response, refer to specific language features. (3 marks)', 3, 1),
-- ('text-1-uuid', 'Analyze how the relationship between Maya and Tomas is established in this passage. (4 marks)', 4, 2),
-- ('text-1-uuid', 'Explain how the writer uses the motif of the river to develop meaning in the extract. (5 marks)', 5, 3);

-- Insert sample essay questions
INSERT INTO public.exam_essay_questions (module, question_text, difficulty) VALUES
('Common Module: Texts and Human Experiences', 'To what extent does your prescribed text demonstrate that individual experiences can lead to broader understanding? In your response, make detailed reference to your prescribed text.', 'Medium'),
('Common Module: Texts and Human Experiences', 'How does your prescribed text represent the ways in which collective experiences shape individual identity? In your response, make detailed reference to your prescribed text.', 'Medium'),
('Common Module: Texts and Human Experiences', '"Human experiences are defined by the tension between connection and isolation." To what extent is this true of your prescribed text? In your response, make detailed reference to your prescribed text.', 'Hard'),
('Common Module: Texts and Human Experiences', 'Explore how your prescribed text represents the impact of extraordinary experiences on ordinary lives. In your response, make detailed reference to your prescribed text.', 'Medium');

-- Insert sample thematic quotes
INSERT INTO public.exam_thematic_quotes (text_name, theme, quote, context) VALUES
('Nineteen Eighty-Four', 'Individual vs. Collective', 'Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.', 'Winston''s thoughts on fundamental truth and freedom'),
('Nineteen Eighty-Four', 'Memory and History', 'Who controls the past controls the future. Who controls the present controls the past.', 'Party slogan explaining the manipulation of historical records'),
('Nineteen Eighty-Four', 'Surveillance and Privacy', 'Big Brother is watching you.', 'Recurring slogan representing omnipresent government surveillance'),
('The Merchant of Venice', 'Justice and Mercy', 'The quality of mercy is not strained. It droppeth as the gentle rain from heaven upon the place beneath.', 'Portia''s speech during the trial scene'),
('The Merchant of Venice', 'Prejudice and Tolerance', 'Hath not a Jew eyes? Hath not a Jew hands, organs, dimensions, senses, affections, passions?', 'Shylock''s powerful speech highlighting his humanity'),
('Selected Poems (Kenneth Slessor)', 'Time and Memory', 'I saw Time flowing like a hundred yachts / That fly behind the daylight, foxed with air', 'From ''Out of Time'', depicting time as an unstoppable force'),
('Selected Poems (Kenneth Slessor)', 'Death and Mortality', 'Between the sob and clubbing of the gunfire / Someone, it seems, has time for this, / To pluck them from the shallows and bury them in burrows', 'From ''Beach Burial'', describing the burial of soldiers at sea');

-- Note: To add questions to the unseen texts, you'll need to:
-- 1. Run the above script to insert the texts
-- 2. Query the database to get the actual UUIDs of the inserted texts
-- 3. Run additional INSERT statements for the questions using the real UUIDs

-- Example of how to add questions (replace the UUIDs with actual values):
-- INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) 
-- SELECT 
--   id,
--   'How does the writer use setting to create tension in this extract? In your response, refer to specific language features.',
--   3,
--   1
-- FROM public.exam_unseen_texts WHERE title = 'The Crossing';

-- You can add more questions similarly for each text 