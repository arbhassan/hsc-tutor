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

    // Map the database structure to what the frontend expects
    const mappedQuotes = (quotes || []).map(quote => ({
      id: quote.id,
      book_id: quote.book_id,
      theme: quote.theme || 'General', // Default theme if missing
      quote_text: quote.text || quote.quote_text, // Handle both field names
      context: quote.title || quote.context, // Handle both field names
      page_reference: quote.page_reference,
      chapter_reference: quote.chapter_reference,
      literary_techniques: quote.literary_techniques,
      importance_level: quote.importance_level || 3
    }))

    return NextResponse.json(mappedQuotes)
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

    // Prepare the insert object, only including importance_level if the column exists
    const insertData: any = {
      book_id,
      theme,
      quote_text,
      context,
      page_reference,
      chapter_reference,
      literary_techniques,
      created_by: user.id
    }

    // Only add importance_level if it was provided (to avoid column errors)
    if (importance_level !== undefined) {
      insertData.importance_level = importance_level
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert(insertData)
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