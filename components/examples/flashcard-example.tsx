"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface FlashcardExampleProps {
  textName: string
}

const sampleQuotes = {
  "Hamlet": [
    { quote: "To be, or not to be, that is the question", context: "Hamlet's famous soliloquy" },
    { quote: "Something is rotten in the state of Denmark", context: "Marcellus observing corruption" },
    { quote: "The lady doth protest too much, methinks", context: "Gertrude watching the play" },
  ],
  "1984": [
    { quote: "War is peace. Freedom is slavery. Ignorance is strength.", context: "The Party's slogans" },
    { quote: "Big Brother is watching you", context: "Omnipresent surveillance" },
    { quote: "Doublethink means the power of holding two contradictory beliefs", context: "Orwell's concept explanation" },
  ],
  "The Great Gatsby": [
    { quote: "So we beat on, boats against the current, borne back ceaselessly into the past", context: "Final line of the novel" },
    { quote: "I was within and without, simultaneously enchanted and repelled", context: "Nick's perspective" },
    { quote: "Gatsby believed in the green light", context: "Symbol of hope and dreams" },
  ]
}

export function FlashcardExample({ textName }: FlashcardExampleProps) {
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 })
  const [startTime, setStartTime] = useState<Date | null>(null)
  const { trackFlashcard } = useProgressTracker()

  const quotes = sampleQuotes[textName as keyof typeof sampleQuotes] || sampleQuotes["Hamlet"]

  useEffect(() => {
    setStartTime(new Date())
  }, [currentCard])

  const handleAnswer = async (isCorrect: boolean) => {
    if (!startTime) return

    const completionTime = (new Date().getTime() - startTime.getTime()) / 1000
    
    // Track this flashcard attempt
    await trackFlashcard(textName, isCorrect, completionTime)
    
    // Update session score
    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    // Move to next card after a short delay
    setTimeout(() => {
      if (currentCard < quotes.length - 1) {
        setCurrentCard(prev => prev + 1)
        setShowAnswer(false)
      } else {
        // Session complete - could show summary
        alert(`Session complete! Score: ${sessionScore.correct + (isCorrect ? 1 : 0)}/${sessionScore.total + 1}`)
        setCurrentCard(0)
        setSessionScore({ correct: 0, total: 0 })
        setShowAnswer(false)
      }
    }, 1500)
  }

  const resetSession = () => {
    setCurrentCard(0)
    setShowAnswer(false)
    setSessionScore({ correct: 0, total: 0 })
    setStartTime(new Date())
  }

  const currentQuote = quotes[currentCard]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{textName} Flashcards</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {currentCard + 1} / {quotes.length}
          </Badge>
          <Badge variant="outline">
            Score: {sessionScore.correct}/{sessionScore.total}
          </Badge>
          <Button variant="outline" size="sm" onClick={resetSession}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="min-h-[300px]">
        <CardHeader>
          <CardTitle className="text-center">Quote Recognition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <blockquote className="text-lg italic border-l-4 border-primary pl-4">
              "{currentQuote.quote}"
            </blockquote>
          </div>

          {!showAnswer ? (
            <div className="text-center">
              <Button onClick={() => setShowAnswer(true)}>
                Show Context
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground">{currentQuote.context}</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleAnswer(true)}
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  I knew this
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  I didn't know this
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Your progress is automatically tracked and will appear in your analytics!</p>
      </div>
    </div>
  )
} 