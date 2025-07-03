import Link from "next/link"
import { ArrowLeft, CheckCircle, BookOpen, Target, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MacbethAmbitionSamplePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4">
          <Link href="/knowledge-bank/essay-guide/introductions" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Introductions Guide
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sample Response: Macbeth and Ambition</h1>
          <p className="text-muted-foreground max-w-3xl">
            A model introduction demonstrating how to effectively address the essay question about Shakespeare's exploration of ambition through Macbeth.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="prose max-w-none">
          {/* Essay Question */}
          <div className="bg-secondary/20 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Essay Question
            </h2>
            <p className="text-lg italic">
              "How does Shakespeare use the character of Macbeth to explore the corrupting influence of ambition?"
            </p>
          </div>

          {/* Sample Introduction */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Sample Introduction</h3>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <p className="text-base leading-relaxed">
                <span className="bg-purple-100 px-2 py-1 rounded">
                  Written during the reign of James I, Shakespeare's "Macbeth" serves as both a cautionary tale about the dangers of unchecked ambition and a reflection on the divine right of kings that was central to Jacobean political thought.
                </span>{" "}
                <span className="bg-blue-100 px-2 py-1 rounded">
                  Through the tragic arc of Macbeth, Shakespeare demonstrates how ambition, when divorced from moral restraint, becomes a destructive force that ultimately consumes both the individual and the social order they seek to dominate.
                </span>{" "}
                <span className="bg-green-100 px-2 py-1 rounded">
                  By chronicling Macbeth's transformation from noble warrior to tyrannical murderer, his increasing isolation from human connection, and his descent into paranoid desperation, Shakespeare reveals how ambition corrupts not only one's actions but one's very nature and capacity for authentic relationships.
                </span>
              </p>
            </div>

            {/* Component Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Context */}
              <Card className="border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                    </div>
                    Historical Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sets the play within its historical moment, showing understanding of the political climate that influenced Shakespeare's writing.
                  </p>
                </CardContent>
              </Card>

              {/* Thesis */}
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    Thesis Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Directly addresses the question about ambition and corruption while establishing a sophisticated understanding of the play's themes.
                  </p>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-t-4 border-t-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    Point Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Outlines three key areas of analysis: transformation, isolation, and psychological deterioration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why This Introduction Works */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Why This Introduction Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-primary">Strengths</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Directly addresses the question</span>
                      <p className="text-sm text-muted-foreground">Uses key terms from the question ("corrupting influence of ambition") and focuses specifically on how Shakespeare uses Macbeth's character.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Relevant historical context</span>
                      <p className="text-sm text-muted-foreground">References James I and Jacobean political thought, showing understanding of the play's historical significance.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Clear thesis statement</span>
                      <p className="text-sm text-muted-foreground">Establishes a sophisticated position about ambition as a corrupting force that affects both individual and society.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Structured argument preview</span>
                      <p className="text-sm text-muted-foreground">Provides a roadmap showing three distinct areas of analysis that will structure the essay.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-primary">Key Techniques</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                      <span className="text-xs text-blue-500">1</span>
                    </div>
                    <div>
                      <span className="font-medium">Sophisticated vocabulary</span>
                      <p className="text-sm text-muted-foreground">Uses precise terms like "unchecked ambition," "moral restraint," and "tyrannical murderer."</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                      <span className="text-xs text-purple-500">2</span>
                    </div>
                    <div>
                      <span className="font-medium">Conceptual understanding</span>
                      <p className="text-sm text-muted-foreground">Demonstrates insight into themes of corruption, power, and human nature.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                      <span className="text-xs text-green-500">3</span>
                    </div>
                    <div>
                      <span className="font-medium">Analytical focus</span>
                      <p className="text-sm text-muted-foreground">Moves beyond plot summary to focus on Shakespeare's techniques and intentions.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Body Paragraph Preview */}
          <div className="bg-secondary/10 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4">How This Introduction Sets Up the Essay</h3>
            <p className="mb-4">
              This introduction effectively establishes the framework for a three-part analysis. Each body paragraph would develop one of the preview points:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md">
                <h4 className="font-medium mb-2">Body Paragraph 1</h4>
                <p className="text-sm text-muted-foreground">
                  Macbeth's transformation from noble warrior to tyrannical murderer, examining specific moments where ambition overrides moral judgment.
                </p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <h4 className="font-medium mb-2">Body Paragraph 2</h4>
                <p className="text-sm text-muted-foreground">
                  His increasing isolation from human connection, analyzing how ambition destroys his relationships with Lady Macbeth and others.
                </p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <h4 className="font-medium mb-2">Body Paragraph 3</h4>
                <p className="text-sm text-muted-foreground">
                  His descent into paranoid desperation, exploring how unchecked ambition leads to psychological deterioration.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Continue Your Learning</h3>
            <p className="mb-6">
              Now that you've seen how to craft an effective introduction, explore our other guides to master all aspects of essay writing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/knowledge-bank/essay-guide/introductions">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Introductions Guide
                </Button>
              </Link>
              <Link href="/knowledge-bank/essay-guide/body-paragraphs">
                <Button className="w-full sm:w-auto">
                  Body Paragraphs Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 