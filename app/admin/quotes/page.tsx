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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { quoteFlashcardService, type QuoteWithDetails, type NewQuote, type Theme } from "@/lib/services/quote-flashcard-service"
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
} from "lucide-react"

function QuotesAdminContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  
  return <QuotesAdminPage action={action} editId={editId} />
}

function QuotesAdminPage({ action, editId }: { action: string | null, editId: string | null }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [quotes, setQuotes] = useState<QuoteWithDetails[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [bookFilter, setBookFilter] = useState<string>("all")
  const [themeFilter, setThemeFilter] = useState<string[]>([])
  const [showForm, setShowForm] = useState(action === 'create' || !!editId)
  const [editingQuote, setEditingQuote] = useState<QuoteWithDetails | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<NewQuote>({
    title: "",
    text: "",
    book_id: "",
    source: "",
    theme_ids: [],
  })

  const [showThemeManager, setShowThemeManager] = useState(false)
  const [newTheme, setNewTheme] = useState({ name: "", description: "", color: "#6366f1" })

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  // Handle URL params
  useEffect(() => {
    if (action === 'create') {
      setShowForm(true)
      resetForm()
    } else if (editId) {
      const quoteToEdit = quotes.find(quote => quote.id === editId)
      if (quoteToEdit) {
        setEditingQuote(quoteToEdit)
        setFormData({
          title: quoteToEdit.title,
          text: quoteToEdit.text,
          book_id: quoteToEdit.book_id,
          source: quoteToEdit.source || "",
          theme_ids: quoteToEdit.themes?.map(t => t.id) || []
        })
        setShowForm(true)
      }
    }
  }, [action, editId, quotes])

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

  const resetForm = () => {
    setFormData({
      title: "",
      text: "",
      book_id: "",
      source: "",
      theme_ids: [],
    })
    setEditingQuote(null)
    setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.text.trim()) {
      setError("Quote text is required")
      return false
    }
    if (!formData.book_id) {
      setError("Please select a book")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user?.id) return

    try {
      if (editingQuote) {
        // Update existing quote
        const success = await quoteFlashcardService.updateQuote(editingQuote.id, formData)
        if (success) {
          toast({
            title: "Success",
            description: "Quote updated successfully. Flashcards will be regenerated automatically.",
          })
        } else {
          throw new Error("Failed to update quote")
        }
      } else {
        // Create new quote
        const newQuote = await quoteFlashcardService.createQuote(user.id, formData)
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
      setShowForm(false)
      resetForm()
      router.push('/admin/quotes')
    } catch (error) {
      console.error('Error saving quote:', error)
      toast({
        title: "Error",
        description: "Failed to save quote",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (quoteId: string) => {
    if (!confirm("Are you sure you want to delete this quote? This will also delete all associated flashcards and cannot be undone.")) {
      return
    }

    try {
      const success = await quoteFlashcardService.deleteQuote(quoteId)
      if (success) {
        toast({
          title: "Success",
          description: "Quote and associated flashcards deleted successfully",
        })
        await loadData()
      } else {
        throw new Error("Failed to delete quote")
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (quoteId: string, isActive: boolean) => {
    try {
      const success = await quoteFlashcardService.toggleQuoteActive(quoteId, isActive)
      if (success) {
        toast({
          title: "Success",
          description: `Quote ${isActive ? 'activated' : 'deactivated'} successfully`,
        })
        await loadData()
      } else {
        throw new Error("Failed to toggle quote status")
      }
    } catch (error) {
      console.error('Error toggling quote status:', error)
      toast({
        title: "Error",
        description: "Failed to update quote status",
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
    
    const matchesBook = bookFilter === "all" || quote.book_id === bookFilter
    
    const matchesTheme = themeFilter.length === 0 || 
                        themeFilter.some(themeId => 
                          quote.themes?.some(t => t.id === themeId)
                        )
    
    return matchesSearch && matchesBook && matchesTheme
  })

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Show access denied if not authenticated
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
            <h1 className="text-3xl font-bold">Quote Management</h1>
            <p className="text-muted-foreground">Upload quotes and auto-generate flashcards with intelligent tagging</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!showForm && (
            <>
              <Button 
                variant="outline"
                onClick={() => setShowThemeManager(!showThemeManager)}
              >
                <Tags className="h-4 w-4 mr-2" />
                Manage Themes
              </Button>
              <Button onClick={() => {
                setShowForm(true)
                resetForm()
                router.push('/admin/quotes?action=create')
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </>
          )}
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

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QuoteIcon className="h-5 w-5" />
              {editingQuote ? "Edit Quote" : "Add New Quote"}
            </CardTitle>
            <CardDescription>
              {editingQuote ? "Update quote information and themes" : "Upload a new quote to automatically generate flashcards"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Macbeth's Ambition Soliloquy"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="e.g. Act 1, Scene 7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="book">Book *</Label>
                <select
                  id="book"
                  value={formData.book_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, book_id: e.target.value }))}
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
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
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
                        checked={formData.theme_ids?.includes(theme.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              theme_ids: [...(prev.theme_ids || []), theme.id]
                            }))
                          } else {
                            setFormData(prev => ({
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
                    setShowForm(false)
                    resetForm()
                    router.push('/admin/quotes')
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search quotes by title, text, book, or source..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={bookFilter}
                    onChange={(e) => setBookFilter(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="all">All Books</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-48">
                  <select
                    multiple
                    value={themeFilter}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value)
                      setThemeFilter(values)
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {themes.map(theme => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  {searchTerm || bookFilter !== "all" || themeFilter.length > 0
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first quote"
                  }
                </p>
                {!searchTerm && bookFilter === "all" && themeFilter.length === 0 && (
                  <Button onClick={() => {
                    setShowForm(true)
                    resetForm()
                    router.push('/admin/quotes?action=create')
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Quote
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
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
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleActive(quote.id, !quote.is_active)}
                          title={quote.is_active ? "Hide from students" : "Show to students"}
                        >
                          {quote.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => router.push(`/admin/quotes?edit=${quote.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(quote.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      {quote.text.length > 200 ? `${quote.text.substring(0, 200)}...` : quote.text}
                    </blockquote>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Created: {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function QuotesAdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <QuotesAdminContent />
    </Suspense>
  )
} 