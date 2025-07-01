import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get all unseen texts with their questions
    const { data: texts, error: textsError } = await supabase
      .from("exam_unseen_texts")
      .select(`
        *,
        exam_unseen_questions (
          id,
          question_text,
          marks,
          question_order
        )
      `)
      .order("created_at", { ascending: false })

    if (textsError) throw textsError

    // Transform data to match expected format
    const formattedTexts = texts?.map(text => ({
      id: text.id,
      type: text.text_type,
      title: text.title,
      author: text.author,
      content: text.content,
      source: text.source,
      difficulty: text.difficulty_level,
      questions: text.exam_unseen_questions
        ?.sort((a, b) => a.question_order - b.question_order)
        .map(q => ({
          id: q.id,
          text: q.question_text,
          marks: q.marks
        })) || []
    })) || []

    return NextResponse.json({ success: true, data: formattedTexts })
  } catch (error) {
    console.error("Error fetching unseen texts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch unseen texts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { title, author, textType, content, source, difficulty, questions } = body

    // Validate required fields
    if (!title || !author || !textType || !content || !source) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Insert unseen text
    const { data: textData, error: textError } = await supabase
      .from("exam_unseen_texts")
      .insert({
        title,
        author,
        text_type: textType,
        content,
        source,
        difficulty_level: difficulty || "Medium"
      })
      .select()
      .single()

    if (textError) throw textError

    // Insert questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        unseen_text_id: textData.id,
        question_text: q.text,
        marks: q.marks,
        question_order: index + 1
      }))

      const { error: questionsError } = await supabase
        .from("exam_unseen_questions")
        .insert(questionsToInsert)

      if (questionsError) throw questionsError
    }

    return NextResponse.json({ success: true, data: textData })
  } catch (error) {
    console.error("Error creating unseen text:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create unseen text" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { id, title, author, textType, content, source, difficulty, questions } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Text ID is required" },
        { status: 400 }
      )
    }

    // Update unseen text
    const { error: textError } = await supabase
      .from("exam_unseen_texts")
      .update({
        title,
        author,
        text_type: textType,
        content,
        source,
        difficulty_level: difficulty || "Medium"
      })
      .eq("id", id)

    if (textError) throw textError

    // Delete existing questions and insert new ones
    const { error: deleteError } = await supabase
      .from("exam_unseen_questions")
      .delete()
      .eq("unseen_text_id", id)

    if (deleteError) throw deleteError

    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        unseen_text_id: id,
        question_text: q.text,
        marks: q.marks,
        question_order: index + 1
      }))

      const { error: questionsError } = await supabase
        .from("exam_unseen_questions")
        .insert(questionsToInsert)

      if (questionsError) throw questionsError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating unseen text:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update unseen text" },
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
        { success: false, error: "Text ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("exam_unseen_texts")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting unseen text:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete unseen text" },
      { status: 500 }
    )
  }
} 