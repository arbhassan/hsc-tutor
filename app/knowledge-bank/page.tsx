import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function KnowledgeBankPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Knowledge Bank</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A deep resource well for content mastery and HSC Paper 1 excellence.
        </p>

        <div className="grid grid-cols-1 gap-6 mb-12">
          <ResourceCard
            title="Text Mastery Hub"
            description="Comprehensive analysis of prescribed texts."
            icon={<BookOpen className="h-6 w-6" />}
            href="/knowledge-bank/text-mastery"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Essay Structure and Writing Guide</CardTitle>
                <CardDescription>Comprehensive guide to crafting Band 6 essays</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Introduction with thesis statement, context, and points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Body paragraphs using PETAL structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Developing sophisticated arguments and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Integrating textual evidence effectively</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Conclusion techniques for maximum impact</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/knowledge-bank/essay-guide">View Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

function ResourceCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
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
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
