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

    const { component, step, text, theme, currentContent } = await request.json()

    // Debug logging
    console.log('Received parameters:', { component, step, text, theme, currentContent })

    if (!component || step === undefined || step === null || !text || !theme) {
      console.error('Missing required parameters:', { component, step, text, theme })
      return NextResponse.json({ 
        error: 'Missing required parameters',
        received: { component, step, text, theme }
      }, { status: 400 })
    }

    console.log('Generating AI tip for:', { component, step, text, theme })

    let prompt = ''

    // Different prompts based on essay component and step
    if (component === 'introduction') {
      const introSteps = {
        0: 'Thesis Statement',
        1: 'Context',
        2: 'Points Preview',
        3: 'Answer Question'
      }
      
      prompt = `You are an expert HSC English teacher helping a student write the ${introSteps[step]} part of their essay introduction about ${theme} in ${text}.

Current step: ${introSteps[step]}
Text: ${text}
Theme: ${theme}
Student's current work: ${currentContent || 'Nothing written yet'}

Provide a helpful, specific tip for writing this part of the introduction. Be encouraging and give concrete advice. Keep it under 100 words and make it actionable.

Focus on:
${step === 0 ? '- Creating a clear, arguable thesis that directly addresses the theme\n- Making a specific claim about how the author explores this theme' : ''}
${step === 1 ? '- Providing relevant context about the author, text, and historical/literary background\n- Setting up the significance of analyzing this theme' : ''}
${step === 2 ? '- Briefly outlining the main arguments you will make\n- Showing how your points will support your thesis' : ''}
${step === 3 ? '- Directly addressing the essay question with clear language\n- Connecting your thesis to the specific question asked' : ''}

Respond with just the tip, no extra formatting.`
    } else if (component === 'body-paragraph') {
      const petalSteps = {
        0: 'Point',
        1: 'Evidence', 
        2: 'Technique',
        3: 'Analysis',
        4: 'Link'
      }
      
      prompt = `You are an expert HSC English teacher helping a student write the ${petalSteps[step]} part of their PETAL body paragraph about ${theme} in ${text}.

Current step: ${petalSteps[step]}
Text: ${text}
Theme: ${theme}
Student's current work: ${currentContent || 'Nothing written yet'}

Provide a helpful, specific tip for writing this part of the PETAL paragraph. Be encouraging and give concrete advice. Keep it under 100 words and make it actionable.

Focus on:
${step === 0 ? '- Making a clear topic sentence that supports your thesis\n- Being specific about how this point relates to the theme' : ''}
${step === 1 ? '- Integrating quotes smoothly into your writing\n- Choosing evidence that directly supports your point' : ''}
${step === 2 ? '- Identifying the specific literary technique used\n- Being precise about how the technique is employed' : ''}
${step === 3 ? '- Explaining the effect of the technique on the reader\n- Connecting the technique to the theme and your argument' : ''}
${step === 4 ? '- Linking back to your thesis and the essay question\n- Transitioning to your next argument' : ''}

Respond with just the tip, no extra formatting.`
    } else if (component === 'conclusion') {
      const conclusionSteps = {
        0: 'Restate Thesis',
        1: 'Synthesize Points',
        2: 'Broader Implications',
        3: 'Final Statement'
      }
      
      prompt = `You are an expert HSC English teacher helping a student write the ${conclusionSteps[step]} part of their essay conclusion about ${theme} in ${text}.

Current step: ${conclusionSteps[step]}
Text: ${text}
Theme: ${theme}
Student's current work: ${currentContent || 'Nothing written yet'}

Provide a helpful, specific tip for writing this part of the conclusion. Be encouraging and give concrete advice. Keep it under 100 words and make it actionable.

Focus on:
${step === 0 ? '- Restating your thesis in fresh language\n- Reinforcing your main argument without repetition' : ''}
${step === 1 ? '- Briefly summarizing your key arguments\n- Showing how they work together to support your thesis' : ''}
${step === 2 ? '- Discussing the broader significance of your analysis\n- Connecting to universal themes or contemporary relevance' : ''}
${step === 3 ? '- Ending with a thoughtful, memorable statement\n- Leaving the reader with something to consider' : ''}

Respond with just the tip, no extra formatting.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HSC English teacher providing personalized, helpful tips to students. Your advice should be specific, actionable, and encouraging."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const tip = completion.choices[0]?.message?.content?.trim()
    if (!tip) {
      throw new Error('No response from OpenAI')
    }

    console.log('Generated AI tip:', tip)
    return NextResponse.json({ tip })

  } catch (error) {
    console.error('Error generating AI tip:', error)
    
    // Fallback tips based on component and step
    const fallbackTips = {
      introduction: [
        "Start with a clear statement about how the author explores your chosen theme. Make it specific and arguable.",
        "Provide context about the text, author, and historical period. This helps establish the significance of your analysis.",
        "Briefly outline the main arguments you'll make. This roadmap helps your reader follow your logic.",
        "Make sure you're directly answering the essay question. Use key terms from the question in your response."
      ],
      'body-paragraph': [
        "Begin with a clear topic sentence that directly supports your thesis. Be specific about your claim.",
        "Choose quotes that directly relate to your point. Integrate them smoothly using signal phrases.",
        "Be precise about the literary technique. Name it specifically and explain how it's used.",
        "Explain the effect of the technique. How does it help convey meaning related to your theme?",
        "Connect back to your thesis and the question. Show how this paragraph advances your overall argument."
      ],
      conclusion: [
        "Restate your thesis using different words. Reinforce your main argument without being repetitive.",
        "Summarize your key points briefly. Show how they work together to support your argument.",
        "Discuss why your analysis matters. Connect to broader themes or contemporary relevance.",
        "End with a thoughtful statement that leaves your reader with something to consider."
      ]
    }
    
    const componentTips = fallbackTips[component] || fallbackTips.introduction
    const fallbackTip = componentTips[step] || componentTips[0]
    
    return NextResponse.json({ tip: fallbackTip })
  }
} 