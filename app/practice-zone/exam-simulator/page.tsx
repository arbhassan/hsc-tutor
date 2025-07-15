"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
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
  Settings,
  X,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"

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
  sectionITime: 60, // 1 hour for Section I
  sectionIITime: 60, // 1 hour for Section II
}

export default function ExamSimulatorPage() {
  // Auth context to get user's selected book
  const { user, selectedBook } = useAuth()
  
  // State for exam data loaded from database
  const [unseenTexts, setUnseenTexts] = useState([])
  const [essayQuestions, setEssayQuestions] = useState([])
  const [thematicQuotes, setThematicQuotes] = useState({})
  
  const [examStarted, setExamStarted] = useState(false)
  const [currentSection, setCurrentSection] = useState("instructions") // instructions, sectionI, sectionII, results
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
  const [showQuestionNavigation, setShowQuestionNavigation] = useState(false)

  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [customExamTime, setCustomExamTime] = useState(examConfig.totalTime)
  const [selectedSections, setSelectedSections] = useState("both") // "section1", "section2", or "both"
  
  // Temporary state for settings dialog
  const [tempCustomExamTime, setTempCustomExamTime] = useState(examConfig.totalTime)
  const [tempSelectedSections, setTempSelectedSections] = useState("both")
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [markingResults, setMarkingResults] = useState(null)
  const [isMarking, setIsMarking] = useState(false)
  const [markingError, setMarkingError] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataLoadError, setDataLoadError] = useState(null)
  
  // Autosave states
  const [savedDraft, setSavedDraft] = useState(false)
  const [showContinueDialog, setShowContinueDialog] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("") // "saving", "saved", ""

  const timerRef = useRef(null)

  const { trackShortAnswerDetailed, trackEssayComponents, trackEssayCompletion, trackStudySession } = useProgressTracker()

  // Load saved draft - always load if available
  useEffect(() => {
    const savedExamData = localStorage.getItem("examSimulatorDraft")
    
    if (savedExamData) {
      try {
        const parsedData = JSON.parse(savedExamData)
        
        // Only load if it's relatively recent (within 7 days)
        const savedDate = new Date(parsedData.timestamp)
        const now = new Date()
        const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24)
        
        if (daysDiff <= 7) {
          setSavedDraft(true)
          setShowContinueDialog(true)
        } else {
          // Remove old saved data
          localStorage.removeItem("examSimulatorDraft")
        }
      } catch (error) {
        console.error('Error parsing saved exam data:', error)
        localStorage.removeItem("examSimulatorDraft")
      }
    }
  }, [])

  // Auto-save exam progress
  const saveExamProgress = useCallback(() => {
    if (examStarted && !examSubmitted) {
      setAutoSaveStatus("saving")
      
      const examData = {
        timestamp: new Date().toISOString(),
        examStarted,
        currentSection,
        currentTextIndex,
        currentQuestionIndex,
        responses,
        essayResponse,
        essayQuestion,
        elapsedTime,
        remainingTime,
        selectedSections,
        customExamTime,
        wordCount
      }
      
      console.log('Saving exam progress:', examData) // Debug log
      localStorage.setItem("examSimulatorDraft", JSON.stringify(examData))
      
      // Show saved status
      setTimeout(() => {
        setAutoSaveStatus("saved")
        setTimeout(() => {
          setAutoSaveStatus("")
        }, 2000)
      }, 200)
    }
  }, [examStarted, examSubmitted, currentSection, currentTextIndex, currentQuestionIndex, responses, essayResponse, essayQuestion, elapsedTime, remainingTime, selectedSections, customExamTime, wordCount])

  // Load saved exam progress
  const loadSavedProgress = () => {
    const savedExamData = localStorage.getItem("examSimulatorDraft")
    
    if (savedExamData) {
      try {
        const parsedData = JSON.parse(savedExamData)
        console.log('Loading saved exam progress:', parsedData) // Debug log
        
        setExamStarted(parsedData.examStarted)
        setCurrentSection(parsedData.currentSection)
        setCurrentTextIndex(parsedData.currentTextIndex || 0)
        setCurrentQuestionIndex(parsedData.currentQuestionIndex || 0)
        setResponses(parsedData.responses || {})
        setEssayResponse(parsedData.essayResponse || "")
        setEssayQuestion(parsedData.essayQuestion || null)
        setElapsedTime(parsedData.elapsedTime || 0)
        setRemainingTime(parsedData.remainingTime || examConfig.totalTime * 60)
        setSelectedSections(parsedData.selectedSections || "both")
        setCustomExamTime(parsedData.customExamTime || examConfig.totalTime)
        setWordCount(parsedData.wordCount || 0)
        
        setShowContinueDialog(false)
        setSavedDraft(false)
      } catch (error) {
        console.error('Error loading saved exam data:', error)
        localStorage.removeItem("examSimulatorDraft")
      }
    }
  }

  // Settings dialog handlers
  const openSettingsDialog = () => {
    // Sync temporary state with current state when opening
    setTempCustomExamTime(customExamTime)
    setTempSelectedSections(selectedSections)
    setShowSettingsDialog(true)
  }

  const applySettings = () => {
    // Apply temporary settings to actual state
    setCustomExamTime(tempCustomExamTime)
    setSelectedSections(tempSelectedSections)
    setShowSettingsDialog(false)
  }

  const cancelSettings = () => {
    // Reset temporary state to current state and close dialog
    setTempCustomExamTime(customExamTime)
    setTempSelectedSections(selectedSections)
    setShowSettingsDialog(false)
  }

  // Clear saved draft
  const clearSavedDraft = () => {
    localStorage.removeItem("examSimulatorDraft")
    setSavedDraft(false)
    setShowContinueDialog(false)
    // Reset exam settings to defaults when starting fresh
    setCustomExamTime(examConfig.totalTime)
    setSelectedSections("both")
    setTempCustomExamTime(examConfig.totalTime)
    setTempSelectedSections("both")
  }

  // Auto-save when important responses change (excluding elapsedTime to avoid excessive saves)
  useEffect(() => {
    if (examStarted && !examSubmitted) {
      const timeoutId = setTimeout(() => {
        saveExamProgress()
      }, 1000) // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [responses, essayResponse, currentSection, currentTextIndex, currentQuestionIndex, saveExamProgress])

  // Separate effect for periodic saves (every 30 seconds) to capture timer state
  useEffect(() => {
    if (examStarted && !examSubmitted) {
      const intervalId = setInterval(() => {
        saveExamProgress()
      }, 30000) // Save every 30 seconds

      return () => clearInterval(intervalId)
    }
  }, [examStarted, examSubmitted, saveExamProgress])

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
    if (examStarted && !isPaused && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            // Auto-submit when time expires
            setTimeout(() => {
              handleExamSubmit()
            }, 100) // Small delay to ensure UI updates
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timerRef.current)
  }, [examStarted, isPaused, examSubmitted])

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startExam = () => {
    setExamStarted(true)
    setRemainingTime(customExamTime * 60)
    // Start with the appropriate section based on selection
    if (selectedSections === "section1") {
      setCurrentSection("sectionI")
    } else if (selectedSections === "section2") {
      setCurrentSection("sectionII")
      // Generate random essay question for section II only
      if (essayQuestions.length > 0) {
        setEssayQuestion(essayQuestions[Math.floor(Math.random() * essayQuestions.length)])
      }
    } else {
      setCurrentSection("sectionI")
    }
    
    // Clear any existing draft when starting a new exam
    if (!savedDraft) {
      localStorage.removeItem("examSimulatorDraft")
    }
    
    // Save initial state
    saveExamProgress()
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
    
    // Immediate save when response changes
    if (examStarted && !examSubmitted) {
      setTimeout(() => saveExamProgress(), 500)
    }
  }

  const handleEssayResponseChange = (value) => {
    setEssayResponse(value)
    
    // Immediate save when essay response changes
    if (examStarted && !examSubmitted) {
      setTimeout(() => saveExamProgress(), 500)
    }
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

  const navigateToQuestion = (textIndex, questionIndex) => {
    setCurrentTextIndex(textIndex)
    setCurrentQuestionIndex(questionIndex)
    setShowQuestionNavigation(false)
  }

  const handleSectionSubmit = () => {
    if (currentSection === "sectionI") {
      // If both sections are selected, move to section II
      if (selectedSections === "both") {
        setCurrentSection("sectionII")
        // Generate random essay question
        if (essayQuestions.length > 0) {
          setEssayQuestion(essayQuestions[Math.floor(Math.random() * essayQuestions.length)])
        }
      } else {
        // If only section I is selected, submit the exam
        handleExamSubmit()
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
    
    // Clear saved draft after submission
    localStorage.removeItem("examSimulatorDraft")
    setSavedDraft(false)

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

      // Call AI marking APIs based on selected sections
      const markingPromises = []
      
      // Only mark Section I if it was selected
      if (selectedSections === "section1" || selectedSections === "both") {
        markingPromises.push(
          fetch("/api/mark-section-one", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ responses: sectionOneResponses }),
          }).then((res) => res.json())
        )
      } else {
        markingPromises.push(Promise.resolve({ success: true, results: [], summary: { totalMarks: 0, percentage: 0 } }))
      }
      
      // Only mark Section II if it was selected and has content
      if ((selectedSections === "section2" || selectedSections === "both") && essayResponse.trim()) {
        markingPromises.push(
          fetch("/api/mark-essay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: essayQuestion.question,
              module: essayQuestion.module,
              response: essayResponse,
              wordCount: wordCount,
            }),
          }).then((res) => res.json())
        )
      } else {
        markingPromises.push(Promise.resolve({ success: true, result: null }))
      }
      
      const [sectionOneResult, essayResult] = await Promise.all(markingPromises)

      if (sectionOneResult.success && essayResult.success) {
        setMarkingResults({
          sectionOne: sectionOneResult,
          essay: essayResult.result,
          totalElapsedTime: elapsedTime,
        })
        setCurrentSection("results")

        // Track progress and save submissions after successful marking
        try {
          // Track Section I short answer questions
          if (sectionOneResult.results) {
            for (const result of sectionOneResult.results) {
              // Find the corresponding question to get marks
              const text = unseenTexts.find(t => t.id === result.textId)
              const question = text?.questions.find(q => q.id === result.questionId)
              if (question && result.mark !== undefined) {
                await trackShortAnswerDetailed(
                  question.marks, // marker type
                  result.mark, // actual score
                  question.marks, // max score
                  3.0 // estimated completion time per question
                )
              }
            }
          }

          // Track essay component scores and overall essay score if available
          if (essayResult.result && essayResult.result.criteriaBreakdown) {
            const criteria = essayResult.result.criteriaBreakdown
            const componentScores = {}
            
            // Map essay criteria to component types
            if (criteria.understanding) {
              componentScores.question_analysis = Math.round((criteria.understanding.mark / 5) * 100)
            }
            if (criteria.analysis) {
              componentScores.body_paragraphs = Math.round((criteria.analysis.mark / 5) * 100)
            }
            if (criteria.response) {
              componentScores.introduction = Math.round((criteria.response.mark / 5) * 100)
            }
            if (criteria.expression) {
              componentScores.conclusion = Math.round((criteria.expression.mark / 5) * 100)
            }

            await trackEssayComponents(componentScores)
            
            // Also track overall essay progress
            console.log('Essay tracking debug:', {
              totalMark: essayResult.result.totalMark,
              wordCount: wordCount,
              condition: !!(essayResult.result.totalMark && wordCount > 0)
            })
            
            if (essayResult.result.totalMark !== undefined && essayResult.result.totalMark !== null && wordCount > 0) {
              const essayPercentage = Math.round((essayResult.result.totalMark / 20) * 100)
              const quoteCount = (essayResponse.match(/"/g) || []).length / 2
              
              console.log('Tracking essay completion:', {
                score: essayPercentage,
                wordCount,
                quoteCount: Math.floor(quoteCount)
              })
              
              await trackEssayCompletion(
                essayPercentage,
                wordCount,
                Math.floor(quoteCount)
              )
                
              console.log('Essay completion tracked successfully')
            } else {
              console.log('Essay tracking skipped - condition not met:', {
                totalMark: essayResult.result.totalMark,
                wordCount
              })
            }
          }

          // Track study session (exam time)
          const sessionTimeMinutes = Math.round(elapsedTime / 60)
          if (sessionTimeMinutes > 0) {
            await trackStudySession(sessionTimeMinutes)
          }

          // Save submissions to database
          // Save Section I questions submission
          if (sectionOneResult.success && sectionOneResult.results && sectionOneResult.results.length > 0) {
            const questionsSubmissionData = {
              submissionType: 'exam_simulator',
              contentType: 'questions',
              title: `Exam Simulator - Section I`,
              totalScore: sectionOneResult.summary.totalMarks,
              maxScore: 20, // Section I total marks
              completionTimeMinutes: sessionTimeMinutes,
              questions: sectionOneResult.results.map((result, index) => {
                const text = unseenTexts.find(t => t.id === result.textId)
                const question = text?.questions.find(q => q.id === result.questionId)
                const responseKey = `${result.textId}-${result.questionId}`
                const userResponse = responses[responseKey] || ''
                
                return {
                  questionText: question?.text || '',
                  userResponse: userResponse,
                  aiFeedback: result.comment || '',
                  marksAwarded: result.mark,
                  maxMarks: result.totalMarks || question?.marks || 0,
                  textTitle: text?.title,
                  textAuthor: text?.author,
                  textType: text?.type,
                  textContent: text?.content
                }
              })
            }

            const questionsResponse = await fetch('/api/submissions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(questionsSubmissionData)
            })

            if (!questionsResponse.ok) {
              console.error('Failed to save questions submission:', await questionsResponse.text())
            }
          }

          // Save Section II essay submission
          if (essayResult.success && essayResult.result && essayResponse.trim()) {
            const essaySubmissionData = {
              submissionType: 'exam_simulator',
              contentType: 'essay',
              title: `Exam Simulator - Essay`,
              totalScore: essayResult.result.totalMark,
              maxScore: 20, // Essay total marks
              completionTimeMinutes: sessionTimeMinutes,
              essay: {
                question: essayQuestion.question,
                response: essayResponse,
                wordCount: wordCount,
                quoteCount: Math.floor((essayResponse.match(/"/g) || []).length / 2),
                aiFeedback: essayResult.result.overallComment,
                overallScore: essayResult.result.totalMark,
                maxScore: 20,
                criteriaScores: essayResult.result.criteriaBreakdown,
                bandLevel: essayResult.result.band,
                module: essayQuestion.module
              }
            }

            const essaySubmissionResponse = await fetch('/api/submissions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(essaySubmissionData)
            })

            if (!essaySubmissionResponse.ok) {
              console.error('Failed to save essay submission:', await essaySubmissionResponse.text())
            }
          }
        } catch (trackingError) {
          console.error('Failed to track exam progress or save submissions:', trackingError)
        }
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

  const insertQuote = (quote) => {
    const newEssayResponse = essayResponse + `\n> "${quote.quote}"\n`
    handleEssayResponseChange(newEssayResponse)
  }

  // Filter thematic quotes to only show relevant HSC texts
  const getFilteredThematicQuotes = () => {
    // Filter quotes to show only those from the user's selected book
    if (!selectedBook) {
      return []
    }
    
    return Object.entries(thematicQuotes).filter(([textName, quotes]) => {
      // Match by book title or author
      const bookTitle = selectedBook.title.toLowerCase()
      const bookAuthor = selectedBook.author.toLowerCase()
      const quoteTextName = textName.toLowerCase()
      
      return (
        quoteTextName.includes(bookTitle) ||
        bookTitle.includes(quoteTextName) ||
        quoteTextName.includes(bookAuthor) ||
        bookAuthor.includes(quoteTextName)
      )
    })
  }

  // Show continue dialog if there's saved progress
  if (showContinueDialog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Continue Exam?</CardTitle>
              <CardDescription>
                You have a saved exam in progress. Would you like to continue where you left off?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>Your saved progress will be restored, including:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Current section and question</li>
                  <li>All responses entered so far</li>
                  <li>Remaining time</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={loadSavedProgress} className="flex-1">
                Continue Exam
              </Button>
              <Button variant="outline" onClick={clearSavedDraft} className="flex-1">
                Start Fresh
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
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
                      Practice with individual sections or the complete exam.
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={openSettingsDialog}>
                      <Settings className="mr-2 h-4 w-4" />
                      Exam Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" asChild>
              <Link href="/practice-zone">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Practice Zone
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/practice-zone/past-submissions">
                Past Submissions
              </Link>
            </Button>
            <Button onClick={startExam} className="bg-primary hover:bg-primary/90">
              Start Exam Simulation
            </Button>
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
                <Label htmlFor="exam-sections">Exam Sections</Label>
                <Select
                  value={tempSelectedSections}
                  onValueChange={(value) => setTempSelectedSections(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sections to include" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section1">Section I Only (Unseen Texts)</SelectItem>
                    <SelectItem value="section2">Section II Only (Essay)</SelectItem>
                    <SelectItem value="both">Both Sections (Full Exam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exam-time">Total Exam Time (minutes)</Label>
                <Select
                  value={tempCustomExamTime.toString()}
                  onValueChange={(value) => setTempCustomExamTime(Number.parseInt(value))}
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


            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelSettings}>
                Cancel
              </Button>
              <Button onClick={applySettings}>Apply Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>




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
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentText.questions.length}
              </span>
              {/* Autosave indicator */}
              {autoSaveStatus && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {autoSaveStatus === "saving" ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Saved</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  remainingTime <= 0 ? "bg-red-600 text-white" : remainingTime < 300 ? "bg-red-100 text-red-800" : "bg-muted"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {remainingTime <= 0 ? "TIME EXPIRED" : `Time Remaining: ${formatTime(remainingTime)}`}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQuestionNavigation(!showQuestionNavigation)}
                  disabled={remainingTime <= 0 || examSubmitted}
                >
                  {showQuestionNavigation ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Hide Navigation
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" /> Show All Questions
                    </>
                  )}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={pauseExam}
                        disabled={remainingTime <= 0 || examSubmitted}
                      >
                        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {remainingTime <= 0 ? "Time Expired" : isPaused ? "Resume Exam" : "Pause Exam"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>

        {/* Time Expired Banner */}
        {remainingTime <= 0 && !examSubmitted && (
          <div className="bg-red-600 text-white px-4 py-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">TIME EXPIRED - Exam automatically submitted</span>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Unseen text */}
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

          {/* Right panel - Question and response area */}
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
                  className="w-full h-64 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  value={currentResponse}
                  onChange={(e) => handleResponseChange(currentText.id, currentQuestion.id, e.target.value)}
                  placeholder={remainingTime <= 0 ? "Time expired - exam automatically submitted" : "Type your response here..."}
                  disabled={isPaused || remainingTime <= 0 || examSubmitted}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentTextIndex === 0 && currentQuestionIndex === 0 || remainingTime <= 0 || examSubmitted}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous Question
                </Button>

                {currentTextIndex === unseenTexts.length - 1 &&
                currentQuestionIndex === currentText.questions.length - 1 ? (
                  <Button 
                    onClick={() => setShowSubmitSectionDialog(true)}
                    disabled={remainingTime <= 0 || examSubmitted}
                  >
                    Submit Section I
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={remainingTime <= 0 || examSubmitted}
                  >
                    Next Question
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Question Navigation */}
              {showQuestionNavigation && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-medium mb-4">Question Navigation</h3>
                  <div className="space-y-4">
                    {unseenTexts.map((text, textIndex) => (
                      <div key={text.id} className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Text {textIndex + 1}: {text.title}
                        </h4>
                        <div className="grid grid-cols-6 gap-2">
                          {text.questions.map((question, questionIndex) => {
                            const responseKey = `${text.id}-${question.id}`
                            const isAnswered = responses[responseKey] && responses[responseKey].trim() !== ''
                            const isCurrent = textIndex === currentTextIndex && questionIndex === currentQuestionIndex
                            
                            return (
                              <button
                                key={question.id}
                                onClick={() => navigateToQuestion(textIndex, questionIndex)}
                                disabled={remainingTime <= 0 || examSubmitted}
                                className={`
                                  h-10 w-10 rounded-md text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                  ${isCurrent 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : isAnswered 
                                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                                    : 'bg-background border-border hover:bg-muted'
                                  }
                                `}
                              >
                                {questionIndex + 1}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>

        {/* Submit Section Dialog */}
        <AlertDialog open={showSubmitSectionDialog} onOpenChange={setShowSubmitSectionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Section I?</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedSections === "both" 
                  ? "Are you sure you want to submit Section I and move to Section II? You will not be able to return to Section I once submitted."
                  : "Are you sure you want to submit Section I? This will complete your exam."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSectionSubmit}>Submit Section I</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <Button onClick={() => setExamStarted(false)}>Back to Start</Button>
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
              {/* Autosave indicator */}
              {autoSaveStatus && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {autoSaveStatus === "saving" ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Saved</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  remainingTime <= 0 ? "bg-red-600 text-white" : remainingTime < 300 ? "bg-red-100 text-red-800" : "bg-muted"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {remainingTime <= 0 ? "TIME EXPIRED" : `Time Remaining: ${formatTime(remainingTime)}`}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowQuoteBank(!showQuoteBank)}
                disabled={remainingTime <= 0 || examSubmitted}
              >
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={pauseExam}
                      disabled={remainingTime <= 0 || examSubmitted}
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {remainingTime <= 0 ? "Time Expired" : isPaused ? "Resume Exam" : "Pause Exam"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        {/* Time Expired Banner */}
        {remainingTime <= 0 && !examSubmitted && (
          <div className="bg-red-600 text-white px-4 py-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">TIME EXPIRED - Exam automatically submitted</span>
            </div>
          </div>
        )}

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
                    {getFilteredThematicQuotes().map(([text, quotes]) => (
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
                                  disabled={isPaused || remainingTime <= 0 || examSubmitted}
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
                  {getFilteredThematicQuotes().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">
                        {selectedBook 
                          ? `No quotes available for ${selectedBook.title}.`
                          : "No quotes available."
                        }
                      </p>
                      <p className="text-xs mt-1">
                        {selectedBook 
                          ? `Add quotes for ${selectedBook.title} in the admin panel to see them here.`
                          : "Please select a book in your profile to see relevant quotes."
                        }
                      </p>
                    </div>
                  )}
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
                  className="w-full h-[calc(100vh-240px)] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-serif disabled:opacity-50 disabled:cursor-not-allowed"
                  value={essayResponse}
                  onChange={(e) => handleEssayResponseChange(e.target.value)}
                  placeholder={remainingTime <= 0 ? "Time expired - exam automatically submitted" : "Begin your essay here..."}
                  disabled={isPaused || remainingTime <= 0 || examSubmitted}
                />
              </div>

              <div className="flex justify-between">
                {selectedSections === "both" && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSubmitSectionDialog(true)}
                    disabled={remainingTime <= 0 || examSubmitted}
                  >
                    Return to Section I
                  </Button>
                )}
                <Button 
                  onClick={() => setShowSubmitExamDialog(true)}
                  disabled={remainingTime <= 0 || examSubmitted}
                >
                  {selectedSections === "section2" ? "Submit Essay" : "Submit Entire Exam"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section Dialog */}
        {selectedSections === "both" && (
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
        )}

        {/* Submit Exam Dialog */}
        <AlertDialog open={showSubmitExamDialog} onOpenChange={setShowSubmitExamDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedSections === "section2" ? "Submit Essay?" : "Submit Entire Exam?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedSections === "section2" 
                  ? "Are you sure you want to submit your essay? This action cannot be undone."
                  : "Are you sure you want to submit your entire exam? This action cannot be undone."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExamSubmit}>
                {selectedSections === "section2" ? "Submit Essay" : "Submit Exam"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
              <span className="font-medium">Marking in Progress</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Marking Your Exam</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our teacher is carefully reviewing your responses and providing detailed feedback. This may take a few moments...
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
                {(selectedSections === "section1" || selectedSections === "both") && (
                  <TabsTrigger value="section1">Section I: Unseen Texts</TabsTrigger>
                )}
                {(selectedSections === "section2" || selectedSections === "both") && (
                  <TabsTrigger value="section2">Section II: Essay</TabsTrigger>
                )}
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
                        <p className="text-sm text-muted-foreground">Based on assessment of your responses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {(() => {
                            const section1Score = (selectedSections === "section1" || selectedSections === "both") ? markingResults.sectionOne.summary.totalMarks : 0
                            const section2Score = (selectedSections === "section2" || selectedSections === "both") ? (markingResults.essay?.totalMark || 0) : 0
                            const maxScore = (selectedSections === "both") ? 40 : 20
                            return `${section1Score + section2Score}/${maxScore}`
                          })()}
                        </div>
                        <Badge className={`${
                          (() => {
                            const section1Band = (selectedSections === "section1" || selectedSections === "both") ? markingResults.sectionOne.summary.band : 0
                            const section2Band = (selectedSections === "section2" || selectedSections === "both") ? (markingResults.essay?.band || 0) : 0
                            const maxBand = Math.max(section1Band, section2Band)
                            return maxBand >= 5 ? "bg-green-600" : maxBand >= 4 ? "bg-blue-600" : "bg-amber-600"
                          })()
                        }`}>
                          Band {(() => {
                            const section1Band = (selectedSections === "section1" || selectedSections === "both") ? markingResults.sectionOne.summary.band : 0
                            const section2Band = (selectedSections === "section2" || selectedSections === "both") ? (markingResults.essay?.band || 0) : 0
                            return Math.max(section1Band, section2Band)
                          })()}
                        </Badge>
                      </div>
                    </div>

                      <Separator />

                      <div className={`grid gap-6 ${
                        selectedSections === "both" ? "grid-cols-2" : "grid-cols-1"
                      }`}>
                        {(selectedSections === "section1" || selectedSections === "both") && (
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
                        )}

                        {(selectedSections === "section2" || selectedSections === "both") && (
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
                        )}
                      </div>


                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {(selectedSections === "section1" || selectedSections === "both") && (
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
              )}

              {(selectedSections === "section2" || selectedSections === "both") && (
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
              )}

              <TabsContent value="improvement">
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>Targeted suggestions to enhance your HSC Paper 1 performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(selectedSections === "section1" || selectedSections === "both") && (
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
                      )}

                      {(selectedSections === "section1" || selectedSections === "both") && (selectedSections === "section2" || selectedSections === "both") && (
                        <Separator />
                      )}

                      {(selectedSections === "section2" || selectedSections === "both") && (
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
                      )}

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-4">Overall Performance Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className={`grid gap-4 ${
                            selectedSections === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                          }`}>
                            {(selectedSections === "section1" || selectedSections === "both") && (
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
                            )}
                            {(selectedSections === "section2" || selectedSections === "both") && (
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
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Recommended Practice Activities</h3>
                        <div className={`grid gap-4 ${
                          selectedSections === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                        }`}>
                          {(selectedSections === "section1" || selectedSections === "both") && (
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
                          )}

                          {(selectedSections === "section2" || selectedSections === "both") && (
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
                          )}
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
                // Reset exam settings to defaults
                setCustomExamTime(examConfig.totalTime)
                setSelectedSections("both")
                setTempCustomExamTime(examConfig.totalTime)
                setTempSelectedSections("both")
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
