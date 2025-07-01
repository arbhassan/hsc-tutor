import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: questions, error } = await supabase
      .from("exam_essay_questions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: questions || [] })
  } catch (error) {
    console.error("Error fetching essay questions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch essay questions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { module, questionText, difficulty } = body

    // Validate required fields
    if (!module || !questionText) {
      return NextResponse.json(
        { success: false, error: "Module and question text are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("exam_essay_questions")
      .insert({
        module,
        question_text: questionText,
        difficulty: difficulty || "Medium"
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating essay question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create essay question" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { id, module, questionText, difficulty } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Question ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("exam_essay_questions")
      .update({
        module,
        question_text: questionText,
        difficulty: difficulty || "Medium"
      })
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating essay question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update essay question" },
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
        { success: false, error: "Question ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("exam_essay_questions")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting essay question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete essay question" },
      { status: 500 }
    )
  }
} 