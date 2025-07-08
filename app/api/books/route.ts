import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .order('title')

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }

    return NextResponse.json(books || [])
  } catch (error) {
    console.error('Error in books API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 