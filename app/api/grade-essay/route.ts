import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is not set')
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const { essayContent, question, selectedText, selectedTheme, rubric } = await request.json()

    if (!essayContent || !question || !selectedText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `You are an expert HSC English teacher grading an essay. Please grade this essay based on the provided rubric and return a detailed assessment.

ESSAY DETAILS:
- Text: ${selectedText}
- Theme: ${selectedTheme}
- Question: ${question}
- Word Count: ${essayContent.trim().split(/\s+/).length} words

ESSAY CONTENT:
${essayContent}

GRADING RUBRIC:
The essay should be graded out of 10 total points, distributed as follows:

1. Introduction (2.5 points):
   - Begin with a contextual statement about the text (0.5 points)
   - Present your thesis statement that directly addresses the question (1 point)
   - Outline your main arguments (3-4 points) (0.5 points)
   - Establish the significance of your argument (0.5 points)

2. Body Paragraphs (5 points):
   - Start with a clear topic sentence that connects to your thesis (1 point)
   - Present textual evidence (quotes) that supports your point (1.5 points)
   - Analyze the evidence by discussing techniques and their effects (1.5 points)
   - Explain how this supports your overall argument (0.5 points)
   - Link back to the question (0.5 points)

3. Conclusion (2 points):
   - Restate your thesis in different words (0.5 points)
   - Summarize your key arguments (0.5 points)
   - Discuss the broader significance of your analysis (0.5 points)
   - End with a thoughtful final statement (0.5 points)

4. Question Analysis (0.5 points):
   - Demonstrates understanding of the question (0.2 points)
   - Addresses all parts of the question (0.2 points)
   - Shows sophisticated analysis (0.1 points)

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown, explanations, or other text. Your entire response must be a single valid JSON object in this exact format:

{
  "totalScore": 7.5,
  "maxScore": 10,
  "criteria": [
    {
      "section": "Introduction",
      "score": 2.0,
      "maxScore": 2.5,
      "feedback": "detailed feedback about the introduction",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"]
    },
    {
      "section": "Body Paragraphs",
      "score": 4.0,
      "maxScore": 5,
      "feedback": "detailed feedback about body paragraphs",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"]
    },
    {
      "section": "Conclusion",
      "score": 1.5,
      "maxScore": 2,
      "feedback": "detailed feedback about the conclusion",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"]
    },
    {
      "section": "Question Analysis",
      "score": 0.4,
      "maxScore": 0.5,
      "feedback": "detailed feedback about question analysis",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"]
    }
  ],
  "overallFeedback": "comprehensive overall feedback about the essay",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Be constructive, specific, and helpful in your feedback. Focus on what the student did well and provide actionable advice for improvement. Consider the HSC English standards and expectations.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HSC English teacher with years of experience grading essays. You provide detailed, constructive feedback that helps students improve their writing skills. Always be encouraging while being honest about areas for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse the JSON response
    let gradeData
    try {
      // First try to parse the response directly
      gradeData = JSON.parse(response)
    } catch (parseError) {
      try {
        // Extract JSON from the response if it's wrapped in markdown or other text
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          gradeData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (secondParseError) {
        console.error('Failed to parse OpenAI response:', response)
        console.error('Parse errors:', parseError, secondParseError)
        
        // Provide a fallback structure if parsing completely fails
        gradeData = {
          totalScore: 5.0,
          maxScore: 10,
          criteria: [
            {
              section: "Introduction",
              score: 1.5,
              maxScore: 2.5,
              feedback: "Unable to analyze due to technical error. Please try again.",
              strengths: [],
              improvements: ["Please resubmit for proper analysis"]
            },
            {
              section: "Body Paragraphs",
              score: 2.5,
              maxScore: 5,
              feedback: "Unable to analyze due to technical error. Please try again.",
              strengths: [],
              improvements: ["Please resubmit for proper analysis"]
            },
            {
              section: "Conclusion",
              score: 1.0,
              maxScore: 2,
              feedback: "Unable to analyze due to technical error. Please try again.",
              strengths: [],
              improvements: ["Please resubmit for proper analysis"]
            },
            {
              section: "Question Analysis",
              score: 0.25,
              maxScore: 0.5,
              feedback: "Unable to analyze due to technical error. Please try again.",
              strengths: [],
              improvements: ["Please resubmit for proper analysis"]
            }
          ],
          overallFeedback: "There was a technical error processing your essay. Please try submitting again for proper analysis.",
          recommendations: ["Try resubmitting your essay", "Ensure your essay is complete", "Contact support if the problem persists"]
        }
      }
    }

    // Log the parsed response for debugging
    console.log('Parsed OpenAI response:', JSON.stringify(gradeData, null, 2))

    // Validate the response structure (note: totalScore can be 0, so check for undefined/null specifically)
    if (gradeData.totalScore === undefined || gradeData.totalScore === null || !gradeData.criteria || !Array.isArray(gradeData.criteria)) {
      console.error('Invalid grade data structure:', gradeData)
      throw new Error('Invalid grade data structure')
    }

    // Ensure scores are numbers and within valid ranges
    gradeData.totalScore = Math.min(Math.max(Number(gradeData.totalScore), 0), 10)
    gradeData.criteria = gradeData.criteria.map((criterion: any) => ({
      ...criterion,
      score: Math.min(Math.max(Number(criterion.score), 0), criterion.maxScore),
      strengths: Array.isArray(criterion.strengths) ? criterion.strengths : [],
      improvements: Array.isArray(criterion.improvements) ? criterion.improvements : []
    }))

    return NextResponse.json(gradeData)

  } catch (error) {
    console.error('Error grading essay:', error)
    return NextResponse.json(
      { error: 'Failed to grade essay. Please try again.' },
      { status: 500 }
    )
  }
} 