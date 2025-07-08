"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"
import { 
  ChevronRight, 
  FileText, 
  Clock, 
  MessageCircle, 
  RefreshCw, 
  X,
  Sparkles,
  Check,
  Send
} from "lucide-react"
import EssayGradingModal from "@/components/ui/essay-grading-modal"

// Import books from database
import { getBooks, type BookInterface } from "@/lib/books"

// Quote interface for database quotes
interface DatabaseQuote {
  id: number;
  book_id: string;
  theme: string;
  quote_text: string;
  context: string;
  page_reference?: string;
  chapter_reference?: string;
  literary_techniques?: string[];
  importance_level: number;
}

// Essay questions by text
const questionsByText = {
  frankenstein: [
    "How does Shelley use the framed narrative structure to explore the central themes of Frankenstein?",
    "Explore the role of nature in Frankenstein and its relationship to the characters' emotional states.",
    "To what extent is Victor Frankenstein responsible for the tragedy that unfolds in the novel?",
    "Analyze the theme of isolation in Frankenstein and its impact on the development of the creature.",
    "How does Shelley use the motif of light and darkness throughout Frankenstein?",
  ],
  "1984": [
    "How does Orwell use language as a means of control in 1984?",
    "Analyze the significance of Winston's relationship with Julia in the context of rebellion against the Party.",
    "To what extent is the individual powerless against the state in 1984?",
    "Explore how Orwell creates a sense of psychological terror in 1984.",
    "How does the concept of doublethink function as both a political and psychological tool in 1984?",
  ],
  "great-gatsby": [
    "How does Fitzgerald use symbolism to explore the corruption of the American Dream in The Great Gatsby?",
    "Analyze the character of Jay Gatsby as both a romantic idealist and a product of American materialism.",
    "To what extent is The Great Gatsby a critique of the social values of 1920s America?",
    "Explore the significance of the narrator, Nick Carraway, in shaping our understanding of the novel.",
    "How does Fitzgerald use setting to reinforce the themes of wealth, class, and moral corruption in The Great Gatsby?",
  ],
  hamlet: [
    "How does Shakespeare explore the theme of revenge in Hamlet?",
    "Analyze the significance of Hamlet's soliloquies in revealing his psychological state.",
    "To what extent is Hamlet's madness real or feigned?",
    "Explore the role of women in Hamlet and their treatment in the patriarchal society of the play.",
    "How does Shakespeare use the motif of performance and theatricality throughout Hamlet?",
  ],
  "jane-eyre": [
    "How does Brontë use Gothic elements to explore Jane's psychological development?",
    "Analyze the significance of Jane's position as a governess in Victorian society.",
    "To what extent is Jane Eyre a feminist novel?",
    "Explore the theme of social class in Jane Eyre and its impact on the characters' relationships.",
    "How does Brontë use symbolism to reveal Jane's emotional state throughout the novel?",
  ],
  "yeats-poetry": [
    "How does Yeats use symbolism to explore his vision of Irish identity?",
    "Analyze the theme of aging and mortality in Yeats's later poems.",
    "To what extent does Yeats's poetry reflect his personal and political concerns?",
    "Explore the significance of mythology and folklore in Yeats's poetic imagination.",
    "How does Yeats's use of imagery evolve throughout his poetic career?",
  ],
}

export default function EssayMode() {
  const { user, selectedBook } = useAuth()
  const { trackEssayCompletion, trackStudySession } = useProgressTracker()
  const { toast } = useToast()
  const [stage, setStage] = useState("start")
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionMethod, setQuestionMethod] = useState("") // "ai" or "past-exam"
  const [essayContent, setEssayContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [timer, setTimer] = useState(40 * 60) // 40 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(false)
  const [savedDraft, setSavedDraft] = useState(false)
  const [aiFeedback, setAiFeedback] = useState([])
  const [showAiFeedback, setShowAiFeedback] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState("")
  const [showGradingModal, setShowGradingModal] = useState(false)
  const [quotes, setQuotes] = useState<DatabaseQuote[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)

  // Check if user has selected a book
  useEffect(() => {
    if (!selectedBook && user) {
      toast({
        title: "No Book Selected",
        description: "Please complete your profile setup to access essay mode.",
        variant: "destructive",
      })
    }
  }, [selectedBook, user, toast])

  // Load quotes when book changes
  useEffect(() => {
    if (selectedBook) {
      loadQuotes()
    }
  }, [selectedBook])

  // Load saved draft - always load if available
  useEffect(() => {
    const savedEssay = localStorage.getItem("essayDraft")
    const savedQuestion = localStorage.getItem("selectedQuestion")

    if (savedEssay) {
      setEssayContent(savedEssay)
      setWordCount(savedEssay.trim().split(/\s+/).length)
    }

    if (savedQuestion) {
      setSelectedQuestion(savedQuestion)
    }

    // Set savedDraft to true if there's any saved content
    if (savedEssay || savedQuestion) {
      setSavedDraft(true)
    }
  }, [selectedBook])

  // Function to load quotes from database
  const loadQuotes = async () => {
    if (!selectedBook) return

    setQuotesLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('bookId', selectedBook.id)
      
      const response = await fetch(`/api/quotes?${params.toString()}`)
      if (response.ok) {
        const quotesData = await response.json()
        setQuotes(quotesData)
      } else {
        console.error('Failed to fetch quotes')
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setQuotesLoading(false)
    }
  }

  // Timer functionality
  useEffect(() => {
    let interval
    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timer])

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Feedback Analysis
  const analyzeEssayWithAI = async (content) => {
    if (!content.trim() || content === lastAnalyzedContent || isAnalyzing) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          question: selectedQuestion,
          text: selectedBook?.title
        }),
      })

      if (response.ok) {
        const analysisArray = await response.json()
        const timestamp = new Date().toLocaleTimeString()
        
        // Handle both single analysis object and array of analyses
        const analyses = Array.isArray(analysisArray) ? analysisArray : [analysisArray]
        
        const newFeedback = analyses.map((analysis, index) => ({
          id: Date.now() + index,
          type: analysis.type || 'suggestion', // 'suggestion', 'missing', 'strength'
          message: analysis.message || 'Continue developing your essay.',
          section: analysis.section || 'overall', // 'introduction', 'body', 'conclusion', 'overall'
          priority: analysis.priority || 'medium', // 'high', 'medium', 'low'
          timestamp
        }))
        
        setAiFeedback(prev => [...prev, ...newFeedback])
        setLastAnalyzedContent(content)
      }
    } catch (error) {
      console.error('Error analyzing essay:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Debounced essay analysis
  useEffect(() => {
    if (essayContent.trim() && essayContent.length > 50) {
      const timeoutId = setTimeout(() => {
        analyzeEssayWithAI(essayContent)
      }, 3000) // Wait 3 seconds after user stops typing

      return () => clearTimeout(timeoutId)
    }
  }, [essayContent])

  // Generate questions based on book
  const generateQuestions = async (method) => {
    if (!selectedBook) return

    setIsGeneratingQuestions(true)
    setQuestionMethod(method)
    
    try {
      if (method === "past-exam") {
        // Fetch past exam questions from database
        const response = await fetch(`/api/past-exam-questions?bookId=${selectedBook.id}`)
        
        if (response.ok) {
          const dbQuestions = await response.json()
          if (dbQuestions.length > 0) {
            setGeneratedQuestions(dbQuestions)
          } else {
            // Fallback to hardcoded questions if no database questions exist
            const fallbackQuestions = questionsByText[selectedBook.id] || []
            setGeneratedQuestions(fallbackQuestions)
          }
        } else {
          // Fallback to hardcoded questions on API error
          const fallbackQuestions = questionsByText[selectedBook.id] || []
          setGeneratedQuestions(fallbackQuestions)
        }
      } else if (method === "ai") {
        // Use custom generation
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: selectedBook.title,
            textDescription: selectedBook.description,
          }),
        })

        if (response.ok) {
          const questions = await response.json()
          setGeneratedQuestions(questions)
        } else {
          throw new Error('Question generation failed')
        }
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      // Fallback to existing questions
      if (questionsByText[selectedBook.id]) {
        setGeneratedQuestions(questionsByText[selectedBook.id])
      }
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  // Handle question selection
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question)
    // Save to local storage
    localStorage.setItem("selectedQuestion", question)
    
    // Track session start time for study time calculation
    if (user?.id) {
      const sessionStart = new Date()
      sessionStorage.setItem('essaySessionStart', sessionStart.toISOString())
    }
  }

  // Handle essay content change
  const handleEssayChange = (e) => {
    const content = e.target.value
    setEssayContent(content)
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0)

    // Auto-save draft
    localStorage.setItem("essayDraft", content)
  }

  // Handle save draft
  const handleSaveDraft = () => {
    localStorage.setItem("essayDraft", essayContent)
    localStorage.setItem("selectedQuestion", selectedQuestion)
    setSavedDraft(true)

    // Show saved notification
    setTimeout(() => {
      setSavedDraft(false)
    }, 3000)
  }

  // Handle timer start/pause
  const handleTimer = () => {
    setTimerRunning(!timerRunning)
  }

  // Handle essay submission
  const handleSubmitEssay = () => {
    setShowGradingModal(true)
  }

  // Handle closing grading modal and resetting
  const handleGradingModalClose = async (finalScore?: number) => {
    console.log('🔍 handleGradingModalClose called with finalScore:', finalScore)
    
    // Track essay completion if user is authenticated
    if (user?.id && wordCount > 0) {
      try {
        // Count quotes used in essay (simple heuristic - look for quotation marks)
        const quoteCount = (essayContent.match(/"/g) || []).length / 2
        
        // Use provided score or estimate based on word count and content quality
        const score = finalScore !== undefined && finalScore !== null 
          ? finalScore 
          : Math.min(100, Math.max(50, 
              (wordCount >= 800 ? 80 : 60) + (quoteCount >= 2 ? 10 : 0)
            ))
        
        console.log('🔍 Tracking essay with:', {
          userId: user.id,
          score,
          wordCount,
          quoteCount: Math.floor(quoteCount),
          finalScoreProvided: finalScore
        })
        
        await trackEssayCompletion(
          score,
          wordCount,
          Math.floor(quoteCount)
        )

        // Track study time for the essay session
        const sessionStartStr = sessionStorage.getItem('essaySessionStart')
        if (sessionStartStr) {
          const sessionStart = new Date(sessionStartStr)
          const sessionEnd = new Date()
          const studyTimeMinutes = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60))
          
          if (studyTimeMinutes > 0) {
            await trackStudySession(studyTimeMinutes)
          }
          
          sessionStorage.removeItem('essaySessionStart')
        }
      } catch (error) {
        console.error('Failed to track essay progress:', error)
      }
    } else {
      console.log('🔍 Essay tracking skipped:', {
        hasUser: !!user?.id,
        wordCount,
        userAuth: user?.id
      })
    }

    setShowGradingModal(false)
    
    // Clear saved draft after submission
    localStorage.removeItem("essayDraft")
    localStorage.removeItem("selectedQuestion")

    // Reset state
    setStage("start")
    setSelectedQuestion("")
    setEssayContent("")
    setWordCount(0)
    setTimer(40 * 60)
    setTimerRunning(false)
    setGeneratedQuestions([])
    setQuestionMethod("")
    setAiFeedback([])
    setSavedDraft(false)
  }

  // Handle continue from saved draft
  const handleContinueDraft = () => {
    if (selectedQuestion) {
      setStage("practice")
    } else {
      setStage("question-generation")
    }
    
    // Track session start time for study time calculation
    if (user?.id) {
      const sessionStart = new Date()
      sessionStorage.setItem('essaySessionStart', sessionStart.toISOString())
    }
  }

  // Handle start new essay
  const handleStartNew = () => {
    setStage("question-generation")
  }

  // Handle clear draft manually
  const handleClearDraft = () => {
    localStorage.removeItem("essayDraft")
    localStorage.removeItem("selectedQuestion")
    setEssayContent("")
    setSelectedQuestion("")
    setWordCount(0)
    setSavedDraft(false)
    setStage("start")
  }

  // Clear feedback
  const clearAiFeedback = () => {
    setAiFeedback([])
  }

  // Dismiss individual feedback
  const dismissFeedback = (id) => {
    setAiFeedback(prev => prev.filter(feedback => feedback.id !== id))
  }

  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Essay Mode</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access Essay Mode. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Start screen
  if (stage === "start") {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Essay Mode</h1>
        <p className="text-lg mb-8">Practice writing essays with intelligent feedback and question generation.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedDraft && (
            <Card>
              <CardHeader>
                <CardTitle>Continue Working</CardTitle>
                <CardDescription>
                  You have saved progress. Continue where you left off or start fresh.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Text: {selectedBook?.title}</p>
                {selectedQuestion && <p className="mt-2 text-sm text-gray-600">Question: {selectedQuestion}</p>}
                {essayContent && <p className="mt-2 text-sm">Word Count: {wordCount} words</p>}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={handleContinueDraft} className="flex-1">
                  Continue
                </Button>
                <Button variant="outline" onClick={handleClearDraft} className="flex-1">
                  Clear & Start New
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Start New Essay</CardTitle>
              <CardDescription>Begin a new guided essay practice session.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Get custom questions and real-time feedback.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" /> AI-powered question generation
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" /> Live feedback and suggestions
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" /> Essay structure analysis
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" /> 40-minute timer with auto-save
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartNew} className="w-full">
                Start New Essay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Question generation screen
  if (stage === "question-generation") {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Generate Essay Questions</h1>
        
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary">Text: {selectedBook?.title}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles size={18} className="mr-2" />
                  Custom Generated Questions
                </CardTitle>
                <CardDescription>
                  Get custom essay questions based on your selected text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => generateQuestions("ai")} 
                  disabled={isGeneratingQuestions}
                  className="w-full"
                  variant={questionMethod === "ai" ? "default" : "outline"}
                >
                  {isGeneratingQuestions && questionMethod === "ai" ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText size={18} className="mr-2" />
                  Past Exam Questions
                </CardTitle>
                <CardDescription>
                  Choose from real HSC past paper questions for your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => generateQuestions("past-exam")} 
                  disabled={isGeneratingQuestions}
                  className="w-full"
                  variant={questionMethod === "past-exam" ? "default" : "outline"}
                >
                  {isGeneratingQuestions && questionMethod === "past-exam" ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Loading Past Questions...
                    </>
                  ) : (
                    <>
                      <FileText size={16} className="mr-2" />
                      Browse Past Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {generatedQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Choose Your Essay Question</h2>
              <Badge variant={questionMethod === "ai" ? "default" : "secondary"}>
                {questionMethod === "ai" ? "Custom Generated" : "Past Exam Questions"}
              </Badge>
            </div>
            {generatedQuestions.map((question, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  selectedQuestion === question ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => handleSelectQuestion(question)}
              >
                <CardContent className="p-4">
                  <p className="font-medium">{question}</p>
                </CardContent>
              </Card>
            ))}
            
            {selectedQuestion && (
              <div className="text-center pt-4">
                <Button onClick={() => setStage("practice")} size="lg">
                  Start Writing Essay
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setStage("start")}>
            Back to Start
          </Button>
        </div>
      </div>
    )
  }



   // Practice screen (enhanced with feedback)
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left sidebar - Quote Bank */}
      <div className="w-80 border-r bg-muted/30 overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText size={18} className="mr-2" /> Quote Bank
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Quotes organized by theme for {selectedBook?.title}</p>
        </div>

        <ScrollArea className="flex-1">
          {quotesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading quotes...</div>
          ) : quotes.length > 0 ? (
            <Accordion type="multiple" className="px-4 pt-2">
              {(() => {
                // Group quotes by theme
                const quotesByTheme = quotes.reduce((acc, quote) => {
                  if (!acc[quote.theme]) acc[quote.theme] = []
                  acc[quote.theme].push(quote)
                  return acc
                }, {} as Record<string, DatabaseQuote[]>)

                // Show all themes for the selected book
                const allThemes = Object.entries(quotesByTheme)

                if (allThemes.length === 0) {
                  return (
                    <div className="p-4 text-center text-muted-foreground">
                      <p className="text-sm">No quotes found for this book.</p>
                      <p className="text-xs mt-2">Contact admin to add quotes for better essay support.</p>
                    </div>
                  )
                }

                return allThemes.map(([theme, themeQuotes]) => (
                  <AccordionItem key={theme} value={theme}>
                    <AccordionTrigger className="text-sm font-medium py-3">
                      {theme} ({themeQuotes.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {themeQuotes
                          .sort((a, b) => b.importance_level - a.importance_level) // Sort by importance
                          .map((quoteObj) => (
                          <div key={quoteObj.id} className="bg-background rounded-md p-3 text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-1">
                                {Array.from({ length: quoteObj.importance_level }).map((_, i) => (
                                  <span key={i} className="text-yellow-500 text-xs">★</span>
                                ))}
                              </div>
                              {(quoteObj.page_reference || quoteObj.chapter_reference) && (
                                <div className="text-xs text-muted-foreground">
                                  {quoteObj.chapter_reference && <span>{quoteObj.chapter_reference}</span>}
                                  {quoteObj.chapter_reference && quoteObj.page_reference && <span>, </span>}
                                  {quoteObj.page_reference && <span>{quoteObj.page_reference}</span>}
                                </div>
                              )}
                            </div>
                            <blockquote className="italic border-l-2 border-primary/20 pl-2">
                              "{quoteObj.quote_text}"
                            </blockquote>
                            <p className="text-xs text-muted-foreground mt-2">{quoteObj.context}</p>
                            {quoteObj.literary_techniques && quoteObj.literary_techniques.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {quoteObj.literary_techniques.map((technique, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              })()}
            </Accordion>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No quotes available for this book.</p>
              <p className="text-xs mt-2">Contact admin to add quotes for better essay support.</p>
            </div>
          )}
        </ScrollArea>

        {/* Theme and question display */}
        <div className="p-4 border-t bg-background">
          <div className="space-y-2 mb-3">
            <Badge variant="outline">Book: {selectedBook?.title}</Badge>
          </div>
          <h3 className="font-medium mb-2">Essay Question</h3>
          <p className="text-sm text-muted-foreground">{selectedQuestion}</p>
        </div>
      </div>

              {/* Main content - Essay writing area with feedback */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{selectedBook?.title} Essay</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-muted px-3 py-1 rounded-md flex items-center">
              <Clock size={16} className="mr-2" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
            <Button size="sm" variant={timerRunning ? "outline" : "default"} onClick={handleTimer}>
              {timerRunning ? "Pause Timer" : "Start Timer"}
            </Button>
          </div>
        </div>

        {/* Feedback Tab */}
        {showAiFeedback && (
          <div className="bg-blue-50 border-b p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center text-blue-700">
                <MessageCircle size={16} className="mr-2" />
                Writing Assistant
                {isAnalyzing && <RefreshCw size={14} className="ml-2 animate-spin" />}
              </h3>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={clearAiFeedback}>
                  Clear All
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAiFeedback(false)}>
                  <X size={14} />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-32">
              {aiFeedback.length === 0 ? (
                <p className="text-sm text-blue-600">Start writing to get feedback on your essay structure and content...</p>
              ) : (
                <div className="space-y-2">
                  {aiFeedback.slice(-6).map((feedback) => (
                    <Alert key={feedback.id} className={`py-2 ${
                      feedback.priority === 'high' ? 'border-red-200 bg-red-50' :
                      feedback.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`}>
                      <AlertDescription className="text-xs flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                feedback.type === 'strength' ? 'default' :
                                feedback.type === 'missing' ? 'destructive' :
                                'secondary'
                              }
                              className="text-xs px-1 py-0"
                            >
                              {feedback.section}
                            </Badge>
                            {feedback.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm">{feedback.message}</p>
                          <span className="text-muted-foreground text-xs">({feedback.timestamp})</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => dismissFeedback(feedback.id)}
                        >
                          <X size={12} />
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4">
          <Textarea
            placeholder="Write your essay here..."
            className="w-full h-full min-h-[300px] p-4 text-base"
            value={essayContent}
            onChange={handleEssayChange}
          />
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm">
              Word Count: <span className="font-medium">{wordCount}</span>
              <span className="text-muted-foreground ml-2">Target: 800-1000 words</span>
            </p>
          </div>
          <div className="flex space-x-2">
            {!showAiFeedback && (
              <Button size="sm" variant="outline" onClick={() => setShowAiFeedback(true)}>
                <MessageCircle size={14} className="mr-1" />
                Show Feedback
              </Button>
            )}
            <Button onClick={handleSubmitEssay} className="flex items-center">
              <Send size={16} className="mr-2" />
              Submit Essay
            </Button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Essay Structure Guide */}
      <div className="w-80 border-l bg-muted/30 overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-xl font-semibold">Essay Structure Guide</h2>
          <p className="text-sm text-muted-foreground mt-1">How to structure your essay and analyze the question</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Introduction</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Begin with a contextual statement about the text</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Present your thesis statement that directly addresses the question</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Outline your main arguments (3-4 points)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Establish the significance of your argument</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Body Paragraphs</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Start with a clear topic sentence that connects to your thesis</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Present textual evidence (quotes) that supports your point</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Analyze the evidence by discussing techniques and their effects</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Explain how this supports your overall argument</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Link back to the question</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Conclusion</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Restate your thesis in different words</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Summarize your key arguments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Discuss the broader significance of your analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>End with a thoughtful final statement</span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Question Analysis</h3>
              <p className="text-sm mb-2">Break down the question:</p>
              <div className="bg-background p-3 rounded-md text-sm">
                <p className="font-medium">{selectedQuestion}</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {selectedQuestion.includes("How") && <li>• Focus on methods, techniques, and processes</li>}
                  {selectedQuestion.includes("Explore") && <li>• Investigate multiple aspects or interpretations</li>}
                  {selectedQuestion.includes("To what extent") && (
                    <li>• Consider the degree or limits of the statement</li>
                  )}
                  {selectedQuestion.includes("Analyze") && <li>• Examine components and their relationships</li>}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Essay Grading Modal */}
      <EssayGradingModal
        isOpen={showGradingModal}
        onClose={handleGradingModalClose}
        essayContent={essayContent}
        question={selectedQuestion}
        selectedText={selectedBook?.title || ""}
        selectedTheme={selectedQuestion.includes("theme") ? "Various themes" : "Literary analysis"}
      />
    </div>
  )
}
