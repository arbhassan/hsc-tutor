"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RefreshCw,
  ChevronLeft,
  Home,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"

// Sample unseen texts for demonstration
const unseenTexts = [
  {
    id: 1,
    type: "Prose Fiction Extract",
    title: "Miss This Place",
    author: "Anonymous",
    content: `Leaving the mountains wasn't going to be easy. James had lived there since he was three years old. Someone told him once that you don't start making memories until you are three. That made sense. After all, he couldn't remember living anywhere else.

His father asked him if he was ready to go. James didn't say anything. He just nodded. His father tossed him the last bag. It flew over the water. He caught it just before it touched down. He handed it off to his brother, Tom. Tom put the bag into the luggage compartment of the orange floatplane. It was the last one.

James looked at his father. Then he looked at the mountains behind him. They jutted up into the sky. They were so beautiful. They were so severe. How could anything else compare?`,
    source: "Original work for HSC practice",
    questions: [
      {
        id: 101,
        text: "How does the author convey James's emotional connection to the mountains? In your response, refer to specific language features used in the text. (3 marks)",
        marks: 3,
      },
      {
        id: 102,
        text: "Analyze how the author creates a sense of reluctance in this passage. (4 marks)",
        marks: 4,
      },
    ],
  },
  {
    id: 2,
    type: "Poetry",
    title: "The Crossing",
    author: "Emily Chen",
    content: `The bridge stretches before me,
A thin line between what was and what will be.
Each step forward echoes with memory,
Each step back impossible to see.

The water below churns dark and deep,
Secrets and stories it promises to keep.
I stand at the center, caught between shores,
The weight of decision heavy on weary feet.

Behind: the comfort of familiar pain.
Ahead: the terror of unknown terrain.
The bridge sways gently, urging me on,
While whispers of doubt fall like rain.`,
    source: "Contemporary Voices Anthology, 2023",
    questions: [
      {
        id: 201,
        text: "How does the poet use imagery to represent the speaker's emotional state? (3 marks)",
        marks: 3,
      },
      {
        id: 202,
        text: "Discuss how the structure of the poem contributes to its exploration of decision-making. (4 marks)",
        marks: 4,
      },
    ],
  },
  {
    id: 3,
    type: "Drama Extract",
    title: "The Waiting Room",
    author: "David Nguyen",
    content: `[A sparsely furnished waiting room. Three chairs against the wall. A clock that reads 3:45. MARCUS (40s) sits nervously, checking his watch repeatedly. ELIZA (30s) enters.]

ELIZA: [Pausing at the doorway] Is this seat taken?

MARCUS: [Not looking up] Does it look taken?

ELIZA: [Sitting down] No need for that tone. We're all in the same boat here.

MARCUS: [Finally looking at her] Are we? Do you know why I'm here?

ELIZA: No, but I know that clock hasn't moved in twenty minutes. [Points to the wall clock]

MARCUS: [Laughs unexpectedly] I've been watching it too. Thought I was going crazy.

ELIZA: Maybe we both are. [Beat] How long have you been waiting?

MARCUS: [Returning to seriousness] My whole life, it feels like.

[The lights flicker briefly. Both look up.]`,
    source: "From 'Liminal Spaces', New Theatre Collection, 2022",
    questions: [
      {
        id: 301,
        text: "How does the playwright create tension in this extract? In your response, consider both dialogue and stage directions. (5 marks)",
        marks: 5,
      },
      {
        id: 302,
        text: "Analyze the symbolic elements in this dramatic extract and their contribution to possible meanings. (5 marks)",
        marks: 5,
      },
    ],
  },
]

// Sample model answers
const modelAnswers = {
  101: {
    answer: `The author effectively conveys James's emotional connection to the mountains through carefully selected language features. Firstly, the opening sentence, "Leaving the mountains wasn't going to be easy," immediately establishes the emotional difficulty of the departure, suggesting a deep attachment. The author then reinforces this connection through the repetition of time references, noting that James "had lived there since he was three years old," which emphasizes the mountains as the foundation of his conscious memory.

The author also employs contrasting sentence structures to highlight James's emotional state. When asked if he's ready to leave, James's response is described in short, abrupt sentences: "James didn't say anything. He just nodded." This brevity suggests emotional restraint and reluctance, contrasting with the more flowing description of the mountains that follows.

Most significantly, the author uses personification and emotive language in the final paragraph when describing how the mountains "jutted up into the sky." The concluding rhetorical question, "How could anything else compare?" powerfully conveys James's belief that the mountains are incomparable, revealing his deep emotional connection to this landscape that has shaped his identity.`,
    commentary:
      "This response effectively identifies and analyzes multiple language features (sentence structure, repetition, rhetorical question) and explains how each contributes to conveying James's emotional connection. The analysis is detailed and supported with specific textual references.",
  },
  201: {
    answer: `The poet employs rich imagery to represent the speaker's emotional state throughout "The Crossing." The central metaphor of the bridge creates a visual representation of the speaker's psychological position between past and future, while also symbolizing transition and decision-making. This is established in the opening lines where the bridge is described as "A thin line between what was and what will be," directly mapping physical geography onto emotional and temporal experience.

Water imagery is used to represent the speaker's subconscious fears and uncertainties. The description of water that "churns dark and deep" with "Secrets and stories it promises to keep" suggests the turbulent emotions beneath the speaker's outward deliberation. The verb "churns" particularly evokes a sense of ongoing emotional turmoil.

Weather imagery in the final stanza, where "whispers of doubt fall like rain," creates a sensory experience of the speaker's hesitation and uncertainty. This rainfall imagery effectively conveys how doubt continuously and persistently affects the speaker, creating a dampening effect on their confidence.

Through these interconnected images of the bridge, water, and rain, the poet creates a multi-sensory representation of the speaker's emotional state, characterized by uncertainty, fear, and the tension between moving forward and looking back.`,
    commentary:
      "This response demonstrates sophisticated analysis of multiple image patterns in the poem. It identifies the central bridge metaphor and supporting imagery patterns, explaining how each contributes to representing the speaker's emotional state. The analysis is detailed and well-supported with specific textual references.",
  },
}

// AI analysis function to evaluate PETAL structure and depth
const analyzeResponse = (response, questionId) => {
  // Initialize feedback object
  const feedback = {
    overallScore: 0,
    petalAnalysis: {
      point: { present: false, strength: 0, feedback: "" },
      evidence: { present: false, strength: 0, feedback: "" },
      technique: { present: false, strength: 0, feedback: "" },
      analysis: { present: false, strength: 0, feedback: "" },
      link: { present: false, strength: 0, feedback: "" },
    },
    strengths: [],
    weaknesses: [],
    improvements: [],
    specificFeedback: "",
  }

  // Check for Point (clear argument or thesis)
  if (response.match(/(?:firstly|the author|this passage|the text|the poem|the extract)/i)) {
    feedback.petalAnalysis.point.present = true
    feedback.petalAnalysis.point.strength = response.length > 300 ? 2 : 1
    feedback.petalAnalysis.point.feedback =
      feedback.petalAnalysis.point.strength === 2
        ? "Strong, clear point that addresses the question directly."
        : "Point is present but could be more clearly articulated."
  } else {
    feedback.petalAnalysis.point.feedback =
      "No clear point or argument identified. Start with a clear statement that addresses the question."
  }

  // Check for Evidence (quotes or specific references)
  const quoteRegex = /"([^"]+)"|'([^']+)'/g
  const quotes = response.match(quoteRegex)
  if (quotes || response.includes("describes") || response.includes("states")) {
    feedback.petalAnalysis.evidence.present = true
    feedback.petalAnalysis.evidence.strength = quotes && quotes.length > 1 ? 2 : 1
    feedback.petalAnalysis.evidence.feedback =
      feedback.petalAnalysis.evidence.strength === 2
        ? "Excellent use of multiple textual references to support your points."
        : "Some evidence is used, but more specific quotes would strengthen your response."
  } else {
    feedback.petalAnalysis.evidence.feedback =
      "Limited or no direct evidence from the text. Include specific quotes or examples."
  }

  // Check for Technique (literary devices)
  const techniques = [
    "metaphor",
    "simile",
    "personification",
    "imagery",
    "symbolism",
    "alliteration",
    "repetition",
    "rhetorical",
    "juxtaposition",
    "contrast",
    "foreshadowing",
    "irony",
    "tone",
    "mood",
    "syntax",
    "structure",
  ]

  const foundTechniques = techniques.filter((tech) => response.toLowerCase().includes(tech))

  if (foundTechniques.length > 0) {
    feedback.petalAnalysis.technique.present = true
    feedback.petalAnalysis.technique.strength = foundTechniques.length > 2 ? 2 : 1
    feedback.petalAnalysis.technique.feedback =
      feedback.petalAnalysis.technique.strength === 2
        ? `Strong identification of techniques (${foundTechniques.join(", ")}).`
        : `Some techniques identified (${foundTechniques.join(", ")}), but more analysis of their effect would be beneficial.`
  } else {
    feedback.petalAnalysis.technique.feedback =
      "No specific literary techniques identified. Discuss how the author uses devices like metaphor, imagery, or structure."
  }

  // Check for Analysis (explanation of effect)
  if (response.match(/(?:conveys|suggests|reveals|demonstrates|shows|highlights|emphasizes|creates|evokes)/i)) {
    feedback.petalAnalysis.analysis.present = true
    feedback.petalAnalysis.analysis.strength = response.length > 500 ? 2 : 1
    feedback.petalAnalysis.analysis.feedback =
      feedback.petalAnalysis.analysis.strength === 2
        ? "Excellent analysis of how techniques create meaning and effect."
        : "Some analysis present, but could delve deeper into how techniques create meaning."
  } else {
    feedback.petalAnalysis.analysis.feedback =
      "Limited analysis of the effect of techniques. Explain how specific techniques create meaning or impact the reader."
  }

  // Check for Link (connection back to question)
  if (response.match(/(?:therefore|thus|consequently|in conclusion|ultimately|this shows|this demonstrates)/i)) {
    feedback.petalAnalysis.link.present = true
    feedback.petalAnalysis.link.strength = 1
    feedback.petalAnalysis.link.feedback = "You've attempted to link your analysis back to the question."
  } else {
    feedback.petalAnalysis.link.feedback =
      "No clear link back to the question. Conclude by explicitly connecting your analysis to the question asked."
  }

  // Calculate overall score based on PETAL components
  const totalComponents = Object.values(feedback.petalAnalysis).filter((comp) => comp.present).length
  const totalStrength = Object.values(feedback.petalAnalysis).reduce((sum, comp) => sum + comp.strength, 0)

  // Calculate score out of the question's marks
  const questionMarks = questionId === 301 || questionId === 302 ? 5 : questionId === 102 ? 4 : 3
  feedback.overallScore = Math.min(
    Math.round(((totalComponents / 5) * 0.6 + (totalStrength / 10) * 0.4) * questionMarks),
    questionMarks,
  )

  // Generate strengths
  if (feedback.petalAnalysis.point.present && feedback.petalAnalysis.point.strength > 0) {
    feedback.strengths.push("Clear articulation of main points")
  }
  if (feedback.petalAnalysis.evidence.present && feedback.petalAnalysis.evidence.strength > 0) {
    feedback.strengths.push("Good use of textual evidence")
  }
  if (feedback.petalAnalysis.technique.present && feedback.petalAnalysis.technique.strength > 1) {
    feedback.strengths.push("Strong identification of literary techniques")
  }
  if (feedback.petalAnalysis.analysis.present && feedback.petalAnalysis.analysis.strength > 1) {
    feedback.strengths.push("Thoughtful analysis of textual elements")
  }
  if (totalComponents >= 4) {
    feedback.strengths.push("Well-structured response following PETAL framework")
  }

  // Generate weaknesses
  if (!feedback.petalAnalysis.point.present || feedback.petalAnalysis.point.strength < 1) {
    feedback.weaknesses.push("Main point could be clearer or more directly address the question")
  }
  if (!feedback.petalAnalysis.evidence.present || feedback.petalAnalysis.evidence.strength < 1) {
    feedback.weaknesses.push("Limited use of specific textual evidence")
  }
  if (!feedback.petalAnalysis.technique.present) {
    feedback.weaknesses.push("No clear identification of literary techniques")
  }
  if (!feedback.petalAnalysis.analysis.present || feedback.petalAnalysis.analysis.strength < 1) {
    feedback.weaknesses.push("Analysis lacks depth or connection between technique and effect")
  }
  if (!feedback.petalAnalysis.link.present) {
    feedback.weaknesses.push("Response doesn't clearly link back to the question")
  }

  // Generate improvements
  if (!feedback.petalAnalysis.point.present || feedback.petalAnalysis.point.strength < 2) {
    feedback.improvements.push("Start with a clearer thesis statement that directly addresses the question")
  }
  if (!feedback.petalAnalysis.evidence.present || feedback.petalAnalysis.evidence.strength < 2) {
    feedback.improvements.push("Include more specific quotes from the text to support your analysis")
  }
  if (!feedback.petalAnalysis.technique.present || feedback.petalAnalysis.technique.strength < 2) {
    feedback.improvements.push("Identify and discuss specific literary techniques used by the author")
  }
  if (!feedback.petalAnalysis.analysis.present || feedback.petalAnalysis.analysis.strength < 2) {
    feedback.improvements.push(
      "Deepen your analysis by explaining how each technique creates meaning or affects the reader",
    )
  }
  if (!feedback.petalAnalysis.link.present) {
    feedback.improvements.push("Conclude by explicitly connecting your analysis back to the question")
  }

  // Generate specific feedback based on the question
  if (questionId === 101) {
    feedback.specificFeedback =
      response.includes("emotional connection") || response.includes("attachment")
        ? "You've correctly identified James's emotional connection to the mountains. To strengthen your response, consider how the author's use of sentence structure and the final rhetorical question emphasize this connection."
        : "Focus more specifically on how the author conveys James's emotional connection to the mountains. Look for language features like the rhetorical question at the end and the contrasting sentence structures."
  } else if (questionId === 201) {
    feedback.specificFeedback =
      response.includes("bridge") && response.includes("water")
        ? "Good identification of the key imagery patterns. Consider how these images work together to create a cohesive representation of the speaker's emotional state."
        : "Focus more on the specific imagery patterns in the poem, particularly the bridge and water imagery, and how they represent the speaker's emotional state."
  } else if (questionId === 301) {
    feedback.specificFeedback =
      response.includes("stage direction") && response.includes("dialogue")
        ? "You've considered both dialogue and stage directions as requested. To improve, analyze how specific elements like the broken clock and the lighting create dramatic tension."
        : "Make sure to analyze both dialogue and stage directions as specified in the question. Pay attention to elements like the clock, lighting, and character interactions."
  }

  return feedback
}

// Function to generate improved version of student response
const generateImprovedResponse = (originalResponse, feedback, questionId) => {
  // Start with the original response
  let improved = originalResponse

  // Add a clear introduction if missing
  if (!feedback.petalAnalysis.point.present) {
    const introText =
      {
        101: "The author effectively conveys James's emotional connection to the mountains through several carefully selected language features. ",
        201: "Throughout 'The Crossing,' the poet employs rich imagery to represent the speaker's complex emotional state. ",
        301: "The playwright creates tension in this extract through a skillful combination of dialogue and stage directions. ",
        302: "This dramatic extract contains several symbolic elements that contribute to its exploration of waiting and uncertainty. ",
        102: "The author creates a sense of reluctance in this passage through various techniques that highlight James's emotional attachment to the mountains. ",
        202: "The structure of the poem significantly contributes to its exploration of decision-making through its stanza organization, line length variations, and progression of ideas. ",
      }[questionId] || "This text effectively uses various literary techniques to convey its meaning. "

    improved = introText + improved
  }

  // Add technique analysis if missing
  if (!feedback.petalAnalysis.technique.present) {
    const techniqueText =
      {
        101: "\n\nThe author employs several notable techniques, including the use of short, abrupt sentences to convey James's emotional restraint, and a powerful rhetorical question at the conclusion that emphasizes his attachment to the mountains. ",
        201: "\n\nThe poet employs metaphor, symbolism, and sensory imagery throughout the poem. The bridge serves as a central metaphor for transition, while the water imagery symbolizes the speaker's subconscious fears. ",
        301: "\n\nThe playwright employs techniques such as pauses indicated by stage directions, symbolic props like the broken clock, and dialogue that reveals character tension without explicitly stating it. ",
        102: "\n\nThe author uses contrasting sentence structures, repetition of time references, and emotive language to build a sense of reluctance throughout the passage. ",
        202: "\n\nThe poem's structure mirrors its thematic exploration of decision-making through its balanced stanzas, parallel constructions, and the tension between forward movement and hesitation. ",
      }[questionId] ||
      "\n\nThe text employs various literary techniques including imagery, symbolism, and structural elements that work together to create meaning. "

    improved += techniqueText
  }

  // Add evidence if missing
  if (!feedback.petalAnalysis.evidence.present) {
    const evidenceText =
      {
        101: 'For example, the text states, "Leaving the mountains wasn\'t going to be easy" and concludes with the rhetorical question, "How could anything else compare?" ',
        201: 'The text provides evidence in lines such as "The bridge stretches before me, / A thin line between what was and what will be" and "The water below churns dark and deep." ',
        301: 'Evidence can be seen in MARCUS\'s line, "My whole life, it feels like" and the stage direction "[The lights flicker briefly. Both look up.]" ',
        102: 'The text provides evidence when it states, "James didn\'t say anything. He just nodded" and describes the mountains as "so beautiful" and "so severe." ',
        202: 'The poem provides evidence in its structural elements, such as the parallel construction in "Behind: the comfort of familiar pain. / Ahead: the terror of unknown terrain." ',
      }[questionId] || "The text provides evidence through specific language choices and structural elements. "

    improved += evidenceText
  }

  // Add analysis if missing or weak
  if (!feedback.petalAnalysis.analysis.present) {
    const analysisText =
      {
        101: "These techniques work together to convey James's deep emotional connection to the mountains by emphasizing both his history with the place and his reluctance to leave it behind. ",
        201: "These imagery patterns work together to create a multi-sensory representation of the speaker's emotional state, characterized by uncertainty, fear, and the tension between moving forward and looking back. ",
        301: "These elements create tension by establishing an atmosphere of uncertainty and unease, suggesting that both characters are trapped in a liminal space both physically and metaphorically. ",
        102: "These techniques effectively create a sense of reluctance by contrasting James's minimal verbal response with the emotional weight conveyed through the description of the mountains. ",
        202: "This structure effectively mirrors the decision-making process by physically representing the balance between options and the progressive movement toward resolution despite doubt. ",
      }[questionId] ||
      "These elements work together to create meaning by establishing connections between form and content, enhancing the reader's understanding of the text's themes. "

    improved += analysisText
  }

  // Add link back to question if missing
  if (!feedback.petalAnalysis.link.present) {
    const linkText =
      {
        101: "\n\nTherefore, through these carefully selected language features, the author effectively conveys James's profound emotional connection to the mountains, presenting it as a fundamental part of his identity and memory.",
        201: "\n\nThus, the poet's use of imagery creates a rich representation of the speaker's emotional state, effectively conveying the psychological complexity of standing at a point of significant transition.",
        301: "\n\nIn conclusion, the playwright creates tension through a careful balance of revealing dialogue and suggestive stage directions, establishing an atmosphere of uncertainty that mirrors the characters' internal states.",
        102: "\n\nUltimately, the author creates a powerful sense of reluctance throughout the passage by contrasting James's minimal verbal responses with the emotional significance of the mountains in his life.",
        202: "\n\nIn conclusion, the structure of the poem is integral to its exploration of decision-making, physically embodying the balance, progression, and uncertainty inherent in facing life's crossroads.",
      }[questionId] ||
      "\n\nIn conclusion, the text effectively uses various techniques to convey its meaning and engage the reader in its thematic exploration."

    improved += linkText
  }

  return improved
}

export default function DailyDrillPage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [practiceStarted, setPracticeStarted] = useState(false)
  const [feedback, setFeedback] = useState({})
  const [improvedResponses, setImprovedResponses] = useState({})

  const { user } = useAuth()
  const { trackShortAnswerDetailed, trackStudySession } = useProgressTracker()

  const currentText = unseenTexts[currentTextIndex]

  const getWordCount = (text) => {
    const words = text.trim().split(/\s+/)
    return text.trim() === "" ? 0 : words.length
  }

  const updateResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const allQuestionsAnswered = () => {
    return currentText.questions.every(question => 
      responses[question.id] && responses[question.id].trim().length > 0
    )
  }

  const handleSubmit = async () => {
    if (allQuestionsAnswered()) {
      setSubmitted(true)

      // Generate AI feedback for all questions
      const newFeedback = {}
      const newImprovedResponses = {}
      
      currentText.questions.forEach(question => {
        const response = responses[question.id]
        const responseFeedback = analyzeResponse(response, question.id)
        newFeedback[question.id] = responseFeedback
        
        const improved = generateImprovedResponse(response, responseFeedback, question.id)
        newImprovedResponses[question.id] = improved
      })

      setFeedback(newFeedback)
      setImprovedResponses(newImprovedResponses)

      // Calculate total score
      const totalScore = Object.values(newFeedback).reduce((sum: number, f: any) => sum + (f?.overallScore || 0), 0)
      const maxScore = currentText.questions.reduce((sum, q) => sum + q.marks, 0)

      // Track progress and save submission if user is authenticated
      if (user?.id) {
        try {
          // Track progress for each question
          for (const question of currentText.questions) {
            const responseFeedback = newFeedback[question.id]
            if (responseFeedback) {
              await trackShortAnswerDetailed(
                question.marks, // marker type (2, 3, 4, or 5 marks)
                responseFeedback.overallScore, // actual score achieved
                question.marks, // max possible score
                2.0 // estimated completion time in minutes
              )
            }
          }

          // Track study session time (estimated 10 minutes for the drill)
          await trackStudySession(10)

          // Save submission to database
          const submissionData = {
            submissionType: 'daily_drill',
            contentType: 'questions',
            title: `Daily Drill - ${currentText.title}`,
            totalScore,
            maxScore,
            completionTimeMinutes: 10, // estimated time
            questions: currentText.questions.map((question, index) => ({
              questionText: question.text,
              userResponse: responses[question.id] || '',
              aiFeedback: newFeedback[question.id]?.specificFeedback || '',
              marksAwarded: newFeedback[question.id]?.overallScore || 0,
              maxMarks: question.marks,
              textTitle: currentText.title,
              textAuthor: currentText.author,
              textType: currentText.type,
              textContent: currentText.content
            }))
          }

          const submissionResponse = await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData)
          })

          if (!submissionResponse.ok) {
            console.error('Failed to save submission:', await submissionResponse.text())
          }
        } catch (error) {
          console.error('Failed to track Daily Drill progress or save submission:', error)
        }
      }
    }
  }

  const handleNextText = () => {
    if (currentTextIndex < unseenTexts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1)
      setResponses({})
      setSubmitted(false)
      setFeedback({})
      setImprovedResponses({})
    }
  }

  const handleNewDrill = () => {
    // Move to next text or wrap around
    const nextTextIndex = (currentTextIndex + 1) % unseenTexts.length
    setCurrentTextIndex(nextTextIndex)
    setResponses({})
    setSubmitted(false)
    setFeedback({})
    setImprovedResponses({})
  }

  const startPractice = () => {
    setPracticeStarted(true)
  }

  // Start screen
  if (!practiceStarted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Daily Drill Practice</h1>
          <p className="text-lg mb-8">
            Improve your HSC Paper 1 skills with daily practice on unseen texts. You'll be presented with texts from
            various genres and need to answer all questions for each text.
          </p>
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">How it works:</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Read the unseen text carefully</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Answer all questions for the text</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Submit your answers for feedback</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Review your strengths and areas for improvement</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>See improved versions of your responses</span>
              </li>
            </ul>
          </div>
          <Button size="lg" onClick={startPractice}>
            Start Practice
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/practice-zone" className="flex items-center text-sm font-medium">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Practice Zone
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/practice-zone/past-submissions">
                Past Submissions
              </Link>
            </Button>
            <span className="text-sm font-medium">
              Text {currentTextIndex + 1} of {unseenTexts.length}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Unseen text (60%) */}
        <div className="w-3/5 overflow-y-auto p-6 border-r">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                {currentText.type}
              </span>
            </div>

            <h2 className="text-2xl font-medium mb-4">{currentText.title}</h2>

            <div className="prose max-w-none mb-6">
              {currentText.type === "Poetry" ? (
                <pre className="font-serif whitespace-pre-wrap">{currentText.content}</pre>
              ) : currentText.type === "Drama Extract" ? (
                <div
                  className="font-serif"
                  dangerouslySetInnerHTML={{ __html: currentText.content.replace(/\[([^\]]+)\]/g, "<em>[$1]</em>") }}
                />
              ) : (
                <div className="font-serif">
                  {currentText.content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground mb-8">
              Source: {currentText.source} by {currentText.author}
            </div>

            <div className="space-y-4">
              {currentText.questions.map((question, index) => (
                <div key={question.id} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                  </div>
                  <p>{question.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Response area (40%) */}
        <div className="w-2/5 overflow-y-auto p-6">
          <div className="max-w-xl mx-auto">
            {!submitted ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Your Responses</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Answer all questions for this text. You must complete all responses before submitting.
                  </p>

                  <div className="space-y-6">
                    {currentText.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {getWordCount(responses[question.id] || "")} words
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({question.marks} marks)
                            </span>
                          </div>
                        </div>
                        <textarea
                          className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          value={responses[question.id] || ""}
                          onChange={(e) => updateResponse(question.id, e.target.value)}
                          placeholder="Type your response here..."
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setResponses({})}
                    disabled={Object.keys(responses).length === 0}
                  >
                    Clear All
                  </Button>
                  <Button onClick={handleSubmit} disabled={!allQuestionsAnswered()}>
                    Submit All Answers
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Tabs defaultValue="feedback" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="improved">Improved Answers</TabsTrigger>
                    <TabsTrigger value="your-answers">Your Answers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="feedback" className="mt-4">
                    <div className="space-y-4">
                      {currentText.questions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Question {index + 1} Analysis</h3>
                            <div className="flex items-center">
                              <div className="text-lg font-bold mr-1">{feedback[question.id]?.overallScore}</div>
                              <div className="text-muted-foreground">/ {question.marks}</div>
                            </div>
                          </div>

                          {/* PETAL Analysis */}
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">PETAL Structure Analysis:</h4>
                            <div className="space-y-3 pl-2">
                              {Object.entries(feedback[question.id]?.petalAnalysis || {}).map(([key, analysis]) => (
                                <div key={key} className="flex items-start gap-3">
                                  <div className="w-16 font-medium capitalize text-sm pt-0.5 flex-shrink-0">{key}:</div>
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {analysis.present ? (
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm leading-relaxed break-words">{analysis.feedback}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Specific Feedback */}
                          {feedback[question.id]?.specificFeedback && (
                            <Alert className="mb-4">
                              <AlertTitle>Specific Feedback</AlertTitle>
                              <AlertDescription>{feedback[question.id].specificFeedback}</AlertDescription>
                            </Alert>
                          )}
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Total Score</h4>
                        <p className="text-2xl font-bold">
                          {Object.values(feedback).reduce((sum, f) => sum + (f?.overallScore || 0), 0)} / {" "}
                          {currentText.questions.reduce((sum, q) => sum + q.marks, 0)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {currentTextIndex < unseenTexts.length - 1 ? (
                          <Button onClick={handleNextText}>
                            Next Text
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button onClick={handleNewDrill}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            New Drill
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="improved" className="mt-4">
                    <div className="space-y-4">
                      {currentText.questions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Question {index + 1} - Improved Answer</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(improvedResponses[question.id] || "")
                              }}
                            >
                              Copy
                            </Button>
                          </div>

                          <div className="prose max-w-none text-sm mb-4 p-4 bg-muted/50 rounded-md">
                            {(improvedResponses[question.id] || "").split("\n\n").map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="your-answers" className="mt-4">
                    <div className="space-y-4">
                      {currentText.questions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <h3 className="text-lg font-medium mb-2">Question {index + 1} - Your Answer</h3>
                          <div className="prose max-w-none text-sm">
                            <p>{responses[question.id] || ""}</p>
                          </div>
                          <div className="text-sm text-muted-foreground mt-4">
                            Word count: {getWordCount(responses[question.id] || "")} words
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            <div className="flex justify-center mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/practice-zone">
                  <Home className="mr-2 h-4 w-4" />
                  Exit to Practice Zone
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
