"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { adminService } from "@/lib/services/admin-service"
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
  const [statsLoaded, setStatsLoaded] = useState(false)

  // Debug authentication state
  useEffect(() => {
    console.log('Admin Page - Auth State:', {
      authLoading,
      user: user ? {
        id: user.id,
        email: user.email,
        authenticated: !!user
      } : null,
      userExists: !!user,
      statsLoading,
      statsLoaded
    })
  }, [user, authLoading, statsLoading, statsLoaded])

  const loadStats = async () => {
    if (statsLoaded) return // Prevent duplicate loading
    
    try {
      console.log('Admin Page - Loading stats...')
      setStatsLoading(true)
      const statsData = await adminService.getStats()
      setStats(statsData)
      setStatsLoaded(true)
      console.log('Admin Page - Stats loaded successfully:', statsData)
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

  // Handle authentication and redirect
  useEffect(() => {
    // Don't do anything while auth is still loading
    if (authLoading) {
      console.log('Admin Page - Still loading auth...')
      return
    }
    
    if (!user) {
      console.log('Admin Page - No user found, redirecting to signin')
      router.push('/auth/signin')
      return
    }
    
    console.log('Admin Page - User authenticated')
  }, [user, authLoading, router])

  // Load stats when user becomes available
  useEffect(() => {
    if (!authLoading && user && !statsLoaded) {
      console.log('Admin Page - User available, loading stats')
      loadStats()
    }
  }, [user, authLoading, statsLoaded])

  // Retry loading stats if user is available but stats failed to load
  useEffect(() => {
    if (!authLoading && user && !statsLoading && !statsLoaded) {
      console.log('Admin Page - Retrying stats load')
      const timer = setTimeout(() => {
        loadStats()
      }, 1000) // Retry after 1 second
      
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, statsLoading, statsLoaded])

  // Show loading spinner while auth is loading OR stats are loading
  if (authLoading || (user && statsLoading)) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {authLoading ? "Loading..." : "Loading statistics..."}
        </p>
      </div>
    )
  }

  // Show access denied if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to access the admin panel.</p>
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
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Management
            </CardTitle>
            <CardDescription>
              Add, edit, and manage books in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/books')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Books
              </Button>
              <Button 
                onClick={() => router.push('/admin/books?action=create')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Flashcard Sets
            </CardTitle>
            <CardDescription>
              Manage flashcard sets and passages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/admin/flashcards')}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Sets
              </Button>
              <Button 
                onClick={() => router.push('/admin/flashcards?action=create')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Set
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Past Exam Questions
            </CardTitle>
            <CardDescription>
              Manage HSC past exam questions for essay practice
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Exam Simulator
            </CardTitle>
            <CardDescription>
              Manage unseen texts, essay questions, and thematic quotes
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          <span>Logged in as: <Badge variant="outline">{user.email}</Badge></span>
          <span>Role: <Badge variant="outline">Admin</Badge></span>
        </div>
      </div>
    </div>
  )
} 