export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          year: string
          description: string
          image: string | null
          category: 'prose' | 'poetry' | 'drama' | 'nonfiction' | 'film'
          themes: string[]
          popular: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          author: string
          year: string
          description: string
          image?: string | null
          category: 'prose' | 'poetry' | 'drama' | 'nonfiction' | 'film'
          themes: string[]
          popular?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          year?: string
          description?: string
          image?: string | null
          category?: 'prose' | 'poetry' | 'drama' | 'nonfiction' | 'film'
          themes?: string[]
          popular?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          study_streak: number
          total_study_time: number
          completion_rate: number
          overall_mastery: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          study_streak?: number
          total_study_time?: number
          completion_rate?: number
          overall_mastery?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          study_streak?: number
          total_study_time?: number
          completion_rate?: number
          overall_mastery?: number
          created_at?: string
          updated_at?: string
        }
      }
      flashcard_progress: {
        Row: {
          id: string
          user_id: string
          text_name: string
          total_flashcards: number
          mastered_flashcards: number
          average_accuracy: number
          completion_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text_name: string
          total_flashcards?: number
          mastered_flashcards?: number
          average_accuracy?: number
          completion_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text_name?: string
          total_flashcards?: number
          mastered_flashcards?: number
          average_accuracy?: number
          completion_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      short_answer_progress: {
        Row: {
          id: string
          user_id: string
          total_questions: number
          average_score: number
          average_completion_time: number
          multiple_attempts_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_questions?: number
          average_score?: number
          average_completion_time?: number
          multiple_attempts_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_questions?: number
          average_score?: number
          average_completion_time?: number
          multiple_attempts_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      essay_progress: {
        Row: {
          id: string
          user_id: string
          total_essays: number
          average_score: number
          average_word_count: number
          average_quote_usage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_essays?: number
          average_score?: number
          average_word_count?: number
          average_quote_usage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_essays?: number
          average_score?: number
          average_word_count?: number
          average_quote_usage?: number
          created_at?: string
          updated_at?: string
        }
      }
      weekly_reports: {
        Row: {
          id: string
          user_id: string
          week_start: string
          highlights: string[]
          action_points: string[]
          time_recommendations: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          highlights: string[]
          action_points: string[]
          time_recommendations: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          highlights?: string[]
          action_points?: string[]
          time_recommendations?: string[]
          created_at?: string
        }
      }
      flashcard_sets: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'quote' | 'paragraph' | 'analysis'
          book_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: 'quote' | 'paragraph' | 'analysis'
          book_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: 'quote' | 'paragraph' | 'analysis'
          book_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      passages: {
        Row: {
          id: string
          flashcard_set_id: string
          text: string
          source: string
          attempts: number
          correct_attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flashcard_set_id: string
          text: string
          source: string
          attempts?: number
          correct_attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          flashcard_set_id?: string
          text?: string
          source?: string
          attempts?: number
          correct_attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Book = Database['public']['Tables']['books']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type FlashcardProgress = Database['public']['Tables']['flashcard_progress']['Row']
export type ShortAnswerProgress = Database['public']['Tables']['short_answer_progress']['Row']
export type EssayProgress = Database['public']['Tables']['essay_progress']['Row']
export type WeeklyReport = Database['public']['Tables']['weekly_reports']['Row']
export type FlashcardSet = Database['public']['Tables']['flashcard_sets']['Row']
export type Passage = Database['public']['Tables']['passages']['Row'] 