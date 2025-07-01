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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { adminService, type PastExamQuestion, type NewPastExamQuestion, type Book } from "@/lib/services/admin-service"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react"

function PastExamQuestionsAdminContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  
  return <PastExamQuestionsAdminPage action={action} editId={editId} />
}

function PastExamQuestionsAdminPage({ action, editId }: { action: string | null, editId: string | null }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [questions, setQuestions] = useState<PastExamQuestion[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [themeFilter, setThemeFilter] = useState<string>("all")
  const [bookFilter, setBookFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(action === 'create' || !!editId)
  const [editingQuestion, setEditingQuestion] = useState<PastExamQuestion | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<NewPastExamQuestion>({
    question: "",
    theme: "",
    book_id: "",
    year: new Date().getFullYear(),
    exam_type: "HSC",
    difficulty_level: "Standard",
  })



  const commonThemes = [
    "Love", "Freedom", "Power", "Identity", "Justice", "Conflict", 
    "Redemption", "Nature", "Time", "Death", "Revenge", "Creation and Responsibility",
    "Individual vs. Society", "Totalitarianism", "Language and Truth", 
    "Isolation and Alienation", "The American Dream", "Wealth and Class",
    "Appearance vs. Reality", "Nature vs. Science"
  ]

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  // Load data
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  // Handle URL params
  useEffect(() => {
    if (action === 'create') {
      setShowForm(true)
      resetForm()
    } else if (editId) {
      const questionToEdit = questions.find(q => q.id === editId)
      if (questionToEdit) {
        setEditingQuestion(questionToEdit)
        setFormData({
          question: questionToEdit.question,
          theme: questionToEdit.theme,
          book_id: questionToEdit.book_id,
          year: questionToEdit.year,
          exam_type: questionToEdit.exam_type,
          difficulty_level: questionToEdit.difficulty_level,
        })
        setShowForm(true)
      }
    }
  }, [action, editId, questions])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [questionsData, booksData] = await Promise.all([
        adminService.getAllPastExamQuestions(),
        adminService.getAllBooks()
      ])
      setQuestions(questionsData)
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
      question: "",
      theme: "",
      book_id: "",
      year: new Date().getFullYear(),
      exam_type: "HSC",
      difficulty_level: "Standard",
    })
    setEditingQuestion(null)
    setError("")
  }

  const handleInputChange = (field: keyof NewPastExamQuestion, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.question.trim()) {
      setError("Question is required")
      return false
    }
    if (!formData.theme.trim()) {
      setError("Theme is required")
      return false
    }
    if (!formData.book_id) {
      setError("Book selection is required")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (editingQuestion) {
        await adminService.updatePastExamQuestion(editingQuestion.id, formData)
        toast({
          title: "Success",
          description: "Past exam question updated successfully",
        })
      } else {
        await adminService.createPastExamQuestion(formData)
        toast({
          title: "Success",
          description: "Past exam question created successfully",
        })
      }
      
      await loadData()
      setShowForm(false)
      resetForm()
      router.push('/admin/past-exam-questions')
    } catch (error) {
      console.error('Error saving question:', error)
      toast({
        title: "Error",
        description: "Failed to save past exam question",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this past exam question?")) {
      return
    }

    try {
      await adminService.deletePastExamQuestion(questionId)
      toast({
        title: "Success",
        description: "Past exam question deleted successfully",
      })
      await loadData()
    } catch (error) {
      console.error('Error deleting question:', error)
      toast({
        title: "Error",
        description: "Failed to delete past exam question",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (question: PastExamQuestion) => {
    router.push(`/admin/past-exam-questions?edit=${question.id}`)
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTheme = themeFilter === "all" || question.theme === themeFilter
    const matchesBook = bookFilter === "all" || question.book_id === bookFilter
    
    return matchesSearch && matchesTheme && matchesBook
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
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Past Exam Questions Management</h1>
            <p className="text-muted-foreground">
              Manage HSC past exam questions for essay practice
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            )}
          </div>
        </div>
      </div>

      {showForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingQuestion ? "Edit Past Exam Question" : "Add New Past Exam Question"}
            </CardTitle>
            <CardDescription>
              {editingQuestion ? "Update the past exam question details" : "Add a new past exam question to the database"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="book_id">Book</Label>
                  <Select value={formData.book_id} onValueChange={(value) => handleInputChange('book_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonThemes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || undefined)}
                    placeholder="e.g. 2023"
                    min="1990"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="Enter the past exam question..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingQuestion ? "Update Question" : "Create Question"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                    router.push('/admin/past-exam-questions')
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
          {/* Filters */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search questions, themes, or books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={themeFilter} onValueChange={setThemeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {Array.from(new Set(questions.map(q => q.theme))).map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={bookFilter} onValueChange={setBookFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions List */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading past exam questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No past exam questions found</h3>
                <p className="text-muted-foreground mb-4">
                  {questions.length === 0 
                    ? "Get started by adding your first past exam question."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Past Exam Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredQuestions.length} of {questions.length} past exam questions
                </p>
              </div>

              {filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="default">{question.book?.title || 'Unknown Book'}</Badge>
                          <Badge variant="secondary">{question.theme}</Badge>
                          <Badge variant="outline">{question.exam_type}</Badge>
                          <Badge variant="outline">{question.difficulty_level}</Badge>
                          {question.year && <Badge variant="outline">{question.year}</Badge>}
                        </div>
                        <CardTitle className="text-base leading-relaxed">
                          {question.question}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {question.book?.author && `by ${question.book.author}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function PastExamQuestionsAdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <PastExamQuestionsAdminContent />
    </Suspense>
  )
} 