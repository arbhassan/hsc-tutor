"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface Question {
  id?: string
  text_id?: string
  question_text: string
  marks: number
  question_order: number
  model_answer?: string
  commentary?: string
  modelAnswer?: {
    answer: string
    commentary?: string
  }
}

interface DailyDrillText {
  id: string
  title: string
  author: string
  text_type: string
  content: string
  source: string
  difficulty_level: string
  is_active: boolean
  display_order: number
  questions: Question[]
}

export default function DailyDrillAdminPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [texts, setTexts] = useState<DailyDrillText[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingText, setEditingText] = useState<DailyDrillText | null>(null)
  const [expandedText, setExpandedText] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    text_type: "Prose Fiction Extract",
    content: "",
    source: "",
    difficulty_level: "Medium",
    display_order: 0,
  })

  const [questions, setQuestions] = useState<Question[]>([
    { question_text: "", marks: 3, question_order: 1, model_answer: "", commentary: "" }
  ])

  const textTypes = [
    "Prose Fiction Extract",
    "Poetry",
    "Drama Extract",
    "Literary Nonfiction"
  ]

  const difficultyLevels = ["Easy", "Medium", "Hard"]

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  // Load data
  useEffect(() => {
    if (user) {
      loadTexts()
    }
  }, [user])

  const loadTexts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/daily-drill?includeInactive=true')
      if (!response.ok) throw new Error('Failed to fetch texts')
      
      const data = await response.json()
      setTexts(data.texts || [])
    } catch (error) {
      console.error('Error loading texts:', error)
      toast({
        title: "Error",
        description: "Failed to load daily drill texts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      text_type: "Prose Fiction Extract",
      content: "",
      source: "",
      difficulty_level: "Medium",
      display_order: 0,
    })
    setQuestions([
      { question_text: "", marks: 3, question_order: 1, model_answer: "", commentary: "" }
    ])
    setEditingText(null)
    setShowForm(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    setQuestions(prev => {
      const newQuestions = [...prev]
      newQuestions[index] = { ...newQuestions[index], [field]: value }
      return newQuestions
    })
  }

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { 
        question_text: "", 
        marks: 3, 
        question_order: prev.length + 1,
        model_answer: "",
        commentary: ""
      }
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const handleEdit = (text: DailyDrillText) => {
    setEditingText(text)
    setFormData({
      title: text.title,
      author: text.author,
      text_type: text.text_type,
      content: text.content,
      source: text.source,
      difficulty_level: text.difficulty_level,
      display_order: text.display_order,
    })
    
    // Map questions with model answers
    const mappedQuestions = text.questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      marks: q.marks,
      question_order: q.question_order,
      model_answer: q.modelAnswer?.answer || "",
      commentary: q.modelAnswer?.commentary || ""
    }))
    
    setQuestions(mappedQuestions.length > 0 ? mappedQuestions : [
      { question_text: "", marks: 3, question_order: 1, model_answer: "", commentary: "" }
    ])
    setShowForm(true)
  }

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.title || !formData.author || !formData.content || !formData.source) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Validate questions
      const validQuestions = questions.filter(q => q.question_text.trim() !== "")
      if (validQuestions.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one question",
          variant: "destructive",
        })
        return
      }

      if (editingText) {
        // Update existing text
        const response = await fetch('/api/daily-drill', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingText.id,
            ...formData
          })
        })

        if (!response.ok) throw new Error('Failed to update text')

        // Handle questions separately
        // Delete removed questions
        const existingQuestionIds = editingText.questions.map(q => q.id)
        const newQuestionIds = questions.filter(q => q.id).map(q => q.id)
        const deletedQuestionIds = existingQuestionIds.filter(id => !newQuestionIds.includes(id))

        for (const questionId of deletedQuestionIds) {
          await fetch(`/api/daily-drill/questions?id=${questionId}`, {
            method: 'DELETE'
          })
        }

        // Update or create questions
        for (const question of validQuestions) {
          if (question.id) {
            // Update existing question
            await fetch('/api/daily-drill/questions', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: question.id,
                question_text: question.question_text,
                marks: question.marks,
                question_order: question.question_order,
                model_answer: question.model_answer,
                commentary: question.commentary
              })
            })
          } else {
            // Create new question
            await fetch('/api/daily-drill/questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text_id: editingText.id,
                question_text: question.question_text,
                marks: question.marks,
                question_order: question.question_order,
                model_answer: question.model_answer,
                commentary: question.commentary
              })
            })
          }
        }

        toast({
          title: "Success",
          description: "Text updated successfully",
        })
      } else {
        // Create new text
        const response = await fetch('/api/daily-drill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            questions: validQuestions.map((q, index) => ({
              question_text: q.question_text,
              marks: q.marks,
              question_order: index + 1,
              model_answer: q.model_answer,
              commentary: q.commentary
            }))
          })
        })

        if (!response.ok) throw new Error('Failed to create text')

        toast({
          title: "Success",
          description: "Text created successfully",
        })
      }

      resetForm()
      loadTexts()
    } catch (error) {
      console.error('Error saving text:', error)
      toast({
        title: "Error",
        description: "Failed to save text",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this text? This will also delete all associated questions.')) {
      return
    }

    try {
      const response = await fetch(`/api/daily-drill?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete text')

      toast({
        title: "Success",
        description: "Text deleted successfully",
      })

      loadTexts()
    } catch (error) {
      console.error('Error deleting text:', error)
      toast({
        title: "Error",
        description: "Failed to delete text",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (text: DailyDrillText) => {
    try {
      const response = await fetch('/api/daily-drill', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: text.id,
          is_active: !text.is_active
        })
      })

      if (!response.ok) throw new Error('Failed to toggle active status')

      toast({
        title: "Success",
        description: `Text ${!text.is_active ? 'activated' : 'deactivated'} successfully`,
      })

      loadTexts()
    } catch (error) {
      console.error('Error toggling active status:', error)
      toast({
        title: "Error",
        description: "Failed to toggle active status",
        variant: "destructive",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Daily Drill Management</h1>
          <p className="text-muted-foreground">
            Manage texts and questions for Daily Drill practice
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          disabled={showForm}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Text
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingText ? 'Edit Text' : 'Create New Text'}
            </CardTitle>
            <CardDescription>
              Fill in the details for the unseen text and its questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter text title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_type">Text Type *</Label>
                  <Select
                    value={formData.text_type}
                    onValueChange={(value) => handleInputChange('text_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_level">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => handleInputChange('difficulty_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source *</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    placeholder="e.g., Original work for HSC practice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Text Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter the full text content..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  For poetry, use line breaks. For drama, include stage directions in square brackets.
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Questions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                {questions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Question {index + 1}</Label>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-2">
                          <Label htmlFor={`question_${index}`}>Question Text *</Label>
                          <Textarea
                            id={`question_${index}`}
                            value={question.question_text}
                            onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                            placeholder="Enter the question..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`marks_${index}`}>Marks *</Label>
                          <Input
                            id={`marks_${index}`}
                            type="number"
                            min="1"
                            max="10"
                            value={question.marks}
                            onChange={(e) => handleQuestionChange(index, 'marks', parseInt(e.target.value) || 3)}
                          />
                        </div>
                      </div>

                      <Tabs defaultValue="preview" className="w-full">
                        <TabsList>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                          <TabsTrigger value="model">Model Answer</TabsTrigger>
                        </TabsList>

                        <TabsContent value="preview" className="mt-2">
                          <div className="p-3 bg-muted rounded-md text-sm">
                            {question.question_text || <span className="text-muted-foreground">Question preview will appear here...</span>}
                          </div>
                        </TabsContent>

                        <TabsContent value="model" className="mt-2 space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`model_answer_${index}`}>Model Answer (Optional)</Label>
                            <Textarea
                              id={`model_answer_${index}`}
                              value={question.model_answer || ""}
                              onChange={(e) => handleQuestionChange(index, 'model_answer', e.target.value)}
                              placeholder="Enter the model answer for reference..."
                              rows={6}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`commentary_${index}`}>Commentary (Optional)</Label>
                            <Textarea
                              id={`commentary_${index}`}
                              value={question.commentary || ""}
                              onChange={(e) => handleQuestionChange(index, 'commentary', e.target.value)}
                              placeholder="Add commentary about what makes this a good answer..."
                              rows={3}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingText ? 'Update' : 'Create'} Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Texts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Existing Texts ({texts.length})
        </h2>

        {texts.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No texts found</AlertTitle>
            <AlertDescription>
              Create your first daily drill text to get started.
            </AlertDescription>
          </Alert>
        ) : (
          texts.map((text) => (
            <Card key={text.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{text.title}</CardTitle>
                      {text.is_active ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                      <Badge variant="outline">{text.text_type}</Badge>
                      <Badge variant="outline">{text.difficulty_level}</Badge>
                    </div>
                    <CardDescription>
                      by {text.author} • {text.questions.length} question{text.questions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(text)}
                    >
                      {text.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(text)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(text.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedText(expandedText === text.id ? null : text.id)}
                    >
                      {expandedText === text.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedText === text.id && (
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Content Preview:</Label>
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {text.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: {text.source}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Questions:</Label>
                    <div className="mt-2 space-y-2">
                      {text.questions.map((question, index) => (
                        <div key={question.id} className="p-3 bg-muted rounded-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">Question {index + 1}</p>
                              <p className="text-sm mt-1">{question.question_text}</p>
                            </div>
                            <Badge variant="outline">{question.marks} marks</Badge>
                          </div>
                          {question.modelAnswer && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground font-medium">Model Answer Available</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

