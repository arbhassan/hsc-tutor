"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Star, RefreshCw, X } from "lucide-react"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"

interface GradingCriteria {
  section: string
  score: number
  maxScore: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

interface EssayGrade {
  totalScore: number
  maxScore: number
  criteria: GradingCriteria[]
  overallFeedback: string
  recommendations: string[]
}

interface EssayGradingModalProps {
  isOpen: boolean
  onClose: (finalScore?: number) => void
  essayContent: string
  question: string
  selectedText: string
  selectedTheme: string
}

export default function EssayGradingModal({ 
  isOpen, 
  onClose, 
  essayContent, 
  question, 
  selectedText, 
  selectedTheme 
}: EssayGradingModalProps) {
  const [isGrading, setIsGrading] = useState(false)
  const [grade, setGrade] = useState<EssayGrade | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const { trackEssayComponents } = useProgressTracker()

  const gradeEssay = async () => {
    setIsGrading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/grade-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essayContent,
          question,
          selectedText,
          selectedTheme,
          rubric: {
            introduction: {
              criteria: [
                "Begin with a contextual statement about the text",
                "Present your thesis statement that directly addresses the question",
                "Outline your main arguments (3-4 points)",
                "Establish the significance of your argument"
              ],
              maxScore: 2.5
            },
            bodyParagraphs: {
              criteria: [
                "Start with a clear topic sentence that connects to your thesis",
                "Present textual evidence (quotes) that supports your point",
                "Analyze the evidence by discussing techniques and their effects",
                "Explain how this supports your overall argument",
                "Link back to the question"
              ],
              maxScore: 5
            },
            conclusion: {
              criteria: [
                "Restate your thesis in different words",
                "Summarize your key arguments",
                "Discuss the broader significance of your analysis",
                "End with a thoughtful final statement"
              ],
              maxScore: 2
            },
            questionAnalysis: {
              criteria: [
                "Demonstrates understanding of the question",
                "Addresses all parts of the question",
                "Shows sophisticated analysis"
              ],
              maxScore: 0.5
            }
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to grade essay')
      }

      const gradeData = await response.json()
      setGrade(gradeData)

      // Track essay component progress if user is authenticated
      if (user?.id && gradeData.criteria) {
        try {
          const componentScores = {}
          
          // Map the grading criteria to component types
          gradeData.criteria.forEach((criterion: any) => {
            const sectionName = criterion.section?.toLowerCase()
            const percentage = Math.round((criterion.score / criterion.maxScore) * 100)
            
            if (sectionName?.includes('introduction')) {
              componentScores.introduction = percentage
            } else if (sectionName?.includes('body')) {
              componentScores.body_paragraphs = percentage
            } else if (sectionName?.includes('conclusion')) {
              componentScores.conclusion = percentage
            } else if (sectionName?.includes('question')) {
              componentScores.question_analysis = percentage
            }
          })
          
          if (Object.keys(componentScores).length > 0) {
            await trackEssayComponents(componentScores)
          }
        } catch (trackingError) {
          console.error('Failed to track essay component progress:', trackingError)
        }
      }
    } catch (err) {
      setError('Failed to grade essay. Please try again.')
      console.error('Grading error:', err)
    } finally {
      setIsGrading(false)
    }
  }

  const handleClose = (finalScore?: number | boolean) => {
    setGrade(null)
    setError(null)
    
    // If finalScore is a boolean (from Dialog onOpenChange), just close without saving
    if (typeof finalScore === 'boolean') {
      onClose() // No score passed
    } else {
      onClose(finalScore) // Pass the actual score
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (percentage >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-4 sm:px-6 border-b flex-shrink-0">
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Essay Grading Results
          </DialogTitle>
          <DialogDescription className="text-sm">
            Essay assessment based on HSC marking criteria
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-4 py-4 sm:px-6">
            {!grade && !isGrading && !error && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to Grade Your Essay</h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                    Your essay will be assessed against HSC marking criteria including structure, 
                    analysis, and question response.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Text:</strong> {selectedText}
                    </div>
                    <div>
                      <strong>Theme:</strong> {selectedTheme}
                    </div>
                    <div className="sm:col-span-2">
                      <strong>Question:</strong> {question}
                    </div>
                    <div className="sm:col-span-2">
                      <strong>Word Count:</strong> {essayContent.trim().split(/\s+/).length} words
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={gradeEssay} size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
                    <Star className="mr-2 h-4 w-4" />
                    Grade My Essay
                  </Button>
                </div>
              </div>
            )}

            {isGrading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <h3 className="text-lg font-semibold">Grading Your Essay...</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  We are carefully analyzing your essay structure, content, and argumentation.
                  This may take a few moments.
                </p>
              </div>
            )}

            {error && (
              <div className="py-4 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">Grading Failed</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">{error}</p>
                <Button onClick={gradeEssay} variant="outline" className="w-full sm:w-auto">
                  Try Again
                </Button>
              </div>
            )}

            {grade && (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card className="border-2 border-primary/20">
                  <CardHeader className="text-center px-4 py-4 sm:px-6">
                    <CardTitle className="flex items-center justify-center text-xl sm:text-2xl">
                      <Star className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                      Overall Score
                    </CardTitle>
                    <div className="text-3xl sm:text-4xl font-bold text-primary">
                      {grade.totalScore}/{grade.maxScore}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((grade.totalScore / grade.maxScore) * 100)}% 
                      {grade.totalScore >= 8 ? " - Excellent" : 
                       grade.totalScore >= 6 ? " - Good" : 
                       grade.totalScore >= 4 ? " - Satisfactory" : " - Needs Improvement"}
                    </div>
                  </CardHeader>
                </Card>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detailed Assessment</h3>
                  
                  {grade.criteria.map((criterion, index) => (
                    <Card key={index}>
                      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between text-base gap-2">
                          <span className="flex items-center">
                            {getScoreIcon(criterion.score, criterion.maxScore)}
                            <span className="ml-2 text-sm sm:text-base">{criterion.section}</span>
                          </span>
                          <Badge variant="outline" className={`${getScoreColor(criterion.score, criterion.maxScore)} self-start sm:self-center`}>
                            {criterion.score}/{criterion.maxScore}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
                        <Progress 
                          value={(criterion.score / criterion.maxScore) * 100} 
                          className="h-2"
                        />
                        
                        <p className="text-sm leading-relaxed">{criterion.feedback}</p>
                        
                        {criterion.strengths.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-green-700 mb-1">Strengths:</h4>
                            <ul className="text-sm text-green-600 space-y-1">
                              {criterion.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="leading-relaxed">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {criterion.improvements.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-amber-700 mb-1">Areas for Improvement:</h4>
                            <ul className="text-sm text-amber-600 space-y-1">
                              {criterion.improvements.map((improvement, idx) => (
                                <li key={idx} className="flex items-start">
                                  <AlertCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="leading-relaxed">{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Overall Feedback */}
                <Card>
                  <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                    <CardTitle className="text-base sm:text-lg">Overall Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                    <p className="text-sm leading-relaxed">{grade.overallFeedback}</p>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {grade.recommendations && grade.recommendations.length > 0 && (
                  <Card>
                    <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                      <CardTitle className="text-base sm:text-lg">Recommendations for Next Time</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <ul className="space-y-2">
                        {grade.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Star className="h-3 w-3 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 px-4 py-4 sm:px-6 border-t bg-background">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleClose()} 
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Close
            </Button>
            {grade && (
              <Button 
                onClick={() => handleClose(Math.round((grade.totalScore / grade.maxScore) * 100))} 
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Save Score & Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 