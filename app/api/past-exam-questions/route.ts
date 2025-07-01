import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const theme = searchParams.get('theme')

    const supabase = createClient()

    let query = supabase
      .from('past_exam_questions')
      .select('*')

    // Filter by book if provided
    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    // Filter by theme if provided
    if (theme) {
      query = query.eq('theme', theme)
    }

    // Order by year descending, then by created date
    query = query.order('year', { ascending: false, nullsLast: true })
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching past exam questions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch past exam questions' },
        { status: 500 }
      )
    }

    // Convert to the format expected by the frontend
    const questions = data?.map(q => q.question) || []

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 