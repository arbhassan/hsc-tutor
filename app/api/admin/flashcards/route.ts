import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      quote_id, 
      card_text, 
      missing_words, 
      is_active = true 
    } = body

    // Validate required fields
    if (!quote_id || !card_text || !missing_words || !Array.isArray(missing_words) || missing_words.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: quote_id, card_text, missing_words' 
      }, { status: 400 })
    }

    // Validate that all missing words are provided
    if (missing_words.some(word => !word || typeof word !== 'string' || !word.trim())) {
      return NextResponse.json({ 
        error: 'All missing words must be non-empty strings' 
      }, { status: 400 })
    }

    // Create the flashcard
    const { data: card, error } = await supabase
      .from('flashcard_cards')
      .insert({
        quote_id,
        card_text: card_text.trim(),
        missing_words,
        is_active
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creating flashcard:', error)
      if (error.code === '23503') { // Foreign key violation
        return NextResponse.json({ error: 'Invalid quote_id' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 })
    }

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error in flashcards POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quoteId = searchParams.get('quote_id')
    const bookId = searchParams.get('book_id')
    const onlyActive = searchParams.get('only_active') !== 'false'

    let query = supabase
      .from('flashcard_cards')
      .select(`
        *,
        quotes (
          id, title, text, book_id, source,
          books (
            id, title, author, category
          )
        )
      `)

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    if (quoteId) {
      query = query.eq('quote_id', quoteId)
    }

    if (bookId) {
      query = query.eq('quotes.book_id', bookId)
    }

    const { data: cards, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching flashcards:', error)
      return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
    }

    return NextResponse.json(cards || [])
  } catch (error) {
    console.error('Error in flashcards GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('id')

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 })
    }

    // Delete the flashcard
    const { error } = await supabase
      .from('flashcard_cards')
      .delete()
      .eq('id', cardId)

    if (error) {
      console.error('Error deleting flashcard:', error)
      return NextResponse.json({ error: 'Failed to delete flashcard' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in flashcards DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
