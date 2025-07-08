"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getBooks, type BookInterface } from "@/lib/books"

function SignUpForm() {
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedBook, setSelectedBook] = useState<BookInterface | null>(null)
  const [books, setBooks] = useState<BookInterface[]>([])
  const [booksLoading, setBooksLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Ensure proper URL structure
  useEffect(() => {
    if (!searchParams.get('step')) {
      router.replace('/auth/signup?step=1')
    }
  }, [router, searchParams])

  // Load books when component mounts
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setBooksLoading(true)
        const booksData = await getBooks()
        setBooks(booksData)
      } catch (error) {
        console.error('Error loading books:', error)
        setError('Failed to load books. Please refresh the page.')
      } finally {
        setBooksLoading(false)
      }
    }
    
    loadBooks()
  }, [])

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateForm()) {
      return
    }
    setError("")
    router.push('/auth/signup?step=2')
  }

  const handleBookSelect = (book: BookInterface) => {
    setSelectedBook(book)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBook) {
      setError("Please select a book to continue")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            selected_book_id: selectedBook.id,
            selected_book_title: selectedBook.title,
            selected_book_author: selectedBook.author,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to home page - user will be automatically signed in
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Welcome to HSC Tutor!</CardTitle>
            <CardDescription>
              Your account has been created successfully. You'll be studying <strong>{selectedBook?.title}</strong> by {selectedBook?.author}.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join HSC Tutor</CardTitle>
          <CardDescription>
            {step === 1 ? "Create your account to start your HSC preparation journey" : "Choose your assigned text to focus your studies"}
          </CardDescription>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                1
              </div>
              <span className="text-sm">Your Details</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                2
              </div>
              <span className="text-sm">Select Your Book</span>
            </div>
          </div>
        </CardHeader>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                Next: Select Your Book
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Choose Your HSC Text</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select the text assigned by your school. You'll focus your studies on this book throughout the platform.
                </p>
              </div>

              {booksLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading books...</span>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No books available. Please contact support.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {books.map((book) => (
                    <Card 
                      key={book.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedBook?.id === book.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleBookSelect(book)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-medium">{book.title}</CardTitle>
                          <Badge variant="outline" className="text-xs capitalize">{book.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">by {book.author}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                        {book.popular && (
                          <Badge variant="secondary" className="text-xs mt-2">Popular</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedBook && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-1">Selected: {selectedBook.title}</h4>
                  <p className="text-sm text-muted-foreground">by {selectedBook.author} • {selectedBook.year}</p>
                  <p className="text-sm mt-2">{selectedBook.description}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/auth/signup?step=1')}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={loading || !selectedBook}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
} 