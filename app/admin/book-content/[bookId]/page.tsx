"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Trash2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { detailedBookService } from "@/lib/services/detailed-book-service"

const supabase = createClient()

interface Book {
  id: string
  title: string
  author: string
  year: string
  description: string
  image: string | null
  category: string
  themes: string[]
  popular: boolean
}

interface ContextSection {
  title?: string
  content: string[]
}

interface DetailedContext {
  contextType: string
  title: string
  sections: ContextSection[]
}

interface RubricSubsection {
  title: string
  content: string[]
}

interface RubricConnection {
  rubricType: string
  title: string
  subsections: RubricSubsection[]
}

interface PlotChapter {
  title: string
  summary: string
  significance: string
}

interface PlotPart {
  title: string
  description?: string
  chapters: PlotChapter[]
}

interface Quote {
  id: string
  text: string
  reference: string
  technique: string
  themes: string[]
  explanation: string
  rubricConnection: string
  chapter: string
  character: string
  significance: 'high' | 'medium' | 'low'
}

interface Technique {
  name: string
  definition: string
  example: string | null
}

export default function BookContentEditPage({ params }: { params: Promise<{ bookId: string }> }) {
  const router = useRouter()
  const { bookId } = use(params)

  // State
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Content state
  const [contexts, setContexts] = useState<DetailedContext[]>([])
  const [rubricConnections, setRubricConnections] = useState<RubricConnection[]>([])
  const [plotParts, setPlotParts] = useState<PlotPart[]>([])
  const [contemporarySections, setContemporarySections] = useState<any[]>([])
  const [essayGuide, setEssayGuide] = useState<any>({})
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [techniques, setTechniques] = useState<Technique[]>([])

  useEffect(() => {
    if (bookId) {
      fetchBookData()
    }
  }, [bookId])

  const fetchBookData = async () => {
    try {
      setLoading(true)

      // Fetch basic book info
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()

      if (bookError) {
        console.error('Error fetching book:', bookError)
        toast({
          title: "Error",
          description: "Failed to fetch book data",
          variant: "destructive"
        })
        return
      }

      setBook(bookData)

      // Fetch detailed content
      const bookContent = await detailedBookService.getBookData(bookId)
      if (bookContent) {
        // Initialize contexts with all four types
        const contextTypes = ['historical', 'political', 'biographical', 'philosophical']
        const initializedContexts = contextTypes.map(type => ({
          contextType: type,
          title: bookContent.detailedContexts[type]?.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Context`,
          sections: bookContent.detailedContexts[type]?.sections || []
        }))
        setContexts(initializedContexts)

        // Initialize rubric connections with all four types  
        const rubricTypes = ['anomaliesAndParadoxes', 'emotionalExperiences', 'relationships', 'humanCapacityForUnderstanding']
        const initializedRubrics = rubricTypes.map(type => ({
          rubricType: type,
          title: bookContent.detailedRubricConnections[type]?.title || type.replace(/([A-Z])/g, ' $1').trim(),
          subsections: bookContent.detailedRubricConnections[type]?.subsections || []
        }))
        setRubricConnections(initializedRubrics)

        setPlotParts(bookContent.plotSummary.parts || [])
        setContemporarySections(bookContent.detailedContemporaryConnections.sections || [])
        
        // Initialize essay guide with proper defaults
        const initializedEssayGuide = {
          structure: {
            title: bookContent.essayGuide.structure?.title || 'Essay Structure',
            parts: bookContent.essayGuide.structure?.parts || []
          },
          techniques: {
            title: bookContent.essayGuide.techniques?.title || 'Essential Techniques for Analysis',
            categories: bookContent.essayGuide.techniques?.categories || []
          },
          mistakes: {
            title: bookContent.essayGuide.mistakes?.title || 'Common Mistakes to Avoid',
            dontDo: bookContent.essayGuide.mistakes?.dontDo || [],
            doInstead: bookContent.essayGuide.mistakes?.doInstead || []
          },
          sampleQuestion: {
            title: bookContent.essayGuide.sampleQuestion?.title || 'Sample HSC Question',
            question: bookContent.essayGuide.sampleQuestion?.question || '',
            approach: bookContent.essayGuide.sampleQuestion?.approach || []
          },
          tips: {
            title: bookContent.essayGuide.tips?.title || 'Writing Tips',
            phases: bookContent.essayGuide.tips?.phases || []
          }
        }
        setEssayGuide(initializedEssayGuide)
        setQuotes(bookContent.quotes || [])
        setTechniques(bookContent.techniques || [])
      } else {
        // Initialize with empty data if no content found
        const contextTypes = ['historical', 'political', 'biographical', 'philosophical']
        setContexts(contextTypes.map(type => ({
          contextType: type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Context`,
          sections: []
        })))

        const rubricTypes = ['anomaliesAndParadoxes', 'emotionalExperiences', 'relationships', 'humanCapacityForUnderstanding']
        setRubricConnections(rubricTypes.map(type => ({
          rubricType: type,
          title: type.replace(/([A-Z])/g, ' $1').trim(),
          subsections: []
        })))

        setEssayGuide({
          structure: { title: 'Essay Structure', parts: [] },
          techniques: { title: 'Essential Techniques for Analysis', categories: [] },
          mistakes: { title: 'Common Mistakes to Avoid', dontDo: [], doInstead: [] },
          sampleQuestion: { title: 'Sample HSC Question', question: '', approach: [] },
          tips: { title: 'Writing Tips', phases: [] }
        })
      }

    } catch (error) {
      console.error('Error fetching book data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch book data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveAllContent = async () => {
    if (!book) return

    try {
      setSaving(true)

      // Save all content sections
      await Promise.all([
        // Save contexts
        ...contexts.map(context =>
          detailedBookService.updateDetailedContext(
            book.id,
            context.contextType,
            context.title,
            context.sections
          )
        ),

        // Save rubric connections
        ...rubricConnections.map(rubric =>
          detailedBookService.updateRubricConnection(
            book.id,
            rubric.rubricType,
            rubric.title,
            rubric.subsections
          )
        ),

        // Save plot summary
        detailedBookService.updatePlotSummary(book.id, plotParts),

        // Save contemporary connections
        detailedBookService.updateContemporaryConnections(book.id, contemporarySections),

        // Save essay guide
        detailedBookService.updateEssayGuide(book.id, essayGuide),

        // Save quotes
        ...quotes.map(quote =>
          detailedBookService.updateBookQuote(book.id, quote)
        ),

        // Save techniques
        ...techniques.map(technique =>
          detailedBookService.updateBookTechnique(book.id, technique)
        )
      ])

      toast({
        title: "Success",
        description: "All content has been saved successfully",
      })

    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addNewQuote = () => {
    const newQuote: Quote = {
      id: `q${quotes.length + 1}`,
      text: "",
      reference: "",
      technique: "",
      themes: [],
      explanation: "",
      rubricConnection: "",
      chapter: "",
      character: "",
      significance: "medium"
    }
    setQuotes([...quotes, newQuote])
  }

  const deleteQuote = (index: number) => {
    const newQuotes = quotes.filter((_, i) => i !== index)
    setQuotes(newQuotes)
  }

  const updateQuote = (index: number, field: keyof Quote, value: any) => {
    const newQuotes = [...quotes]
    newQuotes[index] = { ...newQuotes[index], [field]: value }
    setQuotes(newQuotes)
  }

  const addNewTechnique = () => {
    setTechniques([...techniques, { name: "", definition: "", example: null }])
  }

  const deleteTechnique = (index: number) => {
    const newTechniques = techniques.filter((_, i) => i !== index)
    setTechniques(newTechniques)
  }

  const updateTechnique = (index: number, field: keyof Technique, value: any) => {
    const newTechniques = [...techniques]
    newTechniques[index] = { ...newTechniques[index], [field]: value }
    setTechniques(newTechniques)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading book content...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Button asChild className="mt-4">
            <Link href="/admin/book-content">Back to Books</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin/book-content">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Books
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-gray-600">{book.author} • {book.year}</p>
              </div>
            </div>
            <Button onClick={saveAllContent} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="contexts">Contexts</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
            <TabsTrigger value="plot">Plot</TabsTrigger>
            <TabsTrigger value="contemporary">Contemporary</TabsTrigger>
            <TabsTrigger value="essay">Essay Guide</TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Quotes Management</CardTitle>
                    <CardDescription>Add, edit, and organize quotes for this book</CardDescription>
                  </div>
                  <Button onClick={addNewQuote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {quotes.map((quote, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Quote {index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuote(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`quote-text-${index}`}>Quote Text</Label>
                          <Textarea
                            id={`quote-text-${index}`}
                            placeholder="Enter the quote text..."
                            value={quote.text}
                            onChange={(e) => updateQuote(index, 'text', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quote-explanation-${index}`}>Explanation</Label>
                          <Textarea
                            id={`quote-explanation-${index}`}
                            placeholder="Explain the significance of this quote..."
                            value={quote.explanation}
                            onChange={(e) => updateQuote(index, 'explanation', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`quote-reference-${index}`}>Reference</Label>
                          <Input
                            id={`quote-reference-${index}`}
                            placeholder="e.g., Chapter 1, p. 15"
                            value={quote.reference}
                            onChange={(e) => updateQuote(index, 'reference', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quote-technique-${index}`}>Literary Technique</Label>
                          <Input
                            id={`quote-technique-${index}`}
                            placeholder="e.g., Metaphor, Symbolism"
                            value={quote.technique}
                            onChange={(e) => updateQuote(index, 'technique', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quote-significance-${index}`}>Significance</Label>
                          <Select 
                            value={quote.significance} 
                            onValueChange={(value) => updateQuote(index, 'significance', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`quote-chapter-${index}`}>Chapter</Label>
                          <Input
                            id={`quote-chapter-${index}`}
                            placeholder="e.g., Part 1, Chapter 1"
                            value={quote.chapter}
                            onChange={(e) => updateQuote(index, 'chapter', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quote-character-${index}`}>Character</Label>
                          <Input
                            id={`quote-character-${index}`}
                            placeholder="e.g., Winston Smith"
                            value={quote.character}
                            onChange={(e) => updateQuote(index, 'character', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quote-rubric-${index}`}>Rubric Connection</Label>
                          <Input
                            id={`quote-rubric-${index}`}
                            placeholder="e.g., Anomalies and Paradoxes"
                            value={quote.rubricConnection}
                            onChange={(e) => updateQuote(index, 'rubricConnection', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Themes (comma-separated)</Label>
                        <Input
                          placeholder="e.g., Power, Control, Surveillance"
                          value={quote.themes.join(', ')}
                          onChange={(e) => updateQuote(index, 'themes', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {quotes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No quotes added yet.</p>
                    <Button onClick={addNewQuote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Quote
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Techniques Tab */}
          <TabsContent value="techniques">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Literary Techniques</CardTitle>
                    <CardDescription>Define literary techniques used in this book</CardDescription>
                  </div>
                  <Button onClick={addNewTechnique}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Technique
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {techniques.map((technique, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold">Technique {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTechnique(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`technique-name-${index}`}>Technique Name</Label>
                          <Input
                            id={`technique-name-${index}`}
                            placeholder="e.g., Metaphor, Symbolism"
                            value={technique.name}
                            onChange={(e) => updateTechnique(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`technique-example-${index}`}>Example (Optional)</Label>
                          <Input
                            id={`technique-example-${index}`}
                            placeholder="Short example of the technique"
                            value={technique.example || ''}
                            onChange={(e) => updateTechnique(index, 'example', e.target.value || null)}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor={`technique-definition-${index}`}>Definition</Label>
                        <Textarea
                          id={`technique-definition-${index}`}
                          placeholder="Define what this technique is and how it works..."
                          value={technique.definition}
                          onChange={(e) => updateTechnique(index, 'definition', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {techniques.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No techniques defined yet.</p>
                    <Button onClick={addNewTechnique}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Technique
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contexts Tab */}
          <TabsContent value="contexts">
            <Card>
              <CardHeader>
                <CardTitle>Context Information</CardTitle>
                <CardDescription>Edit historical, political, biographical, and philosophical contexts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {contexts.map((context, contextIndex) => (
                  <Card key={contextIndex} className="border-l-4 border-l-indigo-500">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{context.contextType} Context</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`context-title-${contextIndex}`}>Title</Label>
                        <Input
                          id={`context-title-${contextIndex}`}
                          value={context.title}
                          onChange={(e) => {
                            const newContexts = [...contexts]
                            newContexts[contextIndex].title = e.target.value
                            setContexts(newContexts)
                          }}
                          placeholder="e.g., Historical Context"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Content Sections</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newContexts = [...contexts]
                              newContexts[contextIndex].sections.push({ content: [''] })
                              setContexts(newContexts)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Section
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {context.sections.map((section, sectionIndex) => (
                            <Card key={sectionIndex} className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium">Section {sectionIndex + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newContexts = [...contexts]
                                    newContexts[contextIndex].sections.splice(sectionIndex, 1)
                                    setContexts(newContexts)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {section.title !== undefined && (
                                <div className="mb-3">
                                  <Label htmlFor={`section-title-${contextIndex}-${sectionIndex}`}>Section Title (Optional)</Label>
                                  <Input
                                    id={`section-title-${contextIndex}-${sectionIndex}`}
                                    value={section.title || ''}
                                    onChange={(e) => {
                                      const newContexts = [...contexts]
                                      newContexts[contextIndex].sections[sectionIndex].title = e.target.value
                                      setContexts(newContexts)
                                    }}
                                    placeholder="Optional section title"
                                  />
                                </div>
                              )}

                              <div className="space-y-2">
                                {section.content.map((paragraph, paragraphIndex) => (
                                  <div key={paragraphIndex} className="flex gap-2">
                                    <Textarea
                                      value={paragraph}
                                      onChange={(e) => {
                                        const newContexts = [...contexts]
                                        newContexts[contextIndex].sections[sectionIndex].content[paragraphIndex] = e.target.value
                                        setContexts(newContexts)
                                      }}
                                      placeholder="Enter paragraph content..."
                                      rows={3}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newContexts = [...contexts]
                                        newContexts[contextIndex].sections[sectionIndex].content.splice(paragraphIndex, 1)
                                        setContexts(newContexts)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newContexts = [...contexts]
                                    newContexts[contextIndex].sections[sectionIndex].content.push('')
                                    setContexts(newContexts)
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Paragraph
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rubric Tab */}
          <TabsContent value="rubric">
            <Card>
              <CardHeader>
                <CardTitle>HSC Rubric Connections</CardTitle>
                <CardDescription>Connect themes to HSC assessment criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {rubricConnections.map((rubric, rubricIndex) => (
                  <Card key={rubricIndex} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{rubric.rubricType.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`rubric-title-${rubricIndex}`}>Title</Label>
                        <Input
                          id={`rubric-title-${rubricIndex}`}
                          value={rubric.title}
                          onChange={(e) => {
                            const newRubrics = [...rubricConnections]
                            newRubrics[rubricIndex].title = e.target.value
                            setRubricConnections(newRubrics)
                          }}
                          placeholder="e.g., Anomalies and Paradoxes"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Subsections</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newRubrics = [...rubricConnections]
                              newRubrics[rubricIndex].subsections.push({ title: '', content: [''] })
                              setRubricConnections(newRubrics)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Subsection
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {rubric.subsections.map((subsection, subsectionIndex) => (
                            <Card key={subsectionIndex} className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium">Subsection {subsectionIndex + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newRubrics = [...rubricConnections]
                                    newRubrics[rubricIndex].subsections.splice(subsectionIndex, 1)
                                    setRubricConnections(newRubrics)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mb-3">
                                <Label htmlFor={`subsection-title-${rubricIndex}-${subsectionIndex}`}>Subsection Title</Label>
                                <Input
                                  id={`subsection-title-${rubricIndex}-${subsectionIndex}`}
                                  value={subsection.title}
                                  onChange={(e) => {
                                    const newRubrics = [...rubricConnections]
                                    newRubrics[rubricIndex].subsections[subsectionIndex].title = e.target.value
                                    setRubricConnections(newRubrics)
                                  }}
                                  placeholder="e.g., Doublethink and Contradictory Beliefs"
                                />
                              </div>

                              <div className="space-y-2">
                                {subsection.content.map((paragraph, paragraphIndex) => (
                                  <div key={paragraphIndex} className="flex gap-2">
                                    <Textarea
                                      value={paragraph}
                                      onChange={(e) => {
                                        const newRubrics = [...rubricConnections]
                                        newRubrics[rubricIndex].subsections[subsectionIndex].content[paragraphIndex] = e.target.value
                                        setRubricConnections(newRubrics)
                                      }}
                                      placeholder="Explain the rubric connection..."
                                      rows={3}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newRubrics = [...rubricConnections]
                                        newRubrics[rubricIndex].subsections[subsectionIndex].content.splice(paragraphIndex, 1)
                                        setRubricConnections(newRubrics)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newRubrics = [...rubricConnections]
                                    newRubrics[rubricIndex].subsections[subsectionIndex].content.push('')
                                    setRubricConnections(newRubrics)
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Paragraph
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plot Tab */}
          <TabsContent value="plot">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Plot Summary</CardTitle>
                    <CardDescription>Chapter-by-chapter breakdown and analysis</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setPlotParts([...plotParts, { title: '', chapters: [] }])
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Part
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {plotParts.map((part, partIndex) => (
                  <Card key={partIndex} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Part {partIndex + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newParts = plotParts.filter((_, i) => i !== partIndex)
                            setPlotParts(newParts)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`part-title-${partIndex}`}>Part Title</Label>
                          <Input
                            id={`part-title-${partIndex}`}
                            value={part.title}
                            onChange={(e) => {
                              const newParts = [...plotParts]
                              newParts[partIndex].title = e.target.value
                              setPlotParts(newParts)
                            }}
                            placeholder="e.g., Part One: The World of Winston Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`part-description-${partIndex}`}>Description (Optional)</Label>
                          <Input
                            id={`part-description-${partIndex}`}
                            value={part.description || ''}
                            onChange={(e) => {
                              const newParts = [...plotParts]
                              newParts[partIndex].description = e.target.value
                              setPlotParts(newParts)
                            }}
                            placeholder="Brief description of this part"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Chapters</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newParts = [...plotParts]
                              newParts[partIndex].chapters.push({ title: '', summary: '', significance: '' })
                              setPlotParts(newParts)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Chapter
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {part.chapters.map((chapter, chapterIndex) => (
                            <Card key={chapterIndex} className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium">Chapter {chapterIndex + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newParts = [...plotParts]
                                    newParts[partIndex].chapters.splice(chapterIndex, 1)
                                    setPlotParts(newParts)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor={`chapter-title-${partIndex}-${chapterIndex}`}>Chapter Title</Label>
                                  <Input
                                    id={`chapter-title-${partIndex}-${chapterIndex}`}
                                    value={chapter.title}
                                    onChange={(e) => {
                                      const newParts = [...plotParts]
                                      newParts[partIndex].chapters[chapterIndex].title = e.target.value
                                      setPlotParts(newParts)
                                    }}
                                    placeholder="e.g., Chapter 1: Winston's World"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`chapter-summary-${partIndex}-${chapterIndex}`}>Summary</Label>
                                  <Textarea
                                    id={`chapter-summary-${partIndex}-${chapterIndex}`}
                                    value={chapter.summary}
                                    onChange={(e) => {
                                      const newParts = [...plotParts]
                                      newParts[partIndex].chapters[chapterIndex].summary = e.target.value
                                      setPlotParts(newParts)
                                    }}
                                    placeholder="Summarize what happens in this chapter..."
                                    rows={3}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`chapter-significance-${partIndex}-${chapterIndex}`}>Significance</Label>
                                  <Textarea
                                    id={`chapter-significance-${partIndex}-${chapterIndex}`}
                                    value={chapter.significance}
                                    onChange={(e) => {
                                      const newParts = [...plotParts]
                                      newParts[partIndex].chapters[chapterIndex].significance = e.target.value
                                      setPlotParts(newParts)
                                    }}
                                    placeholder="Explain the significance of this chapter..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {plotParts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No plot parts added yet.</p>
                    <Button onClick={() => setPlotParts([{ title: '', chapters: [] }])}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Part
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contemporary Tab */}
          <TabsContent value="contemporary">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Contemporary Connections</CardTitle>
                    <CardDescription>Modern parallels and relevance</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setContemporarySections([...contemporarySections, { title: '', subsections: [] }])
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {contemporarySections.map((section, sectionIndex) => (
                  <Card key={sectionIndex} className="border-l-4 border-l-teal-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Section {sectionIndex + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSections = contemporarySections.filter((_, i) => i !== sectionIndex)
                            setContemporarySections(newSections)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`contemporary-title-${sectionIndex}`}>Section Title</Label>
                        <Input
                          id={`contemporary-title-${sectionIndex}`}
                          value={section.title}
                          onChange={(e) => {
                            const newSections = [...contemporarySections]
                            newSections[sectionIndex].title = e.target.value
                            setContemporarySections(newSections)
                          }}
                          placeholder="e.g., Digital Surveillance and Privacy"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Subsections</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSections = [...contemporarySections]
                              newSections[sectionIndex].subsections.push({ title: '', content: [''] })
                              setContemporarySections(newSections)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Subsection
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {section.subsections.map((subsection, subsectionIndex) => (
                            <Card key={subsectionIndex} className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-medium">Subsection {subsectionIndex + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSections = [...contemporarySections]
                                    newSections[sectionIndex].subsections.splice(subsectionIndex, 1)
                                    setContemporarySections(newSections)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mb-3">
                                <Label htmlFor={`contemporary-subsection-title-${sectionIndex}-${subsectionIndex}`}>Subsection Title</Label>
                                <Input
                                  id={`contemporary-subsection-title-${sectionIndex}-${subsectionIndex}`}
                                  value={subsection.title}
                                  onChange={(e) => {
                                    const newSections = [...contemporarySections]
                                    newSections[sectionIndex].subsections[subsectionIndex].title = e.target.value
                                    setContemporarySections(newSections)
                                  }}
                                  placeholder="e.g., Government Mass Surveillance"
                                />
                              </div>

                              <div className="space-y-2">
                                {subsection.content.map((paragraph, paragraphIndex) => (
                                  <div key={paragraphIndex} className="flex gap-2">
                                    <Textarea
                                      value={paragraph}
                                      onChange={(e) => {
                                        const newSections = [...contemporarySections]
                                        newSections[sectionIndex].subsections[subsectionIndex].content[paragraphIndex] = e.target.value
                                        setContemporarySections(newSections)
                                      }}
                                      placeholder="Explain the contemporary connection..."
                                      rows={3}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newSections = [...contemporarySections]
                                        newSections[sectionIndex].subsections[subsectionIndex].content.splice(paragraphIndex, 1)
                                        setContemporarySections(newSections)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSections = [...contemporarySections]
                                    newSections[sectionIndex].subsections[subsectionIndex].content.push('')
                                    setContemporarySections(newSections)
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Paragraph
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {contemporarySections.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No contemporary sections added yet.</p>
                    <Button onClick={() => setContemporarySections([{ title: '', subsections: [] }])}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Section
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Essay Guide Tab */}
          <TabsContent value="essay">
            <Card>
              <CardHeader>
                <CardTitle>Essay Writing Guide</CardTitle>
                <CardDescription>Structure, techniques, and tips for writing essays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Essay Structure */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Essay Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="structure-title">Structure Title</Label>
                      <Input
                        id="structure-title"
                        value={essayGuide.structure?.title || ''}
                        onChange={(e) => {
                          setEssayGuide({
                            ...essayGuide,
                            structure: { ...essayGuide.structure, title: e.target.value }
                          })
                        }}
                        placeholder="e.g., Essay Structure"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Structure Parts</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newParts = [...(essayGuide.structure?.parts || []), { title: '', content: [] }]
                            setEssayGuide({
                              ...essayGuide,
                              structure: { ...essayGuide.structure, parts: newParts }
                            })
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Part
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(essayGuide.structure?.parts || []).map((part, partIndex) => (
                          <Card key={partIndex} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-sm font-medium">Part {partIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newParts = essayGuide.structure?.parts?.filter((_, i) => i !== partIndex) || []
                                  setEssayGuide({
                                    ...essayGuide,
                                    structure: { ...essayGuide.structure, parts: newParts }
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <Label>Part Title</Label>
                                <Input
                                  value={part.title}
                                  onChange={(e) => {
                                    const newParts = [...(essayGuide.structure?.parts || [])]
                                    newParts[partIndex].title = e.target.value
                                    setEssayGuide({
                                      ...essayGuide,
                                      structure: { ...essayGuide.structure, parts: newParts }
                                    })
                                  }}
                                  placeholder="e.g., Introduction"
                                />
                              </div>
                              <div>
                                <Label>Word Count (Optional)</Label>
                                <Input
                                  value={part.wordCount || ''}
                                  onChange={(e) => {
                                    const newParts = [...(essayGuide.structure?.parts || [])]
                                    newParts[partIndex].wordCount = e.target.value
                                    setEssayGuide({
                                      ...essayGuide,
                                      structure: { ...essayGuide.structure, parts: newParts }
                                    })
                                  }}
                                  placeholder="e.g., 150-200 words"
                                />
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label>Example (Optional)</Label>
                              <Textarea
                                value={part.example || ''}
                                onChange={(e) => {
                                  const newParts = [...(essayGuide.structure?.parts || [])]
                                  newParts[partIndex].example = e.target.value
                                  setEssayGuide({
                                    ...essayGuide,
                                    structure: { ...essayGuide.structure, parts: newParts }
                                  })
                                }}
                                placeholder="Example text..."
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label>Content Points</Label>
                              <div className="space-y-2">
                                {(part.content || []).map((content, contentIndex) => (
                                  <div key={contentIndex} className="flex gap-2">
                                    <Textarea
                                      value={content}
                                      onChange={(e) => {
                                        const newParts = [...(essayGuide.structure?.parts || [])]
                                        newParts[partIndex].content[contentIndex] = e.target.value
                                        setEssayGuide({
                                          ...essayGuide,
                                          structure: { ...essayGuide.structure, parts: newParts }
                                        })
                                      }}
                                      placeholder="Content point..."
                                      rows={2}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newParts = [...(essayGuide.structure?.parts || [])]
                                        newParts[partIndex].content.splice(contentIndex, 1)
                                        setEssayGuide({
                                          ...essayGuide,
                                          structure: { ...essayGuide.structure, parts: newParts }
                                        })
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newParts = [...(essayGuide.structure?.parts || [])]
                                    if (!newParts[partIndex].content) newParts[partIndex].content = []
                                    newParts[partIndex].content.push('')
                                    setEssayGuide({
                                      ...essayGuide,
                                      structure: { ...essayGuide.structure, parts: newParts }
                                    })
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Content Point
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Common Mistakes */}
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Common Mistakes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="mistakes-title">Mistakes Title</Label>
                      <Input
                        id="mistakes-title"
                        value={essayGuide.mistakes?.title || ''}
                        onChange={(e) => {
                          setEssayGuide({
                            ...essayGuide,
                            mistakes: { ...essayGuide.mistakes, title: e.target.value }
                          })
                        }}
                        placeholder="e.g., Common Mistakes to Avoid"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Don't Do This:</Label>
                        <div className="space-y-2">
                          {(essayGuide.mistakes?.dontDo || []).map((mistake, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={mistake}
                                onChange={(e) => {
                                  const newMistakes = [...(essayGuide.mistakes?.dontDo || [])]
                                  newMistakes[index] = e.target.value
                                  setEssayGuide({
                                    ...essayGuide,
                                    mistakes: { ...essayGuide.mistakes, dontDo: newMistakes }
                                  })
                                }}
                                placeholder="Common mistake..."
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newMistakes = essayGuide.mistakes?.dontDo?.filter((_, i) => i !== index) || []
                                  setEssayGuide({
                                    ...essayGuide,
                                    mistakes: { ...essayGuide.mistakes, dontDo: newMistakes }
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newMistakes = [...(essayGuide.mistakes?.dontDo || []), '']
                              setEssayGuide({
                                ...essayGuide,
                                mistakes: { ...essayGuide.mistakes, dontDo: newMistakes }
                              })
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Mistake
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Do This Instead:</Label>
                        <div className="space-y-2">
                          {(essayGuide.mistakes?.doInstead || []).map((advice, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={advice}
                                onChange={(e) => {
                                  const newAdvice = [...(essayGuide.mistakes?.doInstead || [])]
                                  newAdvice[index] = e.target.value
                                  setEssayGuide({
                                    ...essayGuide,
                                    mistakes: { ...essayGuide.mistakes, doInstead: newAdvice }
                                  })
                                }}
                                placeholder="Better approach..."
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newAdvice = essayGuide.mistakes?.doInstead?.filter((_, i) => i !== index) || []
                                  setEssayGuide({
                                    ...essayGuide,
                                    mistakes: { ...essayGuide.mistakes, doInstead: newAdvice }
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAdvice = [...(essayGuide.mistakes?.doInstead || []), '']
                              setEssayGuide({
                                ...essayGuide,
                                mistakes: { ...essayGuide.mistakes, doInstead: newAdvice }
                              })
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Advice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Question */}
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Sample HSC Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sample-title">Question Title</Label>
                      <Input
                        id="sample-title"
                        value={essayGuide.sampleQuestion?.title || ''}
                        onChange={(e) => {
                          setEssayGuide({
                            ...essayGuide,
                            sampleQuestion: { ...essayGuide.sampleQuestion, title: e.target.value }
                          })
                        }}
                        placeholder="e.g., Sample HSC Question"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sample-question">Question Text</Label>
                      <Textarea
                        id="sample-question"
                        value={essayGuide.sampleQuestion?.question || ''}
                        onChange={(e) => {
                          setEssayGuide({
                            ...essayGuide,
                            sampleQuestion: { ...essayGuide.sampleQuestion, question: e.target.value }
                          })
                        }}
                        placeholder="Enter the sample HSC question..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Approach Points</Label>
                      <div className="space-y-2">
                        {(essayGuide.sampleQuestion?.approach || []).map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={point}
                              onChange={(e) => {
                                const newApproach = [...(essayGuide.sampleQuestion?.approach || [])]
                                newApproach[index] = e.target.value
                                setEssayGuide({
                                  ...essayGuide,
                                  sampleQuestion: { ...essayGuide.sampleQuestion, approach: newApproach }
                                })
                              }}
                              placeholder="Approach point..."
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newApproach = essayGuide.sampleQuestion?.approach?.filter((_, i) => i !== index) || []
                                setEssayGuide({
                                  ...essayGuide,
                                  sampleQuestion: { ...essayGuide.sampleQuestion, approach: newApproach }
                                })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newApproach = [...(essayGuide.sampleQuestion?.approach || []), '']
                            setEssayGuide({
                              ...essayGuide,
                              sampleQuestion: { ...essayGuide.sampleQuestion, approach: newApproach }
                            })
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Approach Point
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Writing Tips */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Writing Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tips-title">Tips Title</Label>
                      <Input
                        id="tips-title"
                        value={essayGuide.tips?.title || ''}
                        onChange={(e) => {
                          setEssayGuide({
                            ...essayGuide,
                            tips: { ...essayGuide.tips, title: e.target.value }
                          })
                        }}
                        placeholder="e.g., Writing Tips"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Tip Phases</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPhases = [...(essayGuide.tips?.phases || []), { title: '', tips: [] }]
                            setEssayGuide({
                              ...essayGuide,
                              tips: { ...essayGuide.tips, phases: newPhases }
                            })
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Phase
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(essayGuide.tips?.phases || []).map((phase, phaseIndex) => (
                          <Card key={phaseIndex} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-sm font-medium">Phase {phaseIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newPhases = essayGuide.tips?.phases?.filter((_, i) => i !== phaseIndex) || []
                                  setEssayGuide({
                                    ...essayGuide,
                                    tips: { ...essayGuide.tips, phases: newPhases }
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mb-3">
                              <Label>Phase Title</Label>
                              <Input
                                value={phase.title}
                                onChange={(e) => {
                                  const newPhases = [...(essayGuide.tips?.phases || [])]
                                  newPhases[phaseIndex].title = e.target.value
                                  setEssayGuide({
                                    ...essayGuide,
                                    tips: { ...essayGuide.tips, phases: newPhases }
                                  })
                                }}
                                placeholder="e.g., Before You Write"
                              />
                            </div>

                            <div>
                              <Label>Tips</Label>
                              <div className="space-y-2">
                                {(phase.tips || []).map((tip, tipIndex) => (
                                  <div key={tipIndex} className="flex gap-2">
                                    <Input
                                      value={tip}
                                      onChange={(e) => {
                                        const newPhases = [...(essayGuide.tips?.phases || [])]
                                        newPhases[phaseIndex].tips[tipIndex] = e.target.value
                                        setEssayGuide({
                                          ...essayGuide,
                                          tips: { ...essayGuide.tips, phases: newPhases }
                                        })
                                      }}
                                      placeholder="Writing tip..."
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newPhases = [...(essayGuide.tips?.phases || [])]
                                        newPhases[phaseIndex].tips.splice(tipIndex, 1)
                                        setEssayGuide({
                                          ...essayGuide,
                                          tips: { ...essayGuide.tips, phases: newPhases }
                                        })
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newPhases = [...(essayGuide.tips?.phases || [])]
                                    if (!newPhases[phaseIndex].tips) newPhases[phaseIndex].tips = []
                                    newPhases[phaseIndex].tips.push('')
                                    setEssayGuide({
                                      ...essayGuide,
                                      tips: { ...essayGuide.tips, phases: newPhases }
                                    })
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Tip
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 