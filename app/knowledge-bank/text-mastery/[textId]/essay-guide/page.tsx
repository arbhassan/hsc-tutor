"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use, useEffect, useState } from "react"
import { getBookData, BookData } from "@/lib/data/book-data"

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

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-6">
          <Link href={`/knowledge-bank/text-mastery/${textId}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to {text?.title || 'Text'}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Essay Writing Guide</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{text.essayGuide.structure.title}</h2>
            <div className="prose prose-lg max-w-none">
              {text.essayGuide.structure.parts.map((part, partIndex) => (
                <div key={partIndex}>
                  <h3 className="text-xl font-semibold mb-3">
                    {part.title} {part.wordCount && `(${part.wordCount})`}
                  </h3>
                  {part.content.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>
                      {paragraph}
                    </p>
                  ))}
                  {part.example && (
                    <p>
                      <strong>Example Opening:</strong> {part.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{text.essayGuide.techniques.title}</h2>
            <div className="prose prose-lg max-w-none">
              {text.essayGuide.techniques.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  {category.techniques.map((technique, techniqueIndex) => (
                    <p key={techniqueIndex}>
                      <strong>{technique.name}:</strong> {technique.description}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{text.essayGuide.mistakes.title}</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-3">Don't Do This:</h3>
              <ul>
                {text.essayGuide.mistakes.dontDo.map((mistake, index) => (
                  <li key={index}>{mistake}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Do This Instead:</h3>
              <ul>
                {text.essayGuide.mistakes.doInstead.map((advice, index) => (
                  <li key={index}>{advice}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{text.essayGuide.sampleQuestion.title}</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg font-medium mb-4">
                {text.essayGuide.sampleQuestion.question}
              </p>

              <h3 className="text-xl font-semibold mb-3">Approach this question by:</h3>
              <ul>
                {text.essayGuide.sampleQuestion.approach.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{text.essayGuide.tips.title}</h2>
            <div className="prose prose-lg max-w-none">
              {text.essayGuide.tips.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex}>
                  <h3 className="text-xl font-semibold mb-3">{phase.title}:</h3>
                  <ul>
                    {phase.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
