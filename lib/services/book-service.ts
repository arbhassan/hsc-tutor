import { createClient } from '../supabase/client'
import type { Book } from '../types/database'

const supabase = createClient()

export class BookService {
  static async getAll(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title')

    if (error) {
      console.error('Error fetching books:', error)
      throw new Error('Failed to fetch books')
    }

    return data || []
  }

  static async getById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching book:', error)
      throw new Error('Failed to fetch book')
    }

    return data
  }

  static async getByCategory(category: Book["category"]): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', category)
      .order('title')

    if (error) {
      console.error('Error fetching books by category:', error)
      throw new Error('Failed to fetch books by category')
    }

    return data || []
  }

  static async getPopular(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('popular', true)
      .order('title')

    if (error) {
      console.error('Error fetching popular books:', error)
      throw new Error('Failed to fetch popular books')
    }

    return data || []
  }

  static async searchByTitle(searchTerm: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .ilike('title', `%${searchTerm}%`)
      .order('title')

    if (error) {
      console.error('Error searching books:', error)
      throw new Error('Failed to search books')
    }

    return data || []
  }

  static async searchByAuthor(searchTerm: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .ilike('author', `%${searchTerm}%`)
      .order('title')

    if (error) {
      console.error('Error searching books by author:', error)
      throw new Error('Failed to search books by author')
    }

    return data || []
  }

  static async getByTheme(theme: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .contains('themes', [theme])
      .order('title')

    if (error) {
      console.error('Error fetching books by theme:', error)
      throw new Error('Failed to fetch books by theme')
    }

    return data || []
  }
} 