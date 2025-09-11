"use client"

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { getBookData, BookData } from "@/lib/data/book-data"
import { SlideNavigation, SlideData } from "@/components/ui/slide-navigation"

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

  // Convert plot summary parts to slides
  const slides: SlideData[] = text.plotSummary.parts.map((part, partIndex) => ({
    id: `part-${partIndex}`,
    title: part.title,
    badge: `Part ${partIndex + 1}`,
    content: (
      <div className="space-y-6">
        {part.description && (
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
            <p className="text-orange-800 italic">{part.description}</p>
          </div>
        )}

        <div className="space-y-8">
          {part.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border-l-2 border-orange-200 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-700">{chapter.title}</h3>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  {chapter.summary}
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong className="text-orange-600">Significance:</strong> {chapter.significance}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }))

  return (
    <SlideNavigation
      slides={slides}
      title="Plot Summary and Analysis"
      subtitle={text.title}
      headerColor="orange"
      backLink={{
        href: `/knowledge-bank/text-mastery/${textId}`,
        text: `Back to ${text.title}`
      }}
    />
  )
}
