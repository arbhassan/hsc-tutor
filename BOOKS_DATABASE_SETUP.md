# Books Database Migration Guide

This guide explains how to migrate the books data from hardcoded arrays to a Supabase database table.

## Overview

The books data has been moved from a hardcoded array in `lib/books.ts` to a proper database table in Supabase. This provides better performance, easier management, and the ability to add/update books without code changes.

## Database Schema

The `books` table has the following structure:

```sql
CREATE TABLE public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL CHECK (category IN ('prose', 'poetry', 'drama', 'nonfiction', 'film')),
    themes TEXT[] NOT NULL DEFAULT '{}',
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## Setup Instructions

1. **Run the database setup script**: Execute `setup-books-database.sql` in your Supabase SQL Editor
2. **Verify the setup**: The script includes a verification query at the end
3. **Update your application**: The new code is already in place and backward compatible

## Files Changed

### Database Files
- `database-schema.sql` - Updated with books table schema
- `setup-books-database.sql` - Complete setup script (NEW)
- `populate-books.sql` - Data insertion script (NEW)

### Code Files
- `lib/types/database.ts` - Added Book type definitions
- `lib/services/book-service.ts` - New service class for book operations (NEW)
- `lib/books.ts` - Updated to use database instead of hardcoded array

## API Changes

### New Functions Available
```typescript
// Service class methods
BookService.getAll() // Get all books
BookService.getById(id) // Get book by ID
BookService.getByCategory(category) // Get books by category
BookService.getPopular() // Get popular books
BookService.searchByTitle(searchTerm) // Search books by title
BookService.searchByAuthor(searchTerm) // Search books by author
BookService.getByTheme(theme) // Get books containing a specific theme

// Exported functions (using service internally)
getBooks() // Get all books
getBookById(id) // Get book by ID
getBooksByCategory(category) // Get books by category
getPopularBooks() // Get popular books
searchBooksByTitle(searchTerm) // Search by title
searchBooksByAuthor(searchTerm) // Search by author
getBooksByTheme(theme) // Get books by theme
```

### Breaking Changes
- All functions are now `async` and return `Promise`
- `getBookById()` now returns `Book | null` instead of `Book | undefined`
- `AVAILABLE_BOOKS` array is now empty (for backward compatibility only)

### Migration for Existing Code

**Before:**
```typescript
import { AVAILABLE_BOOKS, getBookById } from 'lib/books'

// Synchronous access
const books = AVAILABLE_BOOKS
const book = getBookById('hamlet')
```

**After:**
```typescript
import { getBooks, getBookById } from 'lib/books'

// Asynchronous access
const books = await getBooks()
const book = await getBookById('hamlet')
```

## Database Permissions

The books table is configured for public read access since book data is not sensitive. Anonymous users can read all book data, but only authenticated users can potentially add new books (if enabled).

## Performance Improvements

- **Indexed queries**: Category, popularity, and themes are indexed for fast filtering
- **Efficient search**: Full-text search capabilities for titles and authors
- **Caching**: Supabase provides built-in caching for frequently accessed data

## Adding New Books

To add new books to the database, you can either:

1. **Via SQL**: Insert directly into the database
```sql
INSERT INTO public.books (id, title, author, year, description, category, themes, popular)
VALUES ('new-book-id', 'Book Title', 'Author Name', '2024', 'Description', 'prose', ARRAY['Theme1', 'Theme2'], false);
```

2. **Via Application**: Use the BookService (if insert permissions are enabled)
```typescript
// This would require insert permissions to be enabled
const { data, error } = await supabase
  .from('books')
  .insert({ id: 'new-book', title: 'New Book', /* ... other fields */ })
```

## Troubleshooting

### Common Issues

1. **"Books not loading"**: Check that the setup script ran successfully and the books table has data
2. **"Permission denied"**: Verify that the RLS policies are set up correctly
3. **"Function not found"**: Make sure you're using the async versions of the functions

### Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check if table exists and has data
SELECT COUNT(*) FROM public.books;

-- Check categories distribution
SELECT category, COUNT(*) FROM public.books GROUP BY category;

-- Check popular books
SELECT title, author FROM public.books WHERE popular = true;
```

## Rollback Plan

If you need to rollback to the hardcoded array temporarily:

1. Restore the old `lib/books.ts` from git history
2. Update any components that were changed to use async functions
3. The database table can remain for future migration

## Support

If you encounter issues with the migration, check:
1. Supabase connection is working
2. Environment variables are set correctly
3. Database permissions are configured properly
4. All SQL scripts ran without errors 