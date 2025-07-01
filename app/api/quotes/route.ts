import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const theme = searchParams.get('theme')

    let query = supabase
      .from('quotes')
      .select('*')
      .order('importance_level', { ascending: false })
      .order('created_at', { ascending: false })

    // Filter by book if specified
    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    // Filter by theme if specified
    if (theme) {
      query = query.eq('theme', theme)
    }

    const { data: quotes, error } = await query

    if (error) {
      console.error('Error fetching quotes:', error)
      return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
    }

    return NextResponse.json(quotes || [])
  } catch (error) {
    console.error('Error in quotes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      book_id, 
      theme, 
      quote_text, 
      context, 
      page_reference, 
      chapter_reference, 
      literary_techniques, 
      importance_level 
    } = body

    // Validate required fields
    if (!book_id || !theme || !quote_text || !context) {
      return NextResponse.json({ 
        error: 'Missing required fields: book_id, theme, quote_text, context' 
      }, { status: 400 })
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        book_id,
        theme,
        quote_text,
        context,
        page_reference,
        chapter_reference,
        literary_techniques,
        importance_level: importance_level || 3,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating quote:', error)
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Quote already exists for this book' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
    }

    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    console.error('Error in quotes POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 