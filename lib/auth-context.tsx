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

  const fetchProfile = async (userId: string) => {
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

  const refreshProfile = async () => {
    if (!user) return
    
    const profileData = await fetchProfile(user.id)
    setProfile(profileData)
    
    if (profileData?.selected_book_id) {
      try {
        const book = await getBookById(profileData.selected_book_id)
        setSelectedBook(book)
      } catch (error) {
        console.error('Error fetching selected book:', error)
        setSelectedBook(null)
      }
    }
  }

  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('AuthContext: Session result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: error?.message
        })
        
        if (!isMounted) return
        
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          console.log('AuthContext: User found, fetching profile...')
          // Fetch profile data in the background
          const profileData = await fetchProfile(currentUser.id)
          
          if (!isMounted) return
          
          setProfile(profileData)
          
          if (profileData?.selected_book_id) {
            try {
              const book = await getBookById(profileData.selected_book_id)
              if (isMounted) {
                setSelectedBook(book)
              }
            } catch (error) {
              console.error('Error fetching selected book:', error)
              if (isMounted) {
                setSelectedBook(null)
              }
            }
          }
        } else {
          console.log('AuthContext: No user found in session')
        }
      } catch (error) {
        console.error('AuthContext: Error getting initial session:', error)
      } finally {
        if (isMounted) {
          console.log('AuthContext: Setting loading to false')
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        })
        
        if (!isMounted) return
        
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          console.log('AuthContext: Loading profile for authenticated user...')
          const profileData = await fetchProfile(currentUser.id)
          
          if (!isMounted) return
          
          setProfile(profileData)
          console.log('AuthContext: Profile loaded:', !!profileData)
          
          if (profileData?.selected_book_id) {
            try {
              const book = await getBookById(profileData.selected_book_id)
              if (isMounted) {
                setSelectedBook(book)
                console.log('AuthContext: Selected book loaded:', book?.title)
              }
            } catch (error) {
              console.error('Error fetching selected book:', error)
              if (isMounted) {
                setSelectedBook(null)
              }
            }
          }
        } else {
          console.log('AuthContext: Clearing user data')
          if (isMounted) {
            setProfile(null)
            setSelectedBook(null)
          }
        }
        
        // IMPORTANT: Always set loading to false after processing auth state change
        if (isMounted) {
          console.log('AuthContext: Auth state change complete, setting loading to false')
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    console.log('AuthContext: Signing out...')
    await supabase.auth.signOut()
    setProfile(null)
    setSelectedBook(null)
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