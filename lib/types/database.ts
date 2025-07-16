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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_essays?: number
          average_score?: number
          average_word_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_essays?: number
          average_score?: number
          average_word_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      short_answer_progress_detailed: {
        Row: {
          id: string
          user_id: string
          marker_type: number
          total_questions: number
          correct_answers: number
          average_score: number
          average_completion_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          marker_type: number
          total_questions?: number
          correct_answers?: number
          average_score?: number
          average_completion_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          marker_type?: number
          total_questions?: number
          correct_answers?: number
          average_score?: number
          average_completion_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      essay_component_progress: {
        Row: {
          id: string
          user_id: string
          component_type: string
          total_assessments: number
          average_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          component_type: string
          total_assessments?: number
          average_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          component_type?: string
          total_assessments?: number
          average_score?: number
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
      user_submissions: {
        Row: {
          id: string
          user_id: string
          submission_type: 'daily_drill' | 'exam_simulator'
          content_type: 'questions' | 'essay'
          submission_date: string
          title: string
          total_score: number | null
          max_score: number | null
          completion_time_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          submission_type: 'daily_drill' | 'exam_simulator'
          content_type: 'questions' | 'essay'
          submission_date?: string
          title: string
          total_score?: number | null
          max_score?: number | null
          completion_time_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          submission_type?: 'daily_drill' | 'exam_simulator'
          content_type?: 'questions' | 'essay'
          submission_date?: string
          title?: string
          total_score?: number | null
          max_score?: number | null
          completion_time_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      submission_questions: {
        Row: {
          id: string
          submission_id: string
          question_text: string
          user_response: string
          correct_answer: string | null
          ai_feedback: string | null
          marks_awarded: number | null
          max_marks: number | null
          text_title: string | null
          text_author: string | null
          text_type: string | null
          text_content: string | null
          question_order: number
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_text: string
          user_response: string
          correct_answer?: string | null
          ai_feedback?: string | null
          marks_awarded?: number | null
          max_marks?: number | null
          text_title?: string | null
          text_author?: string | null
          text_type?: string | null
          text_content?: string | null
          question_order: number
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_text?: string
          user_response?: string
          correct_answer?: string | null
          ai_feedback?: string | null
          marks_awarded?: number | null
          max_marks?: number | null
          text_title?: string | null
          text_author?: string | null
          text_type?: string | null
          text_content?: string | null
          question_order?: number
          created_at?: string
        }
      }
      submission_essays: {
        Row: {
          id: string
          submission_id: string
          essay_question: string
          essay_response: string
          word_count: number | null
          quote_count: number | null
          ai_feedback: string | null
          overall_score: number | null
          max_score: number | null
          criteria_scores: any | null
          band_level: number | null
          module: string | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          essay_question: string
          essay_response: string
          word_count?: number | null
          quote_count?: number | null
          ai_feedback?: string | null
          overall_score?: number | null
          max_score?: number | null
          criteria_scores?: any | null
          band_level?: number | null
          module?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          essay_question?: string
          essay_response?: string
          word_count?: number | null
          quote_count?: number | null
          ai_feedback?: string | null
          overall_score?: number | null
          max_score?: number | null
          criteria_scores?: any | null
          band_level?: number | null
          module?: string | null
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          title: string
          text: string
          book_id: string
          source: string | null
          created_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          text: string
          book_id: string
          source?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          text?: string
          book_id?: string
          source?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      quote_themes: {
        Row: {
          id: string
          quote_id: string
          theme_id: string
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          theme_id: string
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          theme_id?: string
          created_at?: string
        }
      }
      flashcard_cards: {
        Row: {
          id: string
          quote_id: string
          card_text: string
          missing_words: string[] // Changed from missing_word to array
          missing_positions: number[] // Changed from missing_position to array
          difficulty_level: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          card_text: string
          missing_words: string[] // Changed from missing_word to array
          missing_positions: number[] // Changed from missing_position to array
          difficulty_level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          card_text?: string
          missing_words?: string[] // Changed from missing_word to array
          missing_positions?: number[] // Changed from missing_position to array
          difficulty_level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_card_sets: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_card_set_items: {
        Row: {
          id: string
          set_id: string
          card_id: string
          added_at: string
        }
        Insert: {
          id?: string
          set_id: string
          card_id: string
          added_at?: string
        }
        Update: {
          id?: string
          set_id?: string
          card_id?: string
          added_at?: string
        }
      }
      card_progress: {
        Row: {
          id: string
          user_id: string
          card_id: string
          attempts: number
          correct_attempts: number
          last_attempt_at: string | null
          next_review_at: string | null
          ease_factor: number
          interval_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          attempts?: number
          correct_attempts?: number
          last_attempt_at?: string | null
          next_review_at?: string | null
          ease_factor?: number
          interval_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          attempts?: number
          correct_attempts?: number
          last_attempt_at?: string | null
          next_review_at?: string | null
          ease_factor?: number
          interval_days?: number
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
export type ShortAnswerProgressDetailed = Database['public']['Tables']['short_answer_progress_detailed']['Row']
export type EssayComponentProgress = Database['public']['Tables']['essay_component_progress']['Row']
export type UserSubmission = Database['public']['Tables']['user_submissions']['Row']
export type SubmissionQuestion = Database['public']['Tables']['submission_questions']['Row']
export type SubmissionEssay = Database['public']['Tables']['submission_essays']['Row']

// New flashcard workflow types
export type Quote = Database['public']['Tables']['quotes']['Row']
export type Theme = Database['public']['Tables']['themes']['Row']
export type QuoteTheme = Database['public']['Tables']['quote_themes']['Row']
export type FlashcardCard = Database['public']['Tables']['flashcard_cards']['Row']
export type StudentCardSet = Database['public']['Tables']['student_card_sets']['Row']
export type StudentCardSetItem = Database['public']['Tables']['student_card_set_items']['Row']
export type CardProgress = Database['public']['Tables']['card_progress']['Row'] 