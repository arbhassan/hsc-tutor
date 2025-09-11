"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { quoteFlashcardService, type QuoteWithDetails, type FlashcardCardWithDetails, type NewQuote, type Theme, type CardFilters } from "@/lib/services/quote-flashcard-service"
import { adminService, type Book } from "@/lib/services/admin-service"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Quote as QuoteIcon,
  Search,
  Filter,
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  Tags,
  CreditCard,
  Zap,
  Settings,
  RefreshCw,
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  Target,
} from "lucide-react"

function FlashcardStudioContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  const tab = searchParams.get('tab') || 'create'
  
  return <FlashcardStudioPage action={action} editId={editId} defaultTab={tab} />
}

interface FlashcardCreationData {
  card_text: string
  missing_words: string[]
  book_id: string
  themes: string[]
  auto_quote: boolean
  quote_title?: string
  quote_source?: string
}

function FlashcardStudioPage({ action, editId, defaultTab }: { action: string | null, editId: string | null, defaultTab: string }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Data states
  const [quotes, setQuotes] = useState<QuoteWithDetails[]>([])
  const [cards, setCards] = useState<FlashcardCardWithDetails[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // UI states
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<CardFilters>({
    search: "",
    book_id: undefined,
    theme_ids: [],
    only_active: true
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Form states
  const [showQuoteForm, setShowQuoteForm] = useState(action === 'create-quote' || !!editId)
  const [showCardForm, setShowCardForm] = useState(action === 'create-card')
  const [editingQuote, setEditingQuote] = useState<QuoteWithDetails | null>(null)
  const [editingCard, setEditingCard] = useState<FlashcardCardWithDetails | null>(null)
  const [error, setError] = useState("")

  // Quote form data
  const [quoteFormData, setQuoteFormData] = useState<NewQuote>({
    title: "",
    text: "",
    book_id: "",
    source: "",
    theme_ids: [],
  })

  // Direct flashcard creation form data
  const [cardFormData, setCardFormData] = useState<FlashcardCreationData>({
    card_text: "",
    missing_words: [""],
    book_id: "",
    themes: [],
    auto_quote: true,
    quote_title: "",
    quote_source: ""
  })

  // Theme management
  const [showThemeManager, setShowThemeManager] = useState(false)
  const [newTheme, setNewTheme] = useState({ name: "", description: "", color: "#6366f1" })

  // Load all data
  useEffect(() => {
    loadData()
  }, [])

  // Update filters when search changes
  useEffect(() => {
    updateFilters({ search: searchTerm })
  }, [searchTerm])

  // Load cards when filters change
  useEffect(() => {
    if (activeTab === 'cards') {
      loadCards()
    }
  }, [filters, activeTab])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [quotesData, themesData, booksData] = await Promise.all([
        quoteFlashcardService.getAllQuotes({ only_active: false }),
        quoteFlashcardService.getAllThemes(),
        adminService.getAllBooks()
      ])
      setQuotes(quotesData)
      setThemes(themesData)
      setBooks(booksData)
      
      if (activeTab === 'cards') {
        await loadCards()
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCards = async () => {
    try {
      const cardsData = await quoteFlashcardService.getCardsForStudy(filters)
      setCards(cardsData)
      setSelectedItems([])
    } catch (error) {
      console.error('Error loading cards:', error)
      toast({
        title: "Error",
        description: "Failed to load cards",
        variant: "destructive",
      })
    }
  }

  const updateFilters = (newFilters: Partial<CardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetQuoteForm = () => {
    setQuoteFormData({
      title: "",
      text: "",
      book_id: "",
      source: "",
      theme_ids: [],
    })
    setEditingQuote(null)
    setError("")
  }

  const resetCardForm = () => {
    setCardFormData({
      card_text: "",
      missing_words: [""],
      book_id: "",
      themes: [],
      auto_quote: true,
      quote_title: "",
      quote_source: ""
    })
    setEditingCard(null)
    setError("")
  }

  const validateQuoteForm = (): boolean => {
    if (!quoteFormData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!quoteFormData.text.trim()) {
      setError("Quote text is required")
      return false
    }
    if (!quoteFormData.book_id) {
      setError("Please select a book")
      return false
    }
    setError("")
    return true
  }

  const validateCardForm = (): boolean => {
    if (!cardFormData.card_text.trim()) {
      setError("Card text is required")
      return false
    }
    if (!cardFormData.missing_words || cardFormData.missing_words.length === 0 || cardFormData.missing_words.some(word => !word.trim())) {
      setError("All missing words are required")
      return false
    }
    if (!cardFormData.book_id) {
      setError("Please select a book")
      return false
    }
    if (cardFormData.auto_quote && !cardFormData.quote_title?.trim()) {
      setError("Quote title is required when auto-creating quote")
      return false
    }
    setError("")
    return true
  }

  const handleCreateDirectCard = async () => {
    if (!validateCardForm() || !user?.id) return

    try {
      let quoteId: string

      if (cardFormData.auto_quote) {
        // Create a quote first, then the card manually
        const newQuote = await quoteFlashcardService.createQuote(user.id, {
          title: cardFormData.quote_title || `Card: ${cardFormData.card_text.substring(0, 50)}...`,
          text: cardFormData.card_text,
          book_id: cardFormData.book_id,
          source: cardFormData.quote_source,
          theme_ids: cardFormData.themes
        })

        if (!newQuote) {
          throw new Error("Failed to create quote")
        }
        quoteId = newQuote.id
      } else {
        // This would require selecting an existing quote - we'll implement this later
        throw new Error("Manual quote selection not yet implemented")
      }

      // Create the flashcard manually via API
      const response = await fetch('/api/admin/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: quoteId,
          card_text: cardFormData.card_text,
          missing_words: cardFormData.missing_words,
          is_active: true
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create flashcard")
      }

      toast({
        title: "Success",
        description: "Flashcard created successfully!",
      })

      await loadData()
      setShowCardForm(false)
      resetCardForm()
      setActiveTab('cards')
    } catch (error) {
      console.error('Error creating flashcard:', error)
      toast({
        title: "Error",
        description: "Failed to create flashcard",
        variant: "destructive",
      })
    }
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateQuoteForm() || !user?.id) return

    try {
      if (editingQuote) {
        const success = await quoteFlashcardService.updateQuote(editingQuote.id, quoteFormData)
        if (success) {
          toast({
            title: "Success",
            description: "Quote updated successfully. Flashcards will be regenerated automatically.",
          })
        } else {
          throw new Error("Failed to update quote")
        }
      } else {
        const newQuote = await quoteFlashcardService.createQuote(user.id, quoteFormData)
        if (newQuote) {
          toast({
            title: "Success", 
            description: `Quote created successfully! ${newQuote.card_count || 0} flashcards were automatically generated.`,
          })
        } else {
          throw new Error("Failed to create quote")
        }
      }
      
      await loadData()
      setShowQuoteForm(false)
      resetQuoteForm()
      router.push('/admin/flashcard-studio')
    } catch (error) {
      console.error('Error saving quote:', error)
      toast({
        title: "Error",
        description: "Failed to save quote",
        variant: "destructive",
      })
    }
  }

  const handleCreateTheme = async () => {
    try {
      const theme = await quoteFlashcardService.createTheme(newTheme)
      if (theme) {
        toast({
          title: "Success",
          description: "Theme created successfully",
        })
        setNewTheme({ name: "", description: "", color: "#6366f1" })
        await loadData()
      } else {
        throw new Error("Failed to create theme")
      }
    } catch (error) {
      console.error('Error creating theme:', error)
      toast({
        title: "Error",
        description: "Failed to create theme",
        variant: "destructive",
      })
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.source?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredCards = cards.filter(card => {
    if (!card.quote) return false
    const matchesSearch = card.quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.card_text.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to access the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Flashcard Studio
            </h1>
            <p className="text-muted-foreground">Unified flashcard and quote management with streamlined workflows</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowThemeManager(!showThemeManager)}
          >
            <Tags className="h-4 w-4 mr-2" />
            Manage Themes
          </Button>
        </div>
      </div>

      {/* Theme Manager */}
      {showThemeManager && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Theme Management
            </CardTitle>
            <CardDescription>
              Manage themes for organizing quotes and flashcards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={newTheme.name}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ambition, Love, Betrayal"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="theme-description">Description</Label>
                  <Input
                    id="theme-description"
                    value={newTheme.description}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="theme-color">Color</Label>
                  <Input
                    id="theme-color"
                    type="color"
                    value={newTheme.color}
                    onChange={(e) => setNewTheme(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateTheme}
                  disabled={!newTheme.name.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Theme
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <Badge 
                    key={theme.id}
                    variant="outline"
                    style={{ borderColor: theme.color, color: theme.color }}
                  >
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Quick Create
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <QuoteIcon className="h-4 w-4" />
            Quotes ({quotes.length})
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Cards ({cards.length})
          </TabsTrigger>
        </TabsList>

        {/* Quick Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct Flashcard Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Create Flashcard Directly
                </CardTitle>
                <CardDescription>
                  Create a flashcard with automatic quote generation - perfect for quick content creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quick-book">Book *</Label>
                    <select
                      id="quick-book"
                      value={cardFormData.book_id}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, book_id: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Select a book...</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quick-card-text">Flashcard Text *</Label>
                    <Textarea
                      id="quick-card-text"
                      value={cardFormData.card_text}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, card_text: e.target.value }))}
                      placeholder="The character shows _____ when they..."
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Use _____ to mark where students should fill in the missing word
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Missing Words *</Label>
                    <div className="space-y-2">
                      {cardFormData.missing_words.map((word, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={word}
                            onChange={(e) => {
                              const newWords = [...cardFormData.missing_words]
                              newWords[index] = e.target.value
                              setCardFormData(prev => ({ ...prev, missing_words: newWords }))
                            }}
                            placeholder={`Answer ${index + 1}`}
                            className="flex-1"
                          />
                          {cardFormData.missing_words.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newWords = cardFormData.missing_words.filter((_, i) => i !== index)
                                setCardFormData(prev => ({ ...prev, missing_words: newWords }))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCardFormData(prev => ({ ...prev, missing_words: [...prev.missing_words, ""] }))
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Answer
                      </Button>
                    </div>
                  </div>

                  {cardFormData.auto_quote && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="quick-quote-title">Quote Title *</Label>
                        <Input
                          id="quick-quote-title"
                          value={cardFormData.quote_title}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, quote_title: e.target.value }))}
                          placeholder="Brief title for the auto-generated quote"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quick-quote-source">Source</Label>
                        <Input
                          id="quick-quote-source"
                          value={cardFormData.quote_source}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, quote_source: e.target.value }))}
                          placeholder="e.g. Act 1, Scene 3"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Themes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((theme) => (
                        <div key={theme.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`quick-theme-${theme.id}`}
                            checked={cardFormData.themes.includes(theme.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCardFormData(prev => ({
                                  ...prev,
                                  themes: [...prev.themes, theme.id]
                                }))
                              } else {
                                setCardFormData(prev => ({
                                  ...prev,
                                  themes: prev.themes.filter(id => id !== theme.id)
                                }))
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`quick-theme-${theme.id}`}
                            className="text-sm"
                            style={{ color: theme.color }}
                          >
                            {theme.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleCreateDirectCard}
                    className="w-full"
                    disabled={!cardFormData.card_text || !cardFormData.book_id || cardFormData.missing_words.some(w => !w.trim())}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Create Flashcard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Traditional Quote-First Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Create Quote + Auto-Generate Cards
                </CardTitle>
                <CardDescription>
                  Traditional workflow: create a quote and automatically generate 1-5 flashcards from it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trad-title">Quote Title *</Label>
                    <Input
                      id="trad-title"
                      value={quoteFormData.title}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Macbeth's Ambition Soliloquy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trad-book">Book *</Label>
                    <select
                      id="trad-book"
                      value={quoteFormData.book_id}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, book_id: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Select a book...</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trad-text">Quote Text *</Label>
                    <Textarea
                      id="trad-text"
                      value={quoteFormData.text}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Paste the full quote or passage here..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      AI will automatically generate 1-5 flashcards from this text
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trad-source">Source</Label>
                    <Input
                      id="trad-source"
                      value={quoteFormData.source}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Act 1, Scene 7"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Themes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((theme) => (
                        <div key={theme.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`trad-theme-${theme.id}`}
                            checked={quoteFormData.theme_ids?.includes(theme.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setQuoteFormData(prev => ({
                                  ...prev,
                                  theme_ids: [...(prev.theme_ids || []), theme.id]
                                }))
                              } else {
                                setQuoteFormData(prev => ({
                                  ...prev,
                                  theme_ids: prev.theme_ids?.filter(id => id !== theme.id) || []
                                }))
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`trad-theme-${theme.id}`}
                            className="text-sm"
                            style={{ color: theme.color }}
                          >
                            {theme.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitQuote}
                    className="w-full"
                    disabled={!quoteFormData.title || !quoteFormData.text || !quoteFormData.book_id}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Quote & Generate Cards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quotes Tab */}
        <TabsContent value="quotes" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes by title, text, book, or source..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quotes List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quotes...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <QuoteIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No quotes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first quote"}
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quote
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id} className={`hover:shadow-lg transition-shadow ${!quote.is_active ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{quote.title}</CardTitle>
                          {!quote.is_active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {quote.book?.title} by {quote.book?.author}
                          </Badge>
                          {quote.source && (
                            <Badge variant="secondary">{quote.source}</Badge>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CreditCard className="h-3 w-3" />
                            <span>{quote.card_count || 0} cards</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {quote.themes?.map((theme) => (
                            <Badge 
                              key={theme.id}
                              variant="outline"
                              style={{ borderColor: theme.color, color: theme.color }}
                              className="text-xs"
                            >
                              {theme.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">
                      <span>{quote.text.length > 150 ? `${quote.text.substring(0, 150)}...` : quote.text}</span>
                    </blockquote>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            const success = await quoteFlashcardService.toggleQuoteActive(quote.id, !quote.is_active)
                            if (success) {
                              toast({
                                title: "Success",
                                description: `Quote ${!quote.is_active ? 'activated' : 'deactivated'} successfully`,
                              })
                              await loadData()
                            }
                          }}
                          title={quote.is_active ? "Hide from students" : "Show to students"}
                        >
                          {quote.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingQuote(quote)
                            setQuoteFormData({
                              title: quote.title,
                              text: quote.text,
                              book_id: quote.book_id,
                              source: quote.source || "",
                              theme_ids: quote.themes?.map(t => t.id) || []
                            })
                            setShowQuoteForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this quote? This will also delete all associated flashcards and cannot be undone.")) {
                              const success = await quoteFlashcardService.deleteQuote(quote.id)
                              if (success) {
                                toast({
                                  title: "Success",
                                  description: "Quote and associated flashcards deleted successfully",
                                })
                                await loadData()
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cards by quote text, card text, or source..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cards List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading cards...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No cards found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search criteria" : "Create some quotes to generate flashcards"}
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <Card key={card.id} className={`hover:shadow-lg transition-shadow ${!card.is_active ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!card.is_active && (
                            <Badge variant="destructive" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            const success = await quoteFlashcardService.toggleCardActive(card.id, !card.is_active)
                            if (success) {
                              toast({
                                title: "Success",
                                description: `Card ${!card.is_active ? 'activated' : 'hidden'} successfully`,
                              })
                              await loadCards()
                            }
                          }}
                          title={card.is_active ? "Hide from students" : "Show to students"}
                        >
                          {card.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            // Edit functionality could be added here
                            toast({
                              title: "Info",
                              description: "Card editing coming soon!",
                            })
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground mb-1">Card Text:</p>
                        <div className="p-2 bg-muted rounded text-sm">
                          {card.card_text}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground mb-1">Missing Words:</p>
                        <div className="flex flex-wrap gap-1">
                          {(card.missing_words || []).map((word, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {index + 1}: {word}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {card.book?.title}
                        </Badge>
                      </div>

                      {card.quote && (
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">From Quote:</p>
                          <p className="italic">
                            "{card.quote.text.length > 80 ? `${card.quote.text.substring(0, 80)}...` : card.quote.text}"
                          </p>
                        </div>
                      )}

                      {card.themes && card.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {card.themes.map((theme) => (
                            <Badge
                              key={theme.id}
                              variant="outline"
                              style={{ borderColor: theme.color, color: theme.color }}
                              className="text-xs"
                            >
                              {theme.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quote Form Modal/Overlay */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QuoteIcon className="h-5 w-5" />
                {editingQuote ? "Edit Quote" : "Create Quote"}
              </CardTitle>
              <CardDescription>
                {editingQuote ? "Update quote information and themes" : "Create a new quote to automatically generate flashcards"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuote} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quote Title *</Label>
                    <Input
                      id="title"
                      value={quoteFormData.title}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Macbeth's Ambition Soliloquy"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={quoteFormData.source}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Act 1, Scene 7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="book">Book *</Label>
                  <select
                    id="book"
                    value={quoteFormData.book_id}
                    onChange={(e) => setQuoteFormData(prev => ({ ...prev, book_id: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select a book...</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Quote Text *</Label>
                  <Textarea
                    id="text"
                    value={quoteFormData.text}
                    onChange={(e) => setQuoteFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Paste the full quote or passage here..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    The system will automatically generate 1-5 flashcards from this text based on its length and complexity.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Themes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {themes.map((theme) => (
                      <div key={theme.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${theme.id}`}
                          checked={quoteFormData.theme_ids?.includes(theme.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setQuoteFormData(prev => ({
                                ...prev,
                                theme_ids: [...(prev.theme_ids || []), theme.id]
                              }))
                            } else {
                              setQuoteFormData(prev => ({
                                ...prev,
                                theme_ids: prev.theme_ids?.filter(id => id !== theme.id) || []
                              }))
                            }
                          }}
                        />
                        <Label 
                          htmlFor={`theme-${theme.id}`}
                          className="text-sm"
                          style={{ color: theme.color }}
                        >
                          {theme.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingQuote ? "Update Quote" : "Create Quote & Generate Cards"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowQuoteForm(false)
                      resetQuoteForm()
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function FlashcardStudioPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <FlashcardStudioContent />
    </Suspense>
  )
}
