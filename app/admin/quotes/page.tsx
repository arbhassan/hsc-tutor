"use client"

import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { getBooks, type BookInterface } from "@/lib/books"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  BookOpen,
  Quote,
  Star
} from "lucide-react"

// Available themes for quotes
const THEMES = [
  "Creation and Responsibility",
  "Isolation and Alienation", 
  "Nature vs. Science",
  "Totalitarianism",
  "Individual vs. Society",
  "Language and Truth",
  "The American Dream",
  "Wealth and Class",
  "Revenge",
  "Appearance vs. Reality",
  "Power",
  "Identity",
  "Justice",
  "Conflict",
  "Redemption",
  "Nature",
  "Time",
  "Death",
  "Love",
  "Freedom"
]

interface Quote {
  id: number
  book_id: string
  theme: string
  quote_text: string
  context: string
  page_reference?: string
  chapter_reference?: string
  literary_techniques?: string[]
  importance_level: number
  created_at: string
  updated_at: string
}

interface QuoteFormData {
  book_id: string
  theme: string
  quote_text: string
  context: string
  page_reference: string
  chapter_reference: string
  literary_techniques: string[]
  importance_level: number
}

const initialFormData: QuoteFormData = {
  book_id: "",
  theme: "",
  quote_text: "",
  context: "",
  page_reference: "",
  chapter_reference: "",
  literary_techniques: [],
  importance_level: 3
}

// Custom hook for optimized input handling
function useOptimizedInput(initialValue: string, onUpdate?: (value: string) => void) {
  const [displayValue, setDisplayValue] = useState(initialValue)
  const updateRef = useRef(onUpdate)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const pendingRef = useRef(false)

  // Update the ref when onUpdate changes
  useEffect(() => {
    updateRef.current = onUpdate
  }, [onUpdate])

  const handleChange = useCallback((value: string) => {
    // Critical path: update display immediately
    setDisplayValue(value)
    
    // Non-critical path: batch updates using requestIdleCallback
    if (updateRef.current && !pendingRef.current) {
      pendingRef.current = true
      
      // Use requestIdleCallback for better performance, fallback to setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          updateRef.current?.(value)
          pendingRef.current = false
        })
      } else {
        // Fallback for Safari
        timeoutRef.current = setTimeout(() => {
          updateRef.current?.(value)
          pendingRef.current = false
        }, 0)
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [displayValue, handleChange] as const
}

export default function QuotesAdmin() {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [books, setBooks] = useState<BookInterface[]>([])
  const [selectedBook, setSelectedBook] = useState<string>("all")
  const [selectedTheme, setSelectedTheme] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Optimized literary technique input
  const [literaryTechniqueInput, setLiteraryTechniqueInput] = useOptimizedInput("")

  // Memoize books to prevent unnecessary re-renders
  const bookOptions = useMemo(() => books, [books])

  // Memoize book title lookup
  const getBookTitle = useCallback((bookId: string) => {
    const book = books.find(b => b.id === bookId)
    return book?.title || bookId
  }, [books])

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await getBooks()
        setBooks(booksData)
        console.log('Books loaded:', booksData.length)
      } catch (error) {
        console.error('Error loading books:', error)
        toast({
          title: "Error",
          description: "Failed to load books. Please check your database connection.",
          variant: "destructive",
        })
      }
    }
    loadBooks()
  }, [toast])

  // Optimized loadQuotes function with better error handling
  const loadQuotes = useCallback(async (bookId?: string, theme?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const finalBookId = bookId || selectedBook
      const finalTheme = theme || selectedTheme
      
      if (finalBookId && finalBookId !== "all") params.append('bookId', finalBookId)
      if (finalTheme && finalTheme !== "all") params.append('theme', finalTheme)

      const response = await fetch(`/api/quotes?${params.toString()}`)
      if (response.ok) {
        const quotesData = await response.json()
        setQuotes(quotesData)
      } else {
        throw new Error('Failed to fetch quotes')
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [selectedBook, selectedTheme, toast])

  // Debounced load quotes when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadQuotes()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [loadQuotes])

  // Optimized form data updates using batching
  const updateFormDataBatched = useCallback((updates: Partial<QuoteFormData>) => {
    // Use requestIdleCallback to batch state updates
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        setFormData(prev => ({ ...prev, ...updates }))
      })
    } else {
      // Fallback for Safari
      setTimeout(() => {
        setFormData(prev => ({ ...prev, ...updates }))
      }, 0)
    }
  }, [])

  // Immediate updates for critical form fields
  const updateFormDataImmediate = useCallback((updates: Partial<QuoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.book_id || !formData.theme || !formData.quote_text || !formData.context) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const payload = {
        ...formData,
        literary_techniques: formData.literary_techniques.filter(t => t.trim() !== '')
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quote added successfully",
        })
        setFormData(initialFormData)
        setShowAddDialog(false)
        loadQuotes()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add quote')
      }
    } catch (error) {
      console.error('Error adding quote:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add quote",
        variant: "destructive",
      })
    }
  }, [formData, toast, loadQuotes])

  const handleEdit = useCallback((quote: Quote) => {
    setEditingQuote(quote)
    setFormData({
      book_id: quote.book_id,
      theme: quote.theme,
      quote_text: quote.quote_text,
      context: quote.context,
      page_reference: quote.page_reference || "",
      chapter_reference: quote.chapter_reference || "",
      literary_techniques: quote.literary_techniques || [],
      importance_level: quote.importance_level
    })
    setShowEditDialog(true)
  }, [])

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingQuote) return

    try {
      const payload = {
        ...formData,
        literary_techniques: formData.literary_techniques.filter(t => t.trim() !== '')
      }

      const response = await fetch(`/api/quotes/${editingQuote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quote updated successfully",
        })
        setShowEditDialog(false)
        setEditingQuote(null)
        setFormData(initialFormData)
        loadQuotes()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update quote')
      }
    } catch (error) {
      console.error('Error updating quote:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update quote",
        variant: "destructive",
      })
    }
  }, [editingQuote, formData, toast, loadQuotes])

  const handleDelete = useCallback(async (quote: Quote) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quote deleted successfully",
        })
        loadQuotes()
      } else {
        throw new Error('Failed to delete quote')
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      })
    }
  }, [toast, loadQuotes])

  const addLiteraryTechnique = useCallback(() => {
    const technique = literaryTechniqueInput.trim()
    if (technique && !formData.literary_techniques.includes(technique)) {
      updateFormDataImmediate({
        literary_techniques: [...formData.literary_techniques, technique]
      })
      setLiteraryTechniqueInput("")
    }
  }, [literaryTechniqueInput, formData.literary_techniques, updateFormDataImmediate])

  const removeLiteraryTechnique = useCallback((technique: string) => {
    updateFormDataImmediate({
      literary_techniques: formData.literary_techniques.filter(t => t !== technique)
    })
  }, [formData.literary_techniques, updateFormDataImmediate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLiteraryTechnique()
    }
  }, [addLiteraryTechnique])

  // Memoized QuoteCard component to prevent unnecessary re-renders
  const QuoteCard = memo(({ quote, onEdit, onDelete, getBookTitle }: {
    quote: Quote
    onEdit: (quote: Quote) => void
    onDelete: (quote: Quote) => void
    getBookTitle: (bookId: string) => string
  }) => (
    <Card key={quote.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant="outline">
                <BookOpen size={12} className="mr-1" />
                {getBookTitle(quote.book_id)}
              </Badge>
              <Badge variant="secondary">{quote.theme}</Badge>
              <Badge variant={quote.importance_level >= 4 ? "default" : "outline"}>
                <Star size={12} className="mr-1" />
                {quote.importance_level}/5
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(quote)}>
              <Edit size={14} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(quote)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-4 border-primary/20 pl-4 italic mb-3">
          "{quote.quote_text}"
        </blockquote>
        <p className="text-sm text-muted-foreground mb-2">{quote.context}</p>
        
        {(quote.page_reference || quote.chapter_reference) && (
          <div className="flex gap-4 text-xs text-muted-foreground mb-2">
            {quote.chapter_reference && <span>Chapter: {quote.chapter_reference}</span>}
            {quote.page_reference && <span>Page: {quote.page_reference}</span>}
          </div>
        )}

        {quote.literary_techniques && quote.literary_techniques.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {quote.literary_techniques.map((technique, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {technique}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  ))

  // Memoized QuoteForm component with optimized inputs
  const QuoteForm = memo(({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void, submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="book_id" id="book_id_label">Book *</Label>
          <Select 
            value={formData.book_id} 
            onValueChange={(value) => updateFormDataImmediate({ book_id: value })}
            name="book_id"
          >
            <SelectTrigger id="book_id" aria-labelledby="book_id_label">
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {bookOptions.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="theme" id="theme_label">Theme *</Label>
          <Select 
            value={formData.theme} 
            onValueChange={(value) => updateFormDataImmediate({ theme: value })}
            name="theme"
          >
            <SelectTrigger id="theme" aria-labelledby="theme_label">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="quote_text">Quote *</Label>
        <Textarea
          id="quote_text"
          name="quote_text"
          placeholder="Enter the quote text"
          value={formData.quote_text}
          onChange={(e) => updateFormDataBatched({ quote_text: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="context">Context *</Label>
        <Textarea
          id="context"
          name="context"
          placeholder="Provide context for the quote"
          value={formData.context}
          onChange={(e) => updateFormDataBatched({ context: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="page_reference">Page Reference</Label>
          <Input
            id="page_reference"
            name="page_reference"
            placeholder="e.g., Page 42"
            value={formData.page_reference}
            onChange={(e) => updateFormDataBatched({ page_reference: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="chapter_reference">Chapter Reference</Label>
          <Input
            id="chapter_reference"
            name="chapter_reference"
            placeholder="e.g., Chapter 5"
            value={formData.chapter_reference}
            onChange={(e) => updateFormDataBatched({ chapter_reference: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="importance_level" id="importance_level_label">Importance Level (1-5)</Label>
        <Select 
          value={formData.importance_level.toString()} 
          onValueChange={(value) => updateFormDataImmediate({ importance_level: parseInt(value) })}
          name="importance_level"
        >
          <SelectTrigger id="importance_level" aria-labelledby="importance_level_label">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Low</SelectItem>
            <SelectItem value="2">2 - Below Average</SelectItem>
            <SelectItem value="3">3 - Average</SelectItem>
            <SelectItem value="4">4 - Important</SelectItem>
            <SelectItem value="5">5 - Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="literary_technique_input">Literary Techniques</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="literary_technique_input"
            name="literary_technique_input"
            placeholder="Enter literary technique"
            value={literaryTechniqueInput}
            onChange={(e) => setLiteraryTechniqueInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-describedby="literary_technique_help"
          />
          <Button type="button" onClick={addLiteraryTechnique} variant="outline">
            Add
          </Button>
        </div>
        <div id="literary_technique_help" className="text-xs text-muted-foreground mb-2">
          Press Enter or click Add to add a technique
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Added literary techniques">
          {formData.literary_techniques.map((technique, index) => (
            <Badge key={index} variant="secondary" role="listitem">
              {technique}
              <button
                type="button"
                onClick={() => removeLiteraryTechnique(technique)}
                className="ml-1 hover:text-red-500"
                aria-label={`Remove ${technique}`}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  ))

  // Memoized filtered quotes list to prevent unnecessary recalculations
  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const bookMatch = selectedBook === "all" || quote.book_id === selectedBook
      const themeMatch = selectedTheme === "all" || quote.theme === selectedTheme
      return bookMatch && themeMatch
    })
  }, [quotes, selectedBook, selectedTheme])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quote Management</h1>
          <p className="text-muted-foreground mt-2">Add and manage quotes for different texts and themes</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Quote
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Quote</DialogTitle>
              <DialogDescription>
                Add a new quote to the database for use in essay mode
              </DialogDescription>
            </DialogHeader>
            <QuoteForm onSubmit={handleSubmit} submitLabel="Add Quote" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Debug info */}
      {books.length === 0 && (
        <Alert className="mb-6">
          <AlertDescription>
            No books found. Please check your database connection and RLS policies.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filter_book" id="filter_book_label">Filter by Book</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger id="filter_book" aria-labelledby="filter_book_label">
                  <SelectValue placeholder="All books" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All books</SelectItem>
                  {bookOptions.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter_theme" id="filter_theme_label">Filter by Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger id="filter_theme" aria-labelledby="filter_theme_label">
                  <SelectValue placeholder="All themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All themes</SelectItem>
                  {THEMES.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Quotes ({filteredQuotes.length})
          </h2>
          {(selectedBook !== "all" || selectedTheme !== "all") && (
            <Button variant="outline" onClick={() => { setSelectedBook("all"); setSelectedTheme("all") }}>
              Clear Filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading quotes...</div>
        ) : filteredQuotes.length === 0 ? (
          <Alert>
            <AlertDescription>
              {selectedBook !== "all" || selectedTheme !== "all" ? 
                "No quotes found matching the selected filters." : 
                "No quotes available. Add some quotes to get started."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getBookTitle={getBookTitle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
            <DialogDescription>
              Update the quote information
            </DialogDescription>
          </DialogHeader>
          <QuoteForm onSubmit={handleUpdate} submitLabel="Update Quote" />
        </DialogContent>
      </Dialog>
    </div>
  )
} 