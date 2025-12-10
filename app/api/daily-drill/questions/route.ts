import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Create a new question for a text
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
    const { text_id, question_text, marks, question_order, model_answer, commentary } = body

    // Validate required fields
    if (!text_id || !question_text || !marks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert the question
    const { data: question, error: questionError } = await supabase
      .from('daily_drill_questions')
      .insert({
        text_id,
        question_text,
        marks,
        question_order: question_order || 1
      })
      .select()
      .single()

    if (questionError) {
      console.error('Error creating question:', questionError)
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      )
    }

    // Insert model answer if provided
    if (model_answer) {
      const { error: answerError } = await supabase
        .from('daily_drill_model_answers')
        .insert({
          question_id: question.id,
          answer: model_answer,
          commentary: commentary || null
        })

      if (answerError) {
        console.error('Error creating model answer:', answerError)
        // Continue anyway - the question was created successfully
      }
    }

    return NextResponse.json(
      { message: 'Question created successfully', question },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in question POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a question
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
    const { id, question_text, marks, question_order, model_answer, commentary } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Update question
    const updateData: any = {}
    if (question_text !== undefined) updateData.question_text = question_text
    if (marks !== undefined) updateData.marks = marks
    if (question_order !== undefined) updateData.question_order = question_order

    const { data: question, error: updateError } = await supabase
      .from('daily_drill_questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating question:', updateError)
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      )
    }

    // Update or insert model answer if provided
    if (model_answer !== undefined) {
      // Check if model answer exists
      const { data: existingAnswer } = await supabase
        .from('daily_drill_model_answers')
        .select('id')
        .eq('question_id', id)
        .single()

      if (existingAnswer) {
        // Update existing
        await supabase
          .from('daily_drill_model_answers')
          .update({
            answer: model_answer,
            commentary: commentary || null
          })
          .eq('question_id', id)
      } else {
        // Insert new
        await supabase
          .from('daily_drill_model_answers')
          .insert({
            question_id: id,
            answer: model_answer,
            commentary: commentary || null
          })
      }
    }

    return NextResponse.json(
      { message: 'Question updated successfully', question },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in question PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a question
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
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('daily_drill_questions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting question:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete question' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in question DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

