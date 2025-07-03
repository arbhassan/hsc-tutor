import Link from "next/link"
import { ArrowLeft, Lightbulb, BookText, FileText, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntroductionsGuidePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4">
          <Link href="/knowledge-bank/essay-guide" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Essay Guide
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Essay Introductions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Learn how to craft compelling introductions that engage your reader, establish your argument, and set the
            foundation for your entire essay.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-6">The Complete Guide to Essay Introductions</h2>
          <p className="text-lg mb-8">
            Your introduction is the first impression your essay makes on the reader. A strong introduction sets the
            tone for your analysis, presents your argument clearly, and guides the reader through what to expect in your
            essay.
          </p>

          {/* Introduction Components */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-16">
            {/* Thesis Statement */}
            <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-blue-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 1
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                  </div>
                  Thesis Statement
                </CardTitle>
                <CardDescription>The foundation of your argument</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "Orwell's '1984' demonstrates how language can be weaponized as a means of control, revealing the
                    intrinsic connection between linguistic expression and personal freedom."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Clear position that answers the question</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Sophisticated conceptual understanding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Establishes key themes to be explored</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Context */}
            <Card className="relative overflow-hidden border-t-4 border-t-purple-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-purple-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 2
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <BookText className="h-5 w-5 text-purple-500" />
                  </div>
                  Context
                </CardTitle>
                <CardDescription>Framing your analysis appropriately</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-purple-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "Written in 1949 against the backdrop of totalitarian regimes, Orwell's dystopian novel serves as a
                    warning about the dangers of totalitarianism and surveillance states."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Relevant historical/literary context</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Establishes author's purpose</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Connects to broader themes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Point Preview */}
            <Card className="relative overflow-hidden border-t-4 border-t-green-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-green-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 3
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  Point Preview
                </CardTitle>
                <CardDescription>Roadmap for your essay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "Through the manipulation of Newspeak, the control of historical records, and the suppression of
                    individual thought, the Party demonstrates how language shapes reality and limits resistance."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Outlines key arguments to be developed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Provides structure for the reader</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Demonstrates depth of analysis to come</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Answering the Question Section */}
          <div className="bg-primary/5 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4">Answering the Question</h3>
            <p className="mb-4">
              Every strong introduction directly addresses the essay question or prompt. This demonstrates to your
              marker that you understand what is being asked and have a clear direction for your response.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="font-medium text-primary mb-2">Sample Question:</h4>
                <p className="text-sm italic mb-4">"How does Orwell use language to explore power in '1984'?"</p>
                <h4 className="font-medium text-primary mb-2">Strong Response:</h4>
                <p className="text-sm">
                  "In '1984', Orwell demonstrates how language functions as the primary mechanism through which power is
                  established, maintained, and weaponized against the individual. Through his exploration of Newspeak,
                  propaganda, and the manipulation of historical records, Orwell reveals that control over language is
                  inseparable from political control."
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Key Strategies:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Use key terms from the question in your response</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Address all parts of multi-part questions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Establish your position clearly and early</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Show understanding of key concepts in the question</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Complete Introduction Example */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Complete Introduction Example</h3>
            <div className="p-5 bg-gray-50 rounded-md border border-gray-200 mb-4">
              <p className="text-sm leading-relaxed">
                <span className="bg-purple-100 px-1 py-0.5 rounded">
                  Written in 1949 against the backdrop of totalitarian regimes, Orwell's dystopian novel serves as a
                  warning about the dangers of totalitarianism and surveillance states.
                </span>{" "}
                <span className="bg-blue-100 px-1 py-0.5 rounded">
                  Orwell's '1984' demonstrates how language can be weaponized as a means of control, revealing the
                  intrinsic connection between linguistic expression and personal freedom.
                </span>{" "}
                <span className="bg-green-100 px-1 py-0.5 rounded">
                  Through the manipulation of Newspeak, the control of historical records, and the suppression of
                  individual thought, the Party demonstrates how language shapes reality and limits resistance.
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Clear thesis that addresses the question</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Relevant historical context</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Specific points that will be developed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Sophisticated conceptual understanding</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Structure Analysis:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <span className="text-xs text-purple-500">1</span>
                    </div>
                    <span className="text-sm">Context (historical and literary)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <span className="text-xs text-blue-500">2</span>
                    </div>
                    <span className="text-sm">Thesis statement (main argument)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <span className="text-xs text-green-500">3</span>
                    </div>
                    <span className="text-sm">Point preview (roadmap for essay)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Common Introduction Mistakes to Avoid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="font-medium text-red-700 mb-2">Being too vague or general</h4>
                <p className="text-sm">
                  Avoid starting with overly broad statements like "Throughout history, writers have explored important
                  themes." Instead, be specific about the text and themes you're analyzing.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="font-medium text-red-700 mb-2">Not addressing the question</h4>
                <p className="text-sm">
                  Make sure your introduction directly responds to the specific question or prompt, not just the general
                  topic area.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="font-medium text-red-700 mb-2">Including irrelevant biographical details</h4>
                <p className="text-sm">
                  Only include author information if it's directly relevant to your argument or provides essential
                  context for understanding the text.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="font-medium text-red-700 mb-2">Making unsupported claims</h4>
                <p className="text-sm">
                  Ensure that any claims you make in your introduction can be supported by evidence in your body
                  paragraphs.
                </p>
              </div>
            </div>
          </div>

          {/* Practice Exercise */}
          <div className="bg-secondary/20 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4">Practice Exercise</h3>
            <p className="mb-4">Try writing an introduction for the following essay question:</p>
            <div className="bg-white p-4 rounded-md shadow-sm mb-6">
              <p className="italic">
                "How does Shakespeare use the character of Macbeth to explore the corrupting influence of ambition?"
              </p>
            </div>
            <p className="mb-4">Remember to include:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Relevant context about Shakespeare's Macbeth</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>A clear thesis that addresses the question about ambition</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>A preview of the key points you would develop in your essay</span>
              </li>
            </ul>
            <Link href="/knowledge-bank/essay-guide/sample-responses/macbeth-ambition">
              <Button>
                View Sample Response <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Next Steps */}
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>
            <p className="mb-6">
              Now that you understand how to craft effective introductions, explore our guides on body paragraphs and
              conclusions to complete your essay writing skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/knowledge-bank/essay-guide/body-paragraphs">
                <Button variant="outline" className="w-full sm:w-auto">
                  Body Paragraphs Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/knowledge-bank/essay-guide/conclusions">
                <Button variant="outline" className="w-full sm:w-auto">
                  Conclusions Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
