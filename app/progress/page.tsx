"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AreaChart, BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  BarChartIcon,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  LineChartIcon,
  ListTodo,
  Lightbulb,
  PieChartIcon,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { 
  getUserProgress, 
  getFlashcardProgress, 
  getEssayProgress, 
  getWeeklyReport,
  initializeUserProgress
} from "@/lib/services/progress-service"
import type { 
  UserProgress as UserProgressType, 
  FlashcardProgress, 
  EssayProgress, 
  WeeklyReport 
} from "@/lib/types/database"

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [showGoals, setShowGoals] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<UserProgressType | null>(null)
  const [flashcardProgress, setFlashcardProgress] = useState<FlashcardProgress[]>([])
  const [essayProgress, setEssayProgress] = useState<EssayProgress | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      loadProgressData()
    }
  }, [user?.id])

  const loadProgressData = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const [
        progressData,
        flashcardData,
        essayData,
        weeklyData
      ] = await Promise.all([
        getUserProgress(user.id),
        getFlashcardProgress(user.id),
        getEssayProgress(user.id),
        getWeeklyReport(user.id)
      ])

      // If no data exists, initialize it for new users
      if (!progressData) {
        await initializeUserProgress(user.id)
        // Reload data after initialization
        setTimeout(() => loadProgressData(), 1000)
        return
      }

      setUserProgress(progressData)
      setFlashcardProgress(flashcardData)
      setEssayProgress(essayData)
      setWeeklyReport(weeklyData)
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ProgressPageSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Progress & Analytics</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track your performance and stay on top of your improvement journey.
          </p>
        </div>

        {/* Only show milestone celebration if user has some progress */}
        {userProgress && userProgress.study_streak > 0 && <MilestoneCelebration />}

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flashcards">Quote Flashcards</TabsTrigger>
            <TabsTrigger value="essays">Essays</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              showGoals={showGoals} 
              userProgress={userProgress}
              weeklyReport={weeklyReport}
              flashcardProgress={flashcardProgress}
              essayProgress={essayProgress}
            />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardsTab flashcardProgress={flashcardProgress} />
          </TabsContent>

          <TabsContent value="essays">
            <EssaysTab essayProgress={essayProgress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProgressPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function MilestoneCelebration() {
  // This would normally be conditionally rendered based on whether a milestone was reached
  return (
    <Card className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Trophy className="h-12 w-12 mr-4" />
          <div>
            <h3 className="text-xl font-bold">Milestone Achieved!</h3>
            <p>You've completed 50 quote flashcards with over 85% accuracy!</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
            Share
          </Button>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewTab({ 
  showGoals, 
  userProgress, 
  weeklyReport, 
  flashcardProgress, 
  essayProgress 
}: { 
  showGoals: boolean; 
  userProgress: UserProgressType | null; 
  weeklyReport: WeeklyReport | null;
  flashcardProgress: FlashcardProgress[];
  essayProgress: EssayProgress | null;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Study Streak"
          value={userProgress?.study_streak ? `${userProgress.study_streak} days` : "0 days"}
          description="Keep it up!"
          icon={<Flame className="h-5 w-5" />}
          trend={+12}
        />
        <StatCard
          title="Total Study Time"
          value={userProgress?.total_study_time ? `${userProgress.total_study_time} hours` : "0 hours"}
          description="This month"
          icon={<Clock className="h-5 w-5" />}
          trend={+8}
        />
        <StatCard
          title="Completion Rate"
          value={userProgress?.completion_rate ? `${userProgress.completion_rate}%` : "0%"}
          description="Assigned tasks"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={+5}
        />
        <StatCard
          title="Overall Mastery"
          value={userProgress?.overall_mastery ? `${userProgress.overall_mastery}%` : "0%"}
          description="Across all modules"
          icon={<Target className="h-5 w-5" />}
          trend={+3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <LineChartIcon className="mr-2 h-5 w-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>Your progress over time across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {(flashcardProgress.length > 0 || essayProgress) ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete activities across different areas to see performance trends
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No activity data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Study Time Distribution
            </CardTitle>
            <CardDescription>How you've allocated your study time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {userProgress && userProgress.total_study_time > 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete more study sessions to see time distribution breakdown
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No study time data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Skill Mastery Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SkillMasteryItem 
                label="Quote Memorization" 
                value={flashcardProgress.length > 0 ? Math.round(flashcardProgress.reduce((sum, item) => sum + item.average_accuracy, 0) / flashcardProgress.length) : 0} 
                level={getSkillLevel(flashcardProgress.length > 0 ? Math.round(flashcardProgress.reduce((sum, item) => sum + item.average_accuracy, 0) / flashcardProgress.length) : 0)} 
              />
              <SkillMasteryItem 
                label="Literary Analysis" 
                value={0} 
                level={getSkillLevel(0)} 
              />
              <SkillMasteryItem 
                label="Essay Structure" 
                value={essayProgress?.average_score || 0} 
                level={getSkillLevel(essayProgress?.average_score || 0)} 
              />
              <SkillMasteryItem 
                label="Textual References" 
                value={Math.round((essayProgress?.average_quote_usage || 0) * 20)} 
                level={getSkillLevel(Math.round((essayProgress?.average_quote_usage || 0) * 20))} 
              />
              <SkillMasteryItem 
                label="Overall Understanding" 
                value={userProgress?.overall_mastery || 0} 
                level={getSkillLevel(userProgress?.overall_mastery || 0)} 
              />
            </div>
          </CardContent>
        </Card>
      </div>


    </>
  )
}

function FlashcardsTab({ flashcardProgress }: { flashcardProgress: FlashcardProgress[] }) {
  const totalFlashcards = flashcardProgress.reduce((sum, item) => sum + item.total_flashcards, 0)
  const masteredFlashcards = flashcardProgress.reduce((sum, item) => sum + item.mastered_flashcards, 0)
  const averageAccuracy = flashcardProgress.length > 0 
    ? Math.round(flashcardProgress.reduce((sum, item) => sum + item.average_accuracy, 0) / flashcardProgress.length)
    : 0
  const averageCompletionTime = flashcardProgress.length > 0 
    ? flashcardProgress.reduce((sum, item) => sum + item.completion_time, 0) / flashcardProgress.length
    : 0
  const masteryRate = totalFlashcards > 0 ? Math.round((masteredFlashcards / totalFlashcards) * 100) : 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Flashcards"
          value={totalFlashcards.toString()}
          description="Across all texts"
          icon={<BookOpen className="h-5 w-5" />}
          trend={+15}
        />
        <StatCard
          title="Average Accuracy"
          value={`${averageAccuracy}%`}
          description="Last 30 days"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={+8}
        />
        <StatCard
          title="Completion Time"
          value={`${averageCompletionTime.toFixed(1)}s`}
          description="Per flashcard"
          icon={<Clock className="h-5 w-5" />}
          trend={-0.3}
          trendPositive={true}
        />
        <StatCard
          title="Mastery Rate"
          value={`${masteryRate}%`}
          description="Quotes mastered"
          icon={<Star className="h-5 w-5" />}
          trend={+5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="mr-2 h-5 w-5" />
              Performance by Text
            </CardTitle>
            <CardDescription>Accuracy rates across different texts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <BarChart
                data={flashcardProgress.map(item => ({
                  name: item.text_name,
                  value: item.average_accuracy
                }))}
                index="name"
                categories={["value"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Learning Curve
            </CardTitle>
            <CardDescription>Repetitions needed before mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {flashcardProgress.length > 0 ? (
                <AreaChart
                  data={flashcardProgress.map((item, index) => ({
                    name: `Session ${index + 1}`,
                    repetitions: Math.max(1, Math.round(10 - (item.average_accuracy / 10)))
                  }))}
                  index="name"
                  categories={["repetitions"]}
                  colors={["violet"]}
                  valueFormatter={(value) => `${value} times`}
                  yAxisWidth={40}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete some flashcard sessions to see your learning curve
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Weekly Progress Trend
            </CardTitle>
            <CardDescription>Your flashcard accuracy over the past weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {flashcardProgress.length > 0 ? (
                <LineChart
                  data={flashcardProgress.map((item, index) => ({
                    week: `Week ${index + 1}`,
                    accuracy: item.average_accuracy
                  }))}
                  index="week"
                  categories={["accuracy"]}
                  colors={["indigo"]}
                  valueFormatter={(value) => `${value.toFixed(1)}%`}
                  yAxisWidth={40}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete flashcard sessions to see your weekly progress
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Texts Needing Focus
            </CardTitle>
            <CardDescription>Texts with lower accuracy rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flashcardProgress
                .filter(item => item.average_accuracy < 70)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{item.text_name}</h4>
                      <Badge variant="outline">{item.average_accuracy}% accuracy</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.mastered_flashcards}/{item.total_flashcards} mastered</span>
                      <span>{item.completion_time.toFixed(1)}s avg time</span>
                    </div>
                  </div>
                ))}
              {flashcardProgress.filter(item => item.average_accuracy < 70).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  Great work! All texts are performing well.
                </div>
              )}
            </div>
          </CardContent>
          {flashcardProgress.filter(item => item.average_accuracy < 70).length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                Create Focused Review Session
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}



function EssaysTab({ essayProgress }: { essayProgress: EssayProgress | null }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Essays Completed"
          value={essayProgress?.total_essays?.toString() || "0"}
          description="Last 90 days"
          icon={<BookOpen className="h-5 w-5" />}
          trend={+3}
        />
        <StatCard
          title="Average Score"
          value={essayProgress?.average_score ? `${essayProgress.average_score}%` : "0%"}
          description="Last 5 essays"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={+5}
        />
        <StatCard
          title="Avg. Word Count"
          value={essayProgress?.average_word_count?.toLocaleString() || "0"}
          description="Per essay"
          icon={<ListTodo className="h-5 w-5" />}
          trend={+120}
        />
        <StatCard
          title="Quote Usage"
          value={essayProgress?.average_quote_usage?.toFixed(1) || "0.0"}
          description="Quotes per essay"
          icon={<BookOpen className="h-5 w-5" />}
          trend={+0.8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="mr-2 h-5 w-5" />
              Essay Component Scores
            </CardTitle>
            <CardDescription>Breakdown of performance by essay component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {essayProgress ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete more essays to see detailed component score breakdown
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No essay data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChartIcon className="mr-2 h-5 w-5" />
              Essay Score Progression
            </CardTitle>
            <CardDescription>Your essay scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {essayProgress && essayProgress.total_essays > 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Complete more essays to see score progression over time
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No essay data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Essay Quality Metrics
            </CardTitle>
            <CardDescription>Breakdown of your essay performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={[
                  { 
                    component: "Content", 
                    score: Math.min(100, (essayProgress?.average_score || 0) + 5) 
                  },
                  { 
                    component: "Structure", 
                    score: Math.min(100, (essayProgress?.average_score || 0)) 
                  },
                  { 
                    component: "Evidence", 
                    score: Math.min(100, Math.round((essayProgress?.average_quote_usage || 0) * 15)) 
                  },
                  { 
                    component: "Language", 
                    score: Math.min(100, (essayProgress?.average_score || 0) - 5) 
                  },
                  { 
                    component: "Analysis", 
                    score: Math.min(100, (essayProgress?.average_score || 0) - 3) 
                  },
                ]}
                index="component"
                categories={["score"]}
                colors={["purple"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={60}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Writing Analysis
            </CardTitle>
            <CardDescription>Insights based on your essay data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Word Count Trend</h4>
                  <Badge variant="outline">{essayProgress?.average_word_count || 0} words</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {(essayProgress?.average_word_count || 0) >= 1200 
                    ? "Excellent depth and detail in your essays."
                    : (essayProgress?.average_word_count || 0) >= 800
                    ? "Good length, consider adding more analysis."
                    : "Aim for more detailed responses."
                  }
                </div>
              </div>

              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Quote Integration</h4>
                  <Badge variant="outline">{(essayProgress?.average_quote_usage || 0).toFixed(1)} per essay</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {(essayProgress?.average_quote_usage || 0) >= 4 
                    ? "Excellent use of textual evidence!"
                    : (essayProgress?.average_quote_usage || 0) >= 2
                    ? "Good evidence use, aim for more variety."
                    : "Include more quotes to support your arguments."
                  }
                </div>
              </div>

              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Overall Trend</h4>
                  <Badge variant="outline">{essayProgress?.average_score || 0}% avg</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {(essayProgress?.total_essays || 0) >= 5
                    ? `Based on ${essayProgress?.total_essays} essays, showing ${(essayProgress?.average_score || 0) >= 75 ? 'strong' : 'steady'} progress.`
                    : "Complete more essays to see detailed trends."
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendPositive = true,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: number
  trendPositive?: boolean
}) {
  const showTrend = trend !== undefined
  const trendIsPositive = trend && trend > 0 ? trendPositive : !trendPositive

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {showTrend && (
            <div className={`flex items-center text-xs ${trendIsPositive ? "text-green-500" : "text-red-500"}`}>
              {trendIsPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
              )}
              <span>
                {trend > 0 ? "+" : ""}
                {trend}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SkillMasteryItem({ label, value, level }: { label: string; value: number; level: string }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-green-500"
      case "Proficient":
        return "bg-blue-500"
      case "Developing":
        return "bg-amber-500"
      case "Needs Work":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <div className="flex items-center">
          <Badge className={`mr-2 ${getLevelColor(level)} hover:${getLevelColor(level)}`}>{level}</Badge>
          <span className="font-medium">{value}%</span>
        </div>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  )
}



function QuoteReviewItem({
  text,
  quote,
  accuracy,
  attempts,
}: {
  text: string
  quote: string
  accuracy: number
  attempts: number
}) {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{text}</h4>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            {accuracy}% accuracy
          </Badge>
          <Badge variant="outline">{attempts} attempts</Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">"{quote}"</p>
    </div>
  )
}

function ChallengeItem({
  title,
  description,
  accuracy,
  recommendation,
}: {
  title: string
  description: string
  accuracy: number
  recommendation: string
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title}</h4>
        <Badge variant="outline">{accuracy}% accuracy</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="bg-muted p-3 rounded-md">
        <h5 className="text-sm font-medium mb-1">Recommendation:</h5>
        <p className="text-sm text-muted-foreground">{recommendation}</p>
      </div>
    </div>
  )
}

function FeedbackItem({
  title,
  description,
  frequency,
  recommendation,
  examples,
}: {
  title: string
  description: string
  frequency: "High" | "Medium" | "Low"
  recommendation: string
  examples: string[]
}) {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-amber-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex items-center">
          <span className={`mr-1 ${getFrequencyColor(frequency)}`}>●</span>
          <span className="text-sm">{frequency} frequency</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="bg-muted p-3 rounded-md mb-2">
        <h5 className="text-sm font-medium mb-1">Examples:</h5>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          {examples.map((example, i) => (
            <li key={i}>{example}</li>
          ))}
        </ul>
      </div>
      <div className="bg-muted p-3 rounded-md">
        <h5 className="text-sm font-medium mb-1">Recommendation:</h5>
        <p className="text-sm text-muted-foreground">{recommendation}</p>
      </div>
    </div>
  )
}



// Helper function to determine skill level
function getSkillLevel(value: number): string {
  if (value >= 85) return "Advanced"
  if (value >= 70) return "Proficient"
  if (value >= 50) return "Developing"
  return "Needs Work"
}
