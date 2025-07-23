"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Edit, Plus, FileText, Quote, Lightbulb, Globe, User, BookText, PlusCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

interface Book {
  id: string
  title: string
  author: string
  year: string
  description: string
  category: string
  themes: string[]
  popular: boolean
}

export default function BookContentAdminPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title')

      if (error) {
        console.error('Error fetching books:', error)
        return
      }

      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading books...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Content Management</h1>
          <p className="text-gray-600 mt-2">Manage detailed content for all books including contexts, quotes, and lesson materials.</p>
        </div>
        <Button asChild>
          <Link href="/admin/book-content/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Book
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {book.author} • {book.year}
                  </CardDescription>
                </div>
                <Badge variant={book.popular ? "default" : "outline"}>
                  {book.popular ? "Popular" : "Standard"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {book.description}
              </p>
              
              {/* Themes */}
              <div className="flex flex-wrap gap-1 mb-4">
                {book.themes.slice(0, 3).map((theme) => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
                {book.themes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{book.themes.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Content Management Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/basic`}>
                      <BookOpen className="h-3 w-3 mr-1" />
                      Basic Info
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/contexts`}>
                      <FileText className="h-3 w-3 mr-1" />
                      Contexts
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/rubric`}>
                      <User className="h-3 w-3 mr-1" />
                      Rubric
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/plot`}>
                      <BookText className="h-3 w-3 mr-1" />
                      Plot
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/contemporary`}>
                      <Globe className="h-3 w-3 mr-1" />
                      Contemporary
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/book-content/${book.id}/essay`}>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Essay Guide
                    </Link>
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/admin/book-content/${book.id}/quotes`}>
                    <Quote className="h-3 w-3 mr-1" />
                    Quotes & Techniques
                  </Link>
                </Button>

                <Button className="w-full" asChild>
                  <Link href={`/admin/book-content/${book.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit All Content
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchQuery ? "No books found matching your search." : "No books available."}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-4">
              <Link href="/admin/book-content/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Book
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 