"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { 
  quoteFlashcardService, 
  type FlashcardCardWithDetails, 
  type StudentCardSetWithDetails, 
  type CardFilters,
  type Theme
} from "@/lib/services/quote-flashcard-service"
import {
  Plus,
  Search,
  BookOpen,
  Tags,
  CreditCard,
  Play,
  Edit,
  Trash2,
  Clock,
  Eye,
  Archive,
} from "lucide-react"

interface StudySession {
  cards: FlashcardCardWithDetails[]
  currentIndex: number
  userInputs: { [key: string]: string }
  results: { [key: string]: boolean }
  showAnswers: boolean
}

export default function QuoteFlashcardsNewPage() {
  const { user, selectedBook } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [allCards, setAllCards] = useState<FlashcardCardWithDetails[]>([])
  const [filteredCards, setFilteredCards] = useState<FlashcardCardWithDetails[]>([])
  const [studentSets, setStudentSets] = useState<StudentCardSetWithDetails[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("card-bank")

  // Filters for card bank
  const [filters, setFilters] = useState<CardFilters>({
    search: "",
    theme_ids: [],
    difficulty_level: undefined,
    only_active: true
  })

  // Study session state
  const [studySession, setStudySession] = useState<StudySession | null>(null)

  // Personal set management
  const [showCreateSetDialog, setShowCreateSetDialog] = useState(false)
  const [newSetName, setNewSetName] = useState("")
  const [newSetDescription, setNewSetDescription] = useState("")
  const [showSetDetailsDialog, setShowSetDetailsDialog] = useState(false)
  const [selectedSet, setSelectedSet] = useState<StudentCardSetWithDetails | null>(null)
  const [cardsInSelectedSet, setCardsInSelectedSet] = useState<FlashcardCardWithDetails[]>([])
  const [showEditSetDialog, setShowEditSetDialog] = useState(false)
  const [editSetName, setEditSetName] = useState("")
  const [editSetDescription, setEditSetDescription] = useState("")

  // Restore study session from browser history on page load
  useEffect(() => {
    const currentState = window.history.state
    if (currentState && currentState.studySession) {
      setStudySession(currentState.studySession)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    if (!user?.id || !selectedBook?.id) return
    loadData()
  }, [user?.id, selectedBook?.id])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [allCards, filters])

  // Handle browser navigation during study session
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.studySession) {
        // Restore study session from history state
        setStudySession(event.state.studySession)
      } else {
        // No study session in history state, clear current session
        setStudySession(null)
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const loadData = async () => {
    if (!user?.id || !selectedBook?.id) return

    try {
      setIsLoading(true)
      const [cardsData, setsData, themesData] = await Promise.all([
        quoteFlashcardService.getCardsForStudy({
          book_id: selectedBook.id,
          only_active: true
        }),
        quoteFlashcardService.getStudentCardSets(user.id),
        quoteFlashcardService.getAllThemes()
      ])

      setAllCards(cardsData)
      setStudentSets(setsData)
      setThemes(themesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load flashcard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allCards]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(card => 
        card.card_text.toLowerCase().includes(searchTerm) ||
        card.missing_word.toLowerCase().includes(searchTerm) ||
        card.quote?.text.toLowerCase().includes(searchTerm) ||
        card.quote?.title.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.theme_ids && filters.theme_ids.length > 0) {
      filtered = filtered.filter(card =>
        card.themes?.some(theme => filters.theme_ids!.includes(theme.id))
      )
    }

    if (filters.difficulty_level) {
      filtered = filtered.filter(card => card.difficulty_level === filters.difficulty_level)
    }

    setFilteredCards(filtered)
  }

  const updateFilters = (newFilters: Partial<CardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      theme_ids: [],
      difficulty_level: undefined,
      only_active: true
    })
  }

  const handleCreateSet = async () => {
    if (!user?.id || !newSetName.trim()) return

    try {
      const newSet = await quoteFlashcardService.createStudentCardSet(user.id, {
        name: newSetName.trim(),
        description: newSetDescription.trim() || undefined
      })

      if (newSet) {
        toast({
          title: "Success",
          description: "Personal set created successfully",
        })
        setNewSetName("")
        setNewSetDescription("")
        setShowCreateSetDialog(false)
        await loadData()
      } else {
        throw new Error("Failed to create set")
      }
    } catch (error) {
      console.error('Error creating set:', error)
      toast({
        title: "Error",
        description: "Failed to create personal set",
        variant: "destructive",
      })
    }
  }

  const handleAddCardToSet = async (setId: string, cardId: string) => {
    try {
      const success = await quoteFlashcardService.addCardToSet(setId, cardId)
      if (success) {
        toast({
          title: "Success",
          description: "Card added to personal set",
        })
        await loadData()
      } else {
        throw new Error("Failed to add card")
      }
    } catch (error) {
      console.error('Error adding card to set:', error)
      toast({
        title: "Error",
        description: "Failed to add card to set",
        variant: "destructive",
      })
    }
  }

  const handleRemoveCardFromSet = async (setId: string, cardId: string) => {
    try {
      const success = await quoteFlashcardService.removeCardFromSet(setId, cardId)
      if (success) {
        toast({
          title: "Success",
          description: "Card removed from personal set",
        })
        await loadData()
        // Refresh cards in selected set if it's open
        if (selectedSet && selectedSet.id === setId) {
          const updatedCards = await quoteFlashcardService.getCardsInSet(setId)
          setCardsInSelectedSet(updatedCards)
        }
      } else {
        throw new Error("Failed to remove card")
      }
    } catch (error) {
      console.error('Error removing card from set:', error)
      toast({
        title: "Error",
        description: "Failed to remove card from set",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSet = async (setId: string) => {
    try {
      const success = await quoteFlashcardService.deleteStudentCardSet(setId)
      if (success) {
        toast({
          title: "Success",
          description: "Personal set deleted successfully",
        })
        setShowSetDetailsDialog(false)
        setSelectedSet(null)
        await loadData()
      } else {
        throw new Error("Failed to delete set")
      }
    } catch (error) {
      console.error('Error deleting set:', error)
      toast({
        title: "Error",
        description: "Failed to delete personal set",
        variant: "destructive",
      })
    }
  }

  const handleEditSet = async () => {
    if (!selectedSet || !editSetName.trim()) return

    try {
      const success = await quoteFlashcardService.updateStudentCardSet(selectedSet.id, {
        name: editSetName.trim(),
        description: editSetDescription.trim() || undefined
      })

      if (success) {
        toast({
          title: "Success",
          description: "Set updated successfully",
        })
        setShowEditSetDialog(false)
        setShowSetDetailsDialog(false)
        await loadData()
      } else {
        throw new Error("Failed to update set")
      }
    } catch (error) {
      console.error('Error updating set:', error)
      toast({
        title: "Error",
        description: "Failed to update set",
        variant: "destructive",
      })
    }
  }

  const openSetDetails = async (set: StudentCardSetWithDetails) => {
    setSelectedSet(set)
    try {
      const cards = await quoteFlashcardService.getCardsInSet(set.id)
      setCardsInSelectedSet(cards)
      setShowSetDetailsDialog(true)
    } catch (error) {
      console.error('Error loading set cards:', error)
      toast({
        title: "Error",
        description: "Failed to load set details",
        variant: "destructive",
      })
    }
  }

  const openEditSetDialog = (set: StudentCardSetWithDetails) => {
    setSelectedSet(set)
    setEditSetName(set.name)
    setEditSetDescription(set.description || "")
    setShowEditSetDialog(true)
  }

  const startStudySession = async (cards: FlashcardCardWithDetails[]) => {
    if (cards.length === 0) {
      toast({
        title: "No Cards",
        description: "No cards available for study",
        variant: "destructive",
      })
      return
    }

    const newSession = {
      cards: [...cards],
      currentIndex: 0,
      userInputs: {},
      results: {},
      showAnswers: false
    }

    setStudySession(newSession)
    // Replace current state with study session state
    window.history.replaceState({ studySession: newSession }, "")
  }

  const handleStudyInput = (value: string) => {
    if (!studySession) return

    const currentCard = studySession.cards[studySession.currentIndex]
    const newSession = {
      ...studySession,
      userInputs: {
        ...studySession.userInputs,
        [currentCard.id]: value
      }
    }
    setStudySession(newSession)
    // Update current history state to preserve input
    window.history.replaceState({ studySession: newSession }, "")
  }

  const checkAnswer = async () => {
    if (!studySession || !user?.id) return

    const currentCard = studySession.cards[studySession.currentIndex]
    const userInput = studySession.userInputs[currentCard.id] || ""
    
    // Check if missing_word exists
    if (!currentCard.missing_word) {
      console.error('Missing word not found for card:', currentCard.id)
      toast({
        title: "Error",
        description: "Card data is incomplete. Please try again.",
        variant: "destructive",
      })
      return
    }
    
    // Simple comparison with tolerance for capitalization and punctuation
    const cleanUserInput = userInput.toLowerCase().replace(/[.,!?;:]/g, '').trim()
    const cleanCorrectWord = currentCard.missing_word.toLowerCase().replace(/[.,!?;:]/g, '').trim()
    const isCorrect = cleanUserInput === cleanCorrectWord

    // Update progress
    await quoteFlashcardService.updateCardProgress(user.id, currentCard.id, isCorrect)

    const newSession = {
      ...studySession,
      results: {
        ...studySession.results,
        [currentCard.id]: isCorrect
      }
    }
    setStudySession(newSession)
    // Update current history state to preserve result
    window.history.replaceState({ studySession: newSession }, "")

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Well done!" : `The correct answer is: ${currentCard.missing_word || 'Unknown'}`,
      variant: isCorrect ? "default" : "destructive",
    })
  }

  const nextCard = () => {
    if (!studySession) return

    if (studySession.currentIndex < studySession.cards.length - 1) {
      const newSession = {
        ...studySession,
        currentIndex: studySession.currentIndex + 1
      }
      setStudySession(newSession)
      // Push new state to history
      window.history.pushState({ studySession: newSession }, "")
    } else {
      // Session complete
      const totalCards = studySession.cards.length
      const correctCards = Object.values(studySession.results).filter(Boolean).length
      toast({
        title: "Session Complete!",
        description: `You got ${correctCards} out of ${totalCards} cards correct`,
      })
      setStudySession(null)
      // Clear study session from history
      window.history.replaceState({}, "")
    }
  }

  const previousCard = () => {
    if (!studySession || studySession.currentIndex <= 0) return

    // Use browser back to go to previous card
    window.history.back()
  }

  const endStudySession = () => {
    // Replace current state to exit study session
    setStudySession(null)
    window.history.replaceState({}, "")
  }

  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Quote Flashcards</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access flashcards. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Study session view
  if (studySession) {
    const currentCard = studySession.cards[studySession.currentIndex]
    const progress = ((studySession.currentIndex + 1) / studySession.cards.length) * 100
    const hasAnswered = currentCard.id in studySession.results

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Study Session</h1>
              <Button variant="outline" onClick={endStudySession}>
                End Session
              </Button>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Card {studySession.currentIndex + 1} of {studySession.cards.length}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge variant="outline">Level {currentCard.difficulty_level}</Badge>
                <div className="flex gap-1">
                  {currentCard.themes?.map((theme) => (
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg leading-relaxed mb-6 text-center">
                {currentCard.card_text}
              </div>

              {!hasAnswered ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Type your answer here..."
                    value={studySession.userInputs[currentCard.id] || ""}
                    onChange={(e) => handleStudyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        checkAnswer()
                      }
                    }}
                    className="text-center text-lg"
                    autoFocus
                  />
                  <div className="text-center">
                    <Button 
                      onClick={checkAnswer}
                      disabled={!studySession.userInputs[currentCard.id]?.trim()}
                    >
                      Check Answer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${studySession.results[currentCard.id] ? 'text-green-600' : 'text-red-600'}`}>
                      {studySession.results[currentCard.id] ? '✓ Correct!' : '✗ Incorrect'}
                    </div>
                    <div className="text-muted-foreground">
                      Correct answer: <span className="font-semibold">{currentCard.missing_word || 'Unknown'}</span>
                    </div>
                    {currentCard.quote?.source && (
                      <div className="text-sm text-muted-foreground mt-2">
                        From: {currentCard.quote.source}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={previousCard}
                      disabled={studySession.currentIndex === 0}
                    >
                      Previous Card
                    </Button>
                    <Button onClick={nextCard}>
                      {studySession.currentIndex < studySession.cards.length - 1 ? 'Next Card' : 'Finish Session'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quote Flashcards</h1>
        <p className="text-muted-foreground mt-1">
          Study with auto-generated flashcards for {selectedBook?.title}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card-bank">Card Bank</TabsTrigger>
          <TabsTrigger value="personal-sets">My Sets</TabsTrigger>
        </TabsList>

        {/* Card Bank Tab */}
        <TabsContent value="card-bank" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Available Cards
              </CardTitle>
              <CardDescription>
                Browse and study from all available flashcards for {selectedBook?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search cards..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-32">
                    <select
                      value={filters.difficulty_level || "all"}
                      onChange={(e) => updateFilters({ 
                        difficulty_level: e.target.value === "all" ? undefined : parseInt(e.target.value) 
                      })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="all">All Levels</option>
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                      <option value="4">Level 4</option>
                      <option value="5">Level 5</option>
                    </select>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>

                {themes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Filter by Theme</Label>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <Badge
                          key={theme.id}
                          variant={filters.theme_ids?.includes(theme.id) ? "default" : "outline"}
                          style={filters.theme_ids?.includes(theme.id) 
                            ? { backgroundColor: theme.color, borderColor: theme.color } 
                            : { borderColor: theme.color, color: theme.color }
                          }
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

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">
                  {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} available
                </span>
                <Button 
                  onClick={() => startStudySession(filteredCards)}
                  disabled={filteredCards.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Study All ({filteredCards.length})
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading cards...</p>
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No cards found</h3>
                  <p className="text-muted-foreground">
                    {filters.search || filters.theme_ids?.length || filters.difficulty_level
                      ? "Try adjusting your filters"
                      : "No cards available for this book yet"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.map((card) => (
                    <Card key={card.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Level {card.difficulty_level}</Badge>
                          {studentSets.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add to Set
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add to Personal Set</DialogTitle>
                                  <DialogDescription>
                                    Choose which sets to add this card to
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  {studentSets.map((set) => (
                                    <Button
                                      key={set.id}
                                      variant="outline"
                                      className="w-full justify-start"
                                      onClick={() => handleAddCardToSet(set.id, card.id)}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      {set.name} ({set.card_count || 0} cards)
                                    </Button>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <div className="p-2 bg-muted rounded text-center">
                              {card.card_text}
                            </div>
                          </div>

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

                          {card.quote && (
                            <div className="text-xs text-muted-foreground">
                              <p className="italic">
                                "{card.quote.text.length > 80 ? `${card.quote.text.substring(0, 80)}...` : card.quote.text}"
                              </p>
                              {card.quote.source && (
                                <p className="mt-1">— {card.quote.source}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Sets Tab */}
        <TabsContent value="personal-sets" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">My Personal Sets</h2>
              <p className="text-muted-foreground">Create custom study collections</p>
            </div>
            <Dialog open={showCreateSetDialog} onOpenChange={setShowCreateSetDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Set
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Personal Set</DialogTitle>
                  <DialogDescription>
                    Create a new collection of flashcards for focused study
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="set-name">Set Name</Label>
                    <Input
                      id="set-name"
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                      placeholder="e.g. Exam Week, Difficult Cards"
                    />
                  </div>
                  <div>
                    <Label htmlFor="set-description">Description (optional)</Label>
                    <Input
                      id="set-description"
                      value={newSetDescription}
                      onChange={(e) => setNewSetDescription(e.target.value)}
                      placeholder="Brief description of this set"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSet} disabled={!newSetName.trim()}>
                    Create Set
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {studentSets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No personal sets</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first personal set to organize cards for focused study
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentSets.map((set) => (
                <Card key={set.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{set.name}</span>
                      <Badge variant="outline">
                        {set.card_count || 0} cards
                      </Badge>
                    </CardTitle>
                    {set.description && (
                      <CardDescription>{set.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={async () => {
                          const cards = await quoteFlashcardService.getCardsInSet(set.id)
                          startStudySession(cards)
                        }}
                        disabled={set.card_count === 0}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Study ({set.card_count || 0})
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => openSetDetails(set)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditSetDialog(set)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Set</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{set.name}"? This action cannot be undone and will remove all cards from this set.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteSet(set.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Set Details Dialog */}
      <Dialog open={showSetDetailsDialog} onOpenChange={setShowSetDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedSet?.name}</span>
              <Badge variant="outline">
                {cardsInSelectedSet.length} card{cardsInSelectedSet.length !== 1 ? 's' : ''}
              </Badge>
            </DialogTitle>
            {selectedSet?.description && (
              <DialogDescription>{selectedSet.description}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            {cardsInSelectedSet.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No cards in this set</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cardsInSelectedSet.map((card) => (
                  <Card key={card.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Level {card.difficulty_level}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveCardFromSet(selectedSet!.id, card.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <div className="p-2 bg-muted rounded text-center">
                            {card.card_text}
                          </div>
                        </div>

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

                        {card.quote && (
                          <div className="text-xs text-muted-foreground">
                            <p className="italic">
                              "{card.quote.text.length > 60 ? `${card.quote.text.substring(0, 60)}...` : card.quote.text}"
                            </p>
                            {card.quote.source && (
                              <p className="mt-1">— {card.quote.source}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={async () => {
                if (selectedSet) {
                  const cards = await quoteFlashcardService.getCardsInSet(selectedSet.id)
                  setShowSetDetailsDialog(false)
                  startStudySession(cards)
                }
              }}
              disabled={cardsInSelectedSet.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Study This Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Set Dialog */}
      <Dialog open={showEditSetDialog} onOpenChange={setShowEditSetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Set</DialogTitle>
            <DialogDescription>
              Update the name and description of your set
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-set-name">Set Name</Label>
              <Input
                id="edit-set-name"
                value={editSetName}
                onChange={(e) => setEditSetName(e.target.value)}
                placeholder="e.g. Exam Week, Difficult Cards"
              />
            </div>
            <div>
              <Label htmlFor="edit-set-description">Description (optional)</Label>
              <Input
                id="edit-set-description"
                value={editSetDescription}
                onChange={(e) => setEditSetDescription(e.target.value)}
                placeholder="Brief description of this set"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSet} disabled={!editSetName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 