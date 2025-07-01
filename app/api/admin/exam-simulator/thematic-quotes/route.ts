import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: quotes, error } = await supabase
      .from("exam_thematic_quotes")
      .select("*")
      .order("text_name", { ascending: true })
      .order("theme", { ascending: true })

    if (error) throw error

    // Group quotes by text name for easier consumption
    const groupedQuotes = {}
    quotes?.forEach(quote => {
      if (!groupedQuotes[quote.text_name]) {
        groupedQuotes[quote.text_name] = []
      }
      groupedQuotes[quote.text_name].push({
        id: quote.id,
        theme: quote.theme,
        quote: quote.quote,
        context: quote.context
      })
    })

    return NextResponse.json({ 
      success: true, 
      data: quotes || [],
      grouped: groupedQuotes
    })
  } catch (error) {
    console.error("Error fetching thematic quotes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch thematic quotes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { textName, theme, quote, context } = body

    // Validate required fields
    if (!textName || !theme || !quote || !context) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("exam_thematic_quotes")
      .insert({
        text_name: textName,
        theme,
        quote,
        context
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating thematic quote:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create thematic quote" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { id, textName, theme, quote, context } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Quote ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("exam_thematic_quotes")
      .update({
        text_name: textName,
        theme,
        quote,
        context
      })
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating thematic quote:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update thematic quote" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Quote ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("exam_thematic_quotes")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting thematic quote:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete thematic quote" },
      { status: 500 }
    )
  }
} 