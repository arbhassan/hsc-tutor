"use client"

import { useState, useEffect } from "react"
import { Search, SortDesc, SortAsc, Heart, Copy, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Quote {
  id: number
  text: string
  speaker?: string
  chapter: string
  themes: string[]
  techniques: string[]
  characters: string[]
  analysis: string
  isFavorite: boolean
}

interface LiteraryTechnique {
  name: string
  description: string
  examples: string[]
}

const QuoteBank = ({ textId }: { textId: string }) => {
  // Sample quotes data - in a real app, this would come from an API
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [themeFilter, setThemeFilter] = useState("all")
  const [techniqueFilter, setTechniqueFilter] = useState("all")
  const [chapterFilter, setChapterFilter] = useState("all")
  const [characterFilter, setCharacterFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedTechnique, setSelectedTechnique] = useState<LiteraryTechnique | null>(null)

  // Literary techniques data
  const literaryTechniques: LiteraryTechnique[] = [
    {
      name: "Metaphor",
      description:
        'A figure of speech that makes a comparison between two unrelated things without using "like" or "as".',
      examples: ["Her eyes were diamonds, sparkling in the light.", "Life is a journey that must be traveled."],
    },
    {
      name: "Simile",
      description: 'A comparison between two unlike things using the words "like" or "as".',
      examples: ["She was as quiet as a mouse.", "His heart is like a stone."],
    },
    {
      name: "Personification",
      description: "Giving human qualities to non-human things.",
      examples: ["The wind whispered through the trees.", "The camera loves her."],
    },
    {
      name: "Symbolism",
      description: "The use of symbols to represent ideas or qualities.",
      examples: ["The dove represents peace.", "The red rose symbolizes love and passion."],
    },
    {
      name: "Irony",
      description: "A contrast between expectation and reality.",
      examples: ["The fire station burned down.", "A traffic cop getting a speeding ticket."],
    },
  ]

  // Generate sample quotes based on the textId
  useEffect(() => {
    let sampleQuotes: Quote[] = []

    if (textId === "1984") {
      sampleQuotes = [
        {
          id: 1,
          text: "War is peace. Freedom is slavery. Ignorance is strength.",
          chapter: "Part 1, Chapter 1",
          themes: ["Totalitarianism", "Propaganda", "Control"],
          techniques: ["Paradox", "Repetition"],
          characters: ["Party Slogan"],
          analysis:
            "This paradoxical slogan represents the Party's manipulation of reality and language to control the population.",
          isFavorite: false,
        },
        {
          id: 2,
          text: "Big Brother is watching you.",
          chapter: "Part 1, Chapter 1",
          themes: ["Surveillance", "Control", "Fear"],
          techniques: ["Personification", "Symbolism"],
          characters: ["Big Brother"],
          analysis:
            "This phrase emphasizes the omnipresent surveillance state and creates a sense of being constantly monitored.",
          isFavorite: false,
        },
        {
          id: 3,
          text: "If you want a picture of the future, imagine a boot stamping on a human face—forever.",
          speaker: "O'Brien",
          chapter: "Part 3, Chapter 3",
          themes: ["Power", "Oppression", "Hopelessness"],
          techniques: ["Imagery", "Metaphor"],
          characters: ["O'Brien"],
          analysis:
            "This vivid image represents the Party's ultimate goal: power for power's sake and the complete subjugation of humanity.",
          isFavorite: false,
        },
        {
          id: 4,
          text: "Until they become conscious they will never rebel, and until after they have rebelled they cannot become conscious.",
          chapter: "Part 1, Chapter 7",
          themes: ["Class Struggle", "Revolution", "Consciousness"],
          techniques: ["Paradox", "Circular Logic"],
          characters: ["Winston Smith"],
          analysis:
            "Winston reflects on the paradoxical situation of the proles, who need consciousness to rebel but can only gain consciousness through rebellion.",
          isFavorite: false,
        },
        {
          id: 5,
          text: "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
          chapter: "Part 1, Chapter 7",
          themes: ["Truth", "Freedom", "Resistance"],
          techniques: ["Symbolism", "Understatement"],
          characters: ["Winston Smith"],
          analysis:
            "Winston identifies the fundamental freedom to acknowledge objective truth as the foundation of all other freedoms.",
          isFavorite: false,
        },
      ]
    } else if (textId === "hamlet") {
      sampleQuotes = [
        {
          id: 1,
          text: "To be, or not to be, that is the question.",
          speaker: "Hamlet",
          chapter: "Act 3, Scene 1",
          themes: ["Existence", "Suicide", "Uncertainty"],
          techniques: ["Soliloquy", "Rhetorical Question"],
          characters: ["Hamlet"],
          analysis: "Hamlet contemplates the nature of existence and the prospect of suicide in this famous soliloquy.",
          isFavorite: false,
        },
        {
          id: 2,
          text: "Though this be madness, yet there is method in't.",
          speaker: "Polonius",
          chapter: "Act 2, Scene 2",
          themes: ["Sanity", "Deception", "Perception"],
          techniques: ["Paradox", "Insight"],
          characters: ["Polonius"],
          analysis: "Polonius recognizes that Hamlet's apparent madness contains logic and purpose.",
          isFavorite: false,
        },
        {
          id: 3,
          text: "The lady doth protest too much, methinks.",
          speaker: "Queen Gertrude",
          chapter: "Act 3, Scene 2",
          themes: ["Deception", "Appearance vs Reality"],
          techniques: ["Irony", "Foreshadowing"],
          characters: ["Gertrude"],
          analysis:
            "Gertrude comments on the player queen's excessive declarations of fidelity, ironically reflecting her own hasty remarriage.",
          isFavorite: false,
        },
        {
          id: 4,
          text: "This above all: to thine own self be true.",
          speaker: "Polonius",
          chapter: "Act 1, Scene 3",
          themes: ["Identity", "Integrity", "Wisdom"],
          techniques: ["Aphorism", "Parallelism"],
          characters: ["Polonius"],
          analysis:
            "Polonius offers this piece of wisdom to his son Laertes, emphasizing the importance of personal integrity.",
          isFavorite: false,
        },
        {
          id: 5,
          text: "There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.",
          speaker: "Hamlet",
          chapter: "Act 1, Scene 5",
          themes: ["Knowledge", "Supernatural", "Mystery"],
          techniques: ["Metaphor", "Philosophical Statement"],
          characters: ["Hamlet", "Horatio"],
          analysis:
            "Hamlet suggests that reality extends beyond rational understanding, particularly after his encounter with the ghost.",
          isFavorite: false,
        },
      ]
    } else {
      // Default quotes for other texts
      sampleQuotes = [
        {
          id: 1,
          text: "Sample quote 1 for this text.",
          chapter: "Chapter 1",
          themes: ["Theme A", "Theme B"],
          techniques: ["Technique X", "Technique Y"],
          characters: ["Character 1"],
          analysis: "Analysis of this quote and its significance.",
          isFavorite: false,
        },
        {
          id: 2,
          text: "Sample quote 2 for this text.",
          speaker: "Character 2",
          chapter: "Chapter 2",
          themes: ["Theme C", "Theme D"],
          techniques: ["Technique Z"],
          characters: ["Character 2"],
          analysis: "Analysis of this quote and how it relates to themes.",
          isFavorite: false,
        },
        {
          id: 3,
          text: "Sample quote 3 for this text.",
          chapter: "Chapter 3",
          themes: ["Theme A", "Theme E"],
          techniques: ["Technique X", "Technique W"],
          characters: ["Character 3", "Character 1"],
          analysis: "Detailed analysis of the literary significance.",
          isFavorite: false,
        },
      ]
    }

    setQuotes(sampleQuotes)
    setFilteredQuotes(sampleQuotes)
  }, [textId])

  // Extract unique values for filters
  const themes = Array.from(new Set(quotes.flatMap((quote) => quote.themes)))
  const techniques = Array.from(new Set(quotes.flatMap((quote) => quote.techniques)))
  const chapters = Array.from(new Set(quotes.map((quote) => quote.chapter)))
  const characters = Array.from(new Set(quotes.flatMap((quote) => quote.characters)))

  // Apply filters and search
  useEffect(() => {
    let result = [...quotes]

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (quote) =>
          quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quote.speaker && quote.speaker.toLowerCase().includes(searchTerm.toLowerCase())) ||
          quote.analysis.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply filters
    if (themeFilter !== "all") {
      result = result.filter((quote) => quote.themes.includes(themeFilter))
    }

    if (techniqueFilter !== "all") {
      result = result.filter((quote) => quote.techniques.includes(techniqueFilter))
    }

    if (chapterFilter !== "all") {
      result = result.filter((quote) => quote.chapter === chapterFilter)
    }

    if (characterFilter !== "all") {
      result = result.filter((quote) => quote.characters.includes(characterFilter))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.text.localeCompare(b.text)
      } else {
        return b.text.localeCompare(a.text)
      }
    })

    setFilteredQuotes(result)
  }, [quotes, searchTerm, themeFilter, techniqueFilter, chapterFilter, characterFilter, sortOrder])

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setQuotes(quotes.map((quote) => (quote.id === id ? { ...quote, isFavorite: !quote.isFavorite } : quote)))
  }

  // Copy quote to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  // Show technique info
  const showTechniqueInfo = (technique: string) => {
    const techInfo = literaryTechniques.find((t) => t.name === technique)
    if (techInfo) {
      setSelectedTechnique(techInfo)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search quotes, characters, or analysis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={themeFilter} onValueChange={setThemeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={techniqueFilter} onValueChange={setTechniqueFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Technique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Techniques</SelectItem>
            {techniques.map((technique) => (
              <SelectItem key={technique} value={technique}>
                {technique}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A-Z</SelectItem>
              <SelectItem value="desc">Z-A</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Sort Order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={chapterFilter} onValueChange={setChapterFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Chapter/Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={characterFilter} onValueChange={setCharacterFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Character" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Characters</SelectItem>
            {characters.map((character) => (
              <SelectItem key={character} value={character}>
                {character}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredQuotes.length} of {quotes.length} quotes
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="text-lg font-medium mb-2">"{quote.text}"</div>
                  {quote.speaker && <div className="text-sm text-gray-600 mb-1">— {quote.speaker}</div>}
                  <div className="text-sm text-gray-500 mb-2">{quote.chapter}</div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {quote.themes.map((theme) => (
                      <Badge key={theme} variant="outline" className="bg-blue-50">
                        {theme}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {quote.techniques.map((technique) => (
                      <Badge
                        key={technique}
                        variant="outline"
                        className="bg-purple-50 cursor-pointer flex items-center gap-1"
                        onClick={() => showTechniqueInfo(technique)}
                      >
                        {technique}
                        <Lightbulb size={12} />
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm mt-2">{quote.analysis}</div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(quote.id)}
                          className={quote.isFavorite ? "text-red-500" : "text-gray-400"}
                        >
                          <Heart size={18} fill={quote.isFavorite ? "currentColor" : "none"} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{quote.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(quote.text)}>
                          <Copy size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy quote</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No quotes match your current filters. Try adjusting your search or filters.
          </div>
        )}
      </div>

      {/* Literary Technique Dialog */}
      <Dialog open={!!selectedTechnique} onOpenChange={(open) => !open && setSelectedTechnique(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={18} />
              {selectedTechnique?.name}
            </DialogTitle>
            <DialogDescription>{selectedTechnique?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <h4 className="font-medium">Examples:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {selectedTechnique?.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuoteBank
