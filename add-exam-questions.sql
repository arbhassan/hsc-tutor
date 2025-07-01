-- Add questions to existing unseen texts
-- Run this to populate the missing questions for the exam simulator

-- Questions for "The Crossing" (Prose Fiction)
INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) VALUES
('9d2d6558-af6c-48cc-82a8-d4ec512eeeef', 'How does the writer use setting to create tension in this extract? In your response, refer to specific language features.', 3, 1),
('9d2d6558-af6c-48cc-82a8-d4ec512eeeef', 'Analyze how the relationship between Maya and Tomas is established in this passage.', 4, 2),
('9d2d6558-af6c-48cc-82a8-d4ec512eeeef', 'Explain how the writer uses the motif of the river to develop meaning in the extract.', 5, 3);

-- Questions for "Inheritance" (Poetry)
INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) VALUES
('ebe9d00b-a863-4ce8-a43d-e1b8715fbc29', 'Identify and explain how TWO poetic techniques contribute to the meaning of this poem.', 4, 1),
('ebe9d00b-a863-4ce8-a43d-e1b8715fbc29', 'How does the poet explore the concept of inheritance beyond the literal meaning? Support your response with specific examples from the text.', 5, 2),
('ebe9d00b-a863-4ce8-a43d-e1b8715fbc29', 'Analyze how the structure of the poem enhances its thematic concerns.', 3, 3);

-- Questions for "The Return" (Drama Extract)
INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) VALUES
('93f8b218-890b-4527-9611-9b4fd8b38f1e', 'How do the stage directions contribute to our understanding of the relationship between Eleanor and Michael?', 3, 1),
('93f8b218-890b-4527-9611-9b4fd8b38f1e', 'Explain how dialogue is used to reveal character and create dramatic tension in this extract.', 4, 2),
('93f8b218-890b-4527-9611-9b4fd8b38f1e', 'Analyze the significance of the tea-making ritual in establishing the mood and themes of this scene.', 5, 3);

-- Questions for "The Art of Noticing" (Literary Nonfiction)
INSERT INTO public.exam_unseen_questions (unseen_text_id, question_text, marks, question_order) VALUES
('5c13fe1c-be3c-4e67-aca7-bdd54d4c5a80', 'How does the writer use personal anecdote to support her argument about the importance of noticing?', 4, 1),
('5c13fe1c-be3c-4e67-aca7-bdd54d4c5a80', 'Identify and analyze TWO persuasive techniques used by the writer to engage the reader.', 4, 2),
('5c13fe1c-be3c-4e67-aca7-bdd54d4c5a80', 'Explain how the writer structures her argument to effectively communicate her central thesis.', 4, 3); 