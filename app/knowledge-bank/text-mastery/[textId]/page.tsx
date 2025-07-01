"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Download,
  BookOpen,
  Quote,
  Search,
  Filter,
  Copy,
  Star,
  StarIcon as StarFilled,
  SlidersHorizontal,
  FileDown,
  BookText,
  Bookmark,
  Clock,
  Globe,
  User,
  BookOpenCheck,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

// Mock data for demonstration purposes
// In a real implementation, this would be fetched based on the textId parameter
const getText = (textId: string) => {
  // This is a mock function to return text data
  return {
    id: textId,
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    publicationYear: 1949,
    genre: "Dystopian Fiction",
    coverImage: "/big-brother-eye.png",
    introduction:
      "A dystopian social science fiction novel that explores themes of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.",
    themes: [
      {
        id: "theme1",
        title: "Totalitarianism and Control",
        icon: "shield",
        summary:
          "Orwell's masterful portrayal of totalitarianism serves as a warning against political systems that seek absolute control over every aspect of human life. The Party, led by the enigmatic figure Big Brother, maintains power through constant surveillance, propaganda, manipulation of history, and brutal punishment. The key institutions—the Ministry of Truth, the Ministry of Peace, the Ministry of Plenty, and the Ministry of Love—all function paradoxically, dedicated to the opposite of what their names suggest. Through the Thought Police and devices like telescreens, the Party monitors citizens constantly, making privacy impossible and independence dangerous. By depicting the extreme mechanisms of control in Oceania, Orwell critiques not only the specific dictatorships of his time but also warns against the universal human vulnerability to authoritarian systems and the gradual erosion of freedoms that can occur when power becomes concentrated and unchecked.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The omnipresent telescreens that monitor citizens' every move",
          "The Thought Police who detect and punish thoughtcrime",
          "Ministry of Truth's systematic falsification of historical records",
          "The concept of doublethink - holding contradictory beliefs simultaneously",
        ],
      },
      {
        id: "theme2",
        title: "Language and Reality",
        icon: "speech",
        summary:
          "Through Newspeak, the official language of Oceania, Orwell explores how language shapes thought and how controlling language can limit freedom of expression and even thought itself. Newspeak systematically eliminates words that express nuance, criticism, or resistance, aiming to make thoughtcrime (politically unorthodox thoughts) linguistically impossible. By reducing vocabulary and simplifying grammar, the Party constrains the conceptual range available to citizens, demonstrating how language functions not merely as a tool for communication but as a fundamental framework for understanding reality. Winston Smith's job at the Ministry of Truth—rewriting historical documents to match the Party's ever-changing narrative—further illustrates how manipulation of records and language can distort collective memory and perception of reality, making history malleable and truth subjective when controlled by authoritarian powers.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "Newspeak - designed to limit freedom of thought",
          "Winston's job rewriting history at the Ministry of Truth",
          "The slogan 'War is Peace, Freedom is Slavery, Ignorance is Strength'",
          "The concept of 'blackwhite' - the ability to believe contradictions",
        ],
      },
      {
        id: "theme3",
        title: "Surveillance and Privacy",
        icon: "eye",
        summary:
          "In the world of Nineteen Eighty-Four, surveillance is pervasive and inescapable. The novel explores how constant monitoring transforms human behavior and psychology, creating a society where genuine privacy is impossible and spontaneity dangerous. Telescreens watch citizens in both public and private spaces, while children are encouraged to report their parents for thought-crimes. This omnipresent surveillance forces people to perform loyalty even in their most private moments, leading to a fragmentation of identity and the loss of an authentic inner self. Winston's desperate search for spaces free from observation—whether in the alcove of his apartment or in his relationship with Julia—represents a fundamental human need for privacy that the Party systematically denies. Through these elements, Orwell presciently anticipates modern concerns about government surveillance, data collection, and the psychological effects of living in a monitored society.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The telescreen in Winston's apartment that cannot be turned off",
          "Children spying on adults, including their parents",
          "Winston searching for blind spots to write his diary",
          "The hidden microphones in the countryside and forests",
        ],
      },
      {
        id: "theme4",
        title: "Human Resilience and Breaking Point",
        icon: "heart",
        summary:
          "The novel examines both the resilience of the human spirit and its ultimate fragility under extreme pressure. Winston and Julia's rebellion through their love affair and Winston's diary represent innate human resistance to oppression—the persistent desire for individuality, connection, and truth that the Party seeks to eradicate. Their small acts of defiance, from Winston's diary to their renting of the room above Mr. Charrington's shop, demonstrate how individuals strive to maintain humanity even within dehumanizing systems. However, the novel ultimately depicts the breaking point of human resilience through Winston's torture in Room 101. When confronted with his worst fear, Winston betrays Julia and surrenders his inner rebellion, illustrating how extreme physical and psychological torture can overcome even the strongest convictions. This portrayal serves as both a testament to the human capacity for resistance and a warning about the devastating effects of systematized cruelty on the human spirit.",
        color: "bg-purple-100 border-purple-300",
        examples: [
          "Winston's secret diary as an act of rebellion",
          "The love affair between Winston and Julia",
          "Winston's breakdown under torture in Room 101",
          "The final scene where Winston realizes he loves Big Brother",
        ],
      },
      {
        id: "theme5",
        title: "Memory and History",
        icon: "book",
        summary:
          "Nineteen Eighty-Four powerfully explores how control of the past enables control of the present and future. The Party's slogan 'Who controls the past controls the future; who controls the present controls the past' encapsulates this theme. Through the operations of the Ministry of Truth, where Winston works altering historical documents to match the Party's current narrative, Orwell shows how manipulation of historical record can distort collective memory and enable political manipulation. Winston's struggle to remember accurate details from his childhood and pre-Party history represents the human need for authentic historical continuity. The gradual erosion of reliable memory—both individual and collective—creates a society unmoored from historical reality, making resistance to power nearly impossible as citizens cannot contrast current conditions with different possibilities from the past. This theme resonates particularly with HSC rubric elements about paradoxes and anomalies in human experience, as the novel presents the paradoxical situation where history becomes fluid rather than fixed, and truth becomes whatever the Party declares it to be.",
        color: "bg-amber-100 border-amber-300",
        examples: [
          "Winston's job altering historical records and photographs",
          "The Party slogan: 'Who controls the past controls the future'",
          "Winston's fragmentary memories of his mother and childhood",
          "The disappearance of 'unpersons' from historical records",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The novel explores numerous paradoxes, from the contradictory slogans of the Party ('War is Peace, Freedom is Slavery, Ignorance is Strength') to the paradoxical function of the four ministries. The concept of doublethink—holding two contradictory beliefs simultaneously—represents a central anomaly in human thinking that the Party exploits.",
        textConnections:
          "The Ministry of Truth spreads lies, the Ministry of Peace wages war, Winston's job is to destroy truth while serving 'Truth'",
      },
      {
        concept: "Emotional Experiences",
        explanation:
          "Orwell presents a complex exploration of human emotions under oppression, including fear, love, hatred, and loyalty. The novel examines how totalitarian regimes attempt to control and manipulate emotional responses, redirecting natural human feelings toward Party-approved targets.",
        textConnections:
          "Winston and Julia's love as rebellion, the Two Minutes Hate ritual, Winston's conflicted feelings about O'Brien",
      },
      {
        concept: "Relationships",
        explanation:
          "Relationships in the novel reveal how political systems can penetrate and corrupt the most intimate human connections. Winston and Julia's relationship represents both resistance to and ultimate defeat by the Party's power, while family bonds are systematically undermined through organizations like the Junior Spies.",
        textConnections:
          "Winston and Julia's doomed relationship, children reporting parents to the Thought Police, Winston's memories of his mother's sacrifice",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "The novel questions humans' ability to maintain independent thought and understanding when language, information, and history are systematically manipulated. Winston's struggle to comprehend his reality and maintain logical thought represents the fundamental human drive toward truth and understanding.",
        textConnections:
          "Winston's attempts to remember the past accurately, his questions about Oceania's war with Eurasia or Eastasia, his reading of Goldstein's book",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written in 1948 (with the title being a simple inversion of the year), Nineteen Eighty-Four reflects Orwell's concerns about totalitarian regimes that rose to power in the early-to-mid 20th century. The novel draws particularly on elements of Stalinism in the Soviet Union and aspects of Nazi Germany. Orwell was deeply influenced by his experiences in the Spanish Civil War, where he witnessed the manipulation of truth by various political factions. The novel's portrayal of perpetual war between Oceania, Eurasia, and Eastasia reflects the geopolitical tensions of the early Cold War period, which was beginning as Orwell completed the novel. The atomic bombings of Hiroshima and Nagasaki also influenced the novel's portrayal of a world recovering from nuclear conflict.",
        keyPoints: [
          "Written in post-WWII period during early Cold War tensions",
          "Influenced by rise of totalitarian regimes (Soviet Union, Nazi Germany)",
          "Orwell's experiences in the Spanish Civil War shaped his views on propaganda",
          "Published at the beginning of nuclear age and heightened surveillance practices",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The novel emerged during a period of significant social and technological change in Western society. Post-war austerity in Britain (reflected in the novel's descriptions of shortages and poor-quality goods) formed part of the immediate cultural backdrop. The increasing role of mass media in shaping public opinion and the growing capabilities of surveillance technology concerned Orwell and informed the novel's dystopian vision. The novel also engages with mid-20th century debates about collectivism versus individualism, reflecting tensions between socialist ideals (which Orwell himself supported in a democratic context) and the totalitarian implementations he criticized. The novel's exploration of language manipulation also reflects contemporary interests in linguistics and propaganda analysis that developed during and after WWII.",
        keyPoints: [
          "Post-war austerity in Britain reflected in the novel's depictions of shortages",
          "Growing concerns about mass media manipulation of public opinion",
          "Debates about collectivism vs. individualism in Western political thought",
          "Rising awareness of propaganda techniques following World War II",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "George Orwell (the pen name of Eric Arthur Blair, 1903-1950) drew on his various life experiences in crafting Nineteen Eighty-Four. His time as an imperial police officer in Burma gave him insight into the mechanics of institutional power and oppression. His experiences of poverty, documented in 'Down and Out in Paris and London,' informed the novel's depictions of material deprivation. Most significantly, Orwell's participation in the Spanish Civil War, where he witnessed how different political factions manipulated facts and rewrote history, directly influenced the novel's central themes. Orwell was a democratic socialist who became deeply concerned with how revolutionary ideals could be betrayed by authoritarian implementations. He wrote the novel while seriously ill with tuberculosis on the remote Scottish island of Jura, and died shortly after its publication.",
        keyPoints: [
          "Orwell's experience as an imperial police officer in Burma",
          "His democratic socialist beliefs and criticism of totalitarian implementations",
          "Firsthand witness to propaganda and historical revisionism in Spanish Civil War",
          "Written while Orwell was critically ill with tuberculosis",
        ],
      },
      philosophical: {
        title: "Philosophical and Literary Context",
        content:
          "Nineteen Eighty-Four engages with several philosophical traditions, particularly those concerned with truth, language, and power. It reflects elements of linguistic determinism (the Sapir-Whorf hypothesis) through its exploration of how Newspeak limits thought. The novel also connects to existentialist concerns about authenticity and freedom in the face of social and political pressures. As a dystopian novel, it builds upon earlier works like Yevgeny Zamyatin's 'We' (1924) and Aldous Huxley's 'Brave New World' (1932), but offers a more explicitly political critique. Orwell's earlier work 'Animal Farm' (1945) explored similar themes of revolutionary ideals corrupted by power, focusing specifically on the Soviet experience, while Nineteen Eighty-Four broadens the critique to encompass multiple forms of totalitarianism and their psychological effects.",
        keyPoints: [
          "Engages with linguistic determinism through Newspeak",
          "Connects to existentialist concerns about authenticity under social pressure",
          "Builds on earlier dystopian traditions (Zamyatin's 'We', Huxley's 'Brave New World')",
          "Expands on themes from Orwell's 'Animal Farm' about corrupted revolutions",
        ],
      },
    },
    timelineEvents: [
      { year: 1903, event: "Birth of George Orwell (Eric Arthur Blair)", type: "Author" },
      { year: 1922, event: "Mussolini's fascists take power in Italy", type: "World" },
      { year: 1933, event: "Hitler appointed Chancellor of Germany", type: "World" },
      { year: 1936, event: "Start of Spanish Civil War", type: "World" },
      { year: 1936, event: "Orwell fights in Spanish Civil War", type: "Author" },
      { year: 1937, event: "Stalin's Great Purge reaches its peak", type: "World" },
      { year: 1939, event: "World War II begins", type: "World" },
      { year: 1941, event: "Orwell begins working at the BBC", type: "Author" },
      { year: 1945, event: "World War II ends", type: "World" },
      { year: 1945, event: "Orwell publishes 'Animal Farm'", type: "Author" },
      { year: 1947, event: "Cold War begins", type: "World" },
      { year: 1948, event: "Orwell completes manuscript of Nineteen Eighty-Four", type: "Book" },
      { year: 1949, event: "Publication of Nineteen Eighty-Four", type: "Book" },
      { year: 1950, event: "Death of George Orwell", type: "Author" },
      { year: 1956, event: "First film adaptation of Nineteen Eighty-Four", type: "Legacy" },
      { year: 1984, event: "Renewed interest in the novel during the actual year 1984", type: "Legacy" },
      { year: 2013, event: "Edward Snowden reveals global surveillance programs", type: "Contemporary" },
    ],
    contemporaryConnections: [
      {
        title: "Government Surveillance",
        description:
          "The revelations by Edward Snowden about NSA surveillance programs brought Orwell's predictions about government monitoring into sharp focus. The collection of metadata, internet tracking, and facial recognition technologies parallel the novel's telescreens and surveillance apparatus.",
        modernExample: "Mass data collection by intelligence agencies, CCTV networks, and facial recognition systems",
      },
      {
        title: "Information Manipulation",
        description:
          "The concept of 'fake news', social media echo chambers, and algorithmic curation of information all relate to Orwell's warnings about the manipulation of facts and the distortion of reality. The phrase 'post-truth' directly connects to the novel's exploration of how truth becomes malleable under political pressure.",
        modernExample: "Targeted misinformation campaigns, deep fake technology, and media bias",
      },
      {
        title: "Language and Thought Control",
        description:
          "Modern debates about political correctness, 'cancel culture', and controlled vocabulary echo the novel's exploration of how language shapes thinking. Corporate and political jargon that obscures meaning ('rightsizing' for firing employees, 'enhanced interrogation' for torture) reflects elements of Newspeak.",
        modernExample: "Simplification of language in digital communication and corporate/political euphemisms",
      },
      {
        title: "Technology and Privacy",
        description:
          "Smart devices that listen to conversations, track movement, or collect data about users' habits parallel the novel's telescreens. The voluntary nature of much modern surveillance contrasts with and yet complements Orwell's forced surveillance state.",
        modernExample: "Smart speakers, location tracking on smartphones, and internet cookies",
      },
    ],
    additionalResources: [
      {
        title: "Orwell: A Life in Letters",
        author: "George Orwell (ed. Peter Davison)",
        description:
          "Collection of Orwell's correspondence providing insight into his thinking while writing Nineteen Eighty-Four",
        type: "Book",
      },
      {
        title: "Why Orwell Matters",
        author: "Christopher Hitchens",
        description: "Analysis of Orwell's continued relevance and the historical context of his major works",
        type: "Book",
      },
      {
        title: "The Cambridge Companion to Nineteen Eighty-Four",
        author: "Ed. Nathan Waddell",
        description: "Academic essays exploring various aspects of the novel and its contexts",
        type: "Academic Resource",
      },
      {
        title: "Politics and the English Language",
        author: "George Orwell",
        description: "Orwell's essay examining the connection between unclear language and political manipulation",
        type: "Essay",
      },
    ],
    // Quote Bank data
    quotes: [
      {
        id: "q1",
        text: "War is peace. Freedom is slavery. Ignorance is strength.",
        reference: "Part 1, Chapter 1, p. 6",
        technique: "Paradox",
        themes: ["Totalitarianism and Control", "Language and Reality"],
        explanation:
          "This slogan of the Party exemplifies doublethink, requiring citizens to accept contradictory beliefs simultaneously. The paradoxical nature of these statements demonstrates how language can be manipulated to control thought.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Part 1, Chapter 1",
        character: "Party Slogan",
        significance: "high",
      },
      {
        id: "q2",
        text: "Big Brother is watching you.",
        reference: "Part 1, Chapter 1, p. 3",
        technique: "Symbolism",
        themes: ["Surveillance and Privacy", "Totalitarianism and Control"],
        explanation:
          "This ubiquitous slogan symbolizes the omnipresent surveillance state. The personification of surveillance as a familial figure creates an unsettling juxtaposition of intimacy and control.",
        rubricConnection: "Emotional Experiences",
        chapter: "Part 1, Chapter 1",
        character: "Party Slogan",
        significance: "high",
      },
      {
        id: "q3",
        text: "If you want a picture of the future, imagine a boot stamping on a human face—forever.",
        reference: "Part 3, Chapter 3, p. 267",
        technique: "Imagery",
        themes: ["Totalitarianism and Control", "Human Resilience and Breaking Point"],
        explanation:
          "O'Brien's vivid and brutal imagery reveals the Party's ultimate goal: not just control, but the permanent subjugation and dehumanization of individuals. The visceral image emphasizes the physical and psychological violence inherent in totalitarianism.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 3, Chapter 3",
        character: "O'Brien",
        significance: "high",
      },
      {
        id: "q4",
        text: "Until they become conscious they will never rebel, and until after they have rebelled they cannot become conscious.",
        reference: "Part 1, Chapter 7, p. 74",
        technique: "Paradox",
        themes: ["Totalitarianism and Control", "Human Resilience and Breaking Point"],
        explanation:
          "This paradoxical statement from Goldstein's book highlights the circular trap facing the proles. It demonstrates how systems of oppression create conditions that make resistance nearly impossible by limiting awareness.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Part 1, Chapter 7",
        character: "Goldstein's Book",
        significance: "medium",
      },
      {
        id: "q5",
        text: "The best books... are those that tell you what you know already.",
        reference: "Part 2, Chapter 9, p. 200",
        technique: "Irony",
        themes: ["Language and Reality", "Memory and History"],
        explanation:
          "This ironic statement reveals how the Party has inverted the purpose of reading and learning. Rather than expanding knowledge, books in Oceania merely reinforce existing beliefs, demonstrating how intellectual growth is stunted under totalitarianism.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 2, Chapter 9",
        character: "Winston Smith",
        significance: "medium",
      },
      {
        id: "q6",
        text: "Perhaps one did not want to be loved so much as to be understood.",
        reference: "Part 1, Chapter 3, p. 29",
        technique: "Internal monologue",
        themes: ["Human Resilience and Breaking Point", "Relationships"],
        explanation:
          "Winston's reflection reveals the profound human need for genuine connection beyond physical intimacy. In a society where authentic understanding is dangerous, this desire becomes revolutionary.",
        rubricConnection: "Relationships",
        chapter: "Part 1, Chapter 3",
        character: "Winston Smith",
        significance: "medium",
      },
      {
        id: "q7",
        text: "Doublethink means the power of holding two contradictory beliefs in one's mind simultaneously, and accepting both of them.",
        reference: "Part 2, Chapter 9, p. 214",
        technique: "Definition",
        themes: ["Language and Reality", "Totalitarianism and Control"],
        explanation:
          "This definition of a key concept in the novel explains how the Party maintains control through psychological manipulation. It demonstrates how language can be used to distort reality and undermine logical thinking.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Part 2, Chapter 9",
        character: "Goldstein's Book",
        significance: "high",
      },
      {
        id: "q8",
        text: "Who controls the past controls the future. Who controls the present controls the past.",
        reference: "Part 1, Chapter 3, p. 37",
        technique: "Aphorism",
        themes: ["Memory and History", "Totalitarianism and Control"],
        explanation:
          "This Party slogan encapsulates how control of historical narrative enables political power. The rhythmic, memorable structure demonstrates how language can be weaponized to normalize disturbing concepts.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 1, Chapter 3",
        character: "Party Slogan",
        significance: "high",
      },
      {
        id: "q9",
        text: "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
        reference: "Part 1, Chapter 7, p. 81",
        technique: "Symbolism",
        themes: ["Language and Reality", "Human Resilience and Breaking Point"],
        explanation:
          "Winston's assertion uses mathematical truth as a symbol for objective reality. It demonstrates how the recognition of basic facts becomes revolutionary in a society built on lies.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 1, Chapter 7",
        character: "Winston Smith",
        significance: "high",
      },
      {
        id: "q10",
        text: "We shall meet in the place where there is no darkness.",
        reference: "Part 1, Chapter 2, p. 25",
        technique: "Foreshadowing",
        themes: ["Surveillance and Privacy", "Human Resilience and Breaking Point"],
        explanation:
          "This seemingly hopeful statement by O'Brien foreshadows Winston's eventual capture and torture in the Ministry of Love, where the lights never go out. The ironic contrast between the romantic interpretation and the reality demonstrates the Party's deception.",
        rubricConnection: "Emotional Experiences",
        chapter: "Part 1, Chapter 2",
        character: "O'Brien",
        significance: "medium",
      },
      {
        id: "q11",
        text: "The Ministry of Peace concerns itself with war, the Ministry of Truth with lies, the Ministry of Love with torture and the Ministry of Plenty with starvation.",
        reference: "Part 1, Chapter 1, p. 6",
        technique: "Irony",
        themes: ["Language and Reality", "Totalitarianism and Control"],
        explanation:
          "This description of the four ministries highlights the Party's use of doublethink through ironic naming. The deliberate inversion of meaning demonstrates how language is corrupted to obscure reality.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Part 1, Chapter 1",
        character: "Narrator",
        significance: "high",
      },
      {
        id: "q12",
        text: "If you loved someone, you loved him, and when you had nothing else to give, you still gave him love.",
        reference: "Part 2, Chapter 7, p. 165",
        technique: "Reflection",
        themes: ["Human Resilience and Breaking Point", "Relationships"],
        explanation:
          "Winston's reflection on his mother's sacrifice for her children represents the enduring power of human love even in desperate circumstances. It contrasts sharply with the Party's attempt to eliminate personal loyalties.",
        rubricConnection: "Relationships",
        chapter: "Part 2, Chapter 7",
        character: "Winston Smith",
        significance: "medium",
      },
      {
        id: "q13",
        text: "Being in a minority, even a minority of one, did not make you mad. There was truth and there was untruth, and if you clung to the truth even against the whole world, you were not mad.",
        reference: "Part 1, Chapter 7, p. 80",
        technique: "Internal monologue",
        themes: ["Human Resilience and Breaking Point", "Language and Reality"],
        explanation:
          "Winston's assertion of individual truth against collective falsehood represents the core of human resistance to totalitarianism. It highlights the struggle to maintain personal integrity in a society that demands conformity.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 1, Chapter 7",
        character: "Winston Smith",
        significance: "high",
      },
      {
        id: "q14",
        text: "The object of persecution is persecution. The object of torture is torture. The object of power is power.",
        reference: "Part 3, Chapter 3, p. 266",
        technique: "Repetition",
        themes: ["Totalitarianism and Control"],
        explanation:
          "O'Brien's stark repetition reveals the circular, self-justifying nature of the Party's cruelty. Unlike previous tyrannies that claimed to serve some greater purpose, the Party's only goal is perpetuation of its own power.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 3, Chapter 3",
        character: "O'Brien",
        significance: "high",
      },
      {
        id: "q15",
        text: "It was curious to think that the sky was the same for everybody, in Eurasia or Eastasia as well as here. And the people under the sky were also very much the same—everywhere, all over the world, hundreds of thousands of millions of people just like this, people ignorant of one another's existence, held apart by walls of hatred and lies, and yet almost exactly the same.",
        reference: "Part 1, Chapter 10, p. 127",
        technique: "Imagery",
        themes: ["Human Resilience and Breaking Point", "Totalitarianism and Control"],
        explanation:
          "Winston's reflection on shared humanity across artificial political boundaries reveals his growing awareness of the Party's manufactured divisions. The image of the universal sky symbolizes the natural unity that transcends political constructs.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Part 1, Chapter 10",
        character: "Winston Smith",
        significance: "medium",
      },
    ],
    techniques: [
      {
        name: "Paradox",
        definition: "A statement that appears contradictory but may reveal a deeper truth",
        example: "War is peace. Freedom is slavery. Ignorance is strength.",
      },
      {
        name: "Symbolism",
        definition: "The use of symbols to represent ideas or qualities",
        example: "Big Brother represents the omnipresent surveillance state.",
      },
      {
        name: "Imagery",
        definition: "Vivid descriptive language that appeals to the senses",
        example: "If you want a picture of the future, imagine a boot stamping on a human face—forever.",
      },
      {
        name: "Irony",
        definition: "The expression of meaning using language that normally signifies the opposite",
        example: "The Ministry of Peace concerns itself with war.",
      },
      {
        name: "Internal monologue",
        definition: "A character's inner thoughts presented directly to the reader",
        example: "Perhaps one did not want to be loved so much as to be understood.",
      },
      {
        name: "Aphorism",
        definition: "A concise statement containing a general truth",
        example: "In the face of pain there are no heroes.",
      },
      {
        name: "Repetition",
        definition: "The repeated use of words, phrases, or ideas for emphasis",
        example: "The object of persecution is persecution. The object of torture is torture.",
      },
      {
        name: "Foreshadowing",
        definition: "A hint or indication of what is to come later in the narrative",
        example: "We shall meet in the place where there is no darkness.",
      },
      {
        name: "Rhetorical questioning",
        definition: "Questions asked for effect rather than to elicit an answer",
        example: "For, after all, how do we know that two and two make four?",
      },
      {
        name: "Parallelism",
        definition: "The use of similar grammatical structures in adjacent phrases or sentences",
        example: "He who controls the past controls the future. He who controls the present controls the past.",
      },
    ],
  }
}

// Types for quotes and related data
type Technique = {
  name: string
  definition: string
  example?: string
}

type QuoteType = {
  id: string
  text: string
  reference: string
  technique: string
  themes: string[]
  explanation: string
  rubricConnection: string
  chapter: string
  character: string
  significance: string
}

type Theme = {
  id: string
  title: string
  icon: string
  summary: string
  color: string
  examples: string[]
}

export default function TextExplore({ params }: { params: { textId: string } }) {
  const [activeTab, setActiveTab] = useState("context")
  const text = getText(params.textId)

  // Quote Bank state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("theme")
  const [favoriteQuotes, setFavoriteQuotes] = useState<string[]>([])
  const [showTechniqueInfo, setShowTechniqueInfo] = useState(false)

  // Extract unique values for filters
  const chapters = Array.from(new Set(text.quotes.map((q) => q.chapter)))
  const characters = Array.from(new Set(text.quotes.map((q) => q.character)))

  // Filter quotes based on search and filters
  const filteredQuotes = text.quotes.filter((quote) => {
    // Search query filter
    if (searchQuery && !quote.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Theme filter
    if (selectedThemes.length > 0 && !quote.themes.some((theme) => selectedThemes.includes(theme))) {
      return false
    }

    // Technique filter
    if (selectedTechniques.length > 0 && !selectedTechniques.includes(quote.technique)) {
      return false
    }

    // Chapter filter
    if (selectedChapters.length > 0 && !selectedChapters.includes(quote.chapter)) {
      return false
    }

    // Character filter
    if (selectedCharacters.length > 0 && !selectedCharacters.includes(quote.character)) {
      return false
    }

    return true
  })

  // Sort quotes based on selected option
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    switch (sortOption) {
      case "theme":
        return a.themes[0].localeCompare(b.themes[0])
      case "chapter":
        return a.chapter.localeCompare(b.chapter)
      case "significance":
        const significanceOrder = { high: 0, medium: 1, low: 2 }
        return (
          significanceOrder[a.significance as keyof typeof significanceOrder] -
          significanceOrder[b.significance as keyof typeof significanceOrder]
        )
      case "length":
        return a.text.length - b.text.length
      default:
        return 0
    }
  })

  // Group quotes by theme for theme-based display
  const quotesByTheme = sortedQuotes.reduce(
    (acc, quote) => {
      quote.themes.forEach((theme) => {
        if (!acc[theme]) {
          acc[theme] = []
        }
        if (!acc[theme].includes(quote)) {
          acc[theme].push(quote)
        }
      })
      return acc
    },
    {} as Record<string, typeof text.quotes>,
  )

  // Toggle favorite status
  const toggleFavorite = (quoteId: string) => {
    setFavoriteQuotes((prev) => (prev.includes(quoteId) ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]))
  }

  // Copy quote to clipboard
  const copyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote)
    toast({
      title: "Quote copied",
      description: "The quote has been copied to your clipboard.",
      duration: 3000,
    })
  }

  // Handle theme checkbox change
  const handleThemeChange = (theme: string) => {
    setSelectedThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]))
  }

  // Handle technique checkbox change
  const handleTechniqueChange = (technique: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(technique) ? prev.filter((t) => t !== technique) : [...prev, technique],
    )
  }

  // Handle chapter checkbox change
  const handleChapterChange = (chapter: string) => {
    setSelectedChapters((prev) => (prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]))
  }

  // Handle character checkbox change
  const handleCharacterChange = (character: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(character) ? prev.filter((c) => c !== character) : [...prev, character],
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedThemes([])
    setSelectedTechniques([])
    setSelectedChapters([])
    setSelectedCharacters([])
    setSortOption("theme")
  }

  // Export selected quotes as PDF
  const exportQuotes = () => {
    toast({
      title: "Export initiated",
      description: "Your selected quotes would be exported as PDF in a real implementation.",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/knowledge-bank/text-mastery"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} />
              <span>Back to Text Mastery Hub</span>
            </Link>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              <span>Download PDF Summary</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Text header with cover image */}
        <div className="flex flex-col items-center gap-6 py-8 mt-4 text-center md:flex-row md:text-left md:gap-8">
          <div className="relative flex-shrink-0 overflow-hidden rounded-md shadow-md w-36 h-52 md:w-44 md:h-64">
            <Image
              src={text.coverImage || "/placeholder.svg?height=400&width=300&query=book%20cover"}
              alt={`Cover of ${text.title}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className="mb-2 text-xs font-medium">
              {text.genre} • {text.publicationYear}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{text.title}</h1>
            <p className="text-xl text-gray-600">{text.author}</p>
            <p className="max-w-2xl mt-3 text-gray-700">{text.introduction}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {text.themes.slice(0, 3).map((theme) => (
                <Badge key={theme.id} variant="secondary" className="text-xs">
                  {theme.title}
                </Badge>
              ))}
              {text.themes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{text.themes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs defaultValue="context" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="context" className="flex gap-2 items-center">
              <BookOpen size={18} />
              <span>Context and Summary</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex gap-2 items-center">
              <Quote size={18} />
              <span>Quote Bank</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="context" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Table of Contents</CardTitle>
                <CardDescription>Navigate to different sections of the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => document.getElementById("core-themes")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <BookOpenCheck className="mr-2 h-4 w-4" />
                    Core Themes
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() =>
                      document.getElementById("rubric-connections")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <BookText className="mr-2 h-4 w-4" />
                    HSC Rubric Connections
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => document.getElementById("contexts")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Context Information
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() =>
                      document.getElementById("contemporary-connections")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Contemporary Connections
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() =>
                      document.getElementById("additional-resources")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Additional Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Core Themes Section */}
            <section id="core-themes" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Core Themes</h2>

              <div className="space-y-4">
                {text.themes.map((theme) => (
                  <Accordion key={theme.id} type="single" collapsible className="w-full">
                    <AccordionItem value={theme.id}>
                      <AccordionTrigger className={`p-4 rounded-t-lg ${theme.color}`}>
                        <div className="flex items-center">
                          <div className="mr-2 text-xl">
                            {theme.icon === "shield" && "🛡️"}
                            {theme.icon === "speech" && "💬"}
                            {theme.icon === "eye" && "👁️"}
                            {theme.icon === "heart" && "❤️"}
                            {theme.icon === "book" && "📚"}
                          </div>
                          <span className="text-lg font-medium">{theme.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 border border-t-0 rounded-b-lg">
                        <p className="mb-4 text-gray-700">{theme.summary}</p>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Key Examples:</h4>
                          <ul className="space-y-1 list-disc pl-5">
                            {theme.examples.map((example, idx) => (
                              <li key={idx} className="text-gray-700">
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </section>

            {/* HSC Rubric Connections */}
            <section id="rubric-connections" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">HSC Rubric Connections</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Common Module: Texts and Human Experiences</CardTitle>
                  <CardDescription>How this text addresses key rubric requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {text.rubricConnections.map((connection, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-lg mb-2">{connection.concept}</h3>
                        <p className="text-gray-700 mb-3">{connection.explanation}</p>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-gray-600 mb-1">Textual Evidence:</h4>
                          <p className="text-sm">{connection.textConnections}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Context Information */}
            <section id="contexts" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Context Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      {text.contexts.historical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.historical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.historical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      {text.contexts.biographical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.biographical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.biographical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center">
                      <BookText className="mr-2 h-5 w-5" />
                      {text.contexts.cultural.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.cultural.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.cultural.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      {text.contexts.philosophical.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{text.contexts.philosophical.content}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm">Key Points:</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {text.contexts.philosophical.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Timeline */}
            <section id="timeline" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Timeline</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                    {/* Timeline events */}
                    <div className="space-y-8">
                      {text.timelineEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`relative flex items-center ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                        >
                          <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                            <Badge
                              variant={
                                event.type === "Author"
                                  ? "outline"
                                  : event.type === "World"
                                    ? "secondary"
                                    : event.type === "Book"
                                      ? "default"
                                      : "outline"
                              }
                            >
                              {event.type}
                            </Badge>
                            <h3 className="font-medium mt-1">{event.year}</h3>
                            <p className="text-gray-700">{event.event}</p>
                          </div>

                          {/* Timeline dot */}
                          <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2"></div>

                          {/* Mobile and right side content */}
                          <div className={`md:w-1/2 ${idx % 2 === 0 ? "md:pl-8 pl-6" : "md:pr-8 pl-6"} md:mt-0`}>
                            <div className="md:hidden">
                              <Badge
                                variant={
                                  event.type === "Author"
                                    ? "outline"
                                    : event.type === "World"
                                      ? "secondary"
                                      : event.type === "Book"
                                        ? "default"
                                        : "outline"
                                }
                              >
                                {event.type}
                              </Badge>
                              <h3 className="font-medium mt-1">{event.year}</h3>
                            </div>
                            <p className={`${idx % 2 === 0 ? "" : ""} md:hidden`}>{event.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contemporary Connections */}
            <section id="contemporary-connections" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Contemporary Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {text.contemporaryConnections.map((connection, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{connection.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{connection.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Modern Example:</h4>
                        <p className="text-sm">{connection.modernExample}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Additional Resources */}
            <section id="additional-resources" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Reading and Resources</CardTitle>
                  <CardDescription>Deepen your understanding with these carefully selected materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {text.additionalResources.map((resource, idx) => (
                      <div key={idx} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className="bg-gray-100 p-2 rounded-md mr-4">
                          {resource.type === "Book" && <BookOpen className="h-5 w-5 text-blue-600" />}
                          {resource.type === "Essay" && <FileDown className="h-5 w-5 text-green-600" />}
                          {resource.type === "Academic Resource" && <BookText className="h-5 w-5 text-amber-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-gray-600">{resource.author}</p>
                          <p className="text-sm text-gray-700 mt-1">{resource.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete Resource List (PDF)
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="quotes" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Sidebar with filters */}
              <div className="lg:col-span-1">
                <div className="sticky space-y-6 top-24">
                  {/* Search */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Search size={18} />
                        Search Quotes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Search by text..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
                            Reset Filters
                          </Button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Filter size={14} className="mr-1" />
                                Advanced Filters
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                {/* Theme filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Themes</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.themes.map((theme) => (
                                      <div key={theme.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`theme-${theme.id}`}
                                          checked={selectedThemes.includes(theme.title)}
                                          onCheckedChange={() => handleThemeChange(theme.title)}
                                        />
                                        <Label htmlFor={`theme-${theme.id}`} className="text-sm">
                                          {theme.title}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Technique filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Techniques</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {text.techniques.map((technique) => (
                                      <div key={technique.name} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`technique-${technique.name}`}
                                          checked={selectedTechniques.includes(technique.name)}
                                          onCheckedChange={() => handleTechniqueChange(technique.name)}
                                        />
                                        <Label htmlFor={`technique-${technique.name}`} className="text-sm">
                                          {technique.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Chapter filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Chapters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {chapters.map((chapter) => (
                                      <div key={chapter} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`chapter-${chapter}`}
                                          checked={selectedChapters.includes(chapter)}
                                          onCheckedChange={() => handleChapterChange(chapter)}
                                        />
                                        <Label htmlFor={`chapter-${chapter}`} className="text-sm">
                                          {chapter}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Character filter */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Characters</h4>
                                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                    {characters.map((character) => (
                                      <div key={character} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`character-${character}`}
                                          checked={selectedCharacters.includes(character)}
                                          onCheckedChange={() => handleCharacterChange(character)}
                                        />
                                        <Label htmlFor={`character-${character}`} className="text-sm">
                                          {character}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sort options */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        Sort Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sort-select" className="text-sm">
                            Sort By:
                          </Label>
                          <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="theme">Theme</SelectItem>
                              <SelectItem value="chapter">Chapter</SelectItem>
                              <SelectItem value="significance">Significance</SelectItem>
                              <SelectItem value="length">Length</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technique Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bookmark size={18} />
                        Literary Techniques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowTechniqueInfo(!showTechniqueInfo)}
                          >
                            {showTechniqueInfo ? "Hide Technique Info" : "Show Technique Info"}
                          </Button>
                          {showTechniqueInfo && (
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                              <div className="space-y-4">
                                {text.techniques.map((technique) => (
                                  <div key={technique.name} className="space-y-1">
                                    <h4 className="text-sm font-medium">{technique.name}</h4>
                                    <p className="text-xs text-gray-600">{technique.definition}</p>
                                    {technique.example && (
                                      <div className="bg-gray-50 p-2 rounded-md">
                                        <p className="text-xs italic">{technique.example}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main content area with quote cards */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {Object.keys(quotesByTheme).length > 0
                      ? `Filtered Quotes (${sortedQuotes.length} found)`
                      : "All Quotes"}
                  </h2>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={exportQuotes}>
                    <FileDown size={16} />
                    Export Selected Quotes
                  </Button>
                </div>

                {Object.keys(quotesByTheme).length === 0 ? (
                  <Card className="p-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-gray-600">No quotes match your current filter criteria.</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(quotesByTheme).map(([theme, quotes]) => (
                      <div key={theme} className="space-y-3">
                        <h3 className="text-xl font-semibold">{theme}</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {quotes.map((quote) => (
                            <Card key={quote.id}>
                              <CardHeader>
                                <CardTitle className="text-base font-medium">
                                  {quote.text.length > 100 ? `${quote.text.substring(0, 100)}...` : quote.text}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                  {quote.chapter} - {quote.character}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="text-sm">
                                <p className="text-gray-700">{quote.explanation.substring(0, 150)}...</p>
                                <Separator className="my-2" />
                                <p className="text-gray-600">
                                  <span className="font-medium">Technique:</span> {quote.technique}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {quote.themes.map((theme) => (
                                    <Badge key={theme} variant="secondary" className="text-xs">
                                      {theme}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter className="flex items-center justify-between">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                                        {favoriteQuotes.includes(quote.id) ? (
                                          <StarFilled className="h-4 w-4 text-yellow-500" />
                                        ) : (
                                          <Star className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {favoriteQuotes.includes(quote.id) ? "Remove from favorites" : "Add to favorites"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="flex gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => copyQuote(quote.text)}>
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Copy quote to clipboard</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <Link href={`/knowledge-bank/quote-details/${quote.id}`}>
                                    <Button variant="ghost" size="icon">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
