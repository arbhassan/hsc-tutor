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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminService, type FlashcardSet, type NewFlashcardSet, type Book } from "@/lib/services/admin-service"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CreditCard,
  Search,
  Filter,
  AlertCircle,
  BookOpen,
  Eye,
  Minus,
} from "lucide-react"

function FlashcardsAdminContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  
  return <FlashcardsAdminPage action={action} editId={editId} />
}

function FlashcardsAdminPage({ action, editId }: { action: string | null, editId: string | null }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [bookFilter, setBookFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(action === 'create' || !!editId)
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<NewFlashcardSet>({
    title: "",
    description: "",
    type: "quote",
    book_id: "",
    passages: [{ text: "", source: "" }],
  })

  const types = [
    { value: "quote", label: "Quotes" },
    { value: "paragraph", label: "Paragraphs" },
    { value: "analysis", label: "Analysis" },
  ]

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
      const setToEdit = flashcardSets.find(set => set.id === editId)
      if (setToEdit) {
        setEditingSet(setToEdit)
        loadPassagesForEditing(setToEdit)
        setShowForm(true)
      }
    }
  }, [action, editId, flashcardSets])

  const loadPassagesForEditing = async (flashcardSet: FlashcardSet) => {
    try {
      const passages = await adminService.getPassagesBySetId(flashcardSet.id)
      setFormData({
        title: flashcardSet.title,
        description: flashcardSet.description || "",
        type: flashcardSet.type,
        book_id: flashcardSet.book_id,
        passages: passages.map(p => ({ text: p.text, source: p.source }))
      })
    } catch (error) {
      console.error('Error loading passages for editing:', error)
      // Fallback to basic form data if passages fail to load
      setFormData({
        title: flashcardSet.title,
        description: flashcardSet.description || "",
        type: flashcardSet.type,
        book_id: flashcardSet.book_id,
        passages: [{ text: "", source: "" }]
      })
      toast({
        title: "Warning",
        description: "Failed to load existing passages. You may need to re-add them.",
        variant: "destructive",
      })
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [flashcardSetsData, booksData] = await Promise.all([
        adminService.getAllFlashcardSets(),
        adminService.getAllBooks()
      ])
      setFlashcardSets(flashcardSetsData)
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
      description: "",
      type: "quote",
      book_id: "",
      passages: [{ text: "", source: "" }],
    })
    setEditingSet(null)
    setError("")
  }

  const handleInputChange = (field: keyof NewFlashcardSet, value: any) => {
    if (field === 'passages') {
      setFormData(prev => ({
        ...prev,
        passages: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePassageChange = (index: number, field: 'text' | 'source', value: string) => {
    const updatedPassages = [...formData.passages]
    updatedPassages[index] = {
      ...updatedPassages[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      passages: updatedPassages
    }))
  }

  const addPassage = () => {
    setFormData(prev => ({
      ...prev,
      passages: [...prev.passages, { text: "", source: "" }]
    }))
  }

  const removePassage = (index: number) => {
    if (formData.passages.length > 1) {
      const updatedPassages = formData.passages.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        passages: updatedPassages
      }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.book_id) {
      setError("Please select a book")
      return false
    }
    
    const validPassages = formData.passages.filter(p => p.text.trim() && p.source.trim())
    if (validPassages.length === 0) {
      setError("At least one complete passage (with text and source) is required")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user?.id) return

    try {
      // Filter out empty passages
      const validPassages = formData.passages.filter(p => p.text.trim() && p.source.trim())
      const setToSubmit = {
        ...formData,
        passages: validPassages
      }

      if (editingSet) {
        // Update existing flashcard set
        await adminService.updateFlashcardSet(editingSet.id, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          book_id: formData.book_id
        })
        
        // Update passages
        await adminService.updateFlashcardSetPassages(editingSet.id, validPassages)
        
        toast({
          title: "Success",
          description: "Flashcard set updated successfully",
        })
      } else {
        // Create new flashcard set
        await adminService.createFlashcardSet(user.id, setToSubmit)
        toast({
          title: "Success",
          description: "Flashcard set created successfully",
        })
      }
      
      await loadData()
      setShowForm(false)
      resetForm()
      router.push('/admin/flashcards')
    } catch (error) {
      console.error('Error saving flashcard set:', error)
      toast({
        title: "Error",
        description: "Failed to save flashcard set",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (setId: string) => {
    if (!confirm("Are you sure you want to delete this flashcard set? This action cannot be undone.")) {
      return
    }

    try {
      await adminService.deleteFlashcardSet(setId)
      toast({
        title: "Success",
        description: "Flashcard set deleted successfully",
      })
      await loadData()
    } catch (error) {
      console.error('Error deleting flashcard set:', error)
      toast({
        title: "Error",
        description: "Failed to delete flashcard set",
        variant: "destructive",
      })
    }
  }

  const filteredSets = flashcardSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || set.type === typeFilter
    const matchesBook = bookFilter === "all" || set.book_id === bookFilter
    return matchesSearch && matchesType && matchesBook
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
            <h1 className="text-3xl font-bold">Flashcard Sets Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage flashcard sets in the system</p>
          </div>
        </div>
        
        {!showForm && (
          <Button onClick={() => {
            setShowForm(true)
            resetForm()
            router.push('/admin/flashcards?action=create')
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Flashcard Set
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingSet ? "Edit Flashcard Set" : "Add New Flashcard Set"}
            </CardTitle>
            <CardDescription>
              {editingSet ? "Update flashcard set information" : "Fill in the details to create a new flashcard set"}
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
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Flashcard set title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="book">Book *</Label>
                <select
                  id="book"
                  value={formData.book_id}
                  onChange={(e) => handleInputChange('book_id', e.target.value)}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this flashcard set"
                  rows={2}
                />
              </div>

              {/* Passages Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">Passages</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addPassage}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Passage
                  </Button>
                </div>

                {formData.passages.map((passage, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Passage {index + 1}</h4>
                      {formData.passages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePassage(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`passage-text-${index}`}>Passage Text</Label>
                        <Textarea
                          id={`passage-text-${index}`}
                          value={passage.text}
                          onChange={(e) => handlePassageChange(index, 'text', e.target.value)}
                          placeholder="Enter the full text of the quote or passage"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`passage-source-${index}`}>Source</Label>
                        <Input
                          id={`passage-source-${index}`}
                          value={passage.source}
                          onChange={(e) => handlePassageChange(index, 'source', e.target.value)}
                          placeholder="e.g., Chapter 1, Act 3 Scene 1, etc."
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingSet ? "Update Flashcard Set" : "Create Flashcard Set"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                    router.push('/admin/flashcards')
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
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search flashcard sets by title, description, or book..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    {types.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
              </div>
            </CardContent>
          </Card>

          {/* Flashcard Sets List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading flashcard sets...</p>
            </div>
          ) : filteredSets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No flashcard sets found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || typeFilter !== "all" || bookFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first flashcard set"
                  }
                </p>
                {!searchTerm && typeFilter === "all" && bookFilter === "all" && (
                  <Button onClick={() => {
                    setShowForm(true)
                    resetForm()
                    router.push('/admin/flashcards?action=create')
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Flashcard Set
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSets.map((set) => (
                <Card key={set.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{set.title}</CardTitle>
                        <CardDescription>
                          {set.book?.title} by {set.book?.author}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => router.push(`/admin/flashcards?edit=${set.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(set.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{set.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {set.passage_count || 0} passages
                        </span>
                      </div>
                      
                      {set.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {set.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>{set.book?.category}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(set.created_at).toLocaleDateString()}
                      </div>
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

export default function FlashcardsAdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <FlashcardsAdminContent />
    </Suspense>
  )
} 