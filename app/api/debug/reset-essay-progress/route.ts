import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = createClient()

    // Delete essay progress records
    const { error: essayError } = await supabase
      .from('essay_progress')
      .delete()
      .eq('user_id', userId)

    if (essayError) {
      console.error('Error deleting essay progress:', essayError)
    }

    // Delete essay component progress records
    const { error: componentError } = await supabase
      .from('essay_component_progress')
      .delete()
      .eq('user_id', userId)

    if (componentError) {
      console.error('Error deleting essay component progress:', componentError)
    }

    // Create fresh essay progress record
    const { error: insertError } = await supabase
      .from('essay_progress')
      .insert({
        user_id: userId,
        total_essays: 0,
        average_score: 0,
        average_word_count: 0
      })

    if (insertError) {
      console.error('Error creating fresh essay progress:', insertError)
      return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error resetting essay progress:', error)
    return NextResponse.json(
      { error: 'Failed to reset essay progress' },
      { status: 500 }
    )
  }
} 