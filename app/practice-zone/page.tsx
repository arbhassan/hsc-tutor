import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, FileText, Lightbulb } from "lucide-react"

export default function PracticeZonePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Practice Zone</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Everything you need for regular, active practice to master HSC Paper 1.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <PracticeCard
            title="Daily Drill"
            description="3-4 fresh unseen texts daily with instant marking and model answers."
            icon={<Clock className="h-6 w-6" />}
            href="/practice-zone/daily-drill"
            features={[
              "Fiction, nonfiction, poetry & visual texts",
              "Varying mark allocations (1-7 marks)",
              "Guided annotation tools",
              "Examiner commentary",
            ]}
          />

          <PracticeCard
            title="Essay Mode"
            description="Practice essay writing with your prescribed texts and get detailed feedback."
            icon={<FileText className="h-6 w-6" />}
            href="/practice-zone/essay-mode"
            features={[
              "Complete Standard & Advanced text lists",
              "Question deconstruction guides",
              "Thematic quote references",
              "Detailed feedback",
            ]}
          />

          <PracticeCard
            title="Quote Memorisation Flashcards"
            description="Master key quotes and paragraphs with interactive cloze passages."
            icon={<Lightbulb className="h-6 w-6" />}
            href="/practice-zone/quote-flashcards-new"
            features={[
              "Cloze passage system for active recall",
              "Create custom flashcard sets",
              "Track mastery progress",
              "Import/export study materials",
            ]}
          />

          <PracticeCard
            title="Interactive Essay Builder"
            description="Step-by-step essay writing practice with guidance and random questions."
            icon={<BookOpen className="h-6 w-6" />}
            href="/practice-zone/interactive-builder"
            features={[
              "Random question generation",
              "Step-by-step introduction guidance",
              "Quote-based body paragraph practice",
              "AI feedback and tips",
            ]}
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Exam Simulator
            </CardTitle>
            <CardDescription>Experience the full HSC Paper 1 exam under timed conditions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Prepare for the real thing with our comprehensive exam simulator that replicates the exact format and
              timing of the HSC Paper 1 examination.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/practice-zone/exam-simulator">Start Simulation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function PracticeCard({
  title,
  description,
  icon,
  href,
  features,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  features: string[]
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={href}>Start Practice</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
