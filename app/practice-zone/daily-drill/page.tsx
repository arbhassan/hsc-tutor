"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { useAuth } from "@/lib/auth-context"

// Interface for text data from API
interface UnseenText {
  id: string | number
  type: string
  title: string
  author: string
  content: string
  source: string
  questions: Array<{
    id: string | number
    text: string
    marks: number
    modelAnswer?: {
      answer: string
      commentary?: string
    }
  }>
}

// Fallback unseen texts for demonstration (if API fails)
const fallbackUnseenTexts = [
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
      {
        id: 303,
        text: "Compare the themes of transition and uncertainty in Text 1 and Text 3. In your response, analyze how both authors use different techniques to explore similar ideas. (6 marks)",
        marks: 6,
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
  303: {
    answer: `Both Text 1 ("Miss This Place") and Text 3 ("The Waiting Room") explore themes of transition and uncertainty, though they employ different literary techniques to examine these universal human experiences.

In Text 1, the author uses physical displacement as a metaphor for emotional transition. James's departure from the mountains represents not just a geographical change but a fundamental shift in identity. The author employs temporal references ("since he was three years old") to emphasize how deeply rooted his connection is to this place, making the transition more poignant. The uncertainty is conveyed through James's silence and physical gestures rather than words, with the description "James didn't say anything. He just nodded" suggesting emotional complexity that cannot be verbalized.

Text 3 approaches these themes through dramatic techniques and symbolic elements. The playwright uses the waiting room as a liminal space that literally embodies the concept of transition - characters exist between one state and another. Uncertainty is manifested through the broken clock, which disrupts normal temporal progression and creates an atmosphere where characters cannot predict what comes next. The dialogue reveals uncertainty through what remains unsaid, particularly Marcus's cryptic responses about why he's there.

Both texts employ structural techniques to reinforce these themes. Text 1 uses juxtaposition between short, halting sentences describing James's responses and longer, flowing descriptions of the mountains, creating a rhythm that mirrors emotional uncertainty. Text 3 uses stage directions and pauses to create gaps in communication that reflect the characters' uncertain emotional states.

The key difference lies in their temporal approach: Text 1 focuses on a specific moment of departure with uncertainty about the future, while Text 3 presents characters suspended in an eternal present where time itself has become unreliable. Both authors ultimately suggest that transition and uncertainty are fundamental aspects of human experience, requiring individuals to navigate between the known and unknown with limited guidance.`,
    commentary:
      "This response effectively compares both texts, identifying common themes while analyzing the different techniques each author uses. It demonstrates sophisticated understanding of how different literary forms (prose fiction and drama) can explore similar themes through their unique structural and technical possibilities.",
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
  const questionMarks = questionId === 303 ? 6 : questionId === 301 || questionId === 302 ? 5 : questionId === 102 ? 4 : 3
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
  } else if (questionId === 303) {
    feedback.specificFeedback =
      response.includes("Text 1") && response.includes("Text 3") && (response.includes("transition") || response.includes("uncertainty"))
        ? "Good identification of the key themes across both texts. To strengthen your response, ensure you're analyzing specific techniques used by each author and making clear connections between the texts."
        : "This is a comparative question requiring analysis of both Text 1 and Text 3. Focus on the themes of transition and uncertainty, and make sure to discuss specific techniques used by each author."
  }

  return feedback
}

// Function to generate improved version of student response
const generateImprovedResponse = (originalResponse, feedback, questionId) => {
  // Generate a completely new improved response instead of building on the original
  const improvedResponseTemplates = {
    101: `The author effectively conveys James's emotional connection to the mountains through several carefully selected language features. 

The opening sentence, "Leaving the mountains wasn't going to be easy," immediately establishes the emotional difficulty of the departure, suggesting a deep attachment. The author then reinforces this connection through the repetition of time references, noting that James "had lived there since he was three years old," which emphasizes the mountains as the foundation of his conscious memory.

The author also employs contrasting sentence structures to highlight James's emotional state. When asked if he's ready to leave, James's response is described in short, abrupt sentences: "James didn't say anything. He just nodded." This brevity suggests emotional restraint and reluctance, contrasting with the more flowing description of the mountains that follows.

Most significantly, the author uses personification and emotive language in the final paragraph when describing how the mountains "jutted up into the sky." The concluding rhetorical question, "How could anything else compare?" powerfully conveys James's belief that the mountains are incomparable, revealing his deep emotional connection to this landscape that has shaped his identity.

Therefore, through these carefully selected language features, the author effectively conveys James's profound emotional connection to the mountains, presenting it as a fundamental part of his identity and memory.`,

    102: `The author creates a sense of reluctance in this passage through various techniques that highlight James's emotional attachment to the mountains and his unwillingness to leave.

The author establishes reluctance from the very beginning with the declarative statement, "Leaving the mountains wasn't going to be easy." This immediately sets the tone of difficulty and resistance to the departure. The use of the negative construction "wasn't going to be" suggests an inevitability that James is fighting against.

The author reinforces this reluctance through James's minimal verbal communication. When his father asks if he's ready, "James didn't say anything. He just nodded." The brevity of these sentences mirrors James's emotional restraint and suggests his inability or unwillingness to verbally acknowledge his readiness to leave. The physical gesture of nodding, rather than speaking, implies compliance without enthusiasm.

The author further develops this sense of reluctance through the description of James's final look at the mountains. The text states they "jutted up into the sky" and were "so beautiful" and "so severe." This emotive language emphasizes the magnificence of what James is leaving behind, making his departure feel like a significant loss.

The passage culminates with the rhetorical question, "How could anything else compare?" This technique effectively captures James's belief that nothing could match the mountains' beauty and significance in his life, thereby emphasizing his deep reluctance to leave.

Ultimately, the author creates a powerful sense of reluctance throughout the passage by contrasting James's minimal verbal responses with the emotional significance of the mountains in his life.`,

    201: `Throughout 'The Crossing,' the poet employs rich imagery to represent the speaker's complex emotional state, creating a multi-layered exploration of decision-making and transition.

The central metaphor of the bridge creates a powerful visual representation of the speaker's psychological position. The bridge is described as "A thin line between what was and what will be," directly mapping physical geography onto emotional and temporal experience. This imagery establishes the speaker's position as precarious and transitional, caught between two distinct phases of life.

Water imagery is strategically used to represent the speaker's subconscious fears and uncertainties. The description of water that "churns dark and deep" with "Secrets and stories it promises to keep" suggests the turbulent emotions beneath the speaker's outward deliberation. The verb "churns" particularly evokes a sense of ongoing emotional turmoil, while the personification of the water as keeping "secrets and stories" adds an element of mystery and depth to the speaker's psychological state.

The poet also employs tactile and auditory imagery to represent internal conflict. The speaker feels "The weight of decision heavy on weary feet," which transforms the abstract concept of decision-making into a physical burden. This is contrasted with the "whispers of doubt" that "fall like rain," creating a sensory experience of the speaker's hesitation and uncertainty.

Weather imagery in the final stanza reinforces the emotional representation, where doubt becomes precipitation that continuously affects the speaker. This rainfall imagery effectively conveys how uncertainty persistently dampens the speaker's confidence and creates an atmosphere of hesitation.

Thus, the poet's use of imagery creates a rich representation of the speaker's emotional state, effectively conveying the psychological complexity of standing at a point of significant transition.`,

    202: `The structure of the poem significantly contributes to its exploration of decision-making through its careful organization of stanzas, balanced constructions, and progressive development of ideas.

The poem's four-stanza structure mirrors the decision-making process itself. Each stanza represents a different stage of contemplation: establishing the situation, examining what lies beneath, considering the options, and facing the ongoing uncertainty. This systematic progression reflects how individuals work through major life decisions.

Within each stanza, the poet employs parallel constructions that emphasize the balance inherent in decision-making. The third stanza particularly demonstrates this with "Behind: the comfort of familiar pain. / Ahead: the terror of unknown terrain." This balanced structure physically represents the weighing of options that characterizes decision-making, with each choice receiving equal structural emphasis.

The progression of line lengths and rhythms throughout the poem also contributes to the exploration of decision-making. The opening lines flow smoothly, reflecting initial confidence, while later lines become more fragmented and hesitant, mirroring the speaker's growing uncertainty. This structural evolution parallels the psychological journey from initial determination to doubt and hesitation.

The poem's circular structure, beginning and ending with images of the bridge and movement, reflects the cyclical nature of decision-making. The speaker begins with forward motion ("stretches before me") but ends with static imagery ("bridge sways gently"), suggesting that decision-making often involves periods of progress and pause.

The consistent present tense throughout maintains immediacy and tension, keeping the reader in the moment of decision rather than reflecting on a completed choice. This structural choice emphasizes that decision-making is an ongoing process rather than a single moment.

In conclusion, the structure of the poem is integral to its exploration of decision-making, physically embodying the balance, progression, and uncertainty inherent in facing life's crossroads.`,

    301: `The playwright creates tension in this extract through a skillful combination of dialogue techniques and stage directions that establish an atmosphere of uncertainty and anticipation.

The dialogue immediately establishes tension through what is unsaid rather than what is spoken. When ELIZA asks, "Is this seat taken?" MARCUS responds defensively with "Does it look taken?" This exchange reveals underlying stress and irritability, suggesting both characters are dealing with significant pressure. The playwright uses this opening to establish that both characters are on edge before any explicit conflict emerges.

Stage directions contribute significantly to the tension through symbolic elements. The broken clock that "reads 3:45" but "hasn't moved in twenty minutes" creates an atmosphere of suspended time and waiting. This malfunctioning timepiece symbolizes the characters' trapped situation and builds tension through the suggestion that normal progression has stopped.

The playwright employs dramatic irony to heighten tension, as both characters recognize their shared predicament without fully understanding it. When ELIZA observes that they're "all in the same boat," the audience senses a deeper meaning that the characters themselves may not fully grasp. This creates tension through the gap between character knowledge and audience perception.

Physical staging directions contribute to the tense atmosphere. The "sparsely furnished waiting room" with only "three chairs against the wall" creates a sense of emptiness and isolation. The lighting that "flickers briefly" serves as an external manifestation of the internal instability both characters are experiencing.

The dialogue structure itself builds tension through interruptions and pauses. The "[Beat]" notation and MARCUS's "unexpected" laughter indicate moments where normal conversation breaks down, suggesting underlying emotional pressure that occasionally surfaces.

The extract concludes with both characters looking up at the flickering lights, a shared moment that suggests they are both subject to the same mysterious forces, creating tension through the implication of external control or influence over their situation.

In conclusion, the playwright creates tension through a careful balance of revealing dialogue and suggestive stage directions, establishing an atmosphere of uncertainty that mirrors the characters' internal states.`,

    302: `This dramatic extract contains several symbolic elements that contribute to its exploration of waiting and uncertainty, creating layers of meaning that extend beyond the literal situation.

The waiting room itself functions as a central symbol representing liminal space - a threshold between one state of being and another. The "sparsely furnished" nature of the room suggests temporary occupation and lack of comfort, reflecting how waiting periods in life are often uncomfortable and unfamiliar. The room becomes a metaphor for the uncertainty that accompanies major life transitions.

The broken clock serves as a powerful symbol of suspended time and disrupted expectations. Reading "3:45" but remaining motionless for "twenty minutes," the clock represents how waiting distorts our perception of time and progress. It symbolizes the frustration of being unable to move forward and suggests that the characters exist in a moment outside normal temporal flow.

The three chairs "against the wall" create symbolic significance through their number and positioning. Three suggests incompleteness (neither the pair of two nor the stability of four), while their position against the wall implies defensiveness and lack of agency. The characters cannot control their environment but must conform to its limitations.

The flickering lights function symbolically as representations of instability and uncertainty. Light traditionally symbolizes knowledge and clarity, so flickering lights suggest that understanding comes and goes unpredictably. This creates an atmosphere where revelation seems possible but remains elusive.

The characters' dialogue reveals symbolic elements in their interaction patterns. MARCUS's question "Do you know why I'm here?" extends beyond the immediate situation to represent existential uncertainty about purpose and direction. His response about waiting "My whole life" transforms the specific situation into a symbol for life's broader patterns of anticipation and unfulfillment.

The shared recognition of the broken clock creates symbolic unity between the characters, suggesting that waiting and uncertainty are universal human experiences that create unexpected connections between strangers.

These symbolic elements work together to transform a simple waiting room scene into an exploration of how humans cope with uncertainty, the passage of time, and the search for meaning during transitional periods.`,

    303: `Both Text 1 ("Miss This Place") and Text 3 ("The Waiting Room") explore themes of transition and uncertainty, though they employ different literary techniques to examine these universal human experiences.

In Text 1, the author uses physical displacement as a metaphor for emotional transition. James's departure from the mountains represents not just a geographical change but a fundamental shift in identity. The author employs temporal references ("since he was three years old") to emphasize how deeply rooted his connection is to this place, making the transition more poignant. The uncertainty is conveyed through James's silence and physical gestures rather than words, with the description "James didn't say anything. He just nodded" suggesting emotional complexity that cannot be verbalized.

Text 3 approaches these themes through dramatic techniques and symbolic elements. The playwright uses the waiting room as a liminal space that literally embodies the concept of transition - characters exist between one state and another. Uncertainty is manifested through the broken clock, which disrupts normal temporal progression and creates an atmosphere where characters cannot predict what comes next. The dialogue reveals uncertainty through what remains unsaid, particularly Marcus's cryptic responses about why he's there.

Both texts employ structural techniques to reinforce these themes. Text 1 uses juxtaposition between short, halting sentences describing James's responses and longer, flowing descriptions of the mountains, creating a rhythm that mirrors emotional uncertainty. Text 3 uses stage directions and pauses to create gaps in communication that reflect the characters' uncertain emotional states.

The key difference lies in their temporal approach: Text 1 focuses on a specific moment of departure with uncertainty about the future, while Text 3 presents characters suspended in an eternal present where time itself has become unreliable. Both authors ultimately suggest that transition and uncertainty are fundamental aspects of human experience, requiring individuals to navigate between the known and unknown with limited guidance.

In conclusion, while both texts explore transition and uncertainty through different literary forms, they demonstrate how these universal themes can be effectively examined through careful attention to language, structure, and symbolic meaning.`
  }

  // Return the complete improved response for the question, or a generic one if not found
  return improvedResponseTemplates[questionId] || `This text effectively uses various literary techniques to convey its meaning through careful attention to language, structure, and form.

The author employs specific techniques that work together to create a cohesive and impactful piece of writing. Through the use of imagery, symbolism, and structural elements, the text engages the reader and conveys its central themes effectively.

Evidence from the text supports this analysis through specific examples that demonstrate the author's skillful use of language and technique. These elements combine to create meaning that resonates with readers and achieves the author's intended purpose.

In conclusion, the text demonstrates sophisticated use of literary techniques that work together to create a compelling and meaningful piece of writing.`
}

// Session storage keys
const STORAGE_KEYS = {
  PRACTICE_STARTED: 'dailyDrill_practiceStarted',
  CURRENT_TEXT_INDEX: 'dailyDrill_currentTextIndex',
  CURRENT_QUESTION_SET_INDEX: 'dailyDrill_currentQuestionSetIndex',
  RESPONSES: 'dailyDrill_responses',
  SUBMITTED: 'dailyDrill_submitted',
  FEEDBACK: 'dailyDrill_feedback',
  IMPROVED_RESPONSES: 'dailyDrill_improvedResponses',
  SESSION_ID: 'dailyDrill_sessionId',
  ALL_TEXT_RESPONSES: 'dailyDrill_allTextResponses',
  TEXT_COMPLETION_STATUS: 'dailyDrill_textCompletionStatus'
}

// Helper functions for session persistence
const saveToStorage = (key: string, value: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }
  return defaultValue
}

const clearStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

export default function DailyDrillPage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentQuestionSetIndex, setCurrentQuestionSetIndex] = useState(0) // Separate question set navigation
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [practiceStarted, setPracticeStarted] = useState(false)
  const [feedback, setFeedback] = useState({})
  const [improvedResponses, setImprovedResponses] = useState({})
  const [copiedQuestions, setCopiedQuestions] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [allTextResponses, setAllTextResponses] = useState({}) // Store responses for all texts
  const [textCompletionStatus, setTextCompletionStatus] = useState({}) // Track completion status per text
  const [showTextNavigation, setShowTextNavigation] = useState(false)
  const [unseenTexts, setUnseenTexts] = useState<UnseenText[]>([])
  const [textsLoading, setTextsLoading] = useState(true)

  const { user } = useAuth()
  const { trackShortAnswerDetailed, trackStudySession } = useProgressTracker()

  // Load texts from API
  useEffect(() => {
    const loadTexts = async () => {
      try {
        setTextsLoading(true)
        const response = await fetch('/api/daily-drill')
        if (!response.ok) throw new Error('Failed to fetch texts')
        
        const data = await response.json()
        
        // Transform API data to match expected format
        const transformedTexts = data.texts.map((text: any) => ({
          id: text.id,
          type: text.text_type,
          title: text.title,
          author: text.author,
          content: text.content,
          source: text.source,
          questions: text.questions.map((q: any) => ({
            id: q.id,
            text: q.question_text,
            marks: q.marks,
            modelAnswer: q.modelAnswer // Include model answer from database
          }))
        }))
        
        setUnseenTexts(transformedTexts.length > 0 ? transformedTexts : fallbackUnseenTexts)
      } catch (error) {
        console.error('Error loading daily drill texts:', error)
        // Use fallback data if API fails
        setUnseenTexts(fallbackUnseenTexts)
      } finally {
        setTextsLoading(false)
      }
    }
    
    loadTexts()
  }, [])

  // Load state from localStorage on component mount
  useEffect(() => {
    const loadedPracticeStarted = loadFromStorage(STORAGE_KEYS.PRACTICE_STARTED, false)
    const loadedCurrentTextIndex = loadFromStorage(STORAGE_KEYS.CURRENT_TEXT_INDEX, 0)
    const loadedCurrentQuestionSetIndex = loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION_SET_INDEX, 0)
    const loadedResponses = loadFromStorage(STORAGE_KEYS.RESPONSES, {})
    const loadedSubmitted = loadFromStorage(STORAGE_KEYS.SUBMITTED, false)
    const loadedFeedback = loadFromStorage(STORAGE_KEYS.FEEDBACK, {})
    const loadedImprovedResponses = loadFromStorage(STORAGE_KEYS.IMPROVED_RESPONSES, {})
    const loadedAllTextResponses = loadFromStorage(STORAGE_KEYS.ALL_TEXT_RESPONSES, {})
    const loadedTextCompletionStatus = loadFromStorage(STORAGE_KEYS.TEXT_COMPLETION_STATUS, {})

    // Only restore state if there's an active session
    const sessionId = loadFromStorage(STORAGE_KEYS.SESSION_ID)
    if (sessionId && loadedPracticeStarted) {
      setPracticeStarted(loadedPracticeStarted)
      setCurrentTextIndex(loadedCurrentTextIndex)
      setCurrentQuestionSetIndex(loadedCurrentQuestionSetIndex)
      setResponses(loadedResponses)
      setSubmitted(loadedSubmitted)
      setFeedback(loadedFeedback)
      setImprovedResponses(loadedImprovedResponses)
      setAllTextResponses(loadedAllTextResponses)
      setTextCompletionStatus(loadedTextCompletionStatus)
    }

    setIsLoaded(true)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.PRACTICE_STARTED, practiceStarted)
    }
  }, [practiceStarted, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.CURRENT_TEXT_INDEX, currentTextIndex)
    }
  }, [currentTextIndex, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.CURRENT_QUESTION_SET_INDEX, currentQuestionSetIndex)
    }
  }, [currentQuestionSetIndex, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.RESPONSES, responses)
    }
  }, [responses, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.SUBMITTED, submitted)
    }
  }, [submitted, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.FEEDBACK, feedback)
    }
  }, [feedback, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.IMPROVED_RESPONSES, improvedResponses)
    }
  }, [improvedResponses, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.ALL_TEXT_RESPONSES, allTextResponses)
    }
  }, [allTextResponses, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.TEXT_COMPLETION_STATUS, textCompletionStatus)
    }
  }, [textCompletionStatus, isLoaded])

  const currentText = unseenTexts[currentTextIndex]
  const currentQuestionSet = unseenTexts[currentQuestionSetIndex]

  const getWordCount = (text) => {
    const words = text.trim().split(/\s+/)
    return text.trim() === "" ? 0 : words.length
  }

  // Save current question set responses to allTextResponses before switching
  const saveCurrentQuestionSetResponses = () => {
    if (Object.keys(responses).length > 0) {
      setAllTextResponses(prev => ({
        ...prev,
        [currentQuestionSetIndex]: responses
      }))
    }
  }

  // Load responses for a specific question set
  const loadQuestionSetResponses = (questionSetIndex) => {
    const questionSetResponses = allTextResponses[questionSetIndex] || {}
    setResponses(questionSetResponses)
  }

  // Save current text responses to allTextResponses before switching (legacy for text navigation)
  const saveCurrentTextResponses = () => {
    if (Object.keys(responses).length > 0) {
      setAllTextResponses(prev => ({
        ...prev,
        [currentQuestionSetIndex]: responses
      }))
    }
  }

  // Load responses for a specific text (legacy for text navigation)
  const loadTextResponses = (textIndex) => {
    const textResponses = allTextResponses[textIndex] || {}
    setResponses(textResponses)
  }

  // Switch to a different text (text display only)
  const switchToText = (textIndex) => {
    if (textIndex !== currentTextIndex) {
      console.log(`Switching text display from ${currentTextIndex} to ${textIndex}`)
      setCurrentTextIndex(textIndex)
    }
  }

  // Switch to a different question set
  const switchToQuestionSet = (questionSetIndex) => {
    if (questionSetIndex !== currentQuestionSetIndex) {
      console.log(`Switching question set from ${currentQuestionSetIndex} to ${questionSetIndex}`)
      console.log(`Previous question set:`, unseenTexts[currentQuestionSetIndex]?.questions)
      console.log(`New question set:`, unseenTexts[questionSetIndex]?.questions)
      
      // Save current question set responses
      saveCurrentQuestionSetResponses()
      
      // Switch to new question set
      setCurrentQuestionSetIndex(questionSetIndex)
      
      // Load responses for the new question set
      loadQuestionSetResponses(questionSetIndex)
      
      // Reset submission status for the new question set
      setSubmitted(false)
      setFeedback({})
      setImprovedResponses({})
      setCopiedQuestions({})
      
      console.log(`After switch - current question set:`, unseenTexts[questionSetIndex]?.questions)
    }
  }

  // Check if current question set has any comparative questions (mentions comparing texts)
  const hasComparativeQuestions = () => {
    return currentQuestionSet.questions.some(question => 
      question.text.toLowerCase().includes('compare') || 
      question.text.toLowerCase().includes('contrast') ||
      question.text.toLowerCase().includes('text 1') ||
      question.text.toLowerCase().includes('text 2') ||
      question.text.toLowerCase().includes('text 3')
    )
  }

  const updateResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const handleCopy = async (questionId) => {
    try {
      await navigator.clipboard.writeText(improvedResponses[questionId] || "")
      setCopiedQuestions(prev => ({ ...prev, [questionId]: true }))
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const allQuestionsAnswered = () => {
    return currentQuestionSet.questions.every(question => 
      responses[question.id] && responses[question.id].trim().length > 0
    )
  }

  const handleSubmit = async () => {
    if (allQuestionsAnswered()) {
      setSubmitted(true)

      // Generate AI feedback for all questions
      const newFeedback = {}
      const newImprovedResponses = {}
      
      currentQuestionSet.questions.forEach(question => {
        const response = responses[question.id]
        const responseFeedback = analyzeResponse(response, question.id)
        newFeedback[question.id] = responseFeedback
        
        // Use model answer from database if available, otherwise generate one
        if (question.modelAnswer && question.modelAnswer.answer) {
          newImprovedResponses[question.id] = question.modelAnswer.answer
        } else {
          // Fallback to generated response if no model answer exists
          const improved = generateImprovedResponse(response, responseFeedback, question.id)
          newImprovedResponses[question.id] = improved
        }
      })

      setFeedback(newFeedback)
      setImprovedResponses(newImprovedResponses)

      // Calculate total score
      const totalScore = Object.values(newFeedback).reduce((sum: number, f: any) => sum + (f?.overallScore || 0), 0)
      const maxScore = currentQuestionSet.questions.reduce((sum, q) => sum + q.marks, 0)

      // Track progress and save submission if user is authenticated
      if (user?.id) {
        try {
          // Track progress for each question
          for (const question of currentQuestionSet.questions) {
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
            title: `Daily Drill - ${currentQuestionSet.title}`,
            totalScore,
            maxScore,
            completionTimeMinutes: 10, // estimated time
            questions: currentQuestionSet.questions.map((question, index) => ({
              questionText: question.text,
              userResponse: responses[question.id] || '',
              aiFeedback: newFeedback[question.id]?.specificFeedback || '',
              marksAwarded: newFeedback[question.id]?.overallScore || 0,
              maxMarks: question.marks,
              textTitle: currentQuestionSet.title,
              textAuthor: currentQuestionSet.author,
              textType: currentQuestionSet.type,
              textContent: currentQuestionSet.content
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

  const handleNextQuestionSet = () => {
    if (currentQuestionSetIndex < unseenTexts.length - 1) {
      // Move to next question set
      const nextIndex = currentQuestionSetIndex + 1
      switchToQuestionSet(nextIndex)
      
      // Generate new session ID for the new question set
      saveToStorage(STORAGE_KEYS.SESSION_ID, Date.now().toString())
    }
  }

  const handleNewDrill = () => {
    // Move to next question set or wrap around
    const nextQuestionSetIndex = (currentQuestionSetIndex + 1) % unseenTexts.length
    switchToQuestionSet(nextQuestionSetIndex)
    
    // Generate new session ID for the new drill
    saveToStorage(STORAGE_KEYS.SESSION_ID, Date.now().toString())
  }

  const startPractice = () => {
    setPracticeStarted(true)
    // Auto-show text navigation if any text has comparative questions
    const hasAnyComparative = unseenTexts.some(text => 
      text.questions.some(question => 
        question.text.toLowerCase().includes('compare') || 
        question.text.toLowerCase().includes('contrast') ||
        question.text.toLowerCase().includes('text 1') ||
        question.text.toLowerCase().includes('text 2') ||
        question.text.toLowerCase().includes('text 3')
      )
    )
    if (hasAnyComparative) {
      setShowTextNavigation(true)
    }
    // Generate a session ID to track this practice session
    saveToStorage(STORAGE_KEYS.SESSION_ID, Date.now().toString())
  }

  const exitPractice = () => {
    // Clear all session data when exiting
    clearStorage()
    setPracticeStarted(false)
    setCurrentTextIndex(0)
    setCurrentQuestionSetIndex(0)
    setResponses({})
    setSubmitted(false)
    setFeedback({})
    setImprovedResponses({})
    setCopiedQuestions({})
    setAllTextResponses({})
    setTextCompletionStatus({})
    setShowTextNavigation(false)
  }

  // Show loading state while restoring from localStorage or loading texts
  if (!isLoaded || textsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading daily drill content...</p>
        </div>
      </div>
    )
  }

  // If no texts available, show message
  if (unseenTexts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Daily Drill Practice</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No texts available</AlertTitle>
            <AlertDescription>
              There are currently no daily drill texts available. Please check back later or contact your administrator.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = '/practice-zone'} className="mt-4">
            Return to Practice Zone
          </Button>
        </div>
      </div>
    )
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
          
          {/* Current Text and Question Set Indicators */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              Viewing Text {currentTextIndex + 1} | Questions from Text {currentQuestionSetIndex + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTextNavigation(!showTextNavigation)}
              className="flex items-center"
            >
              <BookOpen className="mr-1 h-4 w-4" />
              {showTextNavigation ? 'Hide' : 'Show'} Navigation
            </Button>
          </div>
        </div>
        
        {/* Collapsible Navigation Panel */}
        {showTextNavigation && (
          <div className="border-t bg-muted/50 p-4">
            <div className="container">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Text Display:</label>
                    <Select
                      value={currentTextIndex.toString()}
                      onValueChange={(value) => switchToText(parseInt(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unseenTexts.map((text, index) => (
                          <SelectItem key={text.id} value={index.toString()}>
                            Text {index + 1}: {text.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Questions:</label>
                    <Select
                      value={currentQuestionSetIndex.toString()}
                      onValueChange={(value) => switchToQuestionSet(parseInt(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unseenTexts.map((text, index) => (
                          <SelectItem key={text.id} value={index.toString()}>
                            Text {index + 1}: {text.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {hasComparativeQuestions() && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-600">
                      Current question set has comparative questions
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Unseen text only (60%) */}
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

            <div className="text-sm text-muted-foreground mb-6">
              Source: {currentText.source} by {currentText.author}
            </div>

            {/* Text Navigation - Previous and Next buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevIndex = Math.max(0, currentTextIndex - 1)
                  if (prevIndex !== currentTextIndex) {
                    switchToText(prevIndex)
                  }
                }}
                disabled={currentTextIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Text
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextIndex = Math.min(unseenTexts.length - 1, currentTextIndex + 1)
                  if (nextIndex !== currentTextIndex) {
                    switchToText(nextIndex)
                  }
                }}
                disabled={currentTextIndex === unseenTexts.length - 1}
                className="flex items-center"
              >
                Next Text
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel - Questions and Response area (40%) */}
        <div className="w-2/5 overflow-y-auto p-6">
          <div className="max-w-xl mx-auto">
            {!submitted ? (
              <>
                {/* Questions and Responses Combined */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Questions & Responses</h3>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Answer all questions for this text. You must complete all responses before submitting.
                    </p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Questions from Text {currentQuestionSetIndex + 1}: {currentQuestionSet.title}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {currentQuestionSet.questions.map((question, index) => (
                      <div key={`${currentQuestionSetIndex}-${question.id}`} className="border rounded-lg p-4">
                        {/* Question */}
                        <div className="bg-muted p-4 rounded-lg mb-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                          </div>
                          <p className="text-sm">{question.text}</p>
                        </div>
                        
                        {/* Response */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-muted-foreground">Your Response:</h5>
                            <span className="text-sm text-muted-foreground">
                              {getWordCount(responses[question.id] || "")} words
                            </span>
                          </div>
                          <textarea
                            className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            value={responses[question.id] || ""}
                            onChange={(e) => updateResponse(question.id, e.target.value)}
                            placeholder="Type your response here..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      saveCurrentQuestionSetResponses()
                      setResponses({})
                    }}
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
                    <TabsTrigger value="improved">Model Answers</TabsTrigger>
                    <TabsTrigger value="your-answers">Your Answers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="feedback" className="mt-4">
                    <div className="space-y-4">
                      {currentQuestionSet.questions.map((question, index) => (
                        <Card key={`${currentQuestionSetIndex}-feedback-${question.id}`} className="p-4">
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
                          {currentQuestionSet.questions.reduce((sum, q) => sum + q.marks, 0)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {currentQuestionSetIndex < unseenTexts.length - 1 ? (
                          <Button onClick={handleNextQuestionSet}>
                            Next Question Set
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
                      {currentQuestionSet.questions.map((question, index) => (
                        <Card key={`${currentQuestionSetIndex}-improved-${question.id}`} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">Question {index + 1} - Model Answer</h3>
                              {question.modelAnswer && (
                                <Badge variant="secondary">From Database</Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(question.id)}
                              disabled={copiedQuestions[question.id]}
                            >
                              {copiedQuestions[question.id] ? (
                                <>
                                  <Check className="mr-1 h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                "Copy"
                              )}
                            </Button>
                          </div>

                          <div className="prose max-w-none text-sm mb-4 p-4 bg-muted/50 rounded-md">
                            {(improvedResponses[question.id] || "").split("\n\n").map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>

                          {/* Show commentary if available from database */}
                          {question.modelAnswer?.commentary && (
                            <Alert className="mt-4">
                              <AlertTitle>Commentary</AlertTitle>
                              <AlertDescription className="text-sm">
                                {question.modelAnswer.commentary}
                              </AlertDescription>
                            </Alert>
                          )}
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="your-answers" className="mt-4">
                    <div className="space-y-4">
                      {currentQuestionSet.questions.map((question, index) => (
                        <Card key={`${currentQuestionSetIndex}-your-answers-${question.id}`} className="p-4">
                          <h3 className="text-lg font-medium mb-2">Question {index + 1} - Your Answer</h3>
                          <div className="prose max-w-none text-sm break-words overflow-hidden">
                            <p className="whitespace-pre-wrap break-words">{responses[question.id] || ""}</p>
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
              <Button variant="outline" size="sm" onClick={exitPractice}>
                Exit to Practice Zone
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
