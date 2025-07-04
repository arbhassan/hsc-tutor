"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

const ADMIN_PASSWORD = "admin123"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { toast } = useToast()
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if password is already verified in session storage
  useEffect(() => {
    const isVerified = sessionStorage.getItem('adminPasswordVerified')
    if (isVerified === 'true') {
      setIsPasswordVerified(true)
    }
    setLoading(false)
  }, [])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (passwordInput === ADMIN_PASSWORD) {
      setIsPasswordVerified(true)
      sessionStorage.setItem('adminPasswordVerified', 'true')
      setPasswordInput("")
      toast({
        title: "Access Granted",
        description: "Welcome to the admin dashboard",
      })
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      })
      setPasswordInput("")
    }
    setPasswordLoading(false)
  }

  // Show loading spinner while checking session storage
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Show password prompt if not verified
  if (!isPasswordVerified) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>
                Please enter the admin password to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    disabled={passwordLoading}
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={passwordLoading || !passwordInput.trim()}
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render the admin content if password is verified
  return <>{children}</>
} 