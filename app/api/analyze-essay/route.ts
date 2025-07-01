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

    const { content, theme, question, text } = await request.json()

    if (!content || content.trim().length < 50) {
      return NextResponse.json({ error: 'Content too short for analysis' }, { status: 400 })
    }

    console.log('Analyzing essay for:', { theme, text, contentLength: content.length })

    const prompt = `Analyze this HSC English essay comprehensively and provide structured feedback covering all essay components.

Essay Context:
- Text: ${text}
- Theme: ${theme}
- Question: ${question}

Essay Content:
${content}

Analyze the essay for these specific areas and provide feedback for each:

1. INTRODUCTION ANALYSIS:
   - Does it have a contextual statement about the text?
   - Is there a clear thesis statement addressing the question?
   - Are main arguments outlined?
   - Is the significance established?

2. BODY PARAGRAPH ANALYSIS:
   - Are there clear topic sentences?
   - Is textual evidence (quotes) used effectively?
   - Is there analysis of techniques and effects?
   - Does it link back to the thesis and question?

3. CONCLUSION ANALYSIS:
   - Is the thesis restated in different words?
   - Are key arguments summarized?
   - Is broader significance discussed?
   - Is there a thoughtful final statement?

4. OVERALL STRUCTURE:
   - Essay organization and flow
   - Question addressing
   - Argument development

IMPORTANT: Respond ONLY with a valid JSON array of feedback objects:
[
  {
    "type": "suggestion|missing|strength",
    "section": "introduction|body|conclusion|overall",
    "message": "Specific feedback message",
    "priority": "high|medium|low"
  }
]

Provide 3-5 pieces of feedback covering different aspects of the essay structure.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an HSC English teacher providing comprehensive essay feedback. You must respond ONLY with a valid JSON array of feedback objects covering introduction, body, conclusion, and overall structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    console.log('Raw OpenAI analysis response:', response)

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

    console.log('Cleaned analysis response:', cleanedResponse)

    // Parse the JSON response
    let analysisArray
    try {
      analysisArray = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanedResponse)
      console.error('Parse error:', parseError)
      
      // Fallback: try to extract feedback from non-JSON response
      const fallbackAnalysis = extractComprehensiveFeedbackFromText(response, content)
      if (fallbackAnalysis.length > 0) {
        console.log('Using fallback analysis:', fallbackAnalysis)
        return NextResponse.json(fallbackAnalysis)
      }
      
      throw new Error(`Invalid JSON response from OpenAI: ${response}`)
    }
    
    // Ensure we have an array
    if (!Array.isArray(analysisArray)) {
      // If it's a single object, wrap it in an array
      if (typeof analysisArray === 'object' && analysisArray.message) {
        analysisArray = [analysisArray]
      } else {
        throw new Error('Response is not a valid array of feedback objects')
      }
    }

    // Validate and fix each feedback object
    const validatedFeedback = analysisArray
      .filter(item => item && typeof item === 'object')
      .map(analysis => ({
        type: ['suggestion', 'missing', 'strength'].includes(analysis.type) ? analysis.type : 'suggestion',
        section: ['introduction', 'body', 'conclusion', 'overall'].includes(analysis.section) ? analysis.section : 'overall',
        message: analysis.message || 'Continue developing your essay with clear arguments and evidence.',
        priority: ['high', 'medium', 'low'].includes(analysis.priority) ? analysis.priority : 'medium'
      }))
      .slice(0, 5) // Limit to 5 pieces of feedback

    // If we don't have enough feedback, add comprehensive fallback
    if (validatedFeedback.length === 0) {
      const fallbackFeedback = getComprehensiveFallbackAnalysis(content)
      console.log('Using comprehensive fallback analysis')
      return NextResponse.json(fallbackFeedback)
    }

    console.log('Final comprehensive analysis result:', validatedFeedback)
    return NextResponse.json(validatedFeedback)
  } catch (error) {
    console.error('Error analyzing essay:', error)
    
    // Return comprehensive fallback analysis
    const fallbackAnalysis = getComprehensiveFallbackAnalysis(content)
    console.log('Returning comprehensive fallback analysis due to error')
    return NextResponse.json(fallbackAnalysis)
  }
}

// Helper function to extract comprehensive feedback from non-JSON text
function extractComprehensiveFeedbackFromText(text: string, essayContent: string): any[] {
  const feedback = []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15)
  
  const sections = ['introduction', 'body', 'conclusion', 'overall']
  let sectionIndex = 0
  
  for (const sentence of sentences.slice(0, 5)) {
    const trimmed = sentence.trim()
    if (trimmed.length > 20 && trimmed.length < 200) {
      feedback.push({
        type: 'suggestion',
        section: sections[sectionIndex % sections.length],
        message: trimmed,
        priority: 'medium'
      })
      sectionIndex++
    }
  }
  
  return feedback
}

// Comprehensive fallback analysis covering all essay structure areas
function getComprehensiveFallbackAnalysis(content: string): any[] {
  const wordCount = content.trim().split(/\s+/).length
  const lines = content.split('\n').filter(line => line.trim().length > 0)
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const hasQuotes = content.includes('"') || content.includes("'") || content.includes('"')
  const lowerContent = content.toLowerCase()
  
  const feedback = []
  
  // Introduction Analysis
  if (paragraphs.length > 0) {
    const firstParagraph = paragraphs[0]
    if (firstParagraph.length < 100) {
      feedback.push({
        type: 'suggestion',
        section: 'introduction',
        message: 'Expand your introduction with a contextual statement about the text and a clear thesis statement.',
        priority: 'high'
      })
    } else if (!lowerContent.includes('thesis') && !firstParagraph.toLowerCase().includes('explores') && !firstParagraph.toLowerCase().includes('presents')) {
      feedback.push({
        type: 'missing',
        section: 'introduction',
        message: 'Your introduction needs a clear thesis statement that directly addresses the essay question.',
        priority: 'high'
      })
    } else {
      feedback.push({
        type: 'strength',
        section: 'introduction',
        message: 'Good start! Ensure your thesis clearly outlines your main arguments.',
        priority: 'low'
      })
    }
  }
  
  // Body Paragraph Analysis
  if (paragraphs.length < 3) {
    feedback.push({
      type: 'missing',
      section: 'body',
      message: 'Develop clear body paragraphs with topic sentences, evidence, and analysis.',
      priority: 'high'
    })
  } else if (!hasQuotes && wordCount > 200) {
    feedback.push({
      type: 'suggestion',
      section: 'body',
      message: 'Include specific textual evidence (quotes) to support your arguments and analyze the techniques used.',
      priority: 'high'
    })
  } else if (hasQuotes) {
    feedback.push({
      type: 'strength',
      section: 'body',
      message: 'Good use of textual evidence! Ensure you analyze how the techniques create meaning.',
      priority: 'medium'
    })
  }
  
  // Conclusion Analysis
  if (paragraphs.length > 1) {
    const lastParagraph = paragraphs[paragraphs.length - 1]
    if (lastParagraph.length < 50) {
      feedback.push({
        type: 'missing',
        section: 'conclusion',
        message: 'Develop a stronger conclusion that restates your thesis and discusses broader significance.',
        priority: 'medium'
      })
    } else if (lastParagraph.toLowerCase().includes('conclusion') || lastParagraph.toLowerCase().includes('therefore')) {
      feedback.push({
        type: 'strength',
        section: 'conclusion',
        message: 'Good concluding paragraph! Ensure it ties back to your thesis and the question.',
        priority: 'low'
      })
    }
  }
  
  // Overall Structure Analysis
  if (wordCount < 200) {
    feedback.push({
      type: 'suggestion',
      section: 'overall',
      message: 'Aim to expand your essay to 800-1000 words for comprehensive coverage of the topic.',
      priority: 'medium'
    })
  } else if (wordCount > 500 && paragraphs.length >= 4) {
    feedback.push({
      type: 'strength',
      section: 'overall',
      message: 'Excellent essay length and structure! Focus on linking each paragraph back to your thesis.',
      priority: 'low'
    })
  } else {
    feedback.push({
      type: 'suggestion',
      section: 'overall',
      message: 'Good progress! Ensure each paragraph directly addresses the question and supports your thesis.',
      priority: 'medium'
    })
  }
  
  return feedback.slice(0, 4) // Return up to 4 pieces of feedback
} 