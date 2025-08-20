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
        const prompt = `You are an experienced HSC English teacher marking a Section I (Unseen Texts) response. You should be fair but maintain HSC standards. You have the actual text in front of you and can verify the student's understanding.

**ORIGINAL TEXT:**
"${response.textTitle}" by ${response.textAuthor}
${response.textContent}

**Question:** ${response.questionText}
**Marks Available:** ${response.marks}
**Text Type:** ${response.textType}

**Student Response:**
${response.response}

**MARKING APPROACH:**
Assess the student's response fairly, looking for evidence of:
1. Reading and understanding of the text
2. Attempt to identify relevant techniques or features
3. Connection between examples and the question asked
4. Basic comprehension of the passage's content

**MARKING CRITERIA:**

**Zero marks only for:**
- Complete nonsense, gibberish, or random letters (e.g., "asdfasf")
- Completely blank or single-word responses
- Responses that are entirely off-topic or irrelevant

**Band 1 (1 mark) for:**
- Shows some attempt to engage with the text, even if basic
- Minimal understanding but some effort to address the question
- Basic attempt at identifying techniques, even if not entirely correct

**Band 2 (2 marks) for:**
- Shows basic reading comprehension
- Attempts to identify techniques with some success
- Makes some connection to the question
- Uses some textual references, even if basic

**Band 3 (3 marks) for:**
- Demonstrates good understanding of the text
- Identifies relevant techniques with reasonable accuracy
- Provides adequate textual evidence
- Addresses the question appropriately

**Band 4+ (4+ marks) for:**
- Shows sophisticated understanding of the text
- Identifies techniques accurately and explains their effects
- Uses specific, relevant textual evidence
- Thoroughly addresses the question with insight

**IMPORTANT PRINCIPLES:**
- Give credit for genuine attempts and partial understanding
- Look for what the student DOES know rather than what they don't
- Award marks proportionally based on the quality of response
- Consider that students may express ideas differently but still show understanding

Format your response as JSON:
{
  "mark": number (based on criteria above, be generous with partial credit),
  "totalMarks": ${response.marks},
  "band": number (1-6 based on response quality),
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "comment": "overall comment explaining the mark awarded and recognizing effort"
}

**Remember: Be fair and encouraging while maintaining standards. Look for evidence of learning and understanding.**`

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an experienced HSC English teacher who is fair but maintains appropriate standards. You look for evidence of student understanding and give credit where it's due. You recognize that students may show understanding in different ways and at different levels. While you maintain HSC standards, you are encouraging and supportive, helping students see what they've done well while guiding them toward improvement. You only award zero marks for truly nonsensical responses (random letters, complete gibberish) and always look for partial understanding that deserves recognition.",
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
            mark: 1, // Give at least 1 mark for attempting the question
            totalMarks: response.marks,
            band: 1,
            strengths: ["Attempted the question"],
            improvements: [
              "Try to read the text more carefully and identify specific details",
              "Look for literary techniques or language features in the passage",
              "Use specific examples from the text to support your points", 
              "Make sure your response directly addresses what the question is asking",
              "Practice identifying how techniques create meaning or effect"
            ],
            comment: "This response shows some attempt to engage with the question. To improve, focus on reading the text carefully and using specific examples to support your analysis.",
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