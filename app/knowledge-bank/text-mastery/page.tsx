"use client"

import { useState } from "react"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, BookOpen, Star, Users, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function TextMasteryPage() {
  const { user, selectedBook } = useAuth()

  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Text Mastery Hub</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access Text Mastery features. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!selectedBook) {
    return null // Loading state or redirect to auth
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Text Mastery Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dive into your selected text with comprehensive analysis tools, context summaries, and quote exploration.
          </p>
        </div>

        {/* Current Book Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your Selected Book</h2>
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">{selectedBook.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <BookOpen className="mr-3 h-6 w-6" />
                {selectedBook.title}
              </CardTitle>
              <CardDescription className="text-lg">
                by {selectedBook.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{selectedBook.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedBook.themes.map((theme) => (
                  <Badge key={theme} variant="outline">
                    {theme}
                  </Badge>
                ))}
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={`/knowledge-bank/text-mastery/${selectedBook.id}`}>
                    Explore {selectedBook.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Context Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get comprehensive summaries of key contexts, themes, and background information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Quote Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore important quotes organized by themes and literary techniques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Character Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Deep dive into character development, motivations, and relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Study Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Quotes Mastered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-2xl font-semibold">0%</p>
                    <p className="text-sm text-muted-foreground">Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
