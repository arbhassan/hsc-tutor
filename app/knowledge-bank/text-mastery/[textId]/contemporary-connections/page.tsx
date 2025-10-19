"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { getBookData, BookData } from "@/lib/data/book-data"
import { SlideNavigation, SlideData } from "@/components/ui/slide-navigation"

export default function ContemporaryConnectionsPage({ params }: { params: Promise<{ textId: string }> }) {
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

  // Check if contemporary connections content is available
  if (!text.detailedContemporaryConnections || !text.detailedContemporaryConnections.sections || text.detailedContemporaryConnections.sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Content Not Available</h1>
          <p className="text-muted-foreground mb-4">
            Contemporary connections for this text are currently being prepared. Please check back soon.
          </p>
          <Link 
            href={`/knowledge-bank/text-mastery/${textId}`} 
            className="inline-block px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Back to {text.title}
          </Link>
        </div>
      </div>
    )
  }

  // Convert contemporary connections sections to slides
  const slides: SlideData[] = text.detailedContemporaryConnections.sections.map((section, sectionIndex) => ({
    id: `section-${sectionIndex}`,
    title: section.title,
    badge: `Connection ${sectionIndex + 1}`,
    content: (
      <div className="space-y-6">
        {section.subsections.map((subsection, subsectionIndex) => (
          <div key={subsectionIndex}>
            <h3 className="text-xl font-semibold mb-3 text-teal-700">{subsection.title}</h3>
            <div className="space-y-4">
              {subsection.content.map((paragraph, paragraphIndex) => (
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
      title="Contemporary Connections"
      subtitle={text.title}
      headerColor="teal"
      backLink={{
        href: `/knowledge-bank/text-mastery/${textId}`,
        text: `Back to ${text.title}`
      }}
    />
  )
}
