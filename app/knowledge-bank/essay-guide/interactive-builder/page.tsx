"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  HelpCircle,
  LayoutPanelLeftIcon as LayoutParagraphLeft,
  Award,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"

// Sample data for the interactive builder - themes and quotes mapped by book ID

const THEMES = {
  "1984": [
    { id: "language", name: "Language and Control" },
    { id: "surveillance", name: "Surveillance and Privacy" },
    { id: "totalitarianism", name: "Totalitarianism and Power" },
    { id: "resistance", name: "Resistance and Rebellion" },
  ],
  hamlet: [
    { id: "revenge", name: "Revenge and Justice" },
    { id: "madness", name: "Madness and Sanity" },
    { id: "corruption", name: "Corruption and Decay" },
    { id: "appearance", name: "Appearance vs. Reality" },
  ],
  gatsby: [
    { id: "american-dream", name: "The American Dream" },
    { id: "wealth", name: "Wealth and Class" },
    { id: "past", name: "The Past and Memory" },
    { id: "illusion", name: "Illusion vs. Reality" },
  ],
  frankenstein: [
    { id: "creation", name: "Creation and Responsibility" },
    { id: "isolation", name: "Isolation and Alienation" },
    { id: "ambition", name: "Ambition and Hubris" },
    { id: "nature", name: "Nature vs. Nurture" },
  ],
  crucible: [
    { id: "hysteria", name: "Mass Hysteria" },
    { id: "reputation", name: "Reputation and Integrity" },
    { id: "power", name: "Power and Authority" },
    { id: "guilt", name: "Guilt and Confession" },
  ],
}

const QUOTES = {
  "1984": {
    language: [
      "Don't you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express it.",
      "The Party told you to reject the evidence of your eyes and ears. It was their final, most essential command.",
      "If you want to keep a secret, you must also hide it from yourself.",
    ],
    surveillance: [
      "Big Brother is watching you.",
      "There was of course no way of knowing whether you were being watched at any given moment... You had to live—did live, from habit that became instinct—in the assumption that every sound you made was overheard.",
      "Always the eyes watching you and the voice enveloping you. Asleep or awake, working or eating, indoors or out of doors, in the bath or in bed—no escape. Nothing was your own except the few cubic centimeters inside your skull.",
    ],
  },
  hamlet: {
    revenge: [
      "The time is out of joint. O cursed spite, That ever I was born to set it right!",
      "Now might I do it pat, now he is praying; And now I'll do't. And so he goes to heaven; And so am I revenged.",
      "O, from this time forth, My thoughts be bloody, or be nothing worth!",
    ],
    madness: [
      "I am but mad north-north-west. When the wind is southerly, I know a hawk from a handsaw.",
      "Though this be madness, yet there is method in't.",
      "O, what a noble mind is here o'erthrown!",
    ],
  },
}

// Sample techniques for PETAL paragraphs
const TECHNIQUES = {
  "1984": {
    language: ["Paradox", "Metaphor", "Symbolism", "Irony"],
    surveillance: ["Repetition", "Imagery", "Symbolism", "Hyperbole"],
  },
  hamlet: {
    revenge: ["Soliloquy", "Metaphor", "Dramatic irony", "Allusion"],
    madness: ["Wordplay", "Imagery", "Soliloquy", "Juxtaposition"],
  },
}

export default function InteractiveEssayBuilder() {
  const { user, selectedBook } = useAuth()
  const [selectedTheme, setSelectedTheme] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [essayComponent, setEssayComponent] = useState("introduction")
  const [essayContent, setEssayContent] = useState("")
  const [randomQuote, setRandomQuote] = useState("")
  const [randomTechnique, setRandomTechnique] = useState("")
  
  // AI features state
  const [aiTip, setAiTip] = useState("")
  const [isLoadingTip, setIsLoadingTip] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [allStepsContent, setAllStepsContent] = useState({})

  // Show message if no book is selected
  if (!selectedBook && user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-xl font-semibold mb-6">Interactive Essay Builder</h1>
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              You need to select a book to access the Essay Builder. Please complete your profile setup first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Map selectedBook to the expected format
  const selectedText = selectedBook?.id || ""

  // Get a random quote based on selected text and theme
  const getRandomQuote = () => {
    if (selectedText && selectedTheme && QUOTES[selectedText]?.[selectedTheme]) {
      const quotes = QUOTES[selectedText][selectedTheme]
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setRandomQuote(quotes[randomIndex])

      // Also set a random technique for PETAL paragraphs
      if (TECHNIQUES[selectedText]?.[selectedTheme]) {
        const techniques = TECHNIQUES[selectedText][selectedTheme]
        const randomTechIndex = Math.floor(Math.random() * techniques.length)
        setRandomTechnique(techniques[randomTechIndex])
      }
    }
  }

  // Get AI tip for current step
  const getAiTip = async () => {
    if (!selectedText || !selectedTheme) return
    
    const textTitle = selectedBook?.title
    const themeName = THEMES[selectedText]?.find(t => t.id === selectedTheme)?.name
    
    // Debug logging
    console.log('getAiTip parameters:', {
      component: essayComponent,
      step: currentStep,
      text: textTitle,
      theme: themeName,
      selectedText,
      selectedTheme
    })
    
    if (!textTitle || !themeName) {
      console.error('Missing text or theme data')
      return
    }
    
    setIsLoadingTip(true)
    try {
      const response = await fetch('/api/essay-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: essayComponent,
          step: currentStep,
          text: textTitle,
          theme: themeName,
          currentContent: essayContent
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiTip(data.tip)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error Response:', errorData)
        throw new Error(`Failed to get AI tip: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Error getting AI tip:', error)
      setAiTip("Focus on being clear and specific in your writing. Use evidence from the text to support your points.")
    } finally {
      setIsLoadingTip(false)
    }
  }

  // Get AI feedback for completed component
  const getAiFeedback = async (completeContent = null) => {
    const contentToAnalyze = completeContent || essayContent
    if (!selectedText || !selectedTheme || !contentToAnalyze.trim()) return
    
    setIsLoadingFeedback(true)
    try {
      const response = await fetch('/api/essay-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: essayComponent,
          content: contentToAnalyze,
          text: TEXTS.find(t => t.id === selectedText)?.title || selectedText,
          theme: THEMES[selectedText]?.find(t => t.id === selectedTheme)?.name || selectedTheme,
          allStepsContent
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setFeedback(data)
        setShowFeedback(true)
      } else {
        throw new Error('Failed to get AI feedback')
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error)
      // Set fallback feedback
      setFeedback({
        score: 7,
        strengths: ["Good effort on your essay component"],
        improvements: ["Continue developing your ideas with more specific examples"],
        overall_comment: "Keep practicing! You're making good progress."
      })
      setShowFeedback(true)
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  // Load AI tip when step, component, or content changes
  useEffect(() => {
    if (selectedText && selectedTheme) {
      getAiTip()
    }
  }, [currentStep, essayComponent, selectedText, selectedTheme])

  // Handle text selection
  // Handle theme selection
  const handleThemeChange = (value) => {
    setSelectedTheme(value)
    setCurrentStep(0)
    setEssayContent("")
    setAiTip("")
    setFeedback(null)
    setShowFeedback(false)
    setAllStepsContent({})
    // Get a random quote when theme is selected
    setTimeout(() => {
      if (value) getRandomQuote()
    }, 100)
  }

  // Handle component selection
  const handleComponentChange = (value) => {
    setEssayComponent(value)
    setCurrentStep(0)
    setEssayContent("")
    setAiTip("")
    setFeedback(null)
    setShowFeedback(false)
    setAllStepsContent({})
  }

  // Get new random quote
  const handleRefreshQuote = () => {
    getRandomQuote()
  }

  // Introduction steps
  const introSteps = [
    { name: "Thesis Statement", description: "State your main argument about the text and theme" },
    { name: "Context", description: "Provide relevant background about the text and author" },
    { name: "Points Preview", description: "Outline the key points you will discuss" },
    { name: "Answer Question", description: "Directly address the essay question" },
  ]

  // PETAL steps
  const petalSteps = [
    { name: "Point", description: "Make a clear statement that supports your thesis" },
    { name: "Evidence", description: "Use the provided quote as evidence" },
    { name: "Technique", description: "Identify the literary technique provided" },
    { name: "Analysis", description: "Explain how the evidence and technique support your point" },
    { name: "Link", description: "Connect back to your thesis and the question" },
  ]

  // Conclusion steps
  const conclusionSteps = [
    { name: "Restate Thesis", description: "Reaffirm your main argument in fresh language" },
    { name: "Synthesize Points", description: "Briefly summarize your key arguments" },
    { name: "Broader Implications", description: "Connect to wider themes or relevance" },
    { name: "Final Statement", description: "End with a thoughtful closing statement" },
  ]

  // Get current steps based on selected component
  const getCurrentSteps = () => {
    switch (essayComponent) {
      case "introduction":
        return introSteps
      case "body-paragraph":
        return petalSteps
      case "conclusion":
        return conclusionSteps
      default:
        return introSteps
    }
  }

  const steps = getCurrentSteps()

  // Handle next step
  const handleNext = () => {
    // Validate current step has content before proceeding
    if (!essayContent.trim()) {
      alert("Please complete this step before moving to the next one.")
      return
    }

    // Save current step content
    const stepKey = `${essayComponent}-${currentStep}`
    setAllStepsContent(prev => ({
      ...prev,
      [stepKey]: essayContent
    }))
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setEssayContent("")
    } else {
      // All steps completed, get AI feedback for the entire component
      handleGetFinalFeedback()
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Load previous step content
      const stepKey = `${essayComponent}-${currentStep - 1}`
      setEssayContent(allStepsContent[stepKey] || "")
    }
  }

  // Handle getting final feedback for completed component
  const handleGetFinalFeedback = () => {
    // Save the final step content
    const stepKey = `${essayComponent}-${currentStep}`
    const finalAllStepsContent = {
      ...allStepsContent,
      [stepKey]: essayContent
    }
    setAllStepsContent(finalAllStepsContent)
    
    // Combine all steps into a complete essay component
    const completeContent = steps.map((step, index) => {
      const stepKey = `${essayComponent}-${index}`
      const content = index === currentStep ? essayContent : finalAllStepsContent[stepKey]
      return `${step.name}:\n${content || ''}`
    }).join('\n\n')
    
    getAiFeedback(completeContent)
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4 px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/knowledge-bank/essay-guide"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Essay Guide</span>
            </Link>
            <h1 className="text-xl font-semibold">Interactive Essay Builder</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        {/* Component Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">What would you like to practice?</h2>
          <Tabs
            defaultValue="introduction"
            value={essayComponent}
            onValueChange={handleComponentChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="introduction" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Introduction
              </TabsTrigger>
              <TabsTrigger value="body-paragraph" className="flex items-center">
                <LayoutParagraphLeft className="h-4 w-4 mr-2" />
                Body Paragraph
              </TabsTrigger>
              <TabsTrigger value="conclusion" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Conclusion
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Current Book and Theme Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Your Selected Book</label>
            <div className="p-3 bg-muted rounded-md border">
              <p className="font-medium">{selectedBook?.title}</p>
              <p className="text-sm text-muted-foreground">by {selectedBook?.author}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select a Theme</label>
            <Select
              value={selectedTheme}
              onValueChange={handleThemeChange}
              disabled={!selectedText || !THEMES[selectedText]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a theme..." />
              </SelectTrigger>
              <SelectContent>
                {selectedText &&
                  THEMES[selectedText]?.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Area */}
        {selectedText && selectedTheme ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quote and Instructions */}
            <div className="lg:col-span-1 space-y-4">
              {/* Quote Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium">Quote</h3>
                    <Button variant="ghost" size="sm" onClick={handleRefreshQuote} className="h-8 w-8 p-0">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm italic">{randomQuote || "Select a text and theme to generate a quote."}</p>
                  </div>

                  {/* Show technique for body paragraphs */}
                  {essayComponent === "body-paragraph" && randomTechnique && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Technique to Analyze</h3>
                      <Badge variant="outline" className="text-primary">
                        {randomTechnique}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Steps Card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-3">
                    {essayComponent === "introduction"
                      ? "Introduction Components"
                      : essayComponent === "body-paragraph"
                        ? "PETAL Structure"
                        : "Conclusion Components"}
                  </h3>
                  <ul className="space-y-3">
                    {steps.map((step, index) => {
                      const stepKey = `${essayComponent}-${index}`
                      const isCompleted = allStepsContent[stepKey]?.trim() || (index === currentStep && essayContent.trim())
                      
                      return (
                        <li
                          key={index}
                          className={`flex items-start p-2 rounded-md ${
                            currentStep === index
                              ? "bg-primary/10 border border-primary/20"
                              : isCompleted
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 ${
                              currentStep === index
                                ? "bg-primary text-white"
                                : isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {isCompleted && currentStep !== index ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                        <div>
                          <p className={`text-sm font-medium ${currentStep === index ? "text-primary" : ""}`}>
                            {step.name}
                          </p>
                          {currentStep === index && (
                            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                  </ul>
                </CardContent>
              </Card>

              {/* AI Tips Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 text-primary mr-2" />
                      <CardTitle className="text-sm">AI Writing Tips</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={getAiTip}
                      disabled={isLoadingTip}
                      className="h-8 w-8 p-0"
                    >
                      {isLoadingTip ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    {isLoadingTip ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <p className="text-sm text-blue-700">Getting AI tips...</p>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">{aiTip || "AI tips will appear here to help you with the current step."}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Writing Area */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{steps[currentStep]?.name}</h3>
                      <p className="text-sm text-muted-foreground">{steps[currentStep]?.description}</p>
                    </div>
                    <Badge variant="outline">
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                  </div>

                  <Textarea
                    placeholder={`Write your ${steps[currentStep]?.name.toLowerCase()} here...`}
                    className="min-h-[200px] mb-4"
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                  />

                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleNext} 
                      disabled={isLoadingFeedback}
                      className="flex items-center"
                    >
                      {isLoadingFeedback ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Getting Feedback...
                        </>
                      ) : currentStep < steps.length - 1 ? (
                        <>Next: {steps[currentStep + 1]?.name}</>
                      ) : (
                        <>Complete & Get AI Feedback</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Feedback Card */}
              {showFeedback && feedback && (
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-primary mr-2" />
                        <CardTitle>AI Feedback</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Score: {feedback.score}/10
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Comment */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">
                        {feedback.overall_comment}
                      </AlertDescription>
                    </Alert>

                    {/* Strengths */}
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {feedback.strengths?.map((strength, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-start">
                            <span className="mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {feedback.improvements?.map((improvement, index) => (
                          <li key={index} className="text-sm text-orange-600 flex items-start">
                            <span className="mr-2">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* PETAL Analysis for body paragraphs */}
                    {feedback.petal_analysis && (
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">PETAL Analysis</h4>
                        <div className="space-y-2">
                          {Object.entries(feedback.petal_analysis).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium capitalize text-blue-600">{key}:</span>
                              <span className="ml-2 text-gray-700">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specific Tips */}
                    {feedback.specific_tips && (
                      <div>
                        <h4 className="font-medium text-purple-700 mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-1" />
                          Specific Tips
                        </h4>
                        <ul className="space-y-1">
                          {feedback.specific_tips.map((tip, index) => (
                            <li key={index} className="text-sm text-purple-600 flex items-start">
                              <span className="mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Progress Preview Card */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Your Progress</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {Object.keys(allStepsContent).filter(key => key.startsWith(essayComponent) && allStepsContent[key]?.trim()).length + (essayContent.trim() ? 1 : 0)} / {steps.length} steps
                      </span>
                      <Progress value={((Object.keys(allStepsContent).filter(key => key.startsWith(essayComponent) && allStepsContent[key]?.trim()).length + (essayContent.trim() ? 1 : 0)) / steps.length) * 100} className="w-24" />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
                    {steps.map((step, index) => {
                      const stepKey = `${essayComponent}-${index}`
                      const content = index === currentStep ? essayContent : allStepsContent[stepKey]
                      if (content?.trim()) {
                        return (
                          <div key={index} className="mb-3 last:mb-0">
                            <p className="text-xs font-medium text-gray-600 mb-1">{step.name}:</p>
                            <p className="text-sm text-gray-800">{content}</p>
                          </div>
                        )
                      }
                      return null
                    })}
                    {!steps.some((step, index) => {
                      const stepKey = `${essayComponent}-${index}`
                      const content = index === currentStep ? essayContent : allStepsContent[stepKey]
                      return content?.trim()
                    }) && (
                      <p className="text-sm text-muted-foreground">Your essay component will appear here as you complete each step...</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-lg border">
            <h3 className="text-lg font-medium mb-2">Get Started</h3>
            <p className="text-muted-foreground mb-6">
              Select a text and theme to begin building your essay component with AI assistance.
            </p>
            <div className="flex justify-center">
              <ChevronDown className="h-6 w-6 text-muted-foreground animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
