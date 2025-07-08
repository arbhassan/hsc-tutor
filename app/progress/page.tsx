"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"



import { Skeleton } from "@/components/ui/skeleton"
import {
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { 
  getUserProgress, 
  getEssayProgress, 
  getWeeklyReport,
  initializeUserProgress,
  getShortAnswerProgressDetailed,
  getEssayComponentProgress
} from "@/lib/services/progress-service"
import type { 
  UserProgress as UserProgressType, 
  EssayProgress, 
  WeeklyReport,
  ShortAnswerProgressDetailed,
  EssayComponentProgress
} from "@/lib/types/database"

export default function ProgressPage() {

  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<UserProgressType | null>(null)
  const [essayProgress, setEssayProgress] = useState<EssayProgress | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const [shortAnswerDetailed, setShortAnswerDetailed] = useState<ShortAnswerProgressDetailed[]>([])
  const [essayComponents, setEssayComponents] = useState<EssayComponentProgress[]>([])
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
        essayData,
        weeklyData,
        shortAnswerDetailedData,
        essayComponentData
      ] = await Promise.all([
        getUserProgress(user.id),
        getEssayProgress(user.id),
        getWeeklyReport(user.id),
        getShortAnswerProgressDetailed(user.id),
        getEssayComponentProgress(user.id)
      ])

      // If no data exists, initialize it for new users
      if (!progressData) {
        await initializeUserProgress(user.id)
        // Reload data after initialization
        setTimeout(() => loadProgressData(), 1000)
        return
      }

      setUserProgress(progressData)
      setEssayProgress(essayData)
      setWeeklyReport(weeklyData)
      setShortAnswerDetailed(shortAnswerDetailedData)
      setEssayComponents(essayComponentData)
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

        {/* Overview Section */}
        <div className="mb-12">
          <OverviewTab 
            userProgress={userProgress}
            weeklyReport={weeklyReport}
            essayProgress={essayProgress}
          />
        </div>



        {/* Short Answer Questions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Short Answer Questions</h2>
          <ShortAnswerTab shortAnswerDetailed={shortAnswerDetailed} />
        </div>

        {/* Essays Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Essays</h2>
          <EssaysTab essayProgress={essayProgress} essayComponents={essayComponents} />
        </div>
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



function OverviewTab({ 
  userProgress, 
  weeklyReport, 
  essayProgress 
}: { 
  userProgress: UserProgressType | null; 
  weeklyReport: WeeklyReport | null;
  essayProgress: EssayProgress | null;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Study Streak"
          value={userProgress?.study_streak ? `${userProgress.study_streak} days` : "0 days"}
          description="Keep it up!"
          icon={<Flame className="h-5 w-5" />}
        />
        <StatCard
          title="Total Study Time"
          value={userProgress?.total_study_time ? `${Math.round(userProgress.total_study_time * 10) / 10} hours` : "0 hours"}
          description="All time"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>



      


    </>
  )
}





function ShortAnswerTab({ shortAnswerDetailed }: { shortAnswerDetailed: ShortAnswerProgressDetailed[] }) {
  // Calculate aggregated data from detailed progress
  const totalQuestions = shortAnswerDetailed.reduce((sum, item) => sum + item.total_questions, 0)
  
  // Create a map for easy lookup by marker type
  const markerData = {}
  shortAnswerDetailed.forEach(item => {
    markerData[item.marker_type] = item.average_score
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Questions"
        value={totalQuestions.toString()}
        description="Daily Drill & Exam Sim"
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <StatCard
        title="2 Marker Average"
        value={`${markerData[2] || 0}%`}
        description="Section I questions"
        icon={<BookOpen className="h-5 w-5" />}
      />
      <StatCard
        title="3 Marker Average"
        value={`${markerData[3] || 0}%`}
        description="Section I questions"
        icon={<BookOpen className="h-5 w-5" />}
      />
      <StatCard
        title="4 Marker Average"
        value={`${markerData[4] || 0}%`}
        description="Section I questions"
        icon={<BookOpen className="h-5 w-5" />}
      />
      <StatCard
        title="5 Marker Average"
        value={`${markerData[5] || 0}%`}
        description="Section I questions"
        icon={<BookOpen className="h-5 w-5" />}
      />
    </div>
  )
}

function EssaysTab({ 
  essayProgress, 
  essayComponents 
}: { 
  essayProgress: EssayProgress | null;
  essayComponents: EssayComponentProgress[];
}) {
  // Create a map for easy lookup by component type
  const componentData = {}
  essayComponents.forEach(item => {
    componentData[item.component_type] = item.average_score
  })

  return (
    <div className="space-y-8">
      {/* Main Essay Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Essays Completed"
          value={essayProgress?.total_essays?.toString() || "0"}
          description="Exam mode & Essay mode"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Average Score"
          value={essayProgress?.average_score ? `${essayProgress.average_score}%` : "0%"}
          description="All time average"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Component Scores */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Component Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Introduction"
            value={`${componentData.introduction || 0}%`}
            description="All time average"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Body Paragraphs"
            value={`${componentData.body_paragraphs || 0}%`}
            description="All time average"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Conclusion"
            value={`${componentData.conclusion || 0}%`}
            description="All time average"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Question Analysis"
            value={`${componentData.question_analysis || 0}%`}
            description="All time average"
            icon={<BookOpen className="h-5 w-5" />}
          />
        </div>
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










