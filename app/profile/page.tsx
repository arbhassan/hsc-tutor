"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { getBooks } from "@/lib/books"
import type { BookInterface } from "@/lib/books"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save, User, Mail, Lock, Book, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const { user, profile, selectedBook, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<BookInterface[]>([])
  const [formData, setFormData] = useState({
    selectedBookId: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [showPasswordErrors, setShowPasswordErrors] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Load books
    const loadBooks = async () => {
      try {
        const booksData = await getBooks()
        setBooks(booksData)
      } catch (error) {
        console.error("Error loading books:", error)
      }
    }

    loadBooks()

    // Initialize form data
    if (user && profile) {
      setFormData({
        selectedBookId: profile.selected_book_id || "",
        newPassword: "",
        confirmPassword: ""
      })
    }
  }, [user, profile, router])

  const validatePassword = (password: string, confirmPassword: string) => {
    const errors: string[] = []
    
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters")
    }
    
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Passwords do not match")
    }
    
    return errors
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validate password in real-time but don't show errors until submit attempt
    if (field === "newPassword" || field === "confirmPassword") {
      const newPassword = field === "newPassword" ? value : formData.newPassword
      const confirmPassword = field === "confirmPassword" ? value : formData.confirmPassword
      const errors = validatePassword(newPassword, confirmPassword)
      setPasswordErrors(errors)
      // Hide errors when user starts fixing them
      if (showPasswordErrors && errors.length === 0) {
        setShowPasswordErrors(false)
      }
    }
  }

  const updateProfile = async () => {
    if (!user || !profile) return

    // Validate password before submission
    if (formData.newPassword) {
      const errors = validatePassword(formData.newPassword, formData.confirmPassword)
      if (errors.length > 0) {
        setPasswordErrors(errors)
        setShowPasswordErrors(true)
        return
      }
    }

    setLoading(true)
    try {
      // Update selected book in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          selected_book_id: formData.selectedBookId || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // Update password if provided
      if (formData.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        })
        if (passwordError) throw passwordError
      }

      // Refresh profile data
      await refreshProfile()

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      // Clear password fields and errors
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: ""
      }))
      setPasswordErrors([])
      setShowPasswordErrors(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const getUserFullName = () => {
    const firstName = profile.first_name || ""
    const lastName = profile.last_name || ""
    return `${firstName} ${lastName}`.trim() || user?.email || "User"
  }

  const hasPasswordChanges = formData.newPassword || formData.confirmPassword
  const isPasswordValid = hasPasswordChanges ? passwordErrors.length === 0 : true
  const canSave = isPasswordValid

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Current Profile Info (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your current account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="p-3 bg-muted rounded-md">
                  {getUserFullName()}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="p-3 bg-muted rounded-md">
                  {user.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Study Preferences
            </CardTitle>
            <CardDescription>Choose the book you're currently studying</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="selectedBook">Current Book</Label>
              <Select
                value={formData.selectedBookId}
                onValueChange={(value) => handleInputChange("selectedBookId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a book to study" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password for security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                placeholder="Enter new password"
                className={passwordErrors.length > 0 && formData.newPassword ? "border-red-500" : ""}
              />
              {formData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center text-sm ${
                    formData.newPassword.length >= 6 ? "text-green-600" : "text-red-600"
                  }`}>
                    {formData.newPassword.length >= 6 ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    At least 6 characters
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                className={passwordErrors.some(error => error.includes("match")) && formData.confirmPassword ? "border-red-500" : ""}
              />
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <div className="mt-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Passwords match
                  </div>
                </div>
              )}
            </div>
            
            {showPasswordErrors && passwordErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {passwordErrors.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={updateProfile} 
            disabled={loading || !canSave}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 