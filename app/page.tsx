import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Master HSC Paper 1 with Confidence</h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive platform for NSW HSC English Paper 1 preparation
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/practice-zone">
              Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/knowledge-bank">Explore Resources</Link>
          </Button>
        </div>
      </section>

      <section className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="Practice Zone"
          description="Daily drills, essay practice, and exam simulation to sharpen your skills."
          icon="📚"
          href="/practice-zone"
        />
        <FeatureCard
          title="Knowledge Bank"
          description="Comprehensive resources for text analysis, themes, and essay structure."
          icon="📖"
          href="/knowledge-bank"
        />
        <FeatureCard
          title="Progress Tracking"
          description="Monitor your improvement with detailed analytics and personalized insights."
          icon="📊"
          href="/progress"
        />
      </section>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="border rounded-lg p-6 h-full hover:shadow-md transition-shadow">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
