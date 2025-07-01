import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({
        book_id,
        theme,
        quote_text,
        context,
        page_reference,
        chapter_reference,
        literary_techniques,
        importance_level: importance_level || 3,
      })
      .eq('id', params.id)
      .eq('created_by', user.id) // Ensure user can only update their own quotes
      .select()
      .single()

    if (error) {
      console.error('Error updating quote:', error)
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Quote already exists for this book' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
    }

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error in quotes PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', params.id)
      .eq('created_by', user.id) // Ensure user can only delete their own quotes

    if (error) {
      console.error('Error deleting quote:', error)
      return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Quote deleted successfully' })
  } catch (error) {
    console.error('Error in quotes DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 