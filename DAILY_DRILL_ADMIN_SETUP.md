# Daily Drill Admin Setup Guide

This guide explains how to set up and use the Daily Drill admin interface to manage practice texts and questions.

## Overview

The Daily Drill feature allows students to practice analyzing unseen texts with guided questions. As an admin, you can now manage all this content through a dedicated admin interface instead of hardcoding it in the application.

## What Was Created

### 1. Database Schema (`daily-drill-schema.sql`)

Three new database tables:

- **`daily_drill_texts`** - Stores unseen texts (prose, poetry, drama, etc.)
- **`daily_drill_questions`** - Stores questions associated with each text
- **`daily_drill_model_answers`** - Stores optional model answers and commentary for questions

### 2. API Endpoints

#### `/api/daily-drill` - Text Management
- **GET** - Fetch all texts with questions
- **POST** - Create new text with questions
- **PUT** - Update existing text
- **DELETE** - Delete text (cascade deletes questions)

#### `/api/daily-drill/questions` - Question Management
- **POST** - Create new question for a text
- **PUT** - Update existing question
- **DELETE** - Delete question

### 3. Admin Interface (`/app/admin/daily-drill/page.tsx`)

A full-featured admin page where you can:
- View all existing texts
- Create new texts with multiple questions
- Edit existing texts and questions
- Delete texts and questions
- Toggle active/inactive status
- Add model answers and commentary
- Preview content before saving

### 4. Updated Pages

- **Admin Dashboard** - Added "Daily Drill" card with navigation
- **Daily Drill Practice Page** - Now loads content from database instead of hardcoded data

## Setup Instructions

### Step 1: Run the Database Migration

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `daily-drill-schema.sql`
4. Run the SQL script

This will:
- Create the three new tables
- Set up Row Level Security (RLS) policies
- Add indexes for performance
- Insert sample data from your existing hardcoded texts

### Step 2: Verify Table Creation

Run this query in Supabase to verify:

```sql
SELECT COUNT(*) FROM daily_drill_texts;
SELECT COUNT(*) FROM daily_drill_questions;
```

You should see 3 texts with their associated questions.

### Step 3: Access the Admin Interface

1. Navigate to `/admin` in your application
2. Enter the admin password (default: `admin123`)
3. Click on the "Daily Drill" card
4. You should see the existing texts loaded from the database

## Using the Admin Interface

### Creating a New Text

1. Click **"Add New Text"** button
2. Fill in the required fields:
   - **Title*** - The name of the text
   - **Author*** - Author's name
   - **Text Type*** - Choose from: Prose Fiction Extract, Poetry, Drama Extract, or Literary Nonfiction
   - **Source*** - Where the text is from
   - **Content*** - The full text content
   - **Difficulty Level** - Easy, Medium, or Hard
   - **Display Order** - Controls the order texts appear (0 = first)

3. Add questions:
   - Click **"Add Question"** to add more questions
   - For each question:
     - Enter the **question text**
     - Specify the **marks** (1-10)
     - Optionally add a **model answer**
     - Optionally add **commentary** explaining what makes it a good answer

4. Click **"Create Text"**

### Editing an Existing Text

1. Find the text in the list
2. Click the **Edit** button (pencil icon)
3. Modify any fields
4. Update, add, or remove questions as needed
5. Click **"Update Text"**

### Managing Text Visibility

- Click the **Eye/Eye-Off** icon to toggle between active and inactive
- Inactive texts won't appear in the practice page
- This is useful for seasonal content or texts under development

### Deleting a Text

1. Click the **Trash** icon
2. Confirm the deletion
3. **Note:** This will also delete all associated questions (cascade delete)

### Viewing Text Details

Click the **chevron down/up** icon to expand/collapse text details:
- View the full content
- See all questions and their marks
- Check if model answers are available

## Model Answers Feature

### How Model Answers Work

When students complete a daily drill:

1. **With Model Answer (from database):**
   - Students submit their responses
   - They receive AI-generated feedback based on PETAL structure analysis
   - In the "Model Answers" tab, they see your curated model answer from the database
   - If you provided commentary, it appears below the model answer
   - A "From Database" badge indicates it's a real model answer

2. **Without Model Answer (fallback):**
   - Students submit their responses
   - They receive AI-generated feedback
   - In the "Model Answers" tab, they see an auto-generated improved response based on templates
   - This is useful for rapid content creation, but less personalized

### Best Practice for Model Answers

**Always include model answers** for the best student experience. Model answers should:
- Demonstrate the expected depth of analysis
- Use proper terminology and literary techniques
- Include specific textual evidence
- Follow PETAL structure (Point, Evidence, Technique, Analysis, Link)
- Be proportionate to the marks allocated (more marks = more detailed response)

**Commentary helps students understand:**
- What makes the answer effective
- Which techniques were used well
- How the response addresses the question
- Areas they should focus on in their own writing

## Tips and Best Practices

### Content Guidelines

1. **Poetry** - Use line breaks to preserve formatting
2. **Drama** - Include stage directions in square brackets `[Enter HAMLET]`
3. **Questions** - Be specific about what students should analyze
4. **Model Answers** - These are displayed directly to students in the "Model Answers" tab after submission. Include high-quality exemplar responses.
5. **Commentary** - Optional field to explain what makes the model answer effective

### Question Types

Good questions typically:
- Ask about specific literary techniques
- Require textual evidence
- Have clear marking criteria (3-6 marks works well)
- Build in complexity (start with basic comprehension, move to analysis)

### Organization

- Use **Display Order** to sequence texts by difficulty
- Mark texts as **Inactive** when you want to refresh content
- Add **Model Answers** to maintain consistency in feedback

## Data Structure

### Text Object
```json
{
  "id": "uuid",
  "title": "The Crossing",
  "author": "Emily Chen",
  "text_type": "Poetry",
  "content": "The bridge stretches...",
  "source": "Contemporary Voices Anthology, 2023",
  "difficulty_level": "Medium",
  "is_active": true,
  "display_order": 1
}
```

### Question Object
```json
{
  "id": "uuid",
  "text_id": "parent-text-uuid",
  "question_text": "How does the poet use imagery...",
  "marks": 3,
  "question_order": 1
}
```

### Model Answer Object
```json
{
  "id": "uuid",
  "question_id": "parent-question-uuid",
  "answer": "The poet effectively employs...",
  "commentary": "This response demonstrates..."
}
```

## API Usage Examples

### Fetch All Active Texts
```javascript
const response = await fetch('/api/daily-drill')
const data = await response.json()
console.log(data.texts)
```

### Create a New Text
```javascript
const response = await fetch('/api/daily-drill', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "New Text",
    author: "Author Name",
    text_type: "Poetry",
    content: "Full text here...",
    source: "Source information",
    difficulty_level: "Medium",
    questions: [
      {
        question_text: "Analyze the use of imagery...",
        marks: 4,
        model_answer: "The author uses imagery to...",
        commentary: "Strong answers will identify..."
      }
    ]
  })
})
```

## Troubleshooting

### No texts appearing in practice page
1. Check that texts are marked as **Active** in admin
2. Verify database connection in Supabase
3. Check browser console for API errors

### Cannot create/edit texts
1. Ensure you're logged in as an authenticated user
2. Check Supabase RLS policies are correctly set
3. Verify all required fields are filled

### Questions not saving
1. Make sure each question has both **question_text** and **marks**
2. Check that the parent text exists
3. Look for validation errors in the console

## Future Enhancements

Potential additions to consider:
- Bulk import from CSV/JSON
- Duplicate text functionality
- Question bank/template library
- Advanced filtering and search
- Analytics on which texts/questions are most challenging
- Student performance tracking per text

## Database Backup

Before making major changes, backup your data:

```sql
-- Export texts
COPY (SELECT * FROM daily_drill_texts) TO '/path/to/backup/texts.csv' CSV HEADER;

-- Export questions
COPY (SELECT * FROM daily_drill_questions) TO '/path/to/backup/questions.csv' CSV HEADER;
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review the Supabase logs
3. Verify your RLS policies allow the operations
4. Ensure you're using the latest version of the code

---

**Created:** December 2024
**Version:** 1.0.0

