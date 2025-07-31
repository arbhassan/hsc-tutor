"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { quoteFlashcardService, type FlashcardCardWithDetails, type CardFilters, type Theme } from "@/lib/services/quote-flashcard-service"
import { adminService, type Book } from "@/lib/services/admin-service"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CreditCard,
  Search,
  Filter,
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  Tags,
  Quote as QuoteIcon,
  Settings,
  MoreVertical,
  RefreshCw,
  Archive,
  CheckSquare,
  Square,
} from "lucide-react"

function FlashcardCardsAdminContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const editId = searchParams.get('edit')
  
  return <FlashcardCardsAdminPage action={action} editId={editId} />
}

function FlashcardCardsAdminPage({ action, editId }: { action: string | null, editId: string | null }) {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [cards, setCards] = useState<FlashcardCardWithDetails[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<CardFilters>({
    search: "",
    book_id: undefined,
    theme_ids: [],
    only_active: true
  })
  const [showForm, setShowForm] = useState(!!editId)
  const [editingCard, setEditingCard] = useState<FlashcardCardWithDetails | null>(null)
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    card_text: "",
    missing_words: [""]
  })

  // New state for bulk operations
  const [showRetagDialog, setShowRetagDialog] = useState(false)
  const [selectedThemesForRetag, setSelectedThemesForRetag] = useState<string[]>([])
  const [isOperationInProgress, setIsOperationInProgress] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  // Handle URL params
  useEffect(() => {
    if (editId && cards.length > 0) {
      const cardToEdit = cards.find(card => card.id === editId)
      if (cardToEdit) {
        setEditingCard(cardToEdit)
        setFormData({
          card_text: cardToEdit.card_text,
          missing_words: cardToEdit.missing_words || [""]
        })
        setShowForm(true)
      } else {
        // Card not found, clear URL params
        router.push('/admin/flashcard-cards')
      }
    } else if (!editId) {
      // No edit ID, make sure form is hidden
      setShowForm(false)
      setEditingCard(null)
      resetForm()
    }
  }, [editId, cards, router])

  // Load cards when filters change
  useEffect(() => {
    loadCards()
  }, [filters])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [themesData, booksData] = await Promise.all([
        quoteFlashcardService.getAllThemes(),
        adminService.getAllBooks()
      ])
      setThemes(themesData)
      setBooks(booksData)
      await loadCards()
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCards = async () => {
    try {
      const cardsData = await quoteFlashcardService.getCardsForStudy(filters)
      setCards(cardsData)
      setSelectedCards([]) // Clear selections when reloading
    } catch (error) {
      console.error('Error loading cards:', error)
      toast({
        title: "Error",
        description: "Failed to load cards",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      card_text: "",
      missing_words: [""]
    })
    setEditingCard(null)
    setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.card_text.trim()) {
      setError("Card text is required")
      return false
    }
    if (!formData.missing_words || formData.missing_words.length === 0 || formData.missing_words.some(word => !word.trim())) {
      setError("All missing words are required")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !editingCard) return

    try {
      const success = await quoteFlashcardService.updateCard(editingCard.id, {
        card_text: formData.card_text,
        missing_words: formData.missing_words
      })

      if (success) {
        toast({
          title: "Success",
          description: "Card updated successfully",
        })
        await loadCards()
        setShowForm(false)
        resetForm()
        router.push('/admin/flashcard-cards')
      } else {
        throw new Error("Failed to update card")
      }
    } catch (error) {
      console.error('Error saving card:', error)
      toast({
        title: "Error",
        description: "Failed to save card",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (cardId: string, isActive: boolean) => {
    try {
      const success = await quoteFlashcardService.toggleCardActive(cardId, isActive)
      if (success) {
        toast({
          title: "Success",
          description: `Card ${isActive ? 'activated' : 'hidden'} successfully`,
        })
        await loadCards()
      } else {
        throw new Error("Failed to toggle card status")
      }
    } catch (error) {
      console.error('Error toggling card status:', error)
      toast({
        title: "Error",
        description: "Failed to update card status",
        variant: "destructive",
      })
    }
  }

  const handleBulkToggleActive = async (isActive: boolean) => {
    if (selectedCards.length === 0) return

    try {
      const success = await quoteFlashcardService.bulkToggleActive(selectedCards, isActive)
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCards.length} cards ${isActive ? 'activated' : 'hidden'} successfully`,
        })
        setSelectedCards([])
        await loadCards()
      } else {
        throw new Error("Failed to update cards")
      }
    } catch (error) {
      console.error('Error with bulk operation:', error)
      toast({
        title: "Error",
        description: "Failed to update cards",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) return

    const confirmed = window.confirm(`Are you sure you want to permanently delete ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''}? This action cannot be undone.`)
    if (!confirmed) return

    try {
      setIsOperationInProgress(true)
      const success = await quoteFlashcardService.bulkDeleteCards(selectedCards)
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCards.length} cards deleted successfully`,
        })
        setSelectedCards([])
        await loadCards()
      } else {
        throw new Error("Failed to delete cards")
      }
    } catch (error) {
      console.error('Error deleting cards:', error)
      toast({
        title: "Error",
        description: "Failed to delete cards",
        variant: "destructive",
      })
    } finally {
      setIsOperationInProgress(false)
    }
  }

  const handleBulkArchive = async (archived: boolean = true) => {
    if (selectedCards.length === 0) return

    try {
      setIsOperationInProgress(true)
      const success = await quoteFlashcardService.bulkArchiveCards(selectedCards, archived)
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCards.length} cards ${archived ? 'archived' : 'unarchived'} successfully`,
        })
        setSelectedCards([])
        await loadCards()
      } else {
        throw new Error("Failed to archive cards")
      }
    } catch (error) {
      console.error('Error archiving cards:', error)
      toast({
        title: "Error",
        description: "Failed to archive cards",
        variant: "destructive",
      })
    } finally {
      setIsOperationInProgress(false)
    }
  }

  const handleBulkRetag = async () => {
    if (selectedCards.length === 0 || selectedThemesForRetag.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one theme",
        variant: "destructive",
      })
      return
    }

    try {
      setIsOperationInProgress(true)
      const success = await quoteFlashcardService.bulkUpdateCardThemes(selectedCards, selectedThemesForRetag)
      
      if (success) {
        toast({
          title: "Success",
          description: `Themes updated for ${selectedCards.length} cards successfully`,
        })
        setSelectedCards([])
        setSelectedThemesForRetag([])
        setShowRetagDialog(false)
        await loadCards()
      } else {
        throw new Error("Failed to update themes")
      }
    } catch (error) {
      console.error('Error updating themes:', error)
      toast({
        title: "Error",
        description: "Failed to update themes",
        variant: "destructive",
      })
    } finally {
      setIsOperationInProgress(false)
    }
  }

  const handleBulkRegenerate = async () => {
    if (selectedCards.length === 0) return

    const confirmed = window.confirm(`Are you sure you want to regenerate ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''}? The existing cards will be deleted and new ones will be generated from their quotes.`)
    if (!confirmed) return

    try {
      setIsOperationInProgress(true)
      const success = await quoteFlashcardService.bulkRegenerateCards(selectedCards)
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCards.length} cards regenerated successfully`,
        })
        setSelectedCards([])
        await loadCards()
      } else {
        throw new Error("Failed to regenerate cards")
      }
    } catch (error) {
      console.error('Error regenerating cards:', error)
      toast({
        title: "Error",
        description: "Failed to regenerate cards",
        variant: "destructive",
      })
    } finally {
      setIsOperationInProgress(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedCards.length === cards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(cards.map(card => card.id))
    }
  }

  const handleSelectCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId))
    } else {
      setSelectedCards([...selectedCards, cardId])
    }
  }

  const updateFilters = (newFilters: Partial<CardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      book_id: undefined,
      theme_ids: [],
      only_active: true
    })
  }

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Show access denied if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to access the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Flashcard Cards Management</h1>
            <p className="text-muted-foreground">Global dashboard for all auto-generated flashcard cards</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => loadCards()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Flashcard Card
            </CardTitle>
            <CardDescription>
              Update the card text and missing words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="card_text">Card Text *</Label>
                <Textarea
                  id="card_text"
                  value={formData.card_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, card_text: e.target.value }))}
                  placeholder="Text with _____ placeholder for missing word"
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use _____ to mark where the missing word should go
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Missing Words *</Label>
                  <div className="space-y-3">
                    {formData.missing_words.map((word, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <Input
                          value={word}
                          onChange={(e) => {
                            const newWords = [...formData.missing_words]
                            newWords[index] = e.target.value
                            setFormData(prev => ({ ...prev, missing_words: newWords }))
                          }}
                          placeholder={`Missing word ${index + 1}`}
                          required
                          className="flex-1"
                        />
                        {formData.missing_words.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newWords = formData.missing_words.filter((_, i) => i !== index)
                              setFormData(prev => ({ ...prev, missing_words: newWords }))
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, missing_words: [...prev.missing_words, ""] }))
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Word
                    </Button>
                  </div>
                </div>


              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Update Card
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                    router.push('/admin/flashcard-cards')
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search cards by quote text, missing word, or source..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-48">
                    <select
                      value={filters.book_id || "all"}
                      onChange={(e) => updateFilters({ book_id: e.target.value === "all" ? undefined : e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="all">All Books</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-inactive"
                      checked={!filters.only_active}
                      onCheckedChange={(checked) => updateFilters({ only_active: !checked })}
                    />
                    <Label htmlFor="show-inactive">Show hidden cards</Label>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>

                {themes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Filter by Themes</Label>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <Badge
                          key={theme.id}
                          variant={filters.theme_ids?.includes(theme.id) ? "default" : "outline"}
                          style={filters.theme_ids?.includes(theme.id) ? { backgroundColor: theme.color, borderColor: theme.color } : { borderColor: theme.color, color: theme.color }}
                          className="cursor-pointer"
                          onClick={() => {
                            const currentThemes = filters.theme_ids || []
                            const newThemes = currentThemes.includes(theme.id)
                              ? currentThemes.filter(id => id !== theme.id)
                              : [...currentThemes, theme.id]
                            updateFilters({ theme_ids: newThemes })
                          }}
                        >
                          {theme.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedCards.length > 0 && (
            <Card className="mb-6 border-primary">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggleActive(true)}
                      disabled={isOperationInProgress}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Show
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggleActive(false)}
                      disabled={isOperationInProgress}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </Button>
                    {selectedCards.length < 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRetagDialog(true)}
                        disabled={isOperationInProgress}
                      >
                        <Tags className="h-4 w-4 mr-2" />
                        Re-tag
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={isOperationInProgress}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCards([])}
                      disabled={isOperationInProgress}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Re-tag Dialog */}
          {showRetagDialog && (
            <Card className="mb-6 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Re-tag Selected Cards
                </CardTitle>
                <CardDescription>
                  Select themes to apply to all {selectedCards.length} selected cards. This will replace existing themes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Available Themes</Label>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <Badge
                          key={theme.id}
                          variant={selectedThemesForRetag.includes(theme.id) ? "default" : "outline"}
                          style={selectedThemesForRetag.includes(theme.id) ? { backgroundColor: theme.color, borderColor: theme.color } : { borderColor: theme.color, color: theme.color }}
                          className="cursor-pointer"
                          onClick={() => {
                            const isSelected = selectedThemesForRetag.includes(theme.id)
                            if (isSelected) {
                              setSelectedThemesForRetag(prev => prev.filter(id => id !== theme.id))
                            } else {
                              setSelectedThemesForRetag(prev => [...prev, theme.id])
                            }
                          }}
                        >
                          {theme.name}
                        </Badge>
                      ))}
                    </div>
                    {selectedThemesForRetag.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Click on themes above to select them
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleBulkRetag}
                      disabled={isOperationInProgress || selectedThemesForRetag.length === 0}
                    >
                      {isOperationInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Apply Themes
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowRetagDialog(false)
                        setSelectedThemesForRetag([])
                      }}
                      disabled={isOperationInProgress}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cards List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading cards...</p>
            </div>
          ) : cards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No cards found</h3>
                <p className="text-muted-foreground mb-4">
                  No flashcard cards match your current filters. Try adjusting your search criteria or{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/admin/quotes')}>
                    add some quotes
                  </Button>{" "}
                  to generate new cards.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {cards.length} card{cards.length > 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedCards.length === cards.length ? (
                      <Square className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckSquare className="h-4 w-4 mr-2" />
                    )}
                    {selectedCards.length === cards.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <Card key={card.id} className={`hover:shadow-lg transition-shadow ${!card.is_active ? 'opacity-60' : ''} ${selectedCards.includes(card.id) ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCards.includes(card.id)}
                            onCheckedChange={() => handleSelectCard(card.id)}
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {!card.is_active && (
                                <Badge variant="destructive" className="text-xs">Hidden</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleActive(card.id, !card.is_active)}
                            title={card.is_active ? "Hide from students" : "Show to students"}
                          >
                            {card.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => router.push(`/admin/flashcard-cards?edit=${card.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground mb-1">Card Text:</p>
                          <div className="p-2 bg-muted rounded text-sm">
                            {card.card_text}
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground mb-1">Missing Words:</p>
                          <div className="flex flex-wrap gap-1">
                            {(card.missing_words || []).map((word, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {index + 1}: {word}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {card.book?.title}
                          </Badge>
                        </div>

                        {card.quote && (
                          <div className="text-xs text-muted-foreground">
                            <p className="font-medium mb-1">From Quote:</p>
                            <p className="italic">
                              "{card.quote.text.length > 100 ? `${card.quote.text.substring(0, 100)}...` : card.quote.text}"
                            </p>
                          </div>
                        )}

                        {card.themes && card.themes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {card.themes.map((theme) => (
                              <Badge
                                key={theme.id}
                                variant="outline"
                                style={{ borderColor: theme.color, color: theme.color }}
                                className="text-xs"
                              >
                                {theme.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default function FlashcardCardsAdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <FlashcardCardsAdminContent />
    </Suspense>
  )
} 