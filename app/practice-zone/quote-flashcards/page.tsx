"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"
import { flashcardService, FlashcardSetWithPassages, PassageData } from "@/lib/services/flashcard-service"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
} from "lucide-react"

// CSS for card flip animation
const flipCardStyles = `
  .flip-card {
    perspective: 1000px;
    display: inline-block;
    width: auto;
    min-width: 80px;
    height: 36px;
    margin: 0 2px;
  }
  
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flip-card.flipped .flip-card-inner {
    transform: rotateX(180deg);
  }
  
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  
  .flip-card-front {
    background-color: transparent;
  }
  
  .flip-card-back {
    transform: rotateX(180deg);
    background-color: #ef4444;
    color: white;
    font-weight: 500;
  }
`

// Use types from the service
type FlashcardSet = FlashcardSetWithPassages
type Passage = PassageData

type ClozeWord = {
  word: string
  startIndex: number
  endIndex: number
  isHidden: boolean
}

export default function QuoteFlashcardsPage() {
  const { toast } = useToast()
  const { user, selectedBook } = useAuth()
  const { trackFlashcardAttempt, trackStudySession } = useProgressTracker()
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)

  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0)
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [results, setResults] = useState<{ [key: string]: boolean }>({})
  const [currentClozeWords, setCurrentClozeWords] = useState<ClozeWord[]>([])

  // Check if user has selected a book
  useEffect(() => {
    if (!selectedBook && user) {
      toast({
        title: "No Book Selected",
        description: "Please complete your profile setup to access flashcards.",
        variant: "destructive",
      })
    }
  }, [selectedBook, user, toast])

  // Load flashcard sets from database
  useEffect(() => {
    const loadFlashcardSets = async () => {
      if (!user?.id || !selectedBook) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // First, try to seed default sets if none exist
        await flashcardService.seedDefaultFlashcardSets(user.id, selectedBook.id)
        
        // Then load all sets for this book
        const sets = await flashcardService.getFlashcardSets(user.id, selectedBook.id)
        setFlashcardSets(sets)
      } catch (error) {
        console.error('Error loading flashcard sets:', error)
        toast({
          title: "Error Loading Flashcards",
          description: "There was a problem loading your flashcard sets.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFlashcardSets()
  }, [user?.id, selectedBook?.id, toast])



  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Quote Memorisation Flashcards</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access flashcards. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Filter flashcard sets by selected book
  const filteredFlashcardSets = selectedBook 
    ? flashcardSets.filter(set => set.bookId === selectedBook.id)
    : []

  const handleSetSelection = (set: FlashcardSet) => {
    setSelectedSet(set)
    setCurrentPassageIndex(0)
    setShowAnswers(false)
    setResults({})
    setUserInputs({})
    setCurrentClozeWords([]) // Generate new random words for this set
    
    // Track session start time for study time calculation
    if (user?.id) {
      const sessionStart = new Date()
      sessionStorage.setItem('flashcardSessionStart', sessionStart.toISOString())
    }
  }

  const handleInputChange = (wordId: string, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [wordId]: value,
    }))
  }

  const checkAnswers = async () => {
    if (!selectedSet) return

    const currentPassage = selectedSet.passages[currentPassageIndex]
    const newResults: { [key: string]: boolean } = {}

    currentClozeWords.forEach((clozeWord, index) => {
      if (clozeWord.isHidden) {
        const inputKey = `${currentPassage.id}-${index}`
        const userInput = userInputs[inputKey] || ""
        // Simple comparison with tolerance for capitalization and punctuation
        const cleanUserInput = userInput.toLowerCase().replace(/[.,!?;:]/g, '')
        const cleanCorrectWord = clozeWord.word.toLowerCase().replace(/[.,!?;:]/g, '')
        const isCorrect = cleanUserInput === cleanCorrectWord
        newResults[inputKey] = isCorrect
      }
    })

    // Calculate accuracy for this attempt
    const totalQuestions = Object.keys(newResults).length
    const correctAnswers = Object.values(newResults).filter(result => result).length
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const allCorrect = Object.values(newResults).every((result) => result)

    // Track progress if user is authenticated
    if (user?.id && selectedBook) {
      try {
        await trackFlashcardAttempt(
          selectedBook.title,
          accuracy,
          2.0 // Average completion time in seconds per question
        )
      } catch (error) {
        console.error('Failed to track flashcard progress:', error)
      }
    }

    // Add a slight delay to make the flip animation more noticeable
    setTimeout(async () => {
      setResults(newResults)

      // Update statistics in database and local state
      const currentPassage = selectedSet.passages[currentPassageIndex]
      const newAttempts = currentPassage.attempts + 1
      const newCorrectAttempts = currentPassage.correctAttempts + (allCorrect ? 1 : 0)

      try {
        // Update in database
        const success = await flashcardService.updatePassageStats(
          currentPassage.id,
          newAttempts,
          newCorrectAttempts
        )

        if (success) {
          // Update local state
          const updatedSets = [...flashcardSets]
          const setIndex = updatedSets.findIndex((set) => set.id === selectedSet.id)
          if (setIndex !== -1) {
            updatedSets[setIndex].passages[currentPassageIndex].attempts = newAttempts
            updatedSets[setIndex].passages[currentPassageIndex].correctAttempts = newCorrectAttempts
            setFlashcardSets(updatedSets)
          }
        }
      } catch (error) {
        console.error('Error updating passage stats:', error)
      }
    }, 100)
  }

  const revealAnswers = () => {
    setShowAnswers(true)
  }

  const nextPassage = () => {
    if (!selectedSet) return

    if (currentPassageIndex < selectedSet.passages.length - 1) {
      setCurrentPassageIndex((prev) => prev + 1)
      setShowAnswers(false)
      setResults({})
      setUserInputs({})
      setCurrentClozeWords([]) // Reset for new passage
    }
  }

  const prevPassage = () => {
    if (currentPassageIndex > 0) {
      setCurrentPassageIndex((prev) => prev - 1)
      setShowAnswers(false)
      setResults({})
      setUserInputs({})
      setCurrentClozeWords([]) // Reset for new passage
    }
  }

  const resetPassage = () => {
    setShowAnswers(false)
    setResults({})
    setUserInputs({})
    setCurrentClozeWords([]) // Reset to generate new random words
  }

  // Export/Import functionality removed - using database now

  const calculateMasteryPercentage = (passage: Passage) => {
    if (passage.attempts === 0) return 0
    return Math.round((passage.correctAttempts / passage.attempts) * 100)
  }

  // Smart word hiding function that randomizes which words to hide
  const generateClozeWords = (passage: Passage): ClozeWord[] => {
    const tokens = passage.text.split(/(\s+)/)
    const clozeWords: ClozeWord[] = []
    let currentIndex = 0

    // Get all meaningful words (not spaces, punctuation, or very short words)
    const meaningfulWords = tokens.filter(token => 
      token.trim().length > 2 && 
      /^[a-zA-Z]+$/.test(token.trim()) && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(token.toLowerCase())
    )

    // Randomly select 20-40% of meaningful words to hide
    const numWordsToHide = Math.max(1, Math.floor(meaningfulWords.length * (0.2 + Math.random() * 0.2)))
    const shuffledWords = [...meaningfulWords].sort(() => Math.random() - 0.5)
    const wordsToHide = new Set(shuffledWords.slice(0, numWordsToHide))

    tokens.forEach((token) => {
      const startIndex = passage.text.indexOf(token, currentIndex)
      const endIndex = startIndex + token.length - 1
      
      // Check if this token should be hidden
      const shouldHide = wordsToHide.has(token)

      clozeWords.push({
        word: token,
        startIndex,
        endIndex,
        isHidden: shouldHide,
      })

      currentIndex = startIndex + token.length
    })

    return clozeWords
  }

  const renderClozePassage = (passage: Passage) => {
    // Generate fresh random cloze words every time, but store for consistency during this session
    let clozeWords = currentClozeWords
    if (clozeWords.length === 0) {
      clozeWords = generateClozeWords(passage)
      setCurrentClozeWords(clozeWords)
    }
    
    let lastIndex = 0
    const elements: React.ReactNode[] = []

    clozeWords.forEach((clozeWord, wordIndex) => {
      // Add text before the cloze word
      if (clozeWord.startIndex > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{passage.text.substring(lastIndex, clozeWord.startIndex)}</span>)
      }

      // Add the cloze word (either as input or revealed text)
      const inputKey = `${passage.id}-${wordIndex}`

      if (clozeWord.isHidden) {
        if (showAnswers) {
          elements.push(
            <span
              key={inputKey}
              className="px-1 py-0.5 rounded font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            >
              {clozeWord.word}
            </span>,
          )
        } else {
          const result = results[inputKey]

          if (result === false) {
            // Wrong answer - use flip card
            elements.push(
              <div key={inputKey} className="flip-card flipped">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <Input
                      type="text"
                      value={userInputs[inputKey] || ""}
                      className="border-b-2 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 w-full px-1 text-center"
                      disabled={true}
                      placeholder="______"
                    />
                  </div>
                  <div className="flip-card-back">{clozeWord.word}</div>
                </div>
              </div>,
            )
          } else if (result === true) {
            // Correct answer
            elements.push(
              <Input
                key={inputKey}
                type="text"
                value={userInputs[inputKey] || ""}
                className="border-b-2 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700 w-24 px-1 mx-0.5 text-center inline-block"
                disabled={true}
                placeholder="______"
              />,
            )
          } else {
            // Not checked yet
            elements.push(
              <Input
                key={inputKey}
                type="text"
                value={userInputs[inputKey] || ""}
                onChange={(e) => handleInputChange(inputKey, e.target.value)}
                className="border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary bg-transparent w-24 px-1 mx-0.5 text-center inline-block"
                disabled={Object.keys(results).length > 0}
                placeholder="______"
              />,
            )
          }
        }
      } else {
        // Not hidden, just display the word
        elements.push(<span key={inputKey}>{clozeWord.word}</span>)
      }

      lastIndex = clozeWord.endIndex + 1
    })

    // Add any remaining text
    if (lastIndex < passage.text.length) {
      elements.push(<span key={`text-end`}>{passage.text.substring(lastIndex)}</span>)
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <style jsx>{flipCardStyles}</style>
        <div className="flashcard-container relative w-full max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
          <div className="flashcard bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center">
            <div className="text-lg md:text-xl leading-relaxed text-center mb-6 max-w-xl">{elements}</div>
            <div className="text-sm text-muted-foreground italic text-center mt-auto">— {passage.source}</div>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quote Memorisation Flashcards</h1>
        <p className="text-muted-foreground mt-1">Master key quotes and paragraphs with interactive cloze passages</p>
      </div>

      <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg mb-6">
            <div>
              <h3 className="text-lg font-medium">{selectedBook?.title}</h3>
              <p className="text-sm text-muted-foreground">by {selectedBook?.author} • {selectedBook?.category}</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading flashcard sets...</p>
            </div>
          ) : !selectedSet ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-4">Select a flashcard set to begin practicing</h3>
              {filteredFlashcardSets.length === 0 ? (
                <div className="mt-8">
                  <p className="text-muted-foreground mb-4">You don't have any flashcard sets yet.</p>
                  <p className="text-muted-foreground">Default flashcard sets will be created automatically when available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {filteredFlashcardSets.map((set) => (
                    <Card
                      key={set.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSetSelection(set)}
                    >
                      <CardHeader>
                        <CardTitle>{set.title}</CardTitle>
                        <CardDescription>{set.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <div className="flex justify-between items-center w-full">
                          <Badge variant="outline">{set.type}</Badge>
                          <span className="text-sm text-muted-foreground">{set.passages.length} passages</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setSelectedSet(null)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Sets
                </Button>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {currentPassageIndex + 1} of {selectedSet.passages.length}
                  </Badge>
                </div>
              </div>

              <Card className="border-2 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle>{selectedSet.title}</CardTitle>
                  <CardDescription>Fill in the blanks to complete the passage</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 min-h-[300px] flex items-center justify-center">
                  {renderClozePassage(selectedSet.passages[currentPassageIndex])}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 bg-muted/30 border-t">
                  <div className="flex justify-between w-full">
                    <div className="space-x-2">
                      <Button variant="outline" onClick={prevPassage} disabled={currentPassageIndex === 0}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={nextPassage}
                        disabled={currentPassageIndex === selectedSet.passages.length - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={resetPassage}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      {Object.keys(results).length === 0 ? (
                        <Button onClick={checkAnswers} disabled={Object.keys(userInputs).length === 0}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Check Answers
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={revealAnswers} disabled={showAnswers}>
                          <Eye className="h-4 w-4 mr-1" />
                          Reveal Answers
                        </Button>
                      )}
                    </div>
                  </div>

                  {Object.keys(results).length > 0 && !showAnswers && (
                    <div className="w-full pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {Object.values(results).filter(Boolean).length} of {Object.values(results).length} correct
                        </span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500 font-medium">
                            {Object.values(results).filter(Boolean).length}
                          </span>
                          <span className="text-sm text-muted-foreground mx-1">/</span>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-500 font-medium">
                            {Object.values(results).filter((result) => !result).length}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(Object.values(results).filter(Boolean).length / Object.values(results).length) * 100}
                        className="h-2 mt-2"
                      />
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
      </div>
    </div>
  )
}
