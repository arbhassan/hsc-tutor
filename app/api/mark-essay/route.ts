import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface EssayResponse {
  question: string
  module: string
  response: string
  wordCount: number
  markingCriteria?: {
    understanding: number
    analysis: number
    response: number
    expression: number
  }
  customPrompt?: string
}

const DEFAULT_MARKING_CRITERIA = {
  understanding: 25, // Understanding of text and module concepts
  analysis: 25, // Analysis of literary techniques and their effects
  response: 25, // Quality of response to the question
  expression: 25, // Structure, expression, and mechanics
}

export async function POST(request: NextRequest) {
  try {
    const {
      question,
      module,
      response,
      wordCount,
      markingCriteria = DEFAULT_MARKING_CRITERIA,
      customPrompt,
    }: EssayResponse = await request.json()

    if (!question || !response) {
      return NextResponse.json({ error: "Question and response are required" }, { status: 400 })
    }

    const basePrompt = `You are an experienced HSC English teacher who provides fair and constructive marking. You maintain HSC standards while recognizing student effort and partial understanding.

**Module:** ${module}
**Question:** ${question}
**Word Count:** ${wordCount}

**Student Essay:**
${response}

**MARKING APPROACH:**
Assess the essay fairly, looking for evidence of understanding and effort. Give credit for partial responses and attempts at analysis.

**Band Guidelines:**

**Band 6 (17-20) - For exceptional responses:**
- Sophisticated understanding of text and module concepts
- Sustained, insightful analysis of techniques and effects
- Compelling argument that fully addresses the question
- Precise expression and sophisticated vocabulary
- Seamless integration of textual evidence

**Band 5 (13-16) - For solid responses:**
- Clear understanding of text and module concepts
- Effective analysis with good insight
- Clear argument addressing the question well
- Effective expression and vocabulary
- Relevant textual evidence with sound analysis

**Band 4 (9-12) - For adequate responses:**
- Satisfactory understanding with some gaps
- Competent basic analysis
- Addresses the question reasonably
- Generally clear expression
- Some relevant textual evidence

**Band 3 (5-8) - For basic responses:**
- Basic understanding, may have gaps
- Limited analysis, mostly identification
- Partially addresses the question
- Simple but understandable expression
- Minimal but some relevant textual evidence

**Band 2 (3-4) - For developing responses:**
- Elementary understanding with gaps
- Very limited analysis
- Attempts to address the question
- Simple expression, may lack clarity
- Little relevant textual evidence

**Band 1 (1-2) - For minimal responses:**
- Minimal understanding shown
- Little to no analysis
- Basic attempt to address question
- Unclear expression
- Minimal textual evidence

**Zero marks only for:**
- Complete gibberish or random letters
- Completely blank responses
- Responses entirely unrelated to the subject

**IMPORTANT PRINCIPLES:**
- Give credit for genuine attempts and effort
- Look for what the student DOES understand
- Provide encouraging feedback while identifying areas for growth
- Consider that understanding can be shown in different ways

**Marking Criteria Weightings:**
- Understanding of text and module concepts: ${markingCriteria.understanding}%
- Analysis of literary techniques and their effects: ${markingCriteria.analysis}%
- Quality of response to the question: ${markingCriteria.response}%
- Structure, expression, and mechanics: ${markingCriteria.expression}%

Please provide detailed feedback in the following JSON format:
{
  "totalMark": number (out of 20, give credit for effort and partial understanding),
  "band": number (1-6 based on response quality),
  "criteriaBreakdown": {
    "understanding": { "mark": number, "comment": "specific comment recognizing effort" },
    "analysis": { "mark": number, "comment": "specific comment" },
    "response": { "mark": number, "comment": "specific comment" },
    "expression": { "mark": number, "comment": "specific comment" }
  },
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4"],
  "overallComment": "2-3 sentence overall assessment that is encouraging while identifying growth areas",
  "suggestedQuotes": [
    {"quote": "suggested quote", "explanation": "how this could strengthen the argument"},
    {"quote": "another quote", "explanation": "how this could be used"}
  ],
  "nextSteps": ["specific practice recommendation 1", "specific practice recommendation 2"]
}

**Remember: Be fair and encouraging. Look for evidence of learning and give credit where due.**`

    const finalPrompt = customPrompt || basePrompt

            const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an experienced HSC English teacher who is fair and constructive in your marking. You maintain appropriate standards while recognizing student effort and partial understanding. You give credit where it's due and provide encouraging feedback that helps students improve. You look for evidence of learning and understanding, even if it's not perfect. You only award zero marks for truly nonsensical responses and always try to find something positive to build on.",
            },
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 2000,
        })

    try {
      const markingResult = JSON.parse(completion.choices[0].message.content || "{}")
      
      // Validate and provide fallback data if parsing fails
      const validatedResult = {
        totalMark: markingResult.totalMark || 3, // Give some marks for attempting the essay
        band: markingResult.band || 2,
        criteriaBreakdown: markingResult.criteriaBreakdown || {
          understanding: { mark: 1, comment: "Shows some attempt to engage with the text or topic" },
          analysis: { mark: 1, comment: "Basic attempt at analysis, could be developed further" },
          response: { mark: 1, comment: "Makes some attempt to address the question" },
          expression: { mark: 0, comment: "Expression could be clearer and more structured" }
        },
        strengths: markingResult.strengths || ["Attempted the essay task", "Shows some engagement with the topic"],
        improvements: markingResult.improvements || [
          "Focus on reading and understanding your prescribed text more deeply",
          "Practice identifying and analyzing specific literary techniques",
          "Work on developing clearer thesis statements",
          "Use more specific textual evidence to support your points",
          "Practice essay structure with clear introduction, body, and conclusion"
        ],
        overallComment: markingResult.overallComment || "This response shows some attempt to engage with the essay task. With more focus on textual analysis and clearer expression, you can improve significantly.",
        suggestedQuotes: markingResult.suggestedQuotes || [
          {
            quote: "Consider including more specific textual evidence",
            explanation: "This would strengthen your analysis and support your arguments more effectively"
          }
        ],
        nextSteps: markingResult.nextSteps || [
          "Practice analyzing how specific techniques create meaning",
          "Work on developing more complex thesis statements"
        ]
      }

      return NextResponse.json({
        success: true,
        result: validatedResult,
      })
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      
      // Provide fallback marking result
      const fallbackResult = {
        totalMark: 3,
        band: 2,
        criteriaBreakdown: {
          understanding: { mark: 1, comment: "Shows some attempt to engage with the text or topic" },
          analysis: { mark: 1, comment: "Basic attempt at analysis, could be developed further" },
          response: { mark: 1, comment: "Makes some attempt to address the question" },
          expression: { mark: 0, comment: "Expression could be clearer and more structured" }
        },
        strengths: ["Attempted the essay task", "Shows some engagement with the topic"],
        improvements: [
          "Focus on reading and understanding your prescribed text more deeply",
          "Practice identifying and analyzing specific literary techniques",
          "Work on developing clearer thesis statements",
          "Use more specific textual evidence to support your points",
          "Practice essay structure with clear introduction, body, and conclusion"
        ],
        overallComment: "This response shows some attempt to engage with the essay task. With more focus on textual analysis and clearer expression, you can improve significantly.",
        suggestedQuotes: [
          {
            quote: "Consider incorporating quotes that directly relate to the module focus",
            explanation: "This would strengthen your connection between textual evidence and the broader themes"
          }
        ],
        nextSteps: [
          "Practice close analysis of literary techniques and their effects",
          "Work on developing more sophisticated thesis statements",
          "Focus on strengthening module concept connections"
        ]
      }

      return NextResponse.json({
        success: true,
        result: fallbackResult,
      })
    }
  } catch (error) {
    console.error("Error marking essay:", error)
    return NextResponse.json({ error: "Failed to mark essay" }, { status: 500 })
  }
} 