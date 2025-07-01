import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Fetch all data in parallel
    const [unseenTextsResponse, essayQuestionsResponse, thematicQuotesResponse] = await Promise.all([
      // Get unseen texts with questions
      supabase
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
        .order("created_at", { ascending: false }),

      // Get essay questions
      supabase
        .from("exam_essay_questions")
        .select("*")
        .order("created_at", { ascending: false }),

      // Get thematic quotes
      supabase
        .from("exam_thematic_quotes")
        .select("*")
        .order("text_name", { ascending: true })
        .order("theme", { ascending: true })
    ])

    // Check for errors
    if (unseenTextsResponse.error) throw unseenTextsResponse.error
    if (essayQuestionsResponse.error) throw essayQuestionsResponse.error
    if (thematicQuotesResponse.error) throw thematicQuotesResponse.error

    // Transform unseen texts to match expected format
    const unseenTexts = unseenTextsResponse.data?.map(text => ({
      id: text.id,
      type: text.text_type,
      title: text.title,
      author: text.author,
      content: text.content,
      source: text.source,
      questions: text.exam_unseen_questions
        ?.sort((a, b) => a.question_order - b.question_order)
        .map((q, index) => ({
          id: Number.parseInt(`${text.id.slice(-3)}${index + 1}`.replace(/\D/g, '')), // Generate numeric ID
          text: q.question_text,
          marks: q.marks
        })) || []
    })) || []

    // Transform essay questions to match expected format
    const essayQuestions = essayQuestionsResponse.data?.map(question => ({
      id: question.id,
      module: question.module,
      question: question.question_text,
      difficulty: question.difficulty
    })) || []

    // Group thematic quotes by text name
    const thematicQuotes = {}
    thematicQuotesResponse.data?.forEach(quote => {
      if (!thematicQuotes[quote.text_name]) {
        thematicQuotes[quote.text_name] = []
      }
      thematicQuotes[quote.text_name].push({
        theme: quote.theme,
        quote: quote.quote,
        context: quote.context
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        unseenTexts,
        essayQuestions,
        thematicQuotes
      }
    })
  } catch (error) {
    console.error("Error fetching exam simulator data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam simulator data" },
      { status: 500 }
    )
  }
} 