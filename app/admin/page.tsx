"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { adminService } from "@/lib/services/admin-service"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Database,
  Plus,
  Eye,
  FileText,
  Monitor,
  Lock,
} from "lucide-react"

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalFlashcardSets: 0,
    totalUsers: 0,
    totalPassages: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  const loadStats = async () => {
    try {
      setStatsLoading(true)
      const statsData = await adminService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      })
    } finally {
      setStatsLoading(false)
    }
  }

  // Load stats when component mounts and user is available
  useEffect(() => {
    if (!authLoading && user) {
      loadStats()
    }
  }, [user, authLoading])

  // Show loading spinner while auth or stats are loading
  if (authLoading || statsLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage books, flashcard sets, and other system resources
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Available in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcard Sets</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFlashcardSets}</div>
            <p className="text-xs text-muted-foreground">
              Created by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passages</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPassages}</div>
            <p className="text-xs text-muted-foreground">
              Available for practice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Exam Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPastExamQuestions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available for essay practice
            </p>
          </CardContent>
        </Card>

        
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Content Management
            </CardTitle>
            <CardDescription>
              Edit all book content including contexts, quotes, plot summaries, and essay guides
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/book-content')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Manage Content
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Flashcard Cards
            </CardTitle>
            <CardDescription>
              Manage auto-generated cards with bulk actions and editing
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/flashcard-cards')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Manage Cards
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Past Exam Questions
            </CardTitle>
            <CardDescription>
              Manage HSC past exam questions for essay practice
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/past-exam-questions')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Questions
              </Button>
              <Button 
                onClick={() => router.push('/admin/past-exam-questions?action=create')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Exam Simulator
            </CardTitle>
            <CardDescription>
              Manage unseen texts, essay questions, and thematic quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/exam-simulator')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Manage Content
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Quote Bank
            </CardTitle>
            <CardDescription>
              Upload quotes and auto-generate flashcards with theme tagging
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/quotes')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Manage Quotes
              </Button>
              <Button 
                onClick={() => router.push('/admin/quotes?action=create')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </div>
          </CardContent>
        </Card>
{/* 
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quote Management
            </CardTitle>
            <CardDescription>
              Add and organize quotes by text and theme for essay mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/quotes')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Quotes
              </Button>
              <Button 
                onClick={() => router.push('/admin/quotes?action=create')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </div>
          </CardContent>
        </Card> */}

        
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-2">Quick Stats</h3>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Logged in as: <Badge variant="outline">{user?.email}</Badge></span>
          <span>Role: <Badge variant="outline">Admin</Badge></span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('adminPasswordVerified')
              window.location.reload()
            }}
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
} 