"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  AlertTriangle,
  BookOpen,
  FileText,
  PanelLeftOpen,
  PanelLeftClose,
  CheckCircle,
  Info,
  Settings,
  X,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample model answers for feedback
const modelAnswers = {
  101: {
    answer: `The writer creates tension through the vivid depiction of the river setting, employing several language features to establish a sense of danger and urgency. The juxtaposition between the river's past and present state is established immediately with contrasting descriptions: "yesterday a gentle, babbling stream" versus "now a churning mass of water and debris." This transformation establishes an immediate sense of changed circumstances and potential danger.

Personification is used effectively to attribute malevolent intent to the river: "It didn't want to hold anything up. It wanted to drag things down, to sweep them away." This creates an antagonistic relationship between the characters and their environment, heightening the tension by suggesting the river is an active threat rather than a passive obstacle.

Visual imagery reinforces the danger through concrete details, as the writer describes "branches and even what looked like part of a fence being carried downstream at alarming speed." The specific mention of recognizable objects being destroyed emphasizes the river's destructive power, while the phrase "alarming speed" directly communicates the threatening nature of the scene, building tension through the implication of imminent danger to the characters.`,
    commentary:
      "This response effectively identifies multiple language features (juxtaposition, personification, visual imagery) and explains how each contributes to creating tension. The analysis is detailed and supported with specific textual references.",
  },
}

// Exam configuration
const examConfig = {
  totalTime: 120, // 2 hours in minutes
  readingTime: 5, // 5 minutes reading time
  sectionITime: 60, // 1 hour for Section I
  sectionIITime: 60, // 1 hour for Section II
}

export default function ExamSimulatorPage() {
  // State for exam data loaded from database
  const [unseenTexts, setUnseenTexts] = useState([])
  const [essayQuestions, setEssayQuestions] = useState([])
  const [thematicQuotes, setThematicQuotes] = useState({})
  
  const [examStarted, setExamStarted] = useState(false)
  const [readingTimeActive, setReadingTimeActive] = useState(false)
  const [currentSection, setCurrentSection] = useState("instructions") // instructions, reading, sectionI, sectionII, results
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [essayResponse, setEssayResponse] = useState("")
  const [essayQuestion, setEssayQuestion] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [remainingTime, setRemainingTime] = useState(examConfig.totalTime * 60) // in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [showQuoteBank, setShowQuoteBank] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showSubmitSectionDialog, setShowSubmitSectionDialog] = useState(false)
  const [showSubmitExamDialog, setShowSubmitExamDialog] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [customExamTime, setCustomExamTime] = useState(examConfig.totalTime)
  const [showInstructions, setShowInstructions] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [markingResults, setMarkingResults] = useState(null)
  const [isMarking, setIsMarking] = useState(false)
  const [markingError, setMarkingError] = useState(null)
  const [customMarkingCriteria, setCustomMarkingCriteria] = useState({
    understanding: 25,
    analysis: 25,
    response: 25,
    expression: 25,
  })
  const [showMarkingSettingsDialog, setShowMarkingSettingsDialog] = useState(false)
  const [customMarkingPrompt, setCustomMarkingPrompt] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataLoadError, setDataLoadError] = useState(null)

  const timerRef = useRef(null)

  // Load exam data on component mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setIsLoadingData(true)
        const response = await fetch('/api/exam-simulator/data')
        const data = await response.json()
        
        if (data.success) {
          setUnseenTexts(data.data.unseenTexts || [])
          setEssayQuestions(data.data.essayQuestions || [])
          setThematicQuotes(data.data.thematicQuotes || {})
          
          // Set initial essay question if available
          if (data.data.essayQuestions?.length > 0) {
            setEssayQuestion(data.data.essayQuestions[0])
          }
        } else {
          throw new Error(data.error || 'Failed to load exam data')
        }
      } catch (error) {
        console.error('Error loading exam data:', error)
        setDataLoadError(error.message)
        
        // Fallback to empty data to prevent crashes
        setUnseenTexts([])
        setEssayQuestions([])
        setThematicQuotes({})
      } finally {
        setIsLoadingData(false)
      }
    }

    loadExamData()
  }, [])

  // Calculate word count when essay content changes
  useEffect(() => {
    const words = essayResponse.trim().split(/\s+/)
    setWordCount(essayResponse.trim() === "" ? 0 : words.length)
  }, [essayResponse])

  // Timer effect
  useEffect(() => {
    if (examStarted && !readingTimeActive && !isPaused && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleExamSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (readingTimeActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setReadingTimeActive(false)
            setCurrentSection("sectionI")
            return examConfig.totalTime * 60
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timerRef.current)
  }, [examStarted, readingTimeActive, isPaused, examSubmitted])

  // Time warning effect
  useEffect(() => {
    if (remainingTime === 300 && currentSection !== "results") {
      // 5 minutes warning
      setShowTimeWarning(true)
      setTimeout(() => setShowTimeWarning(false), 5000)
    }
  }, [remainingTime, currentSection])

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startExam = (withReadingTime = true) => {
    setExamStarted(true)
    if (withReadingTime) {
      setReadingTimeActive(true)
      setRemainingTime(examConfig.readingTime * 60)
      setCurrentSection("reading")
    } else {
      setRemainingTime(customExamTime * 60)
      setCurrentSection("sectionI")
    }
  }

  const pauseExam = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      // Resuming
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
        setRemainingTime((prev) => prev - 1)
      }, 1000)
    } else {
      // Pausing
      clearInterval(timerRef.current)
    }
  }

  const handleResponseChange = (textId, questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [`${textId}-${questionId}`]: value,
    }))
  }

  const handleNextQuestion = () => {
    const currentText = unseenTexts[currentTextIndex]
    if (currentQuestionIndex < currentText.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentTextIndex < unseenTexts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentTextIndex > 0) {
      setCurrentTextIndex(currentTextIndex - 1)
      setCurrentQuestionIndex(unseenTexts[currentTextIndex - 1].questions.length - 1)
    }
  }

  const handleSectionSubmit = () => {
    if (currentSection === "sectionI") {
      setCurrentSection("sectionII")
      // Generate random essay question
      if (essayQuestions.length > 0) {
        setEssayQuestion(essayQuestions[Math.floor(Math.random() * essayQuestions.length)])
      }
    } else if (currentSection === "sectionII") {
      handleExamSubmit()
    }
    setShowSubmitSectionDialog(false)
  }

  const handleExamSubmit = async () => {
    clearInterval(timerRef.current)
    setExamSubmitted(true)
    setIsMarking(true)
    setMarkingError(null)
    setShowSubmitExamDialog(false)

    try {
      // Mark Section I responses
      const sectionOneResponses = []
      unseenTexts.forEach((text) => {
        text.questions.forEach((question) => {
          const responseKey = `${text.id}-${question.id}`
          const response = responses[responseKey]
          if (response) {
            sectionOneResponses.push({
              textId: text.id,
              questionId: question.id,
              questionText: question.text,
              marks: question.marks,
              response: response,
              textType: text.type,
              textTitle: text.title,
              textContent: text.content,
              textAuthor: text.author,
            })
          }
        })
      })

      // Call AI marking APIs
      const [sectionOneResult, essayResult] = await Promise.all([
        fetch("/api/mark-section-one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses: sectionOneResponses }),
        }).then((res) => res.json()),
        
        essayResponse.trim() ? fetch("/api/mark-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: essayQuestion.question,
            module: essayQuestion.module,
            response: essayResponse,
            wordCount: wordCount,
            markingCriteria: customMarkingCriteria,
            customPrompt: customMarkingPrompt || undefined,
          }),
        }).then((res) => res.json()) : { success: true, result: null }
      ])

      if (sectionOneResult.success && essayResult.success) {
        setMarkingResults({
          sectionOne: sectionOneResult,
          essay: essayResult.result,
          totalElapsedTime: elapsedTime,
        })
        setCurrentSection("results")
      } else {
        throw new Error("Marking failed")
      }
    } catch (error) {
      console.error("Error during marking:", error)
      setMarkingError("Failed to mark exam. Please try again.")
      setExamSubmitted(false)
    } finally {
      setIsMarking(false)
    }
  }

  const calculateProgress = () => {
    let totalQuestions = 0
    let answeredQuestions = 0

    unseenTexts.forEach((text) => {
      totalQuestions += text.questions.length
      text.questions.forEach((question) => {
        if (responses[`${text.id}-${question.id}`]) {
          answeredQuestions++
        }
      })
    })

    return (answeredQuestions / totalQuestions) * 100
  }

  const insertQuote = (quote) => {
    setEssayResponse(essayResponse + `\n> "${quote.quote}"\n`)
  }

  // Start screen
  if (!examStarted) {
    // Show loading state while data is being fetched
    if (isLoadingData) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Loading Exam Simulator</h1>
            <p className="text-muted-foreground">Preparing your exam content...</p>
          </div>
        </div>
      )
    }

    // Show error state if data failed to load
    if (dataLoadError) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Failed to Load Exam Content</h1>
            <p className="text-muted-foreground mb-4">{dataLoadError}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      )
    }

    // Show warning if no content is available
    if (unseenTexts.length === 0 && essayQuestions.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Exam Content Available</h1>
            <p className="text-muted-foreground mb-4">
              There are no unseen texts or essay questions available for the exam simulator. 
              Please contact your administrator to add content.
            </p>
            <Button variant="outline" asChild>
              <Link href="/practice-zone">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Practice Zone
              </Link>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">HSC Paper 1 Exam Simulator</h1>
          <p className="text-lg mb-8">
            Experience the full HSC Paper 1 examination under realistic conditions. This simulator replicates the exact
            format, timing, and structure of the actual HSC English Paper 1.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Exam Structure</CardTitle>
              <CardDescription>The exam consists of two sections with specific time allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Reading Time: 5 minutes</h3>
                  <p className="text-sm text-muted-foreground">
                    During reading time, you can read the questions but cannot write or type any responses.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Section I: Unseen Texts (1 hour)</h3>
                  <p className="text-sm text-muted-foreground">
                    This section contains multiple unseen texts from different genres with short-answer questions worth
                    between 1-7 marks each.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Section II: Essay (1 hour)</h3>
                  <p className="text-sm text-muted-foreground">
                    This section requires an essay response to a question based on your prescribed text for the Common
                    Module: Texts and Human Experiences.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h3 className="font-medium">Total Exam Time: 2 hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Plus 5 minutes reading time at the beginning of the exam.
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Exam Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMarkingSettingsDialog(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Marking Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/practice-zone">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Practice Zone
              </Link>
            </Button>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setShowInstructions(true)}>
                <Info className="mr-2 h-4 w-4" />
                View Instructions
              </Button>
              <Button onClick={() => startExam(true)}>Start Exam Simulation</Button>
            </div>
          </div>
        </div>

        {/* Exam Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Exam Settings</DialogTitle>
              <DialogDescription>Adjust the exam parameters for your practice session.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exam-time">Total Exam Time (minutes)</Label>
                <Select
                  value={customExamTime.toString()}
                  onValueChange={(value) => setCustomExamTime(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours (Standard)</SelectItem>
                    <SelectItem value="150">2.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="reading-time" defaultChecked />
                <Label htmlFor="reading-time">Include 5 minutes reading time</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSettingsDialog(false)}>Apply Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Instructions Dialog */}
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>HSC Paper 1 Examination Instructions</DialogTitle>
              <DialogDescription>Official instructions for the English Standard and Advanced Paper 1</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">General Instructions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Reading time – 5 minutes</li>
                    <li>Working time – 2 hours</li>
                    <li>Write using black pen</li>
                    <li>A dictionary is not permitted</li>
                    <li>Write your Centre Number and Student Number at the top of your response sheets</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Section I – 20 marks (suggested time: 1 hour)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Attempt Questions 1–7</li>
                    <li>Allow about 1 hour for this section</li>
                    <li>
                      Answer the questions in the spaces provided. These spaces provide guidance for the expected length
                      of response.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Section II – 20 marks (suggested time: 1 hour)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Attempt ONE question from Questions 8–10</li>
                    <li>Allow about 1 hour for this section</li>
                    <li>Answer the question in a SEPARATE writing booklet. Extra writing booklets are available.</li>
                    <li>
                      In your answer you will be assessed on how well you:
                      <ul className="list-disc pl-5 mt-1">
                        <li>demonstrate understanding of human experiences in texts</li>
                        <li>analyze, explain and assess the ways human experiences are represented in texts</li>
                        <li>
                          organize, develop and express ideas using language appropriate to audience, purpose and form
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      This simulator is designed to replicate the HSC examination experience as closely as possible in a
                      digital format. The timing, structure, and question types match the official HSC Paper 1
                      examination.
                    </li>
                    <li>
                      In the real HSC exam, you would write with pen on paper. In this simulator, you will type your
                      responses.
                    </li>
                    <li>
                      Your responses will be saved automatically, but you should submit each section when you are
                      finished.
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setShowInstructions(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Marking Settings Dialog */}
        <Dialog open={showMarkingSettingsDialog} onOpenChange={setShowMarkingSettingsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Marking Settings</DialogTitle>
              <DialogDescription>
                Customize how the AI marks your essay responses. These settings will affect the detailed feedback you receive.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-4">Marking Criteria Weighting (%)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="understanding">Understanding of text and concepts</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="understanding"
                        type="range"
                        min="10"
                        max="40"
                        value={customMarkingCriteria.understanding}
                        onChange={(e) =>
                          setCustomMarkingCriteria((prev) => ({
                            ...prev,
                            understanding: Number.parseInt(e.target.value),
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{customMarkingCriteria.understanding}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analysis">Analysis of literary techniques</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="analysis"
                        type="range"
                        min="10"
                        max="40"
                        value={customMarkingCriteria.analysis}
                        onChange={(e) =>
                          setCustomMarkingCriteria((prev) => ({
                            ...prev,
                            analysis: Number.parseInt(e.target.value),
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{customMarkingCriteria.analysis}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response">Quality of response to question</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="response"
                        type="range"
                        min="10"
                        max="40"
                        value={customMarkingCriteria.response}
                        onChange={(e) =>
                          setCustomMarkingCriteria((prev) => ({
                            ...prev,
                            response: Number.parseInt(e.target.value),
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{customMarkingCriteria.response}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expression">Structure and expression</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="expression"
                        type="range"
                        min="10"
                        max="40"
                        value={customMarkingCriteria.expression}
                        onChange={(e) =>
                          setCustomMarkingCriteria((prev) => ({
                            ...prev,
                            expression: Number.parseInt(e.target.value),
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{customMarkingCriteria.expression}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Total: {Object.values(customMarkingCriteria).reduce((sum, val) => sum + val, 0)}%
                  {Object.values(customMarkingCriteria).reduce((sum, val) => sum + val, 0) !== 100 && 
                    " (Should equal 100%)"}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom Marking Instructions (Optional)</Label>
                <textarea
                  id="custom-prompt"
                  placeholder="Add any specific instructions for the AI marker, such as particular focus areas or text-specific considerations..."
                  value={customMarkingPrompt}
                  onChange={(e) => setCustomMarkingPrompt(e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "Focus particularly on analysis of symbolism and imagery" or "Consider this is a student's first attempt at this text type"
                </p>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                <Info className="h-4 w-4 text-blue-500" />
                <p className="text-sm">
                  These settings will be applied when the AI marks your essay. The default weightings follow standard HSC marking guidelines.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCustomMarkingCriteria({ understanding: 25, analysis: 25, response: 25, expression: 25 })
                  setCustomMarkingPrompt("")
                }}
              >
                Reset to Default
              </Button>
              <Button onClick={() => setShowMarkingSettingsDialog(false)}>
                Apply Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Reading time screen
  if (readingTimeActive) {
    return (
      <div className="flex flex-col h-screen">
        {/* Fixed header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">HSC Paper 1 Examination</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reading Time: {formatTime(remainingTime)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={pauseExam}>
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Reading Time</h1>
            <div className="bg-muted p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>You have 5 minutes of reading time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>During this time, you may read the questions but cannot write or type any responses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Use this time to familiarize yourself with the exam structure and questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Writing time will begin automatically when reading time expires</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setReadingTimeActive(false)
                  setCurrentSection("sectionI")
                  setRemainingTime(customExamTime * 60)
                }}
              >
                Skip Reading Time
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Section I: Unseen Texts
  if (currentSection === "sectionI" && !examSubmitted) {
    // Safety check for empty unseenTexts
    if (unseenTexts.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Unseen Texts Available</h1>
          <p className="text-muted-foreground mb-4">
            There are no unseen texts available for Section I of the exam.
          </p>
          <Button onClick={() => setExamStarted(false)}>Back to Start</Button>
        </div>
      )
    }

    const currentText = unseenTexts[currentTextIndex]
    if (!currentText || !currentText.questions || currentText.questions.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Text Data</h1>
          <p className="text-muted-foreground mb-4">
            The current text has no questions available.
          </p>
          <Button onClick={() => setExamStarted(false)}>Back to Start</Button>
        </div>
      )
    }

    const currentQuestion = currentText.questions[currentQuestionIndex]
    const responseKey = `${currentText.id}-${currentQuestion.id}`
    const currentResponse = responses[responseKey] || ""

    return (
      <div className="flex flex-col h-screen">
        {/* Fixed header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Section I: Unseen Texts</span>
              <Badge>
                Text {currentTextIndex + 1} of {unseenTexts.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  remainingTime < 300 ? "bg-red-100 text-red-800" : "bg-muted"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Time Remaining: {formatTime(remainingTime)}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={pauseExam}>
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPaused ? "Resume Exam" : "Pause Exam"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Unseen text (50%) */}
          <div className="w-1/2 overflow-y-auto p-6 border-r">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                  {currentText.type}
                </span>
              </div>

              <h2 className="text-2xl font-medium mb-4">{currentText.title}</h2>

              <div className="prose max-w-none mb-6">
                {currentText.type === "Poetry" ? (
                  <pre className="font-serif whitespace-pre-wrap">{currentText.content}</pre>
                ) : currentText.type === "Drama Extract" ? (
                  <div
                    className="font-serif"
                    dangerouslySetInnerHTML={{ __html: currentText.content.replace(/\[([^\]]+)\]/g, "<em>[$1]</em>") }}
                  />
                ) : (
                  <div className="font-serif">
                    {currentText.content.split("\n\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground mb-8">
                Source: {currentText.source} by {currentText.author}
              </div>
            </div>
          </div>

          {/* Right panel - Question and response area (50%) */}
          <div className="w-1/2 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Question {currentQuestionIndex + 1}</h3>
                  <span className="text-sm text-muted-foreground">{currentQuestion.marks} marks</span>
                </div>
                <p>{currentQuestion.text}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Your Response</h3>
                <textarea
                  className="w-full h-64 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={currentResponse}
                  onChange={(e) => handleResponseChange(currentText.id, currentQuestion.id, e.target.value)}
                  placeholder="Type your response here..."
                  disabled={isPaused}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentTextIndex === 0 && currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous Question
                </Button>

                {currentTextIndex === unseenTexts.length - 1 &&
                currentQuestionIndex === currentText.questions.length - 1 ? (
                  <Button onClick={() => setShowSubmitSectionDialog(true)}>Submit Section I</Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next Question
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Section I Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1}/{currentText.questions.length} | Text {currentTextIndex + 1}/
                    {unseenTexts.length}
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section Dialog */}
        <AlertDialog open={showSubmitSectionDialog} onOpenChange={setShowSubmitSectionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Section I?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit Section I and move to Section II? You will not be able to return to
                Section I once submitted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSectionSubmit}>Submit Section I</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Time Warning Alert */}
        {showTimeWarning && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center shadow-lg">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>
              <strong>Warning:</strong> 5 minutes remaining!
            </span>
            <button onClick={() => setShowTimeWarning(false)} className="ml-4 text-red-700 hover:text-red-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // Section II: Essay
  if (currentSection === "sectionII" && !examSubmitted) {
    // Safety check for essay question
    if (!essayQuestion) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Essay Question Available</h1>
          <p className="text-muted-foreground mb-4">
            There are no essay questions available for Section II of the exam.
          </p>
          <Button onClick={() => setCurrentSection("sectionI")}>Back to Section I</Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-screen">
        {/* Fixed header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Section II: Essay</span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  remainingTime < 300 ? "bg-red-100 text-red-800" : "bg-muted"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Time Remaining: {formatTime(remainingTime)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowQuoteBank(!showQuoteBank)}>
                {showQuoteBank ? (
                  <>
                    <PanelLeftClose className="mr-2 h-4 w-4" /> Hide Quotes
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="mr-2 h-4 w-4" /> Show Quotes
                  </>
                )}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={pauseExam}>
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPaused ? "Resume Exam" : "Pause Exam"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Quote Bank (optional) */}
          {showQuoteBank && (
            <div className="w-1/4 border-r overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Thematic Quote Bank</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Note: In a real HSC exam, you would not have access to these quotes. This is provided for practice
                  purposes only.
                </p>

                <ScrollArea className="h-[calc(100vh-180px)]">
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(thematicQuotes).map(([text, quotes]) => (
                      <AccordionItem key={text} value={text}>
                        <AccordionTrigger className="text-sm font-medium">{text}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {quotes.map((quote, index) => (
                              <div key={index} className="border rounded-md p-3 text-sm">
                                <div className="text-xs font-medium text-muted-foreground mb-1">{quote.theme}</div>
                                <div className="italic mb-1">"{quote.quote}"</div>
                                <div className="text-xs text-muted-foreground mb-2">{quote.context}</div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={() => insertQuote(quote)}
                                  disabled={isPaused}
                                >
                                  Insert Quote
                                </Button>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className={`${showQuoteBank ? "w-3/4" : "w-full"} flex flex-col overflow-hidden`}>
            {/* Essay question */}
            <div className="border-b p-4">
              <Card className="mb-4">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{essayQuestion.module}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-lg font-medium">{essayQuestion.question}</p>
                </CardContent>
              </Card>
            </div>

            {/* Essay writing area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Your Essay</h3>
                  <div className="flex items-center">
                    <span
                      className={`text-sm ${
                        wordCount > 1000
                          ? "text-green-600"
                          : wordCount > 800
                            ? "text-amber-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {wordCount} words
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">(Aim for 800-1000 words)</span>
                  </div>
                </div>

                <textarea
                  className="w-full h-[calc(100vh-240px)] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-serif"
                  value={essayResponse}
                  onChange={(e) => setEssayResponse(e.target.value)}
                  placeholder="Begin your essay here..."
                  disabled={isPaused}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowSubmitSectionDialog(true)}>
                  Return to Section I
                </Button>
                <Button onClick={() => setShowSubmitExamDialog(true)}>Submit Entire Exam</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section Dialog */}
        <AlertDialog open={showSubmitSectionDialog} onOpenChange={setShowSubmitSectionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Return to Section I?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to return to Section I? Your essay progress will be saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setCurrentSection("sectionI")
                  setShowSubmitSectionDialog(false)
                }}
              >
                Return to Section I
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Submit Exam Dialog */}
        <AlertDialog open={showSubmitExamDialog} onOpenChange={setShowSubmitExamDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Entire Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your entire exam? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExamSubmit}>Submit Exam</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Time Warning Alert */}
        {showTimeWarning && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center shadow-lg">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>
              <strong>Warning:</strong> 5 minutes remaining!
            </span>
            <button onClick={() => setShowTimeWarning(false)} className="ml-4 text-red-700 hover:text-red-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // Marking in progress screen
  if (isMarking) {
    return (
      <div className="flex flex-col h-screen">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">AI Marking in Progress</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Marking Your Exam</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our AI teacher is carefully reviewing your responses and providing detailed feedback. This may take a few moments...
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Analyzing Section I responses</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Marking essay and generating feedback</span>
              </div>
            </div>

            {markingError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{markingError}</p>
                <Button 
                  onClick={() => {
                    setIsMarking(false)
                    setMarkingError(null)
                    handleExamSubmit()
                  }}
                  className="mt-2"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Marking
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Results page
  if (currentSection === "results" && markingResults) {
    return (
      <div className="flex flex-col h-screen">
        {/* Fixed header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Exam Results</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Completion Time: {formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Exam Completed</h1>
              <p className="text-lg text-muted-foreground">
                Congratulations on completing your HSC Paper 1 practice exam!
              </p>
            </div>

            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="section1">Section I: Unseen Texts</TabsTrigger>
                <TabsTrigger value="section2">Section II: Essay</TabsTrigger>
                <TabsTrigger value="improvement">Areas for Improvement</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Exam Performance Summary</CardTitle>
                    <CardDescription>Overall assessment of your HSC Paper 1 practice exam</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Overall Score</h3>
                        <p className="text-sm text-muted-foreground">Based on AI assessment of your responses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {(markingResults.sectionOne.summary.totalMarks + (markingResults.essay?.totalMark || 0))}/40
                        </div>
                        <Badge className={`${
                          markingResults.sectionOne.summary.band >= 5 || (markingResults.essay?.band || 0) >= 5 
                            ? "bg-green-600" 
                            : markingResults.sectionOne.summary.band >= 4 || (markingResults.essay?.band || 0) >= 4
                            ? "bg-blue-600"
                            : "bg-amber-600"
                        }`}>
                          Band {Math.max(markingResults.sectionOne.summary.band, markingResults.essay?.band || 0)}
                        </Badge>
                      </div>
                    </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">Section I: Unseen Texts</h3>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Score:</span>
                            <span className="text-sm font-medium">
                              {markingResults.sectionOne.summary.totalMarks}/{markingResults.sectionOne.summary.totalPossible}
                            </span>
                          </div>
                          <Progress value={markingResults.sectionOne.summary.percentage} className="h-2 mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {markingResults.sectionOne.summary.percentage >= 80 
                              ? "Excellent analysis with sophisticated understanding of textual features."
                              : markingResults.sectionOne.summary.percentage >= 70
                              ? "Good analysis of textual features with some areas for deeper exploration."
                              : markingResults.sectionOne.summary.percentage >= 60
                              ? "Satisfactory analysis with room for improvement in technique identification."
                              : "Basic analysis - focus on identifying more literary techniques and their effects."
                            }
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Section II: Essay</h3>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Score:</span>
                            <span className="text-sm font-medium">
                              {markingResults.essay?.totalMark || 0}/20
                            </span>
                          </div>
                          <Progress value={(markingResults.essay?.totalMark || 0) * 5} className="h-2 mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {markingResults.essay?.overallComment || "No essay response provided."}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Time Management</h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-1/2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Section I</span>
                              <span className="text-sm font-medium">58 minutes</span>
                            </div>
                            <Progress value={(58 / 60) * 100} className="h-2 mb-1" />
                          </div>
                          <div className="w-1/2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Section II</span>
                              <span className="text-sm font-medium">62 minutes</span>
                            </div>
                            <Progress value={(62 / 60) * 100} className="h-2 mb-1" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Good time allocation between sections, with slightly more time spent on the essay.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="section1">
                <div className="space-y-8">
                  {unseenTexts.map((text) => (
                    <Card key={text.id}>
                      <CardHeader>
                        <CardTitle>{text.title}</CardTitle>
                        <CardDescription>
                          {text.type} by {text.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {text.questions.map((question) => {
                            const responseKey = `${text.id}-${question.id}`
                            const userResponse = responses[responseKey] || "No response provided"
                            const aiResult = markingResults.sectionOne.results.find(
                              r => r.textId === text.id && r.questionId === question.id
                            )

                            return (
                              <div key={question.id} className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                  <h3 className="font-medium">Question {question.id % 100}</h3>
                                  <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                                </div>
                                <p className="mb-4">{question.text}</p>

                                <Tabs defaultValue="response" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="response">Your Response</TabsTrigger>
                                    <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="response" className="mt-4">
                                    <div className="bg-muted p-4 rounded-md">
                                      <p className="text-sm whitespace-pre-wrap">{userResponse}</p>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="feedback" className="mt-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">AI Assessment:</span>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-lg font-bold">
                                            {aiResult?.mark || 0}
                                          </span>
                                          <span className="text-muted-foreground">/ {question.marks}</span>
                                          <Badge className={`${
                                            (aiResult?.band || 0) >= 5 ? "bg-green-600" : 
                                            (aiResult?.band || 0) >= 4 ? "bg-blue-600" : "bg-amber-600"
                                          }`}>
                                            Band {aiResult?.band || 0}
                                          </Badge>
                                        </div>
                                      </div>

                                      {aiResult?.comment && (
                                        <div className="bg-blue-50 p-4 rounded-md">
                                          <p className="text-sm">{aiResult.comment}</p>
                                        </div>
                                      )}

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium mb-2 text-green-600">Strengths</h4>
                                          <ul className="space-y-1">
                                            {(aiResult?.strengths || []).map((strength, idx) => (
                                              <li key={idx} className="flex items-start text-sm">
                                                <span className="text-green-500 mr-2">•</span>
                                                <span>{strength}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>

                                        <div>
                                          <h4 className="text-sm font-medium mb-2 text-amber-600">Areas for Improvement</h4>
                                          <ul className="space-y-1">
                                            {(aiResult?.improvements || []).map((improvement, idx) => (
                                              <li key={idx} className="flex items-start text-sm">
                                                <span className="text-amber-500 mr-2">•</span>
                                                <span>{improvement}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="section2">
                <Card>
                  <CardHeader>
                    <CardTitle>Essay Response</CardTitle>
                    <CardDescription>{essayQuestion.module}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Essay Question</h3>
                      <div className="bg-muted p-4 rounded-md mb-6">
                        <p>{essayQuestion.question}</p>
                      </div>
                    </div>

                    <Tabs defaultValue="response" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="response">Your Response</TabsTrigger>
                        <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
                        <TabsTrigger value="criteria">Marking Criteria</TabsTrigger>
                      </TabsList>

                      <TabsContent value="response" className="mt-4">
                        <div className="bg-muted p-4 rounded-md">
                          <p className="whitespace-pre-wrap font-serif">
                            {essayResponse || "No essay response provided."}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">Word count: {wordCount} words</div>
                      </TabsContent>

                      <TabsContent value="feedback" className="mt-4">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">AI Assessment</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold">
                                {markingResults.essay?.totalMark || 0}
                              </span>
                              <span className="text-muted-foreground">/ 20</span>
                              <Badge className={`${
                                (markingResults.essay?.band || 0) >= 5 ? "bg-green-600" : 
                                (markingResults.essay?.band || 0) >= 4 ? "bg-blue-600" : "bg-amber-600"
                              }`}>
                                Band {markingResults.essay?.band || 0}
                              </Badge>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Overall Comment</h4>
                            <p className="text-sm">
                              {markingResults.essay?.overallComment || "No essay response provided for assessment."}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-medium mb-3 text-green-600">Strengths</h3>
                              <ul className="space-y-2">
                                {(markingResults.essay?.strengths || []).map((strength, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    <span className="text-sm">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-medium mb-3 text-amber-600">Areas for Improvement</h3>
                              <ul className="space-y-2">
                                {(markingResults.essay?.improvements || []).map((improvement, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-amber-600 mr-2">•</span>
                                    <span className="text-sm">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {markingResults.essay?.suggestedQuotes && markingResults.essay.suggestedQuotes.length > 0 && (
                            <div>
                              <h3 className="font-medium mb-3">Suggested Enhancements</h3>
                              <div className="space-y-3">
                                {markingResults.essay.suggestedQuotes.map((suggestion, idx) => (
                                  <div key={idx} className="border rounded-md p-3">
                                    <div className="italic mb-2 text-sm">
                                      "{suggestion.quote}"
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {suggestion.explanation}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {markingResults.essay?.nextSteps && markingResults.essay.nextSteps.length > 0 && (
                            <div>
                              <h3 className="font-medium mb-3">Recommended Next Steps</h3>
                              <ul className="space-y-2">
                                {markingResults.essay.nextSteps.map((step, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span className="text-sm">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="criteria" className="mt-4">
                                                  <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-2">Marking Criteria Breakdown</h3>
                              {markingResults.essay?.criteriaBreakdown ? (
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">Understanding of text and concepts</span>
                                      <span>{markingResults.essay.criteriaBreakdown.understanding.mark}/5</span>
                                    </div>
                                    <Progress value={markingResults.essay.criteriaBreakdown.understanding.mark * 20} className="h-2 mb-1" />
                                    <p className="text-sm text-muted-foreground">
                                      {markingResults.essay.criteriaBreakdown.understanding.comment}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">Analysis of literary techniques</span>
                                      <span>{markingResults.essay.criteriaBreakdown.analysis.mark}/5</span>
                                    </div>
                                    <Progress value={markingResults.essay.criteriaBreakdown.analysis.mark * 20} className="h-2 mb-1" />
                                    <p className="text-sm text-muted-foreground">
                                      {markingResults.essay.criteriaBreakdown.analysis.comment}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">Response to the question</span>
                                      <span>{markingResults.essay.criteriaBreakdown.response.mark}/5</span>
                                    </div>
                                    <Progress value={markingResults.essay.criteriaBreakdown.response.mark * 20} className="h-2 mb-1" />
                                    <p className="text-sm text-muted-foreground">
                                      {markingResults.essay.criteriaBreakdown.response.comment}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">Structure and expression</span>
                                      <span>{markingResults.essay.criteriaBreakdown.expression.mark}/5</span>
                                    </div>
                                    <Progress value={markingResults.essay.criteriaBreakdown.expression.mark * 20} className="h-2 mb-1" />
                                    <p className="text-sm text-muted-foreground">
                                      {markingResults.essay.criteriaBreakdown.expression.comment}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No essay provided for detailed criteria breakdown.</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <h3 className="font-medium">Total Score</h3>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">{markingResults.essay?.totalMark || 0}/20</div>
                                <Badge className={`${
                                  (markingResults.essay?.band || 0) >= 5 ? "bg-green-600" : 
                                  (markingResults.essay?.band || 0) >= 4 ? "bg-blue-600" : "bg-amber-600"
                                }`}>
                                  Band {markingResults.essay?.band || 0}
                                </Badge>
                              </div>
                            </div>
                          </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvement">
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>AI-generated targeted suggestions to enhance your HSC Paper 1 performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Section I: Unseen Texts</h3>
                        {markingResults.sectionOne.results.length > 0 ? (
                          <div className="space-y-4">
                            {/* Get unique improvement suggestions from all Section I responses */}
                            {(() => {
                              const allImprovements = markingResults.sectionOne.results.flatMap(result => result.improvements || [])
                              const uniqueImprovements = [...new Set(allImprovements)]
                              return uniqueImprovements.slice(0, 5).map((improvement, idx) => (
                                <div key={idx} className="flex items-start">
                                  <span className="text-amber-600 mr-2 mt-1">•</span>
                                  <p className="text-sm">{improvement}</p>
                                </div>
                              ))
                            })()}
                            
                            {markingResults.sectionOne.summary.percentage < 60 && (
                              <div className="bg-amber-50 p-4 rounded-md mt-4">
                                <h4 className="font-medium text-amber-800 mb-2">Critical Areas Needing Attention:</h4>
                                <p className="text-sm text-amber-700">
                                  Your Section I performance indicates fundamental gaps in textual analysis. Focus on reading comprehension 
                                  and identifying specific literary techniques that actually exist in the passages provided.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No Section I responses provided for analysis.</p>
                        )}
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-4">Section II: Essay</h3>
                        {markingResults.essay ? (
                          <div className="space-y-4">
                            {(markingResults.essay.improvements || []).map((improvement, idx) => (
                              <div key={idx} className="flex items-start">
                                <span className="text-amber-600 mr-2 mt-1">•</span>
                                <p className="text-sm">{improvement}</p>
                              </div>
                            ))}
                            
                            {markingResults.essay.band <= 3 && (
                              <div className="bg-red-50 p-4 rounded-md mt-4">
                                <h4 className="font-medium text-red-800 mb-2">Essay Performance Alert:</h4>
                                <p className="text-sm text-red-700">
                                  Your essay response falls below expected HSC standards. Focus on demonstrating genuine understanding 
                                  of your prescribed text with specific examples and sophisticated analysis of literary techniques.
                                </p>
                              </div>
                            )}

                            {markingResults.essay.nextSteps && markingResults.essay.nextSteps.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Recommended Next Steps:</h4>
                                <ul className="space-y-2">
                                  {markingResults.essay.nextSteps.map((step, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-primary mr-2 mt-1">→</span>
                                      <p className="text-sm">{step}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No essay response provided for analysis.</p>
                        )}
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-4">Overall Performance Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-blue-800 mb-2">Section I Analysis</h4>
                              <p className="text-sm text-blue-700">
                                {markingResults.sectionOne.summary.percentage >= 80 
                                  ? "Excellent comprehension and analysis of unseen texts. Continue practicing sophisticated technique identification."
                                  : markingResults.sectionOne.summary.percentage >= 60
                                  ? "Good foundation in textual analysis. Focus on deeper exploration of how techniques create meaning."
                                  : "Significant improvement needed in reading comprehension and technique analysis. Practice with more unseen texts daily."
                                }
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-800 mb-2">Essay Analysis</h4>
                              <p className="text-sm text-blue-700">
                                {(markingResults.essay?.totalMark || 0) >= 16 
                                  ? "Strong essay writing skills demonstrated. Focus on adding more sophisticated vocabulary and nuanced arguments."
                                  : (markingResults.essay?.totalMark || 0) >= 12
                                  ? "Solid essay foundation. Work on deeper analysis and stronger textual integration."
                                  : "Essay writing needs significant development. Focus on understanding your prescribed text thoroughly and practicing basic essay structure."
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Recommended Practice Activities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Daily Drills
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm">
                                {markingResults.sectionOne.summary.percentage < 60 
                                  ? "Critical: Focus on basic reading comprehension and technique identification with unseen texts."
                                  : "Continue practicing poetry and drama extracts to improve your analysis of these text types."
                                }
                              </p>
                              <Button variant="outline" size="sm" className="mt-2" asChild>
                                <Link href="/practice-zone/daily-drill">Practice Now</Link>
                              </Button>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Essay Mode
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm">
                                {(markingResults.essay?.totalMark || 0) < 12 
                                  ? "Essential: Focus on basic essay structure and demonstrating understanding of your prescribed text."
                                  : "Practice writing thesis statements and integrating evidence effectively."
                                }
                              </p>
                              <Button variant="outline" size="sm" className="mt-2" asChild>
                                <Link href="/practice-zone/essay-mode">Practice Now</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/practice-zone">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Practice Zone
                </Link>
              </Button>
              <Button
                              onClick={() => {
                setExamStarted(false)
                setExamSubmitted(false)
                setCurrentSection("instructions")
                setElapsedTime(0)
                setRemainingTime(examConfig.totalTime * 60)
                setResponses({})
                setEssayResponse("")
                setCurrentTextIndex(0)
                setCurrentQuestionIndex(0)
                setMarkingResults(null)
                setIsMarking(false)
                setMarkingError(null)
              }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback (should never happen)
  return null
}
