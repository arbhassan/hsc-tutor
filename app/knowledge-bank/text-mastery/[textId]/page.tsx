"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
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
  Check,
  FileText,
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
import { getBookData, BookData } from "@/lib/data/book-data"

export default function TextExplore({ params }: { params: Promise<{ textId: string }> }) {
  const [activeTab, setActiveTab] = useState("context")
  const { textId } = use(params)
  const [text, setText] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)

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
  const [isCopied, setIsCopied] = useState(false)

  // Load book data on mount
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book content...</p>
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
          <Button asChild className="mt-4">
            <Link href="/knowledge-bank/text-mastery">Go Back</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Helper functions to check if sections have content
  const hasContextContent = () => {
    if (!text.detailedContexts) return false
    
    // Handle both array (Supabase) and object (static data) structures
    if (Array.isArray(text.detailedContexts)) {
      // Supabase data structure - array of contexts
      return text.detailedContexts.some(context => 
        context.sections && context.sections.length > 0 && 
        context.sections.some(s => s.content && s.content.length > 0)
      )
    } else {
      // Static data structure - object with fixed keys
      return (
        (text.detailedContexts.historical?.sections?.length > 0 && 
         text.detailedContexts.historical.sections.some(s => s.content?.length > 0)) ||
        (text.detailedContexts.political?.sections?.length > 0 && 
         text.detailedContexts.political.sections.some(s => s.content?.length > 0)) ||
        (text.detailedContexts.biographical?.sections?.length > 0 && 
         text.detailedContexts.biographical.sections.some(s => s.content?.length > 0)) ||
        (text.detailedContexts.philosophical?.sections?.length > 0 && 
         text.detailedContexts.philosophical.sections.some(s => s.content?.length > 0))
      )
    }
  }

  const hasRubricContent = () => {
    return text.detailedRubricConnections && (
      (text.detailedRubricConnections.anomaliesAndParadoxes?.subsections?.length > 0) ||
      (text.detailedRubricConnections.emotionalExperiences?.subsections?.length > 0) ||
      (text.detailedRubricConnections.relationships?.subsections?.length > 0) ||
      (text.detailedRubricConnections.humanCapacityForUnderstanding?.subsections?.length > 0)
    )
  }

  const hasPlotSummaryContent = () => {
    return text.plotSummary?.parts?.length > 0
  }

  const hasContemporaryConnectionsContent = () => {
    return text.detailedContemporaryConnections?.sections?.length > 0
  }

  const hasEssayGuideContent = () => {
    return text.essayGuide && (
      (text.essayGuide.structure?.parts?.length > 0) ||
      (text.essayGuide.techniques?.categories?.length > 0) ||
      (text.essayGuide.mistakes?.dontDo?.length > 0) ||
      (text.essayGuide.sampleQuestion?.question?.length > 0) ||
      (text.essayGuide.tips?.phases?.length > 0)
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
    if (selectedThemes.length > 0 && !(quote.themes || []).some((theme) => selectedThemes.includes(theme))) {
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
        const aTheme = a.themes && a.themes.length > 0 ? a.themes[0] : ""
        const bTheme = b.themes && b.themes.length > 0 ? b.themes[0] : ""
        return aTheme.localeCompare(bTheme)
      case "chapter":
        return (a.chapter || "").localeCompare(b.chapter || "")
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
      const themes = quote.themes && quote.themes.length > 0 ? quote.themes : ["Uncategorized"]
      themes.forEach((theme) => {
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
              <span>Study Lessons</span>
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
            {/* Teaching Points Grid */}
            {!hasContextContent() && !hasRubricContent() && !hasPlotSummaryContent() && !hasContemporaryConnectionsContent() && !hasEssayGuideContent() ? (
              <Card className="p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Content Coming Soon</h3>
                <p className="text-gray-600">
                  Detailed study lessons for this text are currently being prepared. 
                  Check back soon or explore the Quote Bank in the meantime.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Context Card */}
                {hasContextContent() && (
                <Link href={`/knowledge-bank/text-mastery/${textId}/context`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">Context</CardTitle>
                      <CardDescription>Historical, political, and biographical context</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Explore the historical events, political climate, and {text.author}'s personal experiences that shaped
                        this literary work.
                      </p>
                      <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {/* Themes + Rubric Card */}
              {hasRubricContent() && (
                <Link href={`/knowledge-bank/text-mastery/${textId}/themes-rubric`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <User className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl">Themes + Rubric</CardTitle>
                      <CardDescription>Key themes linked to HSC rubric points</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Understand how the {text.genre.toLowerCase()}'s major themes connect directly to HSC Common Module rubric requirements
                        and assessment criteria.
                      </p>
                      <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                        <span className="text-sm font-medium">Explore Themes</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {/* Plot Summary Card */}
              {hasPlotSummaryContent() && (
                <Link href={`/knowledge-bank/text-mastery/${textId}/plot-summary`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                        <BookText className="h-8 w-8 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">Plot Summary</CardTitle>
                      <CardDescription>Chapter by chapter breakdown and analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">Detailed chapter summaries with key events, character development, and thematic significance for each section.  </p>
                      <div className="flex items-center justify-center text-orange-600 group-hover:text-orange-700">
                        <span className="text-sm font-medium">Read Summary</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {/* Contemporary Connections Card */}
              {hasContemporaryConnectionsContent() && (
                <Link href={`/knowledge-bank/text-mastery/${textId}/contemporary-connections`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => document.getElementById("contemporary-connections")?.scrollIntoView({ behavior: "smooth" })}>
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                        <Globe className="h-8 w-8 text-teal-600" />
                      </div>
                      <CardTitle className="text-xl">Contemporary Connections</CardTitle>
                      <CardDescription>Modern parallels and relevance today</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Discover how {text.author}'s themes and warnings relate to contemporary issues and our modern world.
                      </p>
                      <div className="flex items-center justify-center text-teal-600 group-hover:text-teal-700">
                        <span className="text-sm font-medium">Explore Connections</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {/* Essay Writing Guide Card */}
              {hasEssayGuideContent() && (
                <Link href={`/knowledge-bank/text-mastery/${textId}/essay-guide`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">Essay Writing Guide</CardTitle>
                      <CardDescription>Structure and techniques for HSC essays</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Master the art of writing compelling HSC essays with structured approaches, textual evidence, and
                        analytical techniques.
                      </p>
                      <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                        <span className="text-sm font-medium">Start Writing</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
              </div>
            )}
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
                                  {(quote.themes || []).map((theme) => (
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
                            {(quote.themes || []).map((theme) => (
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
                {selectedQuoteForDetails.rubricConnection && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-gray-600 mb-1">Rubric Connection</h4>
                    <p className="text-sm">{selectedQuoteForDetails.rubricConnection}</p>
                  </div>
                )}
              </div>

              {/* Themes */}
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedQuoteForDetails.themes || []).map((theme: string) => (
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
                    setIsCopied(true)
                    toast({
                      title: "Quote copied",
                      description: "The quote has been copied to your clipboard.",
                      duration: 3000,
                    })
                  }}
                  className="flex items-center gap-2"
                  disabled={isCopied}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Quote
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
