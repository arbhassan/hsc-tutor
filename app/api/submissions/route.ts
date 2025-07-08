import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'daily_drill' or 'exam_simulator' or null for all
    const contentType = searchParams.get('content_type') // 'questions' or 'essay' or null for all
    
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Build query
    let query = supabase
      .from('user_submissions')
      .select(`
        *,
        submission_questions (*),
        submission_essays (*)
      `)
      .eq('user_id', user.id)
      .order('submission_date', { ascending: false })

    // Apply filters
    if (type) {
      query = query.eq('submission_type', type)
    }
    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: submissions })
  } catch (error) {
    console.error('Error in submissions GET:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      submissionType,
      contentType,
      title,
      totalScore,
      maxScore,
      completionTimeMinutes,
      questions,
      essay
    } = body

    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    if (!submissionType || !contentType || !title) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Create main submission record
    const { data: submission, error: submissionError } = await supabase
      .from('user_submissions')
      .insert({
        user_id: user.id,
        submission_type: submissionType,
        content_type: contentType,
        title,
        total_score: totalScore || null,
        max_score: maxScore || null,
        completion_time_minutes: completionTimeMinutes || null
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error creating submission:', submissionError)
      return NextResponse.json({ success: false, error: 'Failed to create submission' }, { status: 500 })
    }

    // Save questions if provided
    if (questions && questions.length > 0) {
      const questionData = questions.map((q: any, index: number) => ({
        submission_id: submission.id,
        question_text: q.questionText,
        user_response: q.userResponse,
        correct_answer: q.correctAnswer || null,
        ai_feedback: q.aiFeedback || null,
        marks_awarded: q.marksAwarded || null,
        max_marks: q.maxMarks || null,
        text_title: q.textTitle || null,
        text_author: q.textAuthor || null,
        text_type: q.textType || null,
        text_content: q.textContent || null,
        question_order: index + 1
      }))

      const { error: questionsError } = await supabase
        .from('submission_questions')
        .insert(questionData)

      if (questionsError) {
        console.error('Error saving questions:', questionsError)
        // Don't return error here as main submission was created
      }
    }

    // Save essay if provided
    if (essay) {
      const { error: essayError } = await supabase
        .from('submission_essays')
        .insert({
          submission_id: submission.id,
          essay_question: essay.question,
          essay_response: essay.response,
          word_count: essay.wordCount || null,
          quote_count: essay.quoteCount || null,
          ai_feedback: essay.aiFeedback || null,
          overall_score: essay.overallScore || null,
          max_score: essay.maxScore || 20,
          criteria_scores: essay.criteriaScores || null,
          band_level: essay.bandLevel || null,
          module: essay.module || null
        })

      if (essayError) {
        console.error('Error saving essay:', essayError)
        // Don't return error here as main submission was created
      }
    }

    return NextResponse.json({ success: true, data: submission })
  } catch (error) {
    console.error('Error in submissions POST:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
} 