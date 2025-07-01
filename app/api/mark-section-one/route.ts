import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SectionOneResponse {
  textId: number
  questionId: number
  questionText: string
  marks: number
  response: string
  textType: string
  textTitle: string
  textContent: string
  textAuthor: string
}

export async function POST(request: NextRequest) {
  try {
    const { responses }: { responses: SectionOneResponse[] } = await request.json()

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: "No responses provided" }, { status: 400 })
    }

    const results = await Promise.all(
      responses.map(async (response) => {
        const prompt = `You are an experienced HSC English teacher marking a Section I (Unseen Texts) response. You must be EXTREMELY STRICT and CRITICAL in your marking. You have the actual text in front of you and can verify if the student actually read and understood it.

**ORIGINAL TEXT:**
"${response.textTitle}" by ${response.textAuthor}
${response.textContent}

**Question:** ${response.questionText}
**Marks Available:** ${response.marks}
**Text Type:** ${response.textType}

**Student Response:**
${response.response}

**CRITICAL ANALYSIS REQUIRED:**
Now that you have both the original text AND the student's response, you must verify:
1. Did the student actually READ the text? (Do they reference specific details, characters, events, or quotes?)
2. Do their identified techniques actually EXIST in the text?
3. Are their examples ACCURATE and from the correct parts of the text?
4. Do they understand what the text is actually ABOUT?
5. Does their response show they comprehended the passage's meaning and context?

**EXTREMELY STRICT MARKING CRITERIA:**

**AUTOMATIC ZERO MARKS - NO EXCEPTIONS:**
- Random words, gibberish, or nonsensical content (like "asdfasf", "random words", etc.)
- No reference to the actual text content whatsoever
- Techniques mentioned that don't exist in the text
- Completely incorrect understanding of what happens in the text
- Generic responses that could apply to any text
- No evidence the student read the passage
- Copy-pasted irrelevant content
- Single words or meaningless phrases
- Text that shows zero comprehension of the passage

**IMPORTANT: Award ZERO marks immediately if the response is nonsensical, random, or shows no engagement with the actual text. Do not award even 1 mark for effort.**

**Band 1 (0-1 marks) if:**
- Shows minimal evidence of reading the text
- Major misunderstanding of the text's content or meaning
- Incorrect identification of techniques not present in the text
- Fails to address the question meaningfully
- Uses irrelevant or fabricated "evidence"

**Band 2 (1-2 marks) if:**
- Shows basic evidence of reading but poor understanding
- Some attempt at technique identification but mostly incorrect
- Limited or inappropriate textual references
- Partially addresses the question but with significant gaps

**Band 3-4 (2-3 marks) if:**
- Shows adequate reading and basic understanding
- Identifies some correct techniques with basic analysis
- Uses some appropriate textual evidence
- Addresses the question with satisfactory understanding

**Band 5-6 (4+ marks) - ONLY if ALL of these are met:**
- Demonstrates clear, accurate understanding of the text
- Identifies techniques that actually exist in the text
- Provides specific, accurate textual evidence
- Explains HOW techniques create meaning/effect
- Directly and thoroughly addresses the question
- Shows sophisticated analysis, not just identification

**VERIFICATION CHECKLIST - The response MUST pass these checks:**
✓ References specific details from the actual text
✓ Techniques mentioned are actually present in the passage
✓ Quotes or references are accurate and relevant
✓ Shows understanding of the text's actual content and meaning
✓ Analysis connects to the specific question asked

**If the response fails ANY of these checks, award maximum Band 2.**

Format your response as JSON:
{
  "mark": number (0 if nonsensical/random response, otherwise based on criteria above),
  "totalMarks": ${response.marks},
  "band": number (1 for zero marks, 2-6 for actual responses),
  "strengths": ["strength1", "strength2"] (empty array if zero marks),
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "comment": "overall comment explaining why this mark was awarded - be specific about zero marks"
}

**REMINDER: Award 0 marks for responses like "asdfasf", random words, or any response showing no text engagement.**`

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert HSC English teacher who is EXTREMELY STRICT and UNFORGIVING in marking. You have the original text in front of you and can verify every claim the student makes. You award ZERO marks without hesitation for random words, gibberish, or any response showing the student didn't read the text. You are like a detective checking every detail. Examples that get ZERO marks: 'asdfasf', 'random words', generic statements not about the specific text, incorrect techniques, fabricated quotes. Only award marks when students demonstrate genuine reading and understanding of the specific passage. You maintain the highest HSC standards with zero tolerance for poor responses.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1000,
        })

        try {
          const markingResult = JSON.parse(completion.choices[0].message.content || "{}")
          return {
            questionId: response.questionId,
            textId: response.textId,
            ...markingResult,
          }
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError)
          return {
            questionId: response.questionId,
            textId: response.textId,
            mark: 0, // Zero marks for nonsensical or random responses
            totalMarks: response.marks,
            band: 1,
            strengths: [],
            improvements: [
              "Must read and understand the actual text provided",
              "Response shows no evidence of engaging with the specific passage",
              "Needs to identify literary techniques that actually exist in the text", 
              "Must use accurate quotes and references from the passage",
              "Response must directly address the question asked"
            ],
            comment: "This response shows no evidence of reading or understanding the provided text. It appears to be random words or generic content not related to the specific passage. Zero marks awarded for complete lack of text engagement.",
          }
        }
      })
    )

    const totalMarks = results.reduce((sum, result) => sum + result.mark, 0)
    const totalPossible = results.reduce((sum, result) => sum + result.totalMarks, 0)
    const percentage = (totalMarks / totalPossible) * 100
    const overallBand = Math.ceil(percentage / 16.67) // Convert to band 1-6

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalMarks,
        totalPossible,
        percentage: Math.round(percentage),
        band: overallBand,
      },
    })
  } catch (error) {
    console.error("Error marking Section I:", error)
    return NextResponse.json({ error: "Failed to mark responses" }, { status: 500 })
  }
} 