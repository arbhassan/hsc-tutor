"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { getBookById, type Book } from "@/lib/books"

interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  selected_book_id: string
  selected_book_title: string
  selected_book_author: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  selectedBook: Book | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const loadUserData = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null)
      setSelectedBook(null)
      return
    }

    try {
      // Fetch profile
      const profileData = await fetchProfile(currentUser.id)
      setProfile(profileData)

      // Fetch selected book if profile has one
      if (profileData?.selected_book_id) {
        try {
          const book = await getBookById(profileData.selected_book_id)
          setSelectedBook(book)
        } catch (error) {
          console.error('Error fetching selected book:', error)
          setSelectedBook(null)
        }
      } else {
        setSelectedBook(null)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      setProfile(null)
      setSelectedBook(null)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadUserData(user)
  }

  // Handle initial session
  useEffect(() => {
    let isMounted = true

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setProfile(null)
          setSelectedBook(null)
        } else {
          const currentUser = session?.user ?? null
          setUser(currentUser)
          await loadUserData(currentUser)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (isMounted) {
          setUser(null)
          setProfile(null)
          setSelectedBook(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    return () => {
      isMounted = false
    }
  }, [supabase.auth])

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        // Load user data in the background
        loadUserData(currentUser)
        
        // Ensure loading is false after auth state change
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSelectedBook(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    profile,
    selectedBook,
    loading,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 