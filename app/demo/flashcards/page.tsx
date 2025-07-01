"use client"

import { useState } from "react"
import { FlashcardExample } from "@/components/examples/flashcard-example"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function FlashcardDemoPage() {
  const { user, selectedBook } = useAuth()
  const [showDemo, setShowDemo] = useState(false)

  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Flashcard Practice Demo</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access the flashcard demo. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (showDemo && selectedBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowDemo(false)}
          >
            ← Back to Demo Info
          </Button>
        </div>
        <FlashcardExample textName={selectedBook.title} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Flashcard Practice Demo</h1>
          <p className="text-lg text-muted-foreground">
            Try out the flashcard system and see how your progress is automatically tracked!
          </p>
        </div>

        {selectedBook && (
          <div className="mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {selectedBook.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">by {selectedBook.author}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Practice quote recognition and improve your understanding of key passages from your selected book.
                </p>
                <Button className="w-full" onClick={() => setShowDemo(true)}>
                  Start Demo Practice
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">📊 Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Every flashcard attempt is automatically tracked, including your accuracy rate and response time.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">📈 Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Visit your Progress page to see detailed charts and analytics based on your practice sessions.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🎯 Personalized Feedback</h3>
              <p className="text-sm text-muted-foreground">
                The system identifies which texts need more practice and provides targeted recommendations.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🔥 Study Streaks</h3>
              <p className="text-sm text-muted-foreground">
                Build study habits with streak tracking and time management insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 