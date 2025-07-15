"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Quote,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  BookText,
  Users,
  Clock,
  Target,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getBookData } from "@/lib/data/book-data"

const getText = (textId: string) => {
  return getBookData(textId)
}

export default function CoreThemes({ params }: { params: Promise<{ textId: string }> }) {
  const { textId } = use(params)
  const text = getText(textId)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  if (!text || text.title === "Book Not Found") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <p className="text-muted-foreground">
            The book you are looking for does not exist or is not yet available.
          </p>
          <Button asChild className="mt-4">
            <Link href="/knowledge-bank/text-mastery">Go Back</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Filter themes based on search query
  const filteredThemes = text.themes.filter(theme =>
    theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get quotes related to selected theme
  const getQuotesForTheme = (themeTitle: string) => {
    return text.quotes.filter(quote => quote.themes.includes(themeTitle))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href={`/knowledge-bank/text-mastery/${textId}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} />
              <span>Back to {text.title}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                {text.themes.length} Themes
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Page header */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Core Themes</h1>
          <p className="text-xl text-gray-800 mb-4">{text.title}</p>
          <p className="max-w-3xl mx-auto text-gray-800 leading-relaxed">
            Explore the fundamental themes that drive the narrative and character development in {text.title}. 
            Each theme is analyzed with detailed explanations, textual evidence, and connections to the broader 
            human experience.
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={18} />
                Search Themes
              </CardTitle>
              <CardDescription>
                Find specific themes or concepts within the text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search themes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Themes overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Thematic Overview</CardTitle>
              <CardDescription>
                A comprehensive look at how themes interconnect and develop throughout the text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTheme === theme.title
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTheme(selectedTheme === theme.title ? null : theme.title)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="mr-2 text-2xl">
                        {theme.icon === "shield" && "🛡️"}
                        {theme.icon === "speech" && "💬"}
                        {theme.icon === "eye" && "👁️"}
                        {theme.icon === "heart" && "❤️"}
                        {theme.icon === "book" && "📚"}
                      </div>
                      <h3 className="font-semibold text-lg">{theme.title}</h3>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{theme.summary}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {getQuotesForTheme(theme.title).length} quotes
                      </Badge>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        selectedTheme === theme.title ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed theme analysis */}
        <div className="space-y-8">
          {filteredThemes.map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <CardHeader className={`${theme.color} text-gray-900`}>
                <CardTitle className="flex items-center text-2xl">
                  <div className="mr-3 text-3xl">
                    {theme.icon === "shield" && "🛡️"}
                    {theme.icon === "speech" && "💬"}
                    {theme.icon === "eye" && "👁️"}
                    {theme.icon === "heart" && "❤️"}
                    {theme.icon === "book" && "📚"}
                  </div>
                  {theme.title}
                </CardTitle>
                <CardDescription className="text-gray-900 text-lg">
                  {theme.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analysis" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <BookText className="h-5 w-5" />
                          Detailed Analysis
                        </h4>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-800 leading-relaxed mb-4">
                            {theme.summary}
                          </p>
                          <p className="text-gray-800 leading-relaxed">
                            This theme manifests throughout the text through various literary devices and character 
                            interactions. The author uses this theme to explore fundamental questions about human nature, 
                            society, and the individual's place within larger systems of power and meaning.
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Thematic Development
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="p-4">
                            <h5 className="font-medium mb-2">Beginning</h5>
                            <p className="text-sm text-gray-800">
                              The theme is introduced through initial character interactions and establishing circumstances.
                            </p>
                          </Card>
                          <Card className="p-4">
                            <h5 className="font-medium mb-2">Development</h5>
                            <p className="text-sm text-gray-800">
                              The theme deepens through conflict, character growth, and increasingly complex situations.
                            </p>
                          </Card>
                          <Card className="p-4">
                            <h5 className="font-medium mb-2">Resolution</h5>
                            <p className="text-sm text-gray-800">
                              The theme reaches its culmination, often with profound implications for understanding.
                            </p>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Key Examples
                      </h4>
                      <div className="space-y-3">
                        {theme.examples.map((example, idx) => (
                          <Card key={idx} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800">{example}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quotes" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Quote className="h-5 w-5" />
                        Related Quotes
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getQuotesForTheme(theme.title).slice(0, 6).map((quote) => (
                          <Card key={quote.id} className="p-4">
                            <blockquote className="text-sm italic mb-2">
                              "{quote.text.length > 100 ? `${quote.text.substring(0, 100)}...` : quote.text}"
                            </blockquote>
                            <div className="flex justify-between items-center text-xs text-gray-700">
                              <span>{quote.chapter} - {quote.character}</span>
                              <Badge variant="outline" className="text-xs">
                                {quote.technique}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                      {getQuotesForTheme(theme.title).length > 6 && (
                        <div className="text-center">
                          <Button variant="outline" size="sm">
                            View All {getQuotesForTheme(theme.title).length} Quotes
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="connections" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Thematic Connections
                      </h4>
                      <div className="space-y-3">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Historical Context</h5>
                          <p className="text-sm text-gray-800">
                            This theme reflects the historical period in which the text was written, 
                            addressing contemporary social issues and concerns.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Universal Relevance</h5>
                          <p className="text-sm text-gray-800">
                            The theme transcends its original context to address timeless human experiences 
                            that remain relevant to modern readers.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Literary Tradition</h5>
                          <p className="text-sm text-gray-800">
                            This theme connects to broader literary traditions and influences, 
                            showing how the author engages with established literary conventions.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
} 