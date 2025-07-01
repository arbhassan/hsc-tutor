"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Quote,
  AlertTriangle,
  Loader2
} from "lucide-react"

interface UnseenText {
  id: string
  title: string
  author: string
  type: string
  content: string
  source: string
  difficulty: string
  questions: Question[]
}

interface Question {
  id: string
  text: string
  marks: number
}

interface EssayQuestion {
  id: string
  module: string
  question_text: string
  difficulty: string
}

interface ThematicQuote {
  id: string
  text_name: string
  theme: string
  quote: string
  context: string
}

export default function ExamSimulatorAdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  // State for data
  const [unseenTexts, setUnseenTexts] = useState<UnseenText[]>([])
  const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([])
  const [thematicQuotes, setThematicQuotes] = useState<ThematicQuote[]>([])

  // State for dialogs
  const [showUnseenTextDialog, setShowUnseenTextDialog] = useState(false)
  const [showEssayQuestionDialog, setShowEssayQuestionDialog] = useState(false)
  const [showThematicQuoteDialog, setShowThematicQuoteDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // State for forms
  const [unseenTextForm, setUnseenTextForm] = useState({
    title: "",
    author: "",
    textType: "Prose Fiction",
    content: "",
    source: "",
    difficulty: "Medium",
    questions: [{ text: "", marks: 3 }]
  })

  const [essayQuestionForm, setEssayQuestionForm] = useState({
    module: "Common Module: Texts and Human Experiences",
    questionText: "",
    difficulty: "Medium"
  })

  const [thematicQuoteForm, setThematicQuoteForm] = useState({
    textName: "",
    theme: "",
    quote: "",
    context: ""
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Auth check
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth/signin')
      return
    }
    loadData()
  }, [user, loading, router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      const [unseenTextsRes, essayQuestionsRes, thematicQuotesRes] = await Promise.all([
        fetch('/api/admin/exam-simulator/unseen-texts'),
        fetch('/api/admin/exam-simulator/essay-questions'),
        fetch('/api/admin/exam-simulator/thematic-quotes')
      ])

      const [unseenTextsData, essayQuestionsData, thematicQuotesData] = await Promise.all([
        unseenTextsRes.json(),
        essayQuestionsRes.json(),
        thematicQuotesRes.json()
      ])

      if (unseenTextsData.success) setUnseenTexts(unseenTextsData.data)
      if (essayQuestionsData.success) setEssayQuestions(essayQuestionsData.data)
      if (thematicQuotesData.success) setThematicQuotes(thematicQuotesData.data)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load exam simulator data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUnseenText = async () => {
    try {
      setIsSaving(true)
      
      const url = editingItem 
        ? '/api/admin/exam-simulator/unseen-texts'
        : '/api/admin/exam-simulator/unseen-texts'
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...unseenTextForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Unseen text ${editingItem ? 'updated' : 'created'} successfully`
        })
        setShowUnseenTextDialog(false)
        setEditingItem(null)
        resetUnseenTextForm()
        loadData()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving unseen text:', error)
      toast({
        title: "Error",
        description: "Failed to save unseen text",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEssayQuestion = async () => {
    try {
      setIsSaving(true)
      
      const url = '/api/admin/exam-simulator/essay-questions'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...essayQuestionForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Essay question ${editingItem ? 'updated' : 'created'} successfully`
        })
        setShowEssayQuestionDialog(false)
        setEditingItem(null)
        resetEssayQuestionForm()
        loadData()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving essay question:', error)
      toast({
        title: "Error",
        description: "Failed to save essay question",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveThematicQuote = async () => {
    try {
      setIsSaving(true)
      
      const url = '/api/admin/exam-simulator/thematic-quotes'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...thematicQuoteForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Thematic quote ${editingItem ? 'updated' : 'created'} successfully`
        })
        setShowThematicQuoteDialog(false)
        setEditingItem(null)
        resetThematicQuoteForm()
        loadData()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving thematic quote:', error)
      toast({
        title: "Error",
        description: "Failed to save thematic quote",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (type: 'unseen-texts' | 'essay-questions' | 'thematic-quotes', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`/api/admin/exam-simulator/${type}?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Item deleted successfully"
        })
        loadData()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      })
    }
  }

  const resetUnseenTextForm = () => {
    setUnseenTextForm({
      title: "",
      author: "",
      textType: "Prose Fiction",
      content: "",
      source: "",
      difficulty: "Medium",
      questions: [{ text: "", marks: 3 }]
    })
  }

  const resetEssayQuestionForm = () => {
    setEssayQuestionForm({
      module: "Common Module: Texts and Human Experiences",
      questionText: "",
      difficulty: "Medium"
    })
  }

  const resetThematicQuoteForm = () => {
    setThematicQuoteForm({
      textName: "",
      theme: "",
      quote: "",
      context: ""
    })
  }

  const handleEditUnseenText = (text: UnseenText) => {
    setEditingItem(text)
    setUnseenTextForm({
      title: text.title,
      author: text.author,
      textType: text.type,
      content: text.content,
      source: text.source,
      difficulty: text.difficulty,
      questions: text.questions && text.questions.length > 0 
        ? text.questions.map(q => ({ text: q.text, marks: q.marks }))
        : [{ text: "", marks: 3 }]
    })
    setShowUnseenTextDialog(true)
  }

  const handleEditEssayQuestion = (question: EssayQuestion) => {
    setEditingItem(question)
    setEssayQuestionForm({
      module: question.module,
      questionText: question.question_text,
      difficulty: question.difficulty
    })
    setShowEssayQuestionDialog(true)
  }

  const handleEditThematicQuote = (quote: ThematicQuote) => {
    setEditingItem(quote)
    setThematicQuoteForm({
      textName: quote.text_name,
      theme: quote.theme,
      quote: quote.quote,
      context: quote.context
    })
    setShowThematicQuoteDialog(true)
  }

  const addQuestion = () => {
    setUnseenTextForm(prev => ({
      ...prev,
      questions: [...prev.questions, { text: "", marks: 3 }]
    }))
  }

  const removeQuestion = (index: number) => {
    setUnseenTextForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const updateQuestion = (index: number, field: 'text' | 'marks', value: string | number) => {
    setUnseenTextForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

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
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => router.push('/admin')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Exam Simulator Management</h1>
        <p className="text-muted-foreground">
          Manage unseen texts, essay questions, and thematic quotes for the HSC Paper 1 exam simulator
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading exam simulator data...</p>
        </div>
      ) : (
        <Tabs defaultValue="unseen-texts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unseen-texts" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Unseen Texts
            </TabsTrigger>
            <TabsTrigger value="essay-questions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Essay Questions
            </TabsTrigger>
            <TabsTrigger value="thematic-quotes" className="flex items-center gap-2">
              <Quote className="h-4 w-4" />
              Thematic Quotes
            </TabsTrigger>
          </TabsList>

          {/* Unseen Texts Tab */}
          <TabsContent value="unseen-texts">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Unseen Texts</CardTitle>
                    <CardDescription>
                      Manage texts used in Section I of the exam simulator
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null)
                    resetUnseenTextForm()
                    setShowUnseenTextDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unseenTexts.map((text) => (
                        <TableRow key={text.id}>
                          <TableCell className="font-medium">{text.title}</TableCell>
                          <TableCell>{text.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{text.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              text.difficulty === 'Hard' ? 'destructive' : 
                              text.difficulty === 'Medium' ? 'default' : 'secondary'
                            }>
                              {text.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>{text.questions?.length || 0}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUnseenText(text)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem('unseen-texts', text.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {unseenTexts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No unseen texts found. Add your first text to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Essay Questions Tab */}
          <TabsContent value="essay-questions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Essay Questions</CardTitle>
                    <CardDescription>
                      Manage questions used in Section II of the exam simulator
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null)
                    resetEssayQuestionForm()
                    setShowEssayQuestionDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {essayQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Badge variant="outline">{question.module}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate">{question.question_text}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              question.difficulty === 'Hard' ? 'destructive' : 
                              question.difficulty === 'Medium' ? 'default' : 'secondary'
                            }>
                              {question.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEssayQuestion(question)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem('essay-questions', question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {essayQuestions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No essay questions found. Add your first question to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thematic Quotes Tab */}
          <TabsContent value="thematic-quotes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Thematic Quotes</CardTitle>
                    <CardDescription>
                      Manage quotes available in the quote bank during essays
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null)
                    resetThematicQuoteForm()
                    setShowThematicQuoteDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Text Name</TableHead>
                        <TableHead>Theme</TableHead>
                        <TableHead>Quote</TableHead>
                        <TableHead>Context</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {thematicQuotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell>
                            <Badge variant="outline">{quote.text_name}</Badge>
                          </TableCell>
                          <TableCell>{quote.theme}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate italic">"{quote.quote}"</div>
                          </TableCell>
                          <TableCell className="max-w-sm">
                            <div className="truncate text-muted-foreground">{quote.context}</div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditThematicQuote(quote)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem('thematic-quotes', quote.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {thematicQuotes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No thematic quotes found. Add your first quote to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Unseen Text Dialog */}
      <Dialog open={showUnseenTextDialog} onOpenChange={setShowUnseenTextDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Unseen Text' : 'Add New Unseen Text'}
            </DialogTitle>
            <DialogDescription>
              Create or edit an unseen text with questions for the exam simulator
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={unseenTextForm.title}
                  onChange={(e) => setUnseenTextForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter text title"
                />
              </div>
              
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={unseenTextForm.author}
                  onChange={(e) => setUnseenTextForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Enter author name"
                />
              </div>
              
              <div>
                <Label htmlFor="textType">Text Type</Label>
                <Select
                  value={unseenTextForm.textType}
                  onValueChange={(value) => setUnseenTextForm(prev => ({ ...prev, textType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select text type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prose Fiction">Prose Fiction</SelectItem>
                    <SelectItem value="Poetry">Poetry</SelectItem>
                    <SelectItem value="Drama Extract">Drama Extract</SelectItem>
                    <SelectItem value="Literary Nonfiction">Literary Nonfiction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={unseenTextForm.source}
                  onChange={(e) => setUnseenTextForm(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Enter source"
                />
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={unseenTextForm.difficulty}
                  onValueChange={(value) => setUnseenTextForm(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Text Content</Label>
                <Textarea
                  id="content"
                  value={unseenTextForm.content}
                  onChange={(e) => setUnseenTextForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the full text content"
                  className="h-48"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
            
            {unseenTextForm.questions.map((question, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                  <Input
                    id={`question-${index}`}
                    value={question.text}
                    onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                    placeholder="Enter question text"
                  />
                </div>
                <div className="w-20">
                  <Label htmlFor={`marks-${index}`}>Marks</Label>
                  <Input
                    id={`marks-${index}`}
                    type="number"
                    min="1"
                    max="10"
                    value={question.marks}
                    onChange={(e) => updateQuestion(index, 'marks', Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                {unseenTextForm.questions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnseenTextDialog(false)
                setEditingItem(null)
                resetUnseenTextForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUnseenText} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Create'} Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Essay Question Dialog */}
      <Dialog open={showEssayQuestionDialog} onOpenChange={setShowEssayQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Essay Question' : 'Add New Essay Question'}
            </DialogTitle>
            <DialogDescription>
              Create or edit an essay question for Section II of the exam simulator
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="module">Module</Label>
              <Input
                id="module"
                value={essayQuestionForm.module}
                onChange={(e) => setEssayQuestionForm(prev => ({ ...prev, module: e.target.value }))}
                placeholder="Enter module name"
              />
            </div>
            
            <div>
              <Label htmlFor="questionText">Question Text</Label>
              <Textarea
                id="questionText"
                value={essayQuestionForm.questionText}
                onChange={(e) => setEssayQuestionForm(prev => ({ ...prev, questionText: e.target.value }))}
                placeholder="Enter the full essay question"
                className="h-32"
              />
            </div>
            
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={essayQuestionForm.difficulty}
                onValueChange={(value) => setEssayQuestionForm(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEssayQuestionDialog(false)
                setEditingItem(null)
                resetEssayQuestionForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEssayQuestion} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Create'} Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Thematic Quote Dialog */}
      <Dialog open={showThematicQuoteDialog} onOpenChange={setShowThematicQuoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Thematic Quote' : 'Add New Thematic Quote'}
            </DialogTitle>
            <DialogDescription>
              Create or edit a thematic quote for the quote bank
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="textName">Text Name</Label>
              <Input
                id="textName"
                value={thematicQuoteForm.textName}
                onChange={(e) => setThematicQuoteForm(prev => ({ ...prev, textName: e.target.value }))}
                placeholder="e.g., Nineteen Eighty-Four"
              />
            </div>
            
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={thematicQuoteForm.theme}
                onChange={(e) => setThematicQuoteForm(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="e.g., Individual vs. Collective"
              />
            </div>
            
            <div>
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                value={thematicQuoteForm.quote}
                onChange={(e) => setThematicQuoteForm(prev => ({ ...prev, quote: e.target.value }))}
                placeholder="Enter the quote (without quotation marks)"
                className="h-20"
              />
            </div>
            
            <div>
              <Label htmlFor="context">Context</Label>
              <Textarea
                id="context"
                value={thematicQuoteForm.context}
                onChange={(e) => setThematicQuoteForm(prev => ({ ...prev, context: e.target.value }))}
                placeholder="Provide context for when/how this quote is used"
                className="h-16"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowThematicQuoteDialog(false)
                setEditingItem(null)
                resetThematicQuoteForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveThematicQuote} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Create'} Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 