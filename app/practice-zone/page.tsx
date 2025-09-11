import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, FileText, Lightbulb } from "lucide-react"

export default function PracticeZonePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Practice Zone</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Everything you need for regular, active practice to master HSC Paper 1.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
              "Feedback and tips",
            ]}
          />

          <PracticeCard
            title="Exam Simulator"
            description="Experience the full HSC Paper 1 exam under timed conditions."
            icon={<BookOpen className="h-6 w-6" />}
            href="/practice-zone/exam-simulator"
            features={[
              "Full exam format replication",
              "Timed conditions",
              "Comprehensive feedback",
              "Real exam experience",
            ]}
          />
        </div>
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
    <Link href={href} className="block">
      <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform-gpu bg-gradient-to-br from-background to-muted/30 border-2 hover:border-primary/50 shadow-lg hover:shadow-primary/25">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
              {icon}
            </div>
            <span>{title}</span>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-primary mr-2 font-bold">•</span>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  )
}
