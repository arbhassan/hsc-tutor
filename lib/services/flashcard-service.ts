import { createClient } from '@/lib/supabase/client'
import { FlashcardSet, Passage } from '@/lib/types/database'

type PassageType = 'quote' | 'paragraph' | 'analysis'

export interface FlashcardSetWithPassages extends Omit<FlashcardSet, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  id: string
  passages: PassageData[]
  createdAt: string
  updatedAt: string
}

export interface PassageData extends Omit<Passage, 'id' | 'flashcard_set_id' | 'created_at' | 'updated_at'> {
  id: string
}

export interface NewFlashcardSet {
  title: string
  description: string
  type: PassageType
  bookId: string
  passages: {
    text: string
    source: string
  }[]
}

export class FlashcardService {
  private supabase = createClient()

  async getFlashcardSets(userId: string, bookId?: string): Promise<FlashcardSetWithPassages[]> {
    try {
      let query = this.supabase
        .from('flashcard_sets')
        .select(`
          id,
          title,
          description,
          type,
          book_id,
          created_at,
          updated_at,
          passages (
            id,
            text,
            source,
            attempts,
            correct_attempts
          )
        `)
        .eq('user_id', userId)

      if (bookId) {
        query = query.eq('book_id', bookId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching flashcard sets:', error)
        return []
      }

      return (data || []).map(set => ({
        id: set.id,
        title: set.title,
        description: set.description || '',
        type: set.type as PassageType,
        bookId: set.book_id,
        passages: (set.passages || []).map((passage: any) => ({
          id: passage.id,
          text: passage.text,
          source: passage.source,
          attempts: passage.attempts,
          correctAttempts: passage.correct_attempts
        })),
        createdAt: set.created_at,
        updatedAt: set.updated_at
      }))
    } catch (error) {
      console.error('Error in getFlashcardSets:', error)
      return []
    }
  }

  async createFlashcardSet(userId: string, newSet: NewFlashcardSet): Promise<FlashcardSetWithPassages | null> {
    try {
      // First, create the flashcard set
      const { data: setData, error: setError } = await this.supabase
        .from('flashcard_sets')
        .insert({
          user_id: userId,
          title: newSet.title,
          description: newSet.description,
          type: newSet.type,
          book_id: newSet.bookId
        })
        .select('*')
        .single()

      if (setError) {
        console.error('Error creating flashcard set:', setError)
        return null
      }

      // Then, create the passages
      const passagesData = newSet.passages
        .filter(p => p.text.trim() && p.source.trim())
        .map(passage => ({
          flashcard_set_id: setData.id,
          text: passage.text,
          source: passage.source,
          attempts: 0,
          correct_attempts: 0
        }))

      if (passagesData.length === 0) {
        // If no valid passages, delete the created set
        await this.supabase
          .from('flashcard_sets')
          .delete()
          .eq('id', setData.id)
        return null
      }

      const { data: passageResults, error: passageError } = await this.supabase
        .from('passages')
        .insert(passagesData)
        .select('*')

      if (passageError) {
        console.error('Error creating passages:', passageError)
        // Clean up the created set if passages failed
        await this.supabase
          .from('flashcard_sets')
          .delete()
          .eq('id', setData.id)
        return null
      }

      return {
        id: setData.id,
        title: setData.title,
        description: setData.description || '',
        type: setData.type as PassageType,
        bookId: setData.book_id,
        passages: (passageResults || []).map(passage => ({
          id: passage.id,
          text: passage.text,
          source: passage.source,
          attempts: passage.attempts,
          correctAttempts: passage.correct_attempts
        })),
        createdAt: setData.created_at,
        updatedAt: setData.updated_at
      }
    } catch (error) {
      console.error('Error in createFlashcardSet:', error)
      return null
    }
  }

  async updatePassageStats(passageId: string, attempts: number, correctAttempts: number): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('passages')
        .update({
          attempts,
          correct_attempts: correctAttempts
        })
        .eq('id', passageId)

      if (error) {
        console.error('Error updating passage stats:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updatePassageStats:', error)
      return false
    }
  }

  async deleteFlashcardSet(setId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', setId)

      if (error) {
        console.error('Error deleting flashcard set:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteFlashcardSet:', error)
      return false
    }
  }

  async seedDefaultFlashcardSets(userId: string, bookId: string): Promise<void> {
    try {
      // Check if user already has flashcard sets for this book
      const existingSets = await this.getFlashcardSets(userId, bookId)
      if (existingSets.length > 0) {
        return // Don't seed if sets already exist
      }

      let defaultSets: NewFlashcardSet[] = []

      if (bookId === '1984') {
        defaultSets = [
          {
            title: '1984 Key Quotes',
            description: 'Essential quotes from George Orwell\'s 1984',
            type: 'quote',
            bookId: '1984',
            passages: [
              {
                text: 'War is peace. Freedom is slavery. Ignorance is strength.',
                source: '1984, George Orwell'
              },
              {
                text: 'Big Brother is watching you.',
                source: '1984, George Orwell'
              },
              {
                text: 'It was a bright cold day in April, and the clocks were striking thirteen.',
                source: '1984, George Orwell - Opening line'
              }
            ]
          }
        ]
      } else if (bookId === 'hamlet') {
        defaultSets = [
          {
            title: 'Hamlet Key Quotes',
            description: 'Essential quotes from Shakespeare\'s Hamlet',
            type: 'quote',
            bookId: 'hamlet',
            passages: [
              {
                text: 'To be or not to be, that is the question.',
                source: 'Hamlet, Act 3 Scene 1'
              },
              {
                text: 'Something is rotten in the state of Denmark.',
                source: 'Hamlet, Act 1 Scene 4'
              }
            ]
          },
          {
            title: 'Hamlet PETAL Paragraphs',
            description: 'Model PETAL paragraphs for Hamlet essays',
            type: 'analysis',
            bookId: 'hamlet',
            passages: [
              {
                text: 'Shakespeare explores the corrupting influence of power through the character of Claudius. The metaphor "that have a father killed, a mother stained" emphasizes how Claudius\'s actions have corrupted the natural order and the sanctity of family.',
                source: 'Hamlet, Theme of Corruption'
              }
            ]
          }
        ]
      }

      // Create each default set
      for (const set of defaultSets) {
        await this.createFlashcardSet(userId, set)
      }
    } catch (error) {
      console.error('Error seeding default flashcard sets:', error)
    }
  }
}

export const flashcardService = new FlashcardService() 