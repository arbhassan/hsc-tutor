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

    const basePrompt = `You are an experienced HSC English teacher who is STRICT and CRITICAL in marking essays. You have high standards and only award high marks for genuinely sophisticated responses that demonstrate deep understanding and analysis.

**Module:** ${module}
**Question:** ${question}
**Word Count:** ${wordCount}

**Student Essay:**
${response}

**CRITICAL EVALUATION REQUIRED:**

**BE STRICT - Only award marks when the response demonstrates:**

**Band 6 (17-20) - ONLY for exceptional responses that:**
- Show sophisticated, perceptive understanding of text and module concepts
- Provide sustained, sophisticated analysis of techniques and their effects
- Present a compelling, nuanced argument that fully addresses the question
- Use precise, varied expression with sophisticated vocabulary
- Integrate textual evidence seamlessly with insightful analysis

**Band 5 (13-16) - For solid responses that:**
- Show clear understanding of text and module concepts
- Provide effective analysis with some sophistication
- Present a clear argument that addresses the question well
- Use effective expression with appropriate vocabulary
- Use relevant textual evidence with sound analysis

**Band 4 (9-12) - For adequate responses that:**
- Show satisfactory understanding with some gaps
- Provide competent but basic analysis
- Address the question but may lack depth
- Use generally clear expression
- Use some relevant textual evidence

**Band 3 (5-8) - For basic responses that:**
- Show basic understanding with significant gaps
- Provide limited analysis, mostly identification
- Partially address the question
- Use simple expression with some clarity issues
- Use minimal relevant textual evidence

**Band 2 (3-4) - For poor responses that:**
- Show elementary understanding with major gaps
- Provide very limited analysis
- Poorly address the question
- Use unclear, simple expression
- Use little relevant textual evidence

**Band 1 (1-2) - For very poor responses that:**
- Show minimal or no understanding
- Provide no real analysis
- Fail to address the question adequately
- Use very unclear expression
- Use irrelevant or no textual evidence

**AUTOMATIC ZERO MARKS - NO EXCEPTIONS:**
- Random words, gibberish, or nonsensical content (like "asdfasf", "random words", etc.)
- Completely off-topic or irrelevant content
- No evidence of having read any prescribed text
- Copy-pasted generic content with no specific references
- Single words or meaningless phrases
- Text that shows zero comprehension of the question or module
- Responses that could be written without reading any text

**IMPORTANT: Award ZERO marks immediately if the response is nonsensical, random, or shows no engagement with a prescribed text. Do not award even 1 mark for effort or length.**

**IMPORTANT CHECKS:**
1. Does the response actually address the specific question asked?
2. Does it show genuine understanding of a prescribed text (with specific examples)?
3. Are literary techniques correctly identified and analyzed (not just listed)?
4. Is there actual analysis of HOW techniques create meaning?
5. Does it engage meaningfully with the module concepts?

If the answer to most of these is NO, the response should receive low marks.

**Marking Criteria Weightings:**
- Understanding of text and module concepts: ${markingCriteria.understanding}%
- Analysis of literary techniques and their effects: ${markingCriteria.analysis}%
- Quality of response to the question: ${markingCriteria.response}%
- Structure, expression, and mechanics: ${markingCriteria.expression}%

Please provide detailed feedback in the following JSON format:
{
  "totalMark": number (0 if nonsensical/random response, otherwise out of 20),
  "band": number (1 for zero marks, 2-6 for actual responses),
  "criteriaBreakdown": {
    "understanding": { "mark": number (0 if no text understanding), "comment": "specific comment" },
    "analysis": { "mark": number (0 if no analysis), "comment": "specific comment" },
    "response": { "mark": number (0 if doesn't address question), "comment": "specific comment" },
    "expression": { "mark": number (0 if nonsensical), "comment": "specific comment" }
  },
  "strengths": ["strength1", "strength2"] (empty array if zero marks),
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4"],
  "overallComment": "2-3 sentence overall assessment - be specific about zero marks",
  "suggestedQuotes": [
    {"quote": "suggested quote", "explanation": "how this could strengthen the argument"},
    {"quote": "another quote", "explanation": "how this could be used"}
  ],
  "nextSteps": ["specific practice recommendation 1", "specific practice recommendation 2"]
}

**REMINDER: Award 0 marks for responses like "asdfasf", random words, or any response showing no prescribed text engagement.**`

    const finalPrompt = customPrompt || basePrompt

            const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert HSC English teacher who is EXTREMELY STRICT and UNCOMPROMISING in your marking standards. You award ZERO marks without hesitation for random words, gibberish, or any response showing the student didn't read a prescribed text. You have over 15 years of experience identifying poor responses. Examples that get ZERO marks: 'asdfasf', 'random words', generic content with no text-specific references, responses that could be written without reading any prescribed text. You only award marks when students demonstrate genuine understanding of a specific prescribed text. You maintain the highest HSC standards with zero tolerance for nonsensical responses.",
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
        totalMark: markingResult.totalMark || 0, // Zero marks for nonsensical responses
        band: markingResult.band || 1,
        criteriaBreakdown: markingResult.criteriaBreakdown || {
          understanding: { mark: 0, comment: "No evidence of understanding any prescribed text or module concepts" },
          analysis: { mark: 0, comment: "No analysis present, appears to be random or nonsensical content" },
          response: { mark: 0, comment: "Does not address the question in any meaningful way" },
          expression: { mark: 0, comment: "Unclear, nonsensical, or random content" }
        },
        strengths: markingResult.strengths || [],
        improvements: markingResult.improvements || [
          "Must read and understand a prescribed text for the Common Module",
          "Response must contain actual content related to the question",
          "Needs to demonstrate basic essay writing skills",
          "Must engage with the specific question asked",
          "Requires evidence of having studied HSC English texts"
        ],
        overallComment: markingResult.overallComment || "This response shows no evidence of understanding the question, any prescribed text, or basic essay writing. Zero marks awarded for complete lack of engagement with the task.",
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
        totalMark: 0,
        band: 1,
        criteriaBreakdown: {
          understanding: { mark: 0, comment: "No evidence of understanding any prescribed text or module concepts" },
          analysis: { mark: 0, comment: "No analysis present, appears to be random or nonsensical content" },
          response: { mark: 0, comment: "Does not address the question in any meaningful way" },
          expression: { mark: 0, comment: "Unclear, nonsensical, or random content that shows no essay writing ability" }
        },
        strengths: [],
        improvements: [
          "Must read and understand a prescribed text for the Common Module",
          "Response must contain actual content related to the question",
          "Needs to demonstrate basic essay writing skills",
          "Must engage with the specific question asked",
          "Requires evidence of having studied HSC English texts"
        ],
        overallComment: "This response shows no evidence of understanding the question, any prescribed text, or basic essay writing skills. Zero marks awarded for complete lack of engagement with the HSC English task.",
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