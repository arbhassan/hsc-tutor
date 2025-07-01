import { createClient } from '@/lib/supabase/client'

// Types based on the database schema
export interface Book {
  id: string
  title: string
  author: string
  year: string
  description: string
  image?: string
  category: 'prose' | 'poetry' | 'drama' | 'nonfiction' | 'film'
  themes: string[]
  popular?: boolean
  created_at: string
  updated_at: string
}

export interface NewBook {
  id: string
  title: string
  author: string
  year: string
  description: string
  image?: string
  category: 'prose' | 'poetry' | 'drama' | 'nonfiction' | 'film'
  themes: string[]
  popular?: boolean
}

export interface FlashcardSet {
  id: string
  user_id: string
  title: string
  description?: string
  type: 'quote' | 'paragraph' | 'analysis'
  book_id: string
  created_at: string
  updated_at: string
  book?: Book
  passage_count?: number
}

export interface NewFlashcardSet {
  title: string
  description?: string
  type: 'quote' | 'paragraph' | 'analysis'
  book_id: string
  passages: Array<{
    text: string
    source: string
  }>
}

export interface Passage {
  id: string
  flashcard_set_id: string
  text: string
  source: string
  attempts: number
  correct_attempts: number
  created_at: string
  updated_at: string
}

export interface PastExamQuestion {
  id: string
  question: string
  theme: string
  book_id: string
  year?: number
  exam_type: 'HSC' | 'Trial' | 'Practice'
  difficulty_level: 'Foundation' | 'Standard' | 'Advanced'
  created_at: string
  updated_at: string
  book?: Book
}

export interface NewPastExamQuestion {
  question: string
  theme: string
  book_id: string
  year?: number
  exam_type: 'HSC' | 'Trial' | 'Practice'
  difficulty_level: 'Foundation' | 'Standard' | 'Advanced'
}

class AdminService {
  private supabase = createClient()

  // Books CRUD operations
  async getAllBooks(): Promise<Book[]> {
    const { data, error } = await this.supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching books:', error)
      throw error
    }

    return data || []
  }

  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await this.supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching book:', error)
      throw error
    }

    return data
  }

  async createBook(book: NewBook): Promise<Book> {
    const { data, error } = await this.supabase
      .from('books')
      .insert(book)
      .select()
      .single()

    if (error) {
      console.error('Error creating book:', error)
      throw error
    }

    return data
  }

  async updateBook(id: string, updates: Partial<NewBook>): Promise<Book> {
    // Remove id from updates to prevent foreign key constraint violations
    const { id: _, ...safeUpdates } = updates
    
    const { data, error } = await this.supabase
      .from('books')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating book:', error)
      throw error
    }

    return data
  }

  async deleteBook(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting book:', error)
      throw error
    }

    return true
  }

  // Flashcard Sets CRUD operations
  async getAllFlashcardSets(): Promise<FlashcardSet[]> {
    try {
      // Try the optimized query first (requires foreign key constraint)
      const { data, error } = await this.supabase
        .from('flashcard_sets')
        .select(`
          *,
          book:books(*),
          passage_count:passages(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        // If the foreign key relationship doesn't exist, fall back to separate queries
        if (error.code === 'PGRST200' && error.message.includes('Could not find a relationship')) {
          console.warn('Foreign key relationship missing, using fallback query method')
          return this.getAllFlashcardSetsFallback()
        }
        throw error
      }

      return data?.map(set => ({
        ...set,
        passage_count: set.passage_count?.[0]?.count || 0
      })) || []
    } catch (error) {
      console.error('Error fetching flashcard sets:', error)
      throw error
    }
  }

  // Fallback method that works without foreign key relationships
  private async getAllFlashcardSetsFallback(): Promise<FlashcardSet[]> {
    // Get flashcard sets first
    const { data: sets, error: setsError } = await this.supabase
      .from('flashcard_sets')
      .select('*')
      .order('created_at', { ascending: false })

    if (setsError) {
      throw setsError
    }

    if (!sets || sets.length === 0) {
      return []
    }

    // Get all books
    const { data: books, error: booksError } = await this.supabase
      .from('books')
      .select('*')

    if (booksError) {
      console.warn('Error fetching books for flashcard sets:', booksError)
    }

    // Get passage counts for each set
    const setIds = sets.map(set => set.id)
    const { data: passageCounts, error: passagesError } = await this.supabase
      .from('passages')
      .select('flashcard_set_id')
      .in('flashcard_set_id', setIds)

    if (passagesError) {
      console.warn('Error fetching passage counts:', passagesError)
    }

    // Count passages per set
    const passageCountMap = passageCounts?.reduce((acc, passage) => {
      acc[passage.flashcard_set_id] = (acc[passage.flashcard_set_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Combine the data
    return sets.map(set => ({
      ...set,
      book: books?.find(book => book.id === set.book_id),
      passage_count: passageCountMap[set.id] || 0
    }))
  }

  async getFlashcardSetById(id: string): Promise<FlashcardSet | null> {
    try {
      // Try the optimized query first (requires foreign key constraint)
      const { data, error } = await this.supabase
        .from('flashcard_sets')
        .select(`
          *,
          book:books(*),
          passages(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        // If the foreign key relationship doesn't exist, fall back to separate queries
        if (error.code === 'PGRST200' && error.message.includes('Could not find a relationship')) {
          console.warn('Foreign key relationship missing, using fallback query method')
          return this.getFlashcardSetByIdFallback(id)
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching flashcard set:', error)
      throw error
    }
  }

  // Fallback method that works without foreign key relationships
  private async getFlashcardSetByIdFallback(id: string): Promise<FlashcardSet | null> {
    // Get the flashcard set
    const { data: set, error: setError } = await this.supabase
      .from('flashcard_sets')
      .select('*')
      .eq('id', id)
      .single()

    if (setError) {
      if (setError.code === 'PGRST116') {
        return null // Not found
      }
      throw setError
    }

    // Get the associated book
    const { data: book, error: bookError } = await this.supabase
      .from('books')
      .select('*')
      .eq('id', set.book_id)
      .single()

    if (bookError && bookError.code !== 'PGRST116') {
      console.warn('Error fetching book for flashcard set:', bookError)
    }

    // Get the passages
    const { data: passages, error: passagesError } = await this.supabase
      .from('passages')
      .select('*')
      .eq('flashcard_set_id', id)

    if (passagesError) {
      console.warn('Error fetching passages for flashcard set:', passagesError)
    }

    return {
      ...set,
      book: book || undefined,
      passages: passages || []
    }
  }

  async createFlashcardSet(userId: string, flashcardSet: NewFlashcardSet): Promise<FlashcardSet> {
    // Start a transaction to create the flashcard set and passages
    const { data: setData, error: setError } = await this.supabase
      .from('flashcard_sets')
      .insert({
        user_id: userId,
        title: flashcardSet.title,
        description: flashcardSet.description,
        type: flashcardSet.type,
        book_id: flashcardSet.book_id
      })
      .select()
      .single()

    if (setError) {
      console.error('Error creating flashcard set:', setError)
      throw setError
    }

    // Create passages if provided
    if (flashcardSet.passages?.length > 0) {
      const passagesToInsert = flashcardSet.passages.map(passage => ({
        flashcard_set_id: setData.id,
        text: passage.text,
        source: passage.source
      }))

      const { error: passagesError } = await this.supabase
        .from('passages')
        .insert(passagesToInsert)

      if (passagesError) {
        console.error('Error creating passages:', passagesError)
        // Rollback by deleting the flashcard set
        await this.deleteFlashcardSet(setData.id)
        throw passagesError
      }
    }

    return setData
  }

  async updateFlashcardSet(id: string, updates: Partial<Omit<NewFlashcardSet, 'passages'>>): Promise<FlashcardSet> {
    const { data, error } = await this.supabase
      .from('flashcard_sets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating flashcard set:', error)
      throw error
    }

    return data
  }

  async deleteFlashcardSet(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('flashcard_sets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting flashcard set:', error)
      throw error
    }

    return true
  }

  // Passages CRUD operations
  async getPassagesBySetId(flashcardSetId: string): Promise<Passage[]> {
    const { data, error } = await this.supabase
      .from('passages')
      .select('*')
      .eq('flashcard_set_id', flashcardSetId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching passages:', error)
      throw error
    }

    return data || []
  }

  async createPassage(passage: Omit<Passage, 'id' | 'attempts' | 'correct_attempts' | 'created_at' | 'updated_at'>): Promise<Passage> {
    const { data, error } = await this.supabase
      .from('passages')
      .insert(passage)
      .select()
      .single()

    if (error) {
      console.error('Error creating passage:', error)
      throw error
    }

    return data
  }

  async updatePassage(id: string, updates: Partial<Pick<Passage, 'text' | 'source'>>): Promise<Passage> {
    const { data, error } = await this.supabase
      .from('passages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating passage:', error)
      throw error
    }

    return data
  }

  async deletePassage(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('passages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting passage:', error)
      throw error
    }

    return true
  }

  async updateFlashcardSetPassages(flashcardSetId: string, passages: Array<{ text: string; source: string }>): Promise<boolean> {
    try {
      // Delete all existing passages for this set
      const { error: deleteError } = await this.supabase
        .from('passages')
        .delete()
        .eq('flashcard_set_id', flashcardSetId)

      if (deleteError) {
        console.error('Error deleting existing passages:', deleteError)
        throw deleteError
      }

      // Insert new passages if any
      if (passages.length > 0) {
        const passagesToInsert = passages.map(passage => ({
          flashcard_set_id: flashcardSetId,
          text: passage.text,
          source: passage.source
        }))

        const { error: insertError } = await this.supabase
          .from('passages')
          .insert(passagesToInsert)

        if (insertError) {
          console.error('Error inserting new passages:', insertError)
          throw insertError
        }
      }

      return true
    } catch (error) {
      console.error('Error updating flashcard set passages:', error)
      throw error
    }
  }

  // Past Exam Questions CRUD operations
  async getAllPastExamQuestions(): Promise<PastExamQuestion[]> {
    try {
      const { data, error } = await this.supabase
        .from('past_exam_questions')
        .select(`
          *,
          book:books(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        // Fallback without join if foreign key doesn't exist
        const { data: questionsData, error: questionsError } = await this.supabase
          .from('past_exam_questions')
          .select('*')
          .order('created_at', { ascending: false })

        if (questionsError) {
          throw questionsError
        }

        // Get books separately
        const { data: books } = await this.supabase
          .from('books')
          .select('*')

        const booksMap = new Map(books?.map(book => [book.id, book]) || [])

        return questionsData?.map(question => ({
          ...question,
          book: booksMap.get(question.book_id)
        })) || []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching past exam questions:', error)
      throw error
    }
  }

  async getPastExamQuestionById(id: string): Promise<PastExamQuestion | null> {
    const { data, error } = await this.supabase
      .from('past_exam_questions')
      .select(`
        *,
        book:books(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching past exam question:', error)
      throw error
    }

    return data
  }

  async getPastExamQuestionsByBookAndTheme(bookId: string, theme: string): Promise<PastExamQuestion[]> {
    const { data, error } = await this.supabase
      .from('past_exam_questions')
      .select('*')
      .eq('book_id', bookId)
      .eq('theme', theme)
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching past exam questions by book and theme:', error)
      throw error
    }

    return data || []
  }

  async createPastExamQuestion(question: NewPastExamQuestion): Promise<PastExamQuestion> {
    const { data, error } = await this.supabase
      .from('past_exam_questions')
      .insert(question)
      .select()
      .single()

    if (error) {
      console.error('Error creating past exam question:', error)
      throw error
    }

    return data
  }

  async updatePastExamQuestion(id: string, updates: Partial<NewPastExamQuestion>): Promise<PastExamQuestion> {
    const { data, error } = await this.supabase
      .from('past_exam_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating past exam question:', error)
      throw error
    }

    return data
  }

  async deletePastExamQuestion(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('past_exam_questions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting past exam question:', error)
      throw error
    }

    return true
  }

  // Statistics
  async getStats() {
    const [booksResult, flashcardSetsResult, passagesResult, pastExamQuestionsResult] = await Promise.all([
      this.supabase.from('books').select('id', { count: 'exact', head: true }),
      this.supabase.from('flashcard_sets').select('id', { count: 'exact', head: true }),
      this.supabase.from('passages').select('id', { count: 'exact', head: true }),
      this.supabase.from('past_exam_questions').select('id', { count: 'exact', head: true })
    ])

    return {
      totalBooks: booksResult.count || 0,
      totalFlashcardSets: flashcardSetsResult.count || 0,
      totalUsers: 0, // Would need to query auth.users if accessible
      totalPassages: passagesResult.count || 0,
      totalPastExamQuestions: pastExamQuestionsResult.count || 0
    }
  }
}

export const adminService = new AdminService() 