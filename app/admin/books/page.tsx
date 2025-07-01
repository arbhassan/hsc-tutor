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
import { adminService, type Book, type NewBook } from "@/lib/services/admin-service"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react"

function BooksAdminContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  
  return <BooksAdminPage action={action} editId={editId} />
}

function BooksAdminPage({ action, editId }: { action: string | null, editId: string | null }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(action === 'create' || !!editId)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<NewBook>({
    id: "",
    title: "",
    author: "",
    year: "",
    description: "",
    image: "",
    category: "prose",
    themes: [],
    popular: false,
  })

  const categories = [
    { value: "prose", label: "Prose" },
    { value: "poetry", label: "Poetry" },
    { value: "drama", label: "Drama" },
    { value: "nonfiction", label: "Non-fiction" },
    { value: "film", label: "Film" },
  ]

  // Load books
  useEffect(() => {
    loadBooks()
  }, [])

  // Handle URL params
  useEffect(() => {
    if (action === 'create') {
      setShowForm(true)
      resetForm()
    } else if (editId) {
      const bookToEdit = books.find(book => book.id === editId)
      if (bookToEdit) {
        setEditingBook(bookToEdit)
        setFormData({
          id: bookToEdit.id,
          title: bookToEdit.title,
          author: bookToEdit.author,
          year: bookToEdit.year,
          description: bookToEdit.description,
          image: bookToEdit.image || "",
          category: bookToEdit.category,
          themes: [],
          popular: false,
        })
        setShowForm(true)
      }
    }
  }, [action, editId, books])

  const loadBooks = async () => {
    try {
      setIsLoading(true)
      const booksData = await adminService.getAllBooks()
      setBooks(booksData)
    } catch (error) {
      console.error('Error loading books:', error)
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      author: "",
      year: "",
      description: "",
      image: "",
      category: "prose",
      themes: [],
      popular: false,
    })
    setEditingBook(null)
    setError("")
  }

  const handleInputChange = (field: keyof NewBook, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const validateForm = (): boolean => {
    if (!formData.id.trim()) {
      setError("ID is required")
      return false
    }
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.author.trim()) {
      setError("Author is required")
      return false
    }
    if (!formData.year.trim()) {
      setError("Year is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }

    // Check for duplicate ID (only when creating or changing ID)
    if (!editingBook || editingBook.id !== formData.id) {
      const existingBook = books.find(book => book.id === formData.id)
      if (existingBook) {
        setError("A book with this ID already exists")
        return false
      }
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (editingBook) {
        // Update existing book
        await adminService.updateBook(editingBook.id, formData)
        toast({
          title: "Success",
          description: "Book updated successfully",
        })
      } else {
        // Create new book
        await adminService.createBook(formData)
        toast({
          title: "Success",
          description: "Book created successfully",
        })
      }
      
      await loadBooks()
      setShowForm(false)
      resetForm()
      router.push('/admin/books')
    } catch (error) {
      console.error('Error saving book:', error)
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      return
    }

    try {
      await adminService.deleteBook(bookId)
      toast({
        title: "Success",
        description: "Book deleted successfully",
      })
      await loadBooks()
    } catch (error) {
      console.error('Error deleting book:', error)
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      })
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter
    return matchesSearch && matchesCategory
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
            <h1 className="text-3xl font-bold">Books Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage books in the system</p>
          </div>
        </div>
        
        {!showForm && (
          <Button onClick={() => {
            setShowForm(true)
            resetForm()
            router.push('/admin/books?action=create')
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingBook ? "Edit Book" : "Add New Book"}
            </CardTitle>
            <CardDescription>
              {editingBook ? "Update book information" : "Fill in the details to create a new book"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Book ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="e.g., hamlet, 1984, etc."
                    required
                    disabled={!!editingBook}
                  />
                  {editingBook && (
                    <p className="text-xs text-muted-foreground">
                      Book ID cannot be changed after creation
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Book title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="Publication year"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Book description"
                  rows={3}
                  required
                />
              </div>



              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingBook ? "Update Book" : "Create Book"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                    router.push('/admin/books')
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
                      placeholder="Search books by title, author, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No books found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first book"
                  }
                </p>
                {!searchTerm && categoryFilter === "all" && (
                  <Button onClick={() => {
                    setShowForm(true)
                    resetForm()
                    router.push('/admin/books?action=create')
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Book
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        <CardDescription>
                          by {book.author} ({book.year})
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => router.push(`/admin/books?edit=${book.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{book.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {book.description}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        ID: {book.id}
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

export default function BooksAdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <BooksAdminContent />
    </Suspense>
  )
} 