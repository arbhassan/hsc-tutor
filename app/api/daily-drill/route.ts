import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all daily drill texts with their questions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Fetch texts
    let textsQuery = supabase
      .from('daily_drill_texts')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (!includeInactive) {
      textsQuery = textsQuery.eq('is_active', true)
    }

    const { data: texts, error: textsError } = await textsQuery

    if (textsError) {
      console.error('Error fetching daily drill texts:', textsError)
      return NextResponse.json(
        { error: 'Failed to fetch daily drill texts' },
        { status: 500 }
      )
    }

    // Fetch questions for each text
    const textsWithQuestions = await Promise.all(
      texts.map(async (text) => {
        const { data: questions, error: questionsError } = await supabase
          .from('daily_drill_questions')
          .select('*')
          .eq('text_id', text.id)
          .order('question_order', { ascending: true })

        if (questionsError) {
          console.error(`Error fetching questions for text ${text.id}:`, questionsError)
          return { ...text, questions: [] }
        }

        // Fetch model answers for each question
        const questionsWithAnswers = await Promise.all(
          questions.map(async (question) => {
            const { data: modelAnswer } = await supabase
              .from('daily_drill_model_answers')
              .select('*')
              .eq('question_id', question.id)
              .single()

            return {
              ...question,
              modelAnswer: modelAnswer || null
            }
          })
        )

        return {
          ...text,
          questions: questionsWithAnswers
        }
      })
    )

    return NextResponse.json({ texts: textsWithQuestions }, { status: 200 })
  } catch (error) {
    console.error('Error in daily drill GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new daily drill text with questions
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, author, text_type, content, source, difficulty_level, questions, display_order } = body

    // Validate required fields
    if (!title || !author || !text_type || !content || !source) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert the text
    const { data: text, error: textError } = await supabase
      .from('daily_drill_texts')
      .insert({
        title,
        author,
        text_type,
        content,
        source,
        difficulty_level: difficulty_level || 'Medium',
        display_order: display_order || 0,
        is_active: true
      })
      .select()
      .single()

    if (textError) {
      console.error('Error creating daily drill text:', textError)
      return NextResponse.json(
        { error: 'Failed to create daily drill text' },
        { status: 500 }
      )
    }

    // Insert questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, index: number) => ({
        text_id: text.id,
        question_text: q.question_text,
        marks: q.marks,
        question_order: q.question_order || index + 1
      }))

      const { data: insertedQuestions, error: questionsError } = await supabase
        .from('daily_drill_questions')
        .insert(questionsToInsert)
        .select()

      if (questionsError) {
        console.error('Error creating questions:', questionsError)
        // Optionally delete the text if questions fail
        await supabase.from('daily_drill_texts').delete().eq('id', text.id)
        return NextResponse.json(
          { error: 'Failed to create questions' },
          { status: 500 }
        )
      }

      // Insert model answers if provided
      if (insertedQuestions) {
        const modelAnswersToInsert = []
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].model_answer) {
            modelAnswersToInsert.push({
              question_id: insertedQuestions[i].id,
              answer: questions[i].model_answer,
              commentary: questions[i].commentary || null
            })
          }
        }

        if (modelAnswersToInsert.length > 0) {
          await supabase
            .from('daily_drill_model_answers')
            .insert(modelAnswersToInsert)
        }
      }
    }

    return NextResponse.json(
      { message: 'Daily drill text created successfully', text },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in daily drill POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a daily drill text
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, title, author, text_type, content, source, difficulty_level, is_active, display_order } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Text ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (author !== undefined) updateData.author = author
    if (text_type !== undefined) updateData.text_type = text_type
    if (content !== undefined) updateData.content = content
    if (source !== undefined) updateData.source = source
    if (difficulty_level !== undefined) updateData.difficulty_level = difficulty_level
    if (is_active !== undefined) updateData.is_active = is_active
    if (display_order !== undefined) updateData.display_order = display_order

    const { data: text, error: updateError } = await supabase
      .from('daily_drill_texts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating daily drill text:', updateError)
      return NextResponse.json(
        { error: 'Failed to update daily drill text' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Daily drill text updated successfully', text },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in daily drill PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a daily drill text
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Text ID is required' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('daily_drill_texts')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting daily drill text:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete daily drill text' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Daily drill text deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in daily drill DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

