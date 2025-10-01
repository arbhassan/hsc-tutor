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

  // Group contexts by type and create subsections
  const slides: SlideData[] = (() => {
    // Handle both array (Supabase) and object (static data) structures
    let contexts: any[] = []
    
    if (Array.isArray(text.detailedContexts)) {
      // Supabase data structure - array of contexts
      contexts = text.detailedContexts
    } else {
      // Static data structure - object with fixed keys
      contexts = Object.entries(text.detailedContexts).map(([key, context]) => ({
        id: key,
        contextType: key,
        title: context.title,
        sections: context.sections
      }))
    }

    // Group contexts by contextType
    const groupedContexts = contexts.reduce((acc: Record<string, any[]>, context) => {
      const type = context.contextType || 'general'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(context)
      return acc
    }, {})

    // Convert grouped contexts to slides with subsections
    return Object.entries(groupedContexts).map(([contextType, contextGroup]) => {
      // Format the main section title (e.g., "historical" -> "Historical Context")
      const mainTitle = contextType.charAt(0).toUpperCase() + contextType.slice(1) + " Context"

      // Create subsections for each context in the group
      const subsections = contextGroup.map((context) => ({
        id: context.id || `${contextType}-${context.title}`,
        title: context.title,
        content: (
          <div className="space-y-6">
            <div className="space-y-4">
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
          </div>
        )
      }))

      return {
        id: contextType,
        title: mainTitle,
        content: null, // Not used for grouped sections
        subsections
      }
    })
  })()

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