"use client"

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { getBookData, BookData } from "@/lib/data/book-data"
import { SlideNavigation, SlideData } from "@/components/ui/slide-navigation"

export default function EssayGuidePage({ params }: { params: Promise<{ textId: string }> }) {
  const { textId } = use(params)
  const [text, setText] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)
        const bookData = await getBookData(textId)
        setText(bookData)
      } catch (error) {
        console.error('Error fetching book data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [textId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!text || text.title === "Book Not Found") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <p className="text-muted-foreground">
            The book you are looking for does not exist or is not yet available.
          </p>
          <Link href="/knowledge-bank/text-mastery" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Go Back
          </Link>
        </div>
      </div>
    )
  }

  // Check if essay guide content is available
  const hasEssayGuideContent = () => {
    if (!text.essayGuide) return false
    return (
      (text.essayGuide.structure?.parts?.length > 0) ||
      (text.essayGuide.techniques?.categories?.length > 0) ||
      (text.essayGuide.mistakes?.dontDo?.length > 0) ||
      (text.essayGuide.sampleQuestion?.question?.length > 0) ||
      (text.essayGuide.tips?.phases?.length > 0)
    )
  }

  if (!hasEssayGuideContent()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Content Not Available</h1>
          <p className="text-muted-foreground mb-4">
            Essay writing guide for this text is currently being prepared. Please check back soon.
          </p>
          <Link 
            href={`/knowledge-bank/text-mastery/${textId}`} 
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Back to {text.title}
          </Link>
        </div>
      </div>
    )
  }

  // Convert essay guide sections to slides
  const slides: SlideData[] = [
    // Structure slide
    {
      id: 'structure',
      title: text.essayGuide.structure.title,
      badge: 'Guide 1',
      content: (
        <div className="space-y-6">
          {text.essayGuide.structure.parts.map((part, partIndex) => (
            <div key={partIndex} className="border-l-2 border-purple-200 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                {part.title} {part.wordCount && <span className="text-sm font-normal text-gray-600">({part.wordCount})</span>}
              </h3>
              <div className="space-y-3">
                {part.content.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {part.example && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong className="text-purple-700">Example Opening:</strong> {part.example}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Techniques slide
    {
      id: 'techniques',
      title: text.essayGuide.techniques.title,
      badge: 'Guide 2',
      content: (
        <div className="space-y-6">
          {text.essayGuide.techniques.categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">{category.title}</h3>
              <div className="space-y-3">
                {category.techniques.map((technique, techniqueIndex) => (
                  <div key={techniqueIndex} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">
                      <strong className="text-purple-600">{technique.name}:</strong> {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Common Mistakes slide
    {
      id: 'mistakes',
      title: text.essayGuide.mistakes.title,
      badge: 'Guide 3',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-red-600">Don't Do This:</h3>
            <div className="space-y-2">
              {text.essayGuide.mistakes.dontDo.map((mistake, index) => (
                <div key={index} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                  <p className="text-red-800">{mistake}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-600">Do This Instead:</h3>
            <div className="space-y-2">
              {text.essayGuide.mistakes.doInstead.map((advice, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <p className="text-green-800">{advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Sample Question slide
    {
      id: 'sample-question',
      title: text.essayGuide.sampleQuestion.title,
      badge: 'Guide 4',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <p className="text-lg font-medium text-purple-800 mb-4">
              {text.essayGuide.sampleQuestion.question}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Approach this question by:</h3>
            <div className="space-y-2">
              {text.essayGuide.sampleQuestion.approach.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Tips slide
    {
      id: 'tips',
      title: text.essayGuide.tips.title,
      badge: 'Guide 5',
      content: (
        <div className="space-y-6">
          {text.essayGuide.tips.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex}>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">{phase.title}:</h3>
              <div className="space-y-2">
                {phase.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ]

  return (
    <SlideNavigation
      slides={slides}
      title="Essay Writing Guide"
      subtitle={text.title}
      headerColor="purple"
      backLink={{
        href: `/knowledge-bank/text-mastery/${textId}`,
        text: `Back to ${text?.title || 'Text'}`
      }}
    />
  )
}
