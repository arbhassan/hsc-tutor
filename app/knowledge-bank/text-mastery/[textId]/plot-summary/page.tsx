"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use, useEffect, useState } from "react"
import { getBookData, BookData } from "@/lib/data/book-data"

export default function PlotSummaryPage({ params }: { params: Promise<{ textId: string }> }) {
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
          <Link href="/knowledge-bank/text-mastery" className="mt-4 inline-block">
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
            Back to {text.title}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Plot Summary and Analysis</h1>

        <div className="space-y-12">
          {text.plotSummary.parts.map((part, partIndex) => (
            <section key={partIndex}>
              <h2 className="text-2xl font-bold text-orange-700 mb-6">{part.title}</h2>
              {part.description && (
                <p className="text-gray-600 mb-6 italic">{part.description}</p>
              )}

              <div className="space-y-8">
                {part.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex}>
                    <h3 className="text-xl font-semibold mb-3">{chapter.title}</h3>
                    <p className="text-gray-700 mb-3">
                      {chapter.summary}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Significance:</strong> {chapter.significance}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
