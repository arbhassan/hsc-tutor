"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  Trophy,
  Eye,
  Search
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"

interface Submission {
  id: string
  submission_type: 'daily_drill' | 'exam_simulator'
  content_type: 'questions' | 'essay'
  submission_date: string
  title: string
  total_score: number | null
  max_score: number | null
  completion_time_minutes: number | null
  submission_questions: Array<{
    id: string
    question_text: string
    user_response: string
    correct_answer: string | null
    ai_feedback: string | null
    marks_awarded: number | null
    max_marks: number | null
    text_title: string | null
    text_author: string | null
    text_type: string | null
    text_content: string | null
    question_order: number
  }>
  submission_essays: Array<{
    id: string
    essay_question: string
    essay_response: string
    word_count: number | null
    quote_count: number | null
    ai_feedback: string | null
    overall_score: number | null
    max_score: number | null
    criteria_scores: any
    band_level: number | null
    module: string | null
  }>
}

export default function PastSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const { user } = useAuth()

  // Load submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await fetch('/api/submissions')
        const data = await response.json()

        if (data.success) {
          setSubmissions(data.data || [])
          setFilteredSubmissions(data.data || [])
        } else {
          setError(data.error || 'Failed to load submissions')
        }
      } catch (err) {
        console.error('Error loading submissions:', err)
        setError('Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [user])

  // Filter submissions
  useEffect(() => {
    let filtered = submissions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.submission_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.content_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      const [submissionType, contentType] = typeFilter.split('-')
      if (submissionType !== "all") {
        filtered = filtered.filter(submission => submission.submission_type === submissionType)
      }
      if (contentType !== "all") {
        filtered = filtered.filter(submission => submission.content_type === contentType)
      }
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, typeFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSubmissionTypeLabel = (type: string) => {
    return type === 'daily_drill' ? 'Daily Drill' : 'Exam Simulator'
  }

  const getContentTypeLabel = (type: string) => {
    return type === 'questions' ? 'Questions' : 'Essay'
  }

  const getScoreColor = (score: number | null, maxScore: number | null) => {
    if (!score || !maxScore) return 'bg-gray-500'
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 65) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setViewDialogOpen(true)
  }

  const groupSubmissionsByType = (submissions: Submission[]) => {
    const groups = {
      questions: {
        daily_drill: [] as Submission[],
        exam_simulator: [] as Submission[]
      },
      essay: {
        daily_drill: [] as Submission[],
        exam_simulator: [] as Submission[]
      }
    }

    submissions.forEach(submission => {
      groups[submission.content_type][submission.submission_type].push(submission)
    })

    return groups
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/practice-zone" className="flex items-center text-sm font-medium">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Practice Zone
          </Link>
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your submissions...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/practice-zone" className="flex items-center text-sm font-medium">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Practice Zone
          </Link>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to view your submissions.</p>
        </div>
      </div>
    )
  }

  const groupedSubmissions = groupSubmissionsByType(filteredSubmissions)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/practice-zone" className="flex items-center text-sm font-medium">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Practice Zone
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Past Submissions</h1>
        <div></div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="daily_drill-all">Daily Drills</SelectItem>
            <SelectItem value="exam_simulator-all">Exam Simulator</SelectItem>
            <SelectItem value="all-questions">Questions Only</SelectItem>
            <SelectItem value="all-essay">Essays Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete Daily Drills or Exam Simulations to see your submissions here.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/practice-zone/daily-drill">Start Daily Drill</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/practice-zone/exam-simulator">Start Exam Simulator</Link>
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="essay">Essays</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-6">
            <div className="space-y-8">
              {/* Daily Drill Questions */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Daily Drill Questions
                </h3>
                {groupedSubmissions.questions.daily_drill.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No Daily Drill question submissions yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSubmissions.questions.daily_drill.map((submission) => (
                      <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleViewSubmission(submission)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium truncate">{submission.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">Daily Drill</Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(submission.submission_date)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {submission.total_score !== null && submission.max_score !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Score:</span>
                                <Badge className={getScoreColor(submission.total_score, submission.max_score)}>
                                  {submission.total_score}/{submission.max_score}
                                </Badge>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Questions:</span>
                              <span className="text-sm font-medium">{submission.submission_questions?.length || 0}</span>
                            </div>
                            {submission.completion_time_minutes && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Time:</span>
                                <span className="text-sm font-medium">{submission.completion_time_minutes}m</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Exam Simulator Questions */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Exam Simulator Questions
                </h3>
                {groupedSubmissions.questions.exam_simulator.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No Exam Simulator question submissions yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSubmissions.questions.exam_simulator.map((submission) => (
                      <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleViewSubmission(submission)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium truncate">{submission.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">Exam Simulator</Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(submission.submission_date)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {submission.total_score !== null && submission.max_score !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Score:</span>
                                <Badge className={getScoreColor(submission.total_score, submission.max_score)}>
                                  {submission.total_score}/{submission.max_score}
                                </Badge>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Questions:</span>
                              <span className="text-sm font-medium">{submission.submission_questions?.length || 0}</span>
                            </div>
                            {submission.completion_time_minutes && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Time:</span>
                                <span className="text-sm font-medium">{submission.completion_time_minutes}m</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="essay" className="mt-6">
            <div className="space-y-8">
              {/* Daily Drill Essays */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Daily Drill Essays
                </h3>
                {groupedSubmissions.essay.daily_drill.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No Daily Drill essay submissions yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSubmissions.essay.daily_drill.map((submission) => (
                      <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleViewSubmission(submission)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium truncate">{submission.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">Daily Drill</Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(submission.submission_date)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {(() => {
                              const essay = submission.submission_essays?.[0];
                              const displayScore = submission.total_score ?? essay?.overall_score;
                              const maxScore = submission.max_score;
                              
                              // Calculate score from criteria if overall_score is null
                              let calculatedScore = displayScore;
                              if (displayScore === null && essay?.criteria_scores) {
                                calculatedScore = Object.values(essay.criteria_scores).reduce((sum: number, criteria: any) => {
                                  return sum + (typeof criteria === 'object' ? criteria.mark : criteria);
                                }, 0);
                              }
                              
                              return calculatedScore !== null && maxScore !== null ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Score:</span>
                                  <Badge className={getScoreColor(calculatedScore, maxScore)}>
                                    {calculatedScore}/{maxScore}
                                  </Badge>
                                </div>
                              ) : null;
                            })()}
                            {submission.submission_essays?.[0]?.word_count && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Words:</span>
                                <span className="text-sm font-medium">{submission.submission_essays[0].word_count}</span>
                              </div>
                            )}
                            {submission.completion_time_minutes && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Time:</span>
                                <span className="text-sm font-medium">{submission.completion_time_minutes}m</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Exam Simulator Essays */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Exam Simulator Essays
                </h3>
                {groupedSubmissions.essay.exam_simulator.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No Exam Simulator essay submissions yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedSubmissions.essay.exam_simulator.map((submission) => (
                      <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleViewSubmission(submission)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium truncate">{submission.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">Exam Simulator</Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(submission.submission_date)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {(() => {
                              const essay = submission.submission_essays?.[0];
                              const displayScore = submission.total_score ?? essay?.overall_score;
                              const maxScore = submission.max_score;
                              
                              // Calculate score from criteria if overall_score is null
                              let calculatedScore = displayScore;
                              if (displayScore === null && essay?.criteria_scores) {
                                calculatedScore = Object.values(essay.criteria_scores).reduce((sum: number, criteria: any) => {
                                  return sum + (typeof criteria === 'object' ? criteria.mark : criteria);
                                }, 0);
                              }
                              
                              return calculatedScore !== null && maxScore !== null ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Score:</span>
                                  <Badge className={getScoreColor(calculatedScore, maxScore)}>
                                    {calculatedScore}/{maxScore}
                                  </Badge>
                                </div>
                              ) : null;
                            })()}
                            {submission.submission_essays?.[0]?.word_count && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Words:</span>
                                <span className="text-sm font-medium">{submission.submission_essays[0].word_count}</span>
                              </div>
                            )}
                            {submission.completion_time_minutes && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Time:</span>
                                <span className="text-sm font-medium">{submission.completion_time_minutes}m</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.title}</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <span className="inline-flex items-center space-x-4 text-sm">
                  <span>{getSubmissionTypeLabel(selectedSubmission.submission_type)}</span>
                  <span>•</span>
                  <span>{getContentTypeLabel(selectedSubmission.content_type)}</span>
                  <span>•</span>
                  <span>{formatDate(selectedSubmission.submission_date)}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {selectedSubmission && (
              <div className="space-y-6">
                {/* Questions */}
                {selectedSubmission.submission_questions && selectedSubmission.submission_questions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Questions & Responses</h4>
                    <div className="space-y-4">
                      {selectedSubmission.submission_questions
                        .sort((a, b) => a.question_order - b.question_order)
                        .map((question, index) => (
                        <Card key={question.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">Question {question.question_order}</h5>
                              {question.marks_awarded !== null && question.max_marks !== null && (
                                <Badge className={getScoreColor(question.marks_awarded, question.max_marks)}>
                                  {question.marks_awarded}/{question.max_marks}
                                </Badge>
                              )}
                            </div>
                            {question.text_title && (
                              <div className="text-sm text-muted-foreground">
                                {question.text_type}: "{question.text_title}" {question.text_author && `by ${question.text_author}`}
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h6 className="text-sm font-medium mb-1">Question:</h6>
                              <p className="text-sm">{question.question_text}</p>
                            </div>
                            <Separator />
                            <div>
                              <h6 className="text-sm font-medium mb-1">Your Response:</h6>
                              <p className="text-sm">{question.user_response}</p>
                            </div>
                            {question.ai_feedback && (
                              <>
                                <Separator />
                                <div>
                                  <h6 className="text-sm font-medium mb-1">AI Feedback:</h6>
                                  <p className="text-sm text-muted-foreground">{question.ai_feedback}</p>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essays */}
                {selectedSubmission.submission_essays && selectedSubmission.submission_essays.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Essay</h4>
                    {selectedSubmission.submission_essays.map((essay) => (
                      <Card key={essay.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">Essay Response</h5>
                            <div className="flex items-center space-x-2">
                              {(() => {
                                const displayScore = essay.overall_score;
                                const maxScore = essay.max_score;
                                
                                // Calculate score from criteria if overall_score is null
                                let calculatedScore = displayScore;
                                if (displayScore === null && essay.criteria_scores) {
                                  calculatedScore = Object.values(essay.criteria_scores).reduce((sum: number, criteria: any) => {
                                    return sum + (typeof criteria === 'object' ? criteria.mark : criteria);
                                  }, 0);
                                }
                                
                                return calculatedScore !== null && maxScore !== null ? (
                                  <Badge className={getScoreColor(calculatedScore, maxScore)}>
                                    {calculatedScore}/{maxScore}
                                  </Badge>
                                ) : null;
                              })()}
                              {essay.band_level && (
                                <Badge variant="outline">Band {essay.band_level}</Badge>
                              )}
                            </div>
                          </div>
                          {essay.module && (
                            <div className="text-sm text-muted-foreground">Module: {essay.module}</div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h6 className="text-sm font-medium mb-2">Question:</h6>
                            <p className="text-sm">{essay.essay_question}</p>
                          </div>
                          <Separator />
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {essay.word_count && (
                              <div className="flex items-center">
                                <FileText className="mr-1 h-3 w-3" />
                                {essay.word_count} words
                              </div>
                            )}
                            {essay.quote_count && (
                              <div className="flex items-center">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {essay.quote_count} quotes
                              </div>
                            )}
                          </div>
                          <div>
                            <h6 className="text-sm font-medium mb-2">Your Response:</h6>
                            <div className="bg-muted p-3 rounded-md text-sm max-h-64 overflow-y-auto">
                              {essay.essay_response.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-2">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                          {essay.ai_feedback && (
                            <>
                              <Separator />
                              <div>
                                <h6 className="text-sm font-medium mb-2">AI Feedback:</h6>
                                <p className="text-sm text-muted-foreground">{essay.ai_feedback}</p>
                              </div>
                            </>
                          )}
                          {essay.criteria_scores && (
                            <>
                              <Separator />
                              <div>
                                <h6 className="text-sm font-medium mb-2">Detailed Criteria Scores:</h6>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  {Object.entries(essay.criteria_scores).map(([criterion, data]: [string, any]) => {
                                    const score = typeof data === 'object' ? data.mark : data;
                                    return (
                                      <div key={criterion} className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="capitalize">{criterion}:</span>
                                          <span className="font-medium">{score}/5</span>
                                        </div>
                                        <Progress value={score * 20} className="h-1" />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
} 