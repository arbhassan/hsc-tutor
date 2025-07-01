"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import { Loader2 } from "lucide-react"

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/demo',
    '/demo/flashcards',
    '/debug'
  ]
  
  // Define routes that should handle auth client-side (but still require auth)
  const clientAuthRoutes = [
    '/admin',
    '/practice-zone',
    '/knowledge-bank',
    '/progress'
  ]
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the current path should handle auth client-side
  const isClientAuthRoute = clientAuthRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if this is an auth page
  const isAuthPage = pathname.startsWith('/auth')

  // For public routes, show content immediately without waiting for auth
  if (isPublicRoute) {
    return (
      <>
        {user && <Navbar />}
        <main className="min-h-screen">{children}</main>
      </>
    )
  }

  // For auth pages, show content immediately
  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>
  }

  // For client auth routes, show content with navbar (let the page handle auth logic)
  if (isClientAuthRoute) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </>
    )
  }

  // For protected routes, show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If user is not authenticated on a protected route, show children (middleware will redirect)
  if (!user) {
    return <main className="min-h-screen">{children}</main>
  }

  // If user is authenticated, show navbar and main content
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  )
} 