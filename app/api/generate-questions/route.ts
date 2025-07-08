import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const { theme, text, textDescription } = await request.json()
    
    // Validate input - only text is required now
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    console.log('Generating questions for:', { theme, text })

    // Create prompt based on whether theme is provided or not
    const prompt = theme 
      ? `Generate 4 HSC English essay questions focusing on the theme of "${theme}" in "${text}".

Requirements:
- Each question should be suitable for a 40-minute essay
- Questions should encourage deep analysis and critical thinking
- Use HSC-appropriate language and formats
- Focus specifically on the theme of "${theme}"

IMPORTANT: Respond ONLY with a valid JSON array. No additional text before or after. Example format:
["Question 1 text here", "Question 2 text here", "Question 3 text here", "Question 4 text here"]

Theme: ${theme}
Text: ${text}
Description: ${textDescription}`
      : `Generate 4 HSC English essay questions for "${text}".

Requirements:
- Each question should be suitable for a 40-minute essay
- Questions should encourage deep analysis and critical thinking
- Use HSC-appropriate language and formats
- Cover different aspects of literary analysis (themes, techniques, character development, structure, etc.)
- Questions should be varied and comprehensive

IMPORTANT: Respond ONLY with a valid JSON array. No additional text before or after. Example format:
["Question 1 text here", "Question 2 text here", "Question 3 text here", "Question 4 text here"]

Text: ${text}
Description: ${textDescription}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an HSC English teacher. You must respond ONLY with a valid JSON array of 4 essay questions. No explanations, no additional text, just the JSON array."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    console.log('Raw OpenAI response:', response)

    // Clean the response - remove any markdown formatting or extra text
    let cleanedResponse = response.trim()
    
    // Remove markdown code block formatting if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Try to find JSON array in the response
    const jsonMatch = cleanedResponse.match(/\[[^\]]*\]/s)
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0]
    }

    console.log('Cleaned response:', cleanedResponse)

    // Parse the JSON response
    let questions
    try {
      questions = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanedResponse)
      console.error('Parse error:', parseError)
      
      // Fallback: try to extract questions from non-JSON response
      const fallbackQuestions = extractQuestionsFromText(response)
      if (fallbackQuestions.length > 0) {
        console.log('Using fallback extraction:', fallbackQuestions)
        return NextResponse.json(fallbackQuestions)
      }
      
      throw new Error(`Invalid JSON response from OpenAI: ${response}`)
    }
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Response is not a valid array of questions')
    }

    // Ensure we have exactly 4 questions
    const finalQuestions = questions.slice(0, 4)
    if (finalQuestions.length < 4) {
      // Pad with generic questions if needed
      while (finalQuestions.length < 4) {
        const genericQuestion = theme 
          ? `How does ${text} explore the theme of ${theme}?`
          : `How does the author use literary techniques to develop meaning in ${text}?`
        finalQuestions.push(genericQuestion)
      }
    }

    console.log('Generated questions:', finalQuestions)
    return NextResponse.json(finalQuestions)
  } catch (error) {
    console.error('Error generating questions:', error)
    
    // Return fallback questions if available
    const fallbackQuestions = getFallbackQuestions(theme, text)
    if (fallbackQuestions.length > 0) {
      console.log('Returning fallback questions due to error')
      return NextResponse.json(fallbackQuestions)
    }
    
    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Failed to generate questions',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper function to extract questions from non-JSON text
function extractQuestionsFromText(text: string): string[] {
  const questions: string[] = []
  
  // Try to find lines that look like questions
  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.endsWith('?') && trimmed.length > 20) {
      // Remove any numbering or bullet points
      const cleaned = trimmed.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').replace(/^•\s*/, '')
      questions.push(cleaned)
    }
  }
  
  return questions.slice(0, 4)
}

// Fallback questions for different themes
function getFallbackQuestions(theme: string | undefined, text: string): string[] {
  // If no theme provided, return general literary analysis questions
  if (!theme) {
    return [
      `How does the author use literary techniques to develop meaning in ${text}?`,
      `To what extent does ${text} reflect the social context of its time?`,
      `Analyze the role of characterization in conveying the central concerns of ${text}.`,
      `How does the structure of ${text} contribute to its overall meaning and impact?`
    ]
  }

  const fallbackQuestions = {
    love: [
      `How does ${text} explore different forms of love?`,
      `To what extent does ${text} present love as a transformative force?`,
      `Analyze the role of love in shaping character relationships in ${text}.`,
      `How does the author use literary techniques to convey the complexities of love in ${text}?`
    ],
    freedom: [
      `How does ${text} explore the concept of freedom?`,
      `To what extent do characters in ${text} achieve true freedom?`,
      `Analyze the barriers to freedom presented in ${text}.`,
      `How does the author use symbolism to represent freedom in ${text}?`
    ],
    power: [
      `How does ${text} explore the corrupting nature of power?`,
      `To what extent does ${text} present power as destructive?`,
      `Analyze the different forms of power depicted in ${text}.`,
      `How does the author critique power structures in ${text}?`
    ],
    identity: [
      `How does ${text} explore questions of identity?`,
      `To what extent do characters in ${text} struggle with self-discovery?`,
      `Analyze the factors that shape identity in ${text}.`,
      `How does the author use character development to explore identity in ${text}?`
    ]
  }
  
  const themeKey = theme.toLowerCase() as keyof typeof fallbackQuestions
  return fallbackQuestions[themeKey] || [
    `How does ${text} explore the theme of ${theme}?`,
    `To what extent does ${text} present ${theme} as significant?`,
    `Analyze the role of ${theme} in ${text}.`,
    `How does the author use literary techniques to convey ${theme} in ${text}?`
  ]
} 