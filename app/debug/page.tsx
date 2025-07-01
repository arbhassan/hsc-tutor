"use client"

import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const { user, profile, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [cookies, setCookies] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        error: error?.message,
        sessionId: session?.access_token?.slice(0, 20) + "..." || null
      })
    }
    
    checkSession()
    setCookies(document.cookie)
  }, [supabase])

  const refreshSession = async () => {
    console.log("Manually refreshing session...")
    const { data, error } = await supabase.auth.refreshSession()
    console.log("Refresh result:", { data, error })
    
    const { data: { session } } = await supabase.auth.getSession()
    setSessionInfo({
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      sessionId: session?.access_token?.slice(0, 20) + "..." || null
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
            <CardDescription>State from useAuth hook</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                loading,
                hasUser: !!user,
                userEmail: user?.email,
                userId: user?.id,
                hasProfile: !!profile,
                profileName: profile ? `${profile.first_name} ${profile.last_name}` : null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct Session Check</CardTitle>
            <CardDescription>Direct call to supabase.auth.getSession()</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto mb-4">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
            <Button onClick={refreshSession}>Refresh Session</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Cookies</CardTitle>
            <CardDescription>Current browser cookies</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {cookies || "No cookies found"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + "..." || null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 