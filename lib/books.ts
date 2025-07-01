import { BookService } from './services/book-service'
import type { Book } from './types/database'

export interface BookInterface {
  id: string
  title: string
  author: string
  year: string
  description: string
  image?: string
  category: "prose" | "poetry" | "drama" | "nonfiction" | "film"
  themes: string[]
  popular?: boolean
}

// For backward compatibility, export the interface as Book
export type { BookInterface as Book }

// Main functions using the service
export const getBooks = BookService.getAll
export const getBookById = BookService.getById
export const getBooksByCategory = BookService.getByCategory
export const getPopularBooks = BookService.getPopular

// Additional utility functions
export const getAllBooks = getBooks
export const searchBooksByTitle = BookService.searchByTitle
export const searchBooksByAuthor = BookService.searchByAuthor
export const getBooksByTheme = BookService.getByTheme

// Legacy export for compatibility - now returns empty array and logs deprecation warning
export const AVAILABLE_BOOKS: BookInterface[] = []

// For backward compatibility, keep the old function signature but mark as deprecated
/** @deprecated Use getBookById instead */
export const getBookByIdSync = (id: string): BookInterface | undefined => {
  console.warn('getBookByIdSync is deprecated. Use async getBookById instead.')
  return undefined
} 