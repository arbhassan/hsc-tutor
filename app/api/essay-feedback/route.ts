import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  let component, content, text, theme, allStepsContent
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const requestData = await request.json()
    component = requestData.component
    content = requestData.content
    text = requestData.text
    theme = requestData.theme
    allStepsContent = requestData.allStepsContent

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

IMPORTANT: You must analyze whatever content is provided above, even if it's incomplete, minimal, or nonsensical. Do not ask for more content - work with what's given.

Analyze this introduction and provide specific, constructive feedback. Look for:
- Clear thesis statement that addresses the theme
- Relevant context about the text and author
- Preview of main arguments
- Direct connection to the essay question

SCORING CRITERIA (be strict):
- 1-2: No coherent content, irrelevant text, or just a few words
- 3-4: Minimal effort, lacks clear thesis, no context or structure
- 5-6: Basic attempt with some relevant content but missing key elements
- 7-8: Good structure with most elements present, clear thesis and context
- 9-10: Excellent introduction with sophisticated thesis, rich context, and clear argument preview

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

IMPORTANT: You must analyze whatever content is provided above, even if it's incomplete, minimal, or nonsensical. Do not ask for more content - work with what's given.

Analyze this body paragraph using the PETAL structure and provide specific feedback. Look for:
- Point: Clear topic sentence supporting the thesis
- Evidence: Relevant quotes integrated well
- Technique: Literary techniques identified and explained
- Analysis: Deep analysis of how technique creates meaning
- Link: Connection back to thesis and question

SCORING CRITERIA (be strict):
- 1-2: No coherent content, irrelevant text, or just a few words
- 3-4: Minimal effort, lacks PETAL structure, no quotes or analysis
- 5-6: Basic attempt with some PETAL elements but weak analysis or poor quote integration
- 7-8: Good PETAL structure with clear analysis and appropriate quotes
- 9-10: Excellent paragraph with sophisticated analysis, seamless quote integration, and insightful technique discussion

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

IMPORTANT: You must analyze whatever content is provided above, even if it's incomplete, minimal, or nonsensical. Do not ask for more content - work with what's given.

Analyze this conclusion and provide specific feedback. Look for:
- Thesis restated in fresh language
- Key arguments synthesized
- Broader implications discussed  
- Strong final statement

SCORING CRITERIA (be strict):
- 1-2: No coherent content, irrelevant text, or just a few words
- 3-4: Minimal effort, lacks structure, simply repeats introduction
- 5-6: Basic attempt with some synthesis but weak final statement
- 7-8: Good conclusion with clear synthesis and thoughtful final statement
- 9-10: Excellent conclusion with sophisticated synthesis, broader implications, and memorable ending

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
    
    // Fallback feedback based on component - using stricter scoring
    const fallbackFeedback = {
      introduction: {
        score: 4,
        strengths: [
          "You've attempted to write an introduction"
        ],
        improvements: [
          "Develop a clear thesis statement that directly answers the question",
          "Add relevant context about the text and author",
          "Structure your introduction with a clear argument preview"
        ],
        specific_tips: [
          "Start with context, then present your thesis, then preview your main points",
          "Make sure every sentence contributes to answering the essay question"
        ],
        overall_comment: "This is a starting point. Focus on developing a clear thesis and providing relevant context to improve your score."
      },
      'body-paragraph': {
        score: 4,
        petal_analysis: {
          point: "Needs a clear topic sentence that supports your thesis",
          evidence: "Include relevant quotes from the text",
          technique: "Identify specific literary techniques used",
          analysis: "Explain how the technique creates meaning and supports your argument",
          link: "Connect your analysis back to your thesis"
        },
        strengths: [
          "You've attempted to write a body paragraph"
        ],
        improvements: [
          "Follow the PETAL structure more clearly",
          "Include specific quotes and analyze their techniques",
          "Deepen your analysis of how evidence supports your argument"
        ],
        overall_comment: "This needs significant development. Focus on including quotes, identifying techniques, and analyzing their effect."
      },
      conclusion: {
        score: 4,
        strengths: [
          "You've attempted to write a conclusion"
        ],
        improvements: [
          "Restate your thesis in fresh language",
          "Synthesize your key arguments",
          "End with a strong final statement about the text's significance"
        ],
        specific_tips: [
          "Don't just repeat your introduction - show how your argument has developed",
          "Consider the broader implications of your analysis"
        ],
        overall_comment: "This conclusion needs more development. Focus on synthesizing your arguments and ending with impact."
      }
    }
    
    const componentFeedback = fallbackFeedback[component] || fallbackFeedback.introduction
    return NextResponse.json(componentFeedback)
  }
} 