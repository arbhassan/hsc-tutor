"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Download,
  BookOpen,
  Quote,
  Search,
  Filter,
  Copy,
  Star,
  StarIcon as StarFilled,
  SlidersHorizontal,
  FileDown,
  BookText,
  Bookmark,
  Clock,
  Globe,
  User,
  BookOpenCheck,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Heart,
  X,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { getBookData } from "@/lib/data/book-data"

// Get text data from the centralized book data file
const getText = (textId: string) => {
  return getBookData(textId)
}

export default function TextExplore({ params }: { params: Promise<{ textId: string }> }) {
  const [activeTab, setActiveTab] = useState("context")
  const { textId } = use(params)
  const text = getText(textId)

  // Quote Bank state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("theme")
  const [favoriteQuotes, setFavoriteQuotes] = useState<string[]>([])
  const [selectedQuoteForDetails, setSelectedQuoteForDetails] = useState<any>(null)
  const [showQuoteDetails, setShowQuoteDetails] = useState(false)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites-${textId}`)
    if (savedFavorites) {
      setFavoriteQuotes(JSON.parse(savedFavorites))
    }
  }, [textId])

  // Save favorites to localStorage whenever favoriteQuotes changes
  useEffect(() => {
    localStorage.setItem(`favorites-${textId}`, JSON.stringify(favoriteQuotes))
  }, [favoriteQuotes, textId])

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

  // Extract unique values for filters
  const chapters = Array.from(new Set(text.quotes.map((q) => q.chapter)))
  const characters = Array.from(new Set(text.quotes.map((q) => q.character)))

  // Filter quotes based on search and filters
  const filteredQuotes = text.quotes.filter((quote) => {
    // Search query filter
    if (searchQuery && !quote.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Theme filter
    if (selectedThemes.length > 0 && !quote.themes.some((theme) => selectedThemes.includes(theme))) {
      return false
    }

    // Technique filter
    if (selectedTechniques.length > 0 && !selectedTechniques.includes(quote.technique)) {
      return false
    }

    // Chapter filter
    if (selectedChapters.length > 0 && !selectedChapters.includes(quote.chapter)) {
      return false
    }

    // Character filter
    if (selectedCharacters.length > 0 && !selectedCharacters.includes(quote.character)) {
      return false
    }

    return true
  })

  // Get favorite quotes
  const favoriteQuoteObjects = text.quotes.filter(quote => favoriteQuotes.includes(quote.id))

  // Sort quotes based on selected option
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    switch (sortOption) {
      case "theme":
        return a.themes[0].localeCompare(b.themes[0])
      case "chapter":
        return a.chapter.localeCompare(b.chapter)
      case "significance":
        const significanceOrder = { high: 0, medium: 1, low: 2 }
        return (
          significanceOrder[a.significance as keyof typeof significanceOrder] -
          significanceOrder[b.significance as keyof typeof significanceOrder]
        )
      case "length":
        return a.text.length - b.text.length
      default:
        return 0
    }
  })

  // Group quotes by theme for theme-based display
  const quotesByTheme = sortedQuotes.reduce(
    (acc, quote) => {
      quote.themes.forEach((theme) => {
        if (!acc[theme]) {
          acc[theme] = []
        }
        if (!acc[theme].includes(quote)) {
          acc[theme].push(quote)
        }
      })
      return acc
    },
    {} as Record<string, typeof text.quotes>,
  )

  // Toggle favorite status
  const toggleFavorite = (quoteId: string) => {
    setFavoriteQuotes((prev) => {
      const newFavorites = prev.includes(quoteId) 
        ? prev.filter((id) => id !== quoteId) 
        : [...prev, quoteId]
      
      // Show toast notification
      const isAdding = !prev.includes(quoteId)
      toast({
        title: isAdding ? "Added to favorites" : "Removed from favorites",
        description: isAdding ? "Quote saved to your favorites." : "Quote removed from your favorites.",
        duration: 3000,
      })
      
      return newFavorites
    })
  }

  // Show quote details
  const showQuoteDetailsModal = (quote: any) => {
    setSelectedQuoteForDetails(quote)
    setShowQuoteDetails(true)
  }

  // Handle theme checkbox change
  const handleThemeChange = (theme: string) => {
    setSelectedThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]))
  }

  // Handle technique checkbox change
  const handleTechniqueChange = (technique: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(technique) ? prev.filter((t) => t !== technique) : [...prev, technique],
    )
  }

  // Handle chapter checkbox change
  const handleChapterChange = (chapter: string) => {
    setSelectedChapters((prev) => (prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]))
  }

  // Handle character checkbox change
  const handleCharacterChange = (character: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(character) ? prev.filter((c) => c !== character) : [...prev, character],
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedThemes([])
    setSelectedTechniques([])
    setSelectedChapters([])
    setSelectedCharacters([])
    setSortOption("theme")
  }

  // Remove exportQuotes function

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/knowledge-bank/text-mastery"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} />
              <span>Back to Text Mastery Hub</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Text header with cover image */}
        <div className="flex flex-col items-center gap-6 py-8 mt-4 text-center md:flex-row md:text-left md:gap-8">
          <div className="relative flex-shrink-0 overflow-hidden rounded-md shadow-md w-36 h-52 md:w-44 md:h-64">
            <Image
              src={text.coverImage || "/placeholder.svg?height=400&width=300&query=book%20cover"}
              alt={`Cover of ${text.title}`}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className="mb-2 text-xs font-medium">
              {text.genre} • {text.publicationYear}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{text.title}</h1>
            <p className="text-xl text-gray-600">{text.author}</p>
            <p className="max-w-2xl mt-3 text-gray-700">{text.introduction}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {text.themes.slice(0, 3).map((theme) => (
                <Badge key={theme.id} variant="secondary" className="text-xs">
                  {theme.title}
                </Badge>
              ))}
              {text.themes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{text.themes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs defaultValue="context" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="context" className="flex gap-2 items-center">
              <BookOpen size={18} />
              <span>Context and Summary</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex gap-2 items-center">
              <Quote size={18} />
              <span>Quote Bank</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex gap-2 items-center">
              <Heart size={18} />
              <span>Favorites ({favoriteQuotes.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="context" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Table of Contents</CardTitle>
                <CardDescription>Navigate to different sections of the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    asChild
                  >
                    <Link href={`/knowledge-bank/text-mastery/${textId}/core-themes`}>
                      <BookOpenCheck className="mr-2 h-4 w-4" />
                      Core Themes
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    asChild
                  >
                    <Link href={`/knowledge-bank/text-mastery/${textId}/hsc-rubric-connections`}>
                      <BookText className="mr-2 h-4 w-4" />
                      HSC Rubric Connections
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    asChild
                  >
                    <Link href={`/knowledge-bank/text-mastery/${textId}/context-information`}>
                      <Globe className="mr-2 h-4 w-4" />
                      Context Information
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() =>
                      document.getElementById("contemporary-connections")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Contemporary Connections
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() =>
                      document.getElementById("additional-resources")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Additional Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Core Themes Section */}
            <section id="core-themes" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Core Themes</h2>

              <div className="space-y-4">
                {text.themes.map((theme) => (
                  <Accordion key={theme.id} type="single" collapsible className="w-full">
                    <AccordionItem value={theme.id}>
                      <AccordionTrigger className={`p-4 rounded-t-lg ${theme.color}`}>
                        <div className="flex items-center">
                          <div className="mr-2 text-xl">
                            {theme.icon === "shield" && "🛡️"}
                            {theme.icon === "speech" && "💬"}
                            {theme.icon === "eye" && "👁️"}
                            {theme.icon === "heart" && "❤️"}
                            {theme.icon === "book" && "📚"}
                          </div>
                          <span className="text-lg font-medium">{theme.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 border border-t-0 rounded-b-lg">
                        <p className="mb-4 text-gray-700">{theme.summary}</p>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Key Examples:</h4>
                          <ul className="space-y-1 list-disc pl-5">
                            {theme.examples.map((example, idx) => (
                              <li key={idx} className="text-gray-700">
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </section>

            {/* HSC Rubric Connections */}
            <section id="rubric-connections" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">HSC Rubric Connections</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Common Module: Texts and Human Experiences</CardTitle>
                  <CardDescription>How this text addresses key rubric requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {text.rubricConnections.map((connection, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-lg mb-2">{connection.concept}</h3>
                        <p className="text-gray-700 mb-3">{connection.explanation}</p>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-gray-600 mb-1">Textual Evidence:</h4>
                          <p className="text-sm">{connection.textConnections}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Context Information */}
            <section id="contexts" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Context Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      {text.contexts.historical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.historical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.historical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      {text.contexts.biographical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.biographical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.biographical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center">
                      <BookText className="mr-2 h-5 w-5" />
                      {text.contexts.cultural.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.cultural.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.cultural.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      {text.contexts.philosophical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.philosophical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.philosophical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Timeline */}
            <section id="timeline" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Timeline</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                    {/* Timeline events */}
                    <div className="space-y-8">
                      {text.timelineEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`relative flex items-center ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                        >
                          <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                            <Badge
                              variant={
                                event.type === "Author"
                                  ? "outline"
                                  : event.type === "World"
                                    ? "secondary"
                                    : event.type === "Book"
                                      ? "default"
                                      : "outline"
                              }
                            >
                              {event.type}
                            </Badge>
                            <h3 className="font-medium mt-1">{event.year}</h3>
                            <p className="text-gray-700">{event.event}</p>
                          </div>

                          {/* Timeline dot */}
                          <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2"></div>

                          {/* Mobile and right side content */}
                          <div className={`md:w-1/2 ${idx % 2 === 0 ? "md:pl-8 pl-6" : "md:pr-8 pl-6"} md:mt-0`}>
                            <div className="md:hidden">
                              <Badge
                                variant={
                                  event.type === "Author"
                                    ? "outline"
                                    : event.type === "World"
                                      ? "secondary"
                                      : event.type === "Book"
                                        ? "default"
                                        : "outline"
                                }
                              >
                                {event.type}
                              </Badge>
                              <h3 className="font-medium mt-1">{event.year}</h3>
                            </div>
                            <p className={`${idx % 2 === 0 ? "" : ""} md:hidden`}>{event.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contemporary Connections */}
            <section id="contemporary-connections" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Contemporary Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {text.contemporaryConnections.map((connection, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{connection.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{connection.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Modern Example:</h4>
                        <p className="text-sm">{connection.modernExample}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Additional Resources */}
            <section id="additional-resources" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Reading and Resources</CardTitle>
                  <CardDescription>Deepen your understanding with these carefully selected materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {text.additionalResources.map((resource, idx) => (
                      <div key={idx} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className="bg-gray-100 p-2 rounded-md mr-4">
                          {resource.type === "Book" && <BookOpen className="h-5 w-5 text-blue-600" />}
                          {resource.type === "Essay" && <FileDown className="h-5 w-5 text-green-600" />}
                          {resource.type === "Academic Resource" && <BookText className="h-5 w-5 text-amber-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-gray-600">{resource.author}</p>
                          <p className="text-sm text-gray-700 mt-1">{resource.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete Resource List (PDF)
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="quotes" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Sidebar with filters */}
              <div className="lg:col-span-1">
                <div className="sticky space-y-6 top-24">
                  {/* Search */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Search size={18} />
                        Search Quotes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Search by text..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
                            Reset Filters
                          </Button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Filter size={14} className="mr-1" />
                                Advanced Filters
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                {/* Theme filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Themes</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.themes.map((theme) => (
                                      <div key={theme.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`theme-${theme.id}`}
                                          checked={selectedThemes.includes(theme.title)}
                                          onCheckedChange={() => handleThemeChange(theme.title)}
                                        />
                                        <Label htmlFor={`theme-${theme.id}`} className="text-sm">
                                          {theme.title}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Technique filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Techniques</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.techniques.map((technique) => (
                                      <div key={technique.name} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`technique-${technique.name}`}
                                          checked={selectedTechniques.includes(technique.name)}
                                          onCheckedChange={() => handleTechniqueChange(technique.name)}
                                        />
                                        <Label htmlFor={`technique-${technique.name}`} className="text-sm">
                                          {technique.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Chapter filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Chapters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {chapters.map((chapter) => (
                                      <div key={chapter} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`chapter-${chapter}`}
                                          checked={selectedChapters.includes(chapter)}
                                          onCheckedChange={() => handleChapterChange(chapter)}
                                        />
                                        <Label htmlFor={`chapter-${chapter}`} className="text-sm">
                                          {chapter}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Character filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Characters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {characters.map((character) => (
                                      <div key={character} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`character-${character}`}
                                          checked={selectedCharacters.includes(character)}
                                          onCheckedChange={() => handleCharacterChange(character)}
                                        />
                                        <Label htmlFor={`character-${character}`} className="text-sm">
                                          {character}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sort options */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        Sort Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sort-select" className="text-sm">
                            Sort By:
                          </Label>
                          <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="theme">Theme</SelectItem>
                              <SelectItem value="chapter">Chapter</SelectItem>
                              <SelectItem value="significance">Significance</SelectItem>
                              <SelectItem value="length">Length</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main content area with quote cards */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {Object.keys(quotesByTheme).length > 0
                      ? `Filtered Quotes (${sortedQuotes.length} found)`
                      : "All Quotes"}
                  </h2>
                </div>

                {Object.keys(quotesByTheme).length === 0 ? (
                  <Card className="p-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-gray-600">No quotes match your current filter criteria.</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(quotesByTheme).map(([theme, quotes]) => (
                      <div key={theme} className="space-y-3">
                        <h3 className="text-xl font-semibold">{theme}</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {quotes.map((quote) => (
                            <Card key={quote.id}>
                              <CardHeader>
                                <CardTitle className="text-base font-medium">
                                  {quote.text.length > 100 ? `${quote.text.substring(0, 100)}...` : quote.text}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                  {quote.chapter} - {quote.character}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="text-sm">
                                <p className="text-gray-700">{quote.explanation.substring(0, 150)}...</p>
                                <Separator className="my-2" />
                                <p className="text-gray-600">
                                  <span className="font-medium">Technique:</span> {quote.technique}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {quote.themes.map((theme) => (
                                    <Badge key={theme} variant="secondary" className="text-xs">
                                      {theme}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter className="flex items-center justify-between">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                                        {favoriteQuotes.includes(quote.id) ? (
                                          <StarFilled className="h-4 w-4 text-yellow-500" />
                                        ) : (
                                          <Star className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {favoriteQuotes.includes(quote.id) ? "Remove from favorites" : "Add to favorites"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <Button variant="ghost" size="icon" onClick={() => showQuoteDetailsModal(quote)}>
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Sidebar with filters */}
              <div className="lg:col-span-1">
                <div className="sticky space-y-6 top-24">
                  {/* Search */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Search size={18} />
                        Search Quotes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Search by text..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
                            Reset Filters
                          </Button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Filter size={14} className="mr-1" />
                                Advanced Filters
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                {/* Theme filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Themes</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.themes.map((theme) => (
                                      <div key={theme.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`theme-${theme.id}`}
                                          checked={selectedThemes.includes(theme.title)}
                                          onCheckedChange={() => handleThemeChange(theme.title)}
                                        />
                                        <Label htmlFor={`theme-${theme.id}`} className="text-sm">
                                          {theme.title}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Technique filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Techniques</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.techniques.map((technique) => (
                                      <div key={technique.name} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`technique-${technique.name}`}
                                          checked={selectedTechniques.includes(technique.name)}
                                          onCheckedChange={() => handleTechniqueChange(technique.name)}
                                        />
                                        <Label htmlFor={`technique-${technique.name}`} className="text-sm">
                                          {technique.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Chapter filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Chapters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {chapters.map((chapter) => (
                                      <div key={chapter} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`chapter-${chapter}`}
                                          checked={selectedChapters.includes(chapter)}
                                          onCheckedChange={() => handleChapterChange(chapter)}
                                        />
                                        <Label htmlFor={`chapter-${chapter}`} className="text-sm">
                                          {chapter}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Character filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Characters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {characters.map((character) => (
                                      <div key={character} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`character-${character}`}
                                          checked={selectedCharacters.includes(character)}
                                          onCheckedChange={() => handleCharacterChange(character)}
                                        />
                                        <Label htmlFor={`character-${character}`} className="text-sm">
                                          {character}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sort options */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        Sort Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sort-select" className="text-sm">
                            Sort By:
                          </Label>
                          <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="theme">Theme</SelectItem>
                              <SelectItem value="chapter">Chapter</SelectItem>
                              <SelectItem value="significance">Significance</SelectItem>
                              <SelectItem value="length">Length</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main content area with quote cards */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {favoriteQuoteObjects.length > 0
                      ? `Favorites (${favoriteQuoteObjects.length})`
                      : "No Favorites Yet"}
                  </h2>
                </div>

                {favoriteQuoteObjects.length === 0 ? (
                  <Card className="p-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-gray-600">You haven't saved any quotes to your favorites yet.</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {favoriteQuoteObjects.map((quote) => (
                      <Card key={quote.id}>
                        <CardHeader>
                          <CardTitle className="text-base font-medium">
                            {quote.text.length > 100 ? `${quote.text.substring(0, 100)}...` : quote.text}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            {quote.chapter} - {quote.character}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p className="text-gray-700">{quote.explanation.substring(0, 150)}...</p>
                          <Separator className="my-2" />
                          <p className="text-gray-600">
                            <span className="font-medium">Technique:</span> {quote.technique}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quote.themes.map((theme) => (
                              <Badge key={theme} variant="secondary" className="text-xs">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                                                 <CardFooter className="flex items-center justify-between">
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                                   {favoriteQuotes.includes(quote.id) ? (
                                     <StarFilled className="h-4 w-4 text-yellow-500" />
                                   ) : (
                                     <Star className="h-4 w-4" />
                                   )}
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>
                                 {favoriteQuotes.includes(quote.id) ? "Remove from favorites" : "Add to favorites"}
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                           <Button variant="ghost" size="icon" onClick={() => showQuoteDetailsModal(quote)}>
                             <ChevronRight className="h-4 w-4" />
                           </Button>
                         </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Quote Details Modal */}
      <Dialog open={showQuoteDetails} onOpenChange={setShowQuoteDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              Quote Details
            </DialogTitle>
          </DialogHeader>
          {selectedQuoteForDetails && (
            <div className="space-y-6">
              {/* Quote Text */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <blockquote className="text-lg italic leading-relaxed">
                  "{selectedQuoteForDetails.text}"
                </blockquote>
              </div>

              {/* Quote Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Chapter</h4>
                  <p className="text-sm">{selectedQuoteForDetails.chapter}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Character</h4>
                  <p className="text-sm">{selectedQuoteForDetails.character}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Literary Technique</h4>
                  <p className="text-sm">{selectedQuoteForDetails.technique}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Significance</h4>
                  <Badge variant={selectedQuoteForDetails.significance === 'high' ? 'default' : selectedQuoteForDetails.significance === 'medium' ? 'secondary' : 'outline'}>
                    {selectedQuoteForDetails.significance}
                  </Badge>
                </div>
              </div>

              {/* Themes */}
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedQuoteForDetails.themes.map((theme: string) => (
                    <Badge key={theme} variant="secondary" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Analysis</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedQuoteForDetails.explanation}</p>
              </div>

              {/* Page Reference */}
              {selectedQuoteForDetails.pageReference && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-1">Page Reference</h4>
                  <p className="text-sm">{selectedQuoteForDetails.pageReference}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(selectedQuoteForDetails.id)}
                  className="flex items-center gap-2"
                >
                  {favoriteQuotes.includes(selectedQuoteForDetails.id) ? (
                    <StarFilled className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                  {favoriteQuotes.includes(selectedQuoteForDetails.id) ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedQuoteForDetails.text)
                    toast({
                      title: "Quote copied",
                      description: "The quote has been copied to your clipboard.",
                      duration: 3000,
                    })
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Quote
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
