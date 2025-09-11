"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { getBookData, BookData } from "@/lib/data/book-data"
import { SlideNavigation, SlideData } from "@/components/ui/slide-navigation"

export default function ContextPage({ params }: { params: Promise<{ textId: string }> }) {
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

  // Convert detailedContexts to slides
  const slides: SlideData[] = Object.entries(text.detailedContexts).map(([key, context], index) => ({
    id: key,
    title: context.title,
    badge: `Context ${index + 1}`,
    content: (
      <div className="space-y-6">
        {context.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{section.title}</h3>
            )}
            <div className="space-y-4">
              {section.content.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }))

  return (
    <SlideNavigation
      slides={slides}
      title="Context Analysis"
      subtitle={text.title}
      headerColor="blue"
      backLink={{
        href: `/knowledge-bank/text-mastery/${textId}`,
        text: `Back to ${text.title}`
      }}
    />
  )
} 