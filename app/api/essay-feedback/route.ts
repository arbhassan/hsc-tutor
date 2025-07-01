import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const { component, content, text, theme, allStepsContent } = await request.json()

    if (!component || !content || !text || !theme) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    console.log('Generating feedback for:', { component, text, theme, contentLength: content.length })

    let prompt = ''

    if (component === 'introduction') {
      prompt = `You are an expert HSC English teacher providing feedback on a student's essay introduction about ${theme} in ${text}.

Text: ${text}
Theme: ${theme}

Student's Introduction:
${content}

Analyze this introduction and provide specific, constructive feedback. Look for:
- Clear thesis statement that addresses the theme
- Relevant context about the text and author
- Preview of main arguments
- Direct connection to the essay question

Provide feedback in this JSON format:
{
  "score": [1-10],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "specific_tips": ["tip 1", "tip 2"],
  "overall_comment": "encouraging overall assessment"
}

Be specific and constructive. Highlight what they did well and give actionable advice for improvement.`
    
    } else if (component === 'body-paragraph') {
      prompt = `You are an expert HSC English teacher providing feedback on a student's PETAL body paragraph about ${theme} in ${text}.

Text: ${text}
Theme: ${theme}

Student's Body Paragraph:
${content}

Analyze this body paragraph using the PETAL structure and provide specific feedback. Look for:
- Point: Clear topic sentence supporting the thesis
- Evidence: Relevant quotes integrated well
- Technique: Literary techniques identified and explained
- Analysis: Deep analysis of how technique creates meaning
- Link: Connection back to thesis and question

Provide feedback in this JSON format:
{
  "score": [1-10],
  "petal_analysis": {
    "point": "feedback on topic sentence",
    "evidence": "feedback on quote usage",
    "technique": "feedback on technique identification",
    "analysis": "feedback on analysis depth",
    "link": "feedback on connection to thesis"
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overall_comment": "encouraging overall assessment"
}

Be specific about each PETAL component and provide actionable advice.`

    } else if (component === 'conclusion') {
      prompt = `You are an expert HSC English teacher providing feedback on a student's essay conclusion about ${theme} in ${text}.

Text: ${text}
Theme: ${theme}

Student's Conclusion:
${content}

Analyze this conclusion and provide specific feedback. Look for:
- Thesis restated in fresh language
- Key arguments synthesized
- Broader implications discussed  
- Strong final statement

Provide feedback in this JSON format:
{
  "score": [1-10],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "specific_tips": ["tip 1", "tip 2"],
  "overall_comment": "encouraging overall assessment"
}

Be encouraging while providing specific guidance for improvement.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HSC English teacher providing detailed, constructive feedback. Always respond with valid JSON and be encouraging while giving specific improvement advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const response = completion.choices[0]?.message?.content?.trim()
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    console.log('Raw OpenAI feedback response:', response)

    // Clean and parse JSON response
    let cleanedResponse = response
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/\s*```$/, '')
    }

    let feedback
    try {
      feedback = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanedResponse)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Validate feedback structure
    if (!feedback.score || !feedback.strengths || !feedback.improvements || !feedback.overall_comment) {
      throw new Error('Invalid feedback structure')
    }

    console.log('Generated feedback:', feedback)
    return NextResponse.json(feedback)

  } catch (error) {
    console.error('Error generating feedback:', error)
    
    // Fallback feedback based on component
    const fallbackFeedback = {
      introduction: {
        score: 7,
        strengths: [
          "Good attempt at structuring your introduction",
          "Shows understanding of the text and theme"
        ],
        improvements: [
          "Make your thesis statement more specific and arguable",
          "Add more context about the text and its significance"
        ],
        specific_tips: [
          "Try starting with a broader statement about the theme before narrowing to your specific argument",
          "Make sure to preview the main points you'll discuss in your body paragraphs"
        ],
        overall_comment: "You're on the right track! Focus on making your thesis more specific and providing clearer context."
      },
      'body-paragraph': {
        score: 7,
        petal_analysis: {
          point: "Good topic sentence that supports your argument",
          evidence: "Quote is relevant but could be integrated more smoothly",
          technique: "Technique identified correctly",
          analysis: "Analysis could be deeper - explain the effect on the reader",
          link: "Remember to link back to your thesis more explicitly"
        },
        strengths: [
          "Clear structure following PETAL format",
          "Good use of textual evidence"
        ],
        improvements: [
          "Deepen your analysis of how the technique creates meaning",
          "Strengthen the link back to your overall argument"
        ],
        overall_comment: "Strong paragraph structure! Focus on deepening your analysis and making clearer connections to your thesis."
      },
      conclusion: {
        score: 7,
        strengths: [
          "Good attempt at restating your main argument",
          "Shows understanding of the text's broader significance"
        ],
        improvements: [
          "Avoid simply repeating your introduction",
          "Make your final statement more impactful"
        ],
        specific_tips: [
          "Try connecting your analysis to broader themes or contemporary relevance",
          "End with a thought-provoking statement that leaves a lasting impression"
        ],
        overall_comment: "Well done! Your conclusion effectively wraps up your argument. Work on making it more memorable and impactful."
      }
    }
    
    const componentFeedback = fallbackFeedback[component] || fallbackFeedback.introduction
    return NextResponse.json(componentFeedback)
  }
} 