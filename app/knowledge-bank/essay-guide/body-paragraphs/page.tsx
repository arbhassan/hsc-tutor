import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BodyParagraphsGuidePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4">
          <Link href="/knowledge-bank/essay-guide" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Essay Guide
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Body Paragraphs</h1>
          <p className="text-muted-foreground max-w-3xl">
            Master the art of crafting analytical body paragraphs that showcase your critical thinking and textual
            understanding through the PETAL framework, sophisticated arguments, and effective evidence.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-6">The Complete Guide to Body Paragraphs</h2>
          <p className="text-lg mb-8">
            Body paragraphs form the core of your essay, where you develop your arguments and demonstrate your
            analytical skills. Each paragraph should focus on a single point that supports your thesis statement.
          </p>

          <Tabs defaultValue="petal" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="petal" id="petal">PETAL Structure</TabsTrigger>
              <TabsTrigger value="arguments" id="arguments">Sophisticated Arguments</TabsTrigger>
              <TabsTrigger value="evidence" id="evidence">Textual Evidence</TabsTrigger>
            </TabsList>

            {/* PETAL Structure Tab */}
            <TabsContent value="petal">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">The PETAL Framework</h3>
                <p className="mb-6">
                  The PETAL framework provides a clear structure for crafting analytical paragraphs that showcase your
                  critical thinking and textual understanding.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center p-4 bg-red-50 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-red-500">P</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700">Point</h4>
                        <p className="text-sm text-muted-foreground">
                          A clear statement that supports your thesis and introduces the main idea of the paragraph.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-blue-500">E</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">Evidence</h4>
                        <p className="text-sm text-muted-foreground">
                          Relevant quotation or example from the text that supports your point.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-purple-50 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-purple-500">T</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700">Technique</h4>
                        <p className="text-sm text-muted-foreground">
                          Identify the literary devices or techniques used in your evidence.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-green-50 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-green-500">A</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-700">Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Explain how the evidence and techniques support your point and thesis.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-amber-50 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-amber-500">L</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-700">Link</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect back to your thesis and the question, reinforcing your argument.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Sample PETAL Paragraph</h3>
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">
                      <span className="bg-red-100 px-1 py-0.5 rounded">
                        The Party's control of language through Newspeak serves as the foundation of its power,
                        systematically limiting the capacity for rebellious thought.
                      </span>{" "}
                      <span className="bg-blue-100 px-1 py-0.5 rounded">
                        As Syme explains to Winston, "Don't you see that the whole aim of Newspeak is to narrow the
                        range of thought? In the end we shall make thoughtcrime literally impossible, because there will
                        be no words in which to express it."
                      </span>{" "}
                      <span className="bg-purple-100 px-1 py-0.5 rounded">
                        Through this paradoxical statement and linguistic determinism,
                      </span>{" "}
                      <span className="bg-green-100 px-1 py-0.5 rounded">
                        Orwell illustrates how language shapes the boundaries of thought itself. By eliminating words
                        that express concepts like freedom and rebellion, the Party doesn't just prohibit dissent—it
                        makes it conceptually impossible. This linguistic manipulation represents the most insidious
                        form of control, as it operates at the level of cognition itself, preventing citizens from even
                        formulating rebellious ideas.
                      </span>{" "}
                      <span className="bg-amber-100 px-1 py-0.5 rounded">
                        This deliberate restriction of language thus exemplifies how the Party weaponizes linguistic
                        expression to maintain its totalitarian control, directly supporting Orwell's warning about the
                        relationship between language and power.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg mb-8">
                <h4 className="font-medium text-lg mb-4">PETAL Paragraph Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Does your point clearly support your thesis?</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Is your evidence relevant and specific?</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Have you identified specific techniques?</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Does your analysis explain the significance of your evidence?</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Does your link connect back to your thesis?</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">Is there a logical flow between all PETAL elements?</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-medium text-lg mb-4">Transition Tips</h4>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Use linking words between PETAL elements</p>
                        <p className="text-sm text-muted-foreground">
                          Words like "furthermore," "specifically," "through," and "consequently" help create smooth
                          transitions.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Vary sentence structures</p>
                        <p className="text-sm text-muted-foreground">
                          Mix simple, compound, and complex sentences to create a sophisticated writing style.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Create logical connections</p>
                        <p className="text-sm text-muted-foreground">
                          Ensure each element naturally flows from the previous one, building your argument
                          progressively.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Sophisticated Arguments Tab */}
            <TabsContent value="arguments">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Developing Sophisticated Arguments</h3>
                <p className="mb-6">
                  Sophisticated arguments demonstrate depth of understanding, nuanced thinking, and the ability to
                  engage with complex ideas. They elevate your essay from descriptive to analytical.
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Basic vs. Sophisticated Analysis</CardTitle>
                  <CardDescription>See the difference in analytical depth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-100 rounded-md border-l-4 border-gray-400">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Analysis</h4>
                      <p className="text-sm">
                        "The red hunting hat symbolizes Holden's uniqueness and individuality. He wears it to stand out
                        from others and show he is different."
                      </p>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-md border-l-4 border-primary">
                      <h4 className="text-sm font-medium text-primary mb-2">Sophisticated Analysis</h4>
                      <p className="text-sm">
                        "Holden's red hunting hat functions as a multifaceted symbol that evolves throughout the
                        narrative. Initially representing his desire for isolation from a society he deems 'phony,' the
                        hat later transforms into a protective talisman against adult corruption. Significantly, Holden
                        removes the hat in certain social situations, revealing his conflicted desire for connection
                        despite his self-imposed alienation. This sartorial choice thus embodies the central paradox of
                        his character: his simultaneous yearning for authentic connection and fear of vulnerability."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Strategies for Nuanced Arguments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold text-primary">1</span>
                        </div>
                        Consider Contradictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Explore how texts present contradictory ideas or paradoxes that create complexity and depth.
                        Identify tensions within characters, themes, or narrative structures.
                      </p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs italic">
                          "While Macbeth's ambition drives him to murder, his persistent guilt and hallucinations reveal
                          his underlying moral conscience, creating a character torn between ruthless determination and
                          human remorse."
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold text-primary">2</span>
                        </div>
                        Examine Multiple Perspectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Analyze how different characters or viewpoints contribute to the text's overall meaning. Consider
                        how various perspectives illuminate different aspects of the same theme.
                      </p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs italic">
                          "The theme of justice in 'To Kill a Mockingbird' is explored through multiple perspectives:
                          Atticus's idealistic legal approach, the town's prejudiced view, and Scout's evolving
                          childhood understanding."
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold text-primary">3</span>
                        </div>
                        Connect to Broader Themes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Link textual elements to universal themes and philosophical concepts. Show how specific details
                        connect to larger ideas about human experience or society.
                      </p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs italic">
                          "The decay of the natural world in 'The Great Gatsby' serves not merely as backdrop but as a
                          reflection of moral corruption in American society, connecting Fitzgerald's environmental
                          imagery to broader critiques of capitalism and the American Dream."
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold text-primary">4</span>
                        </div>
                        Analyze Development Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Track how themes, characters, or ideas evolve throughout the text. Show progression, regression,
                        or cyclical patterns that add layers of meaning.
                      </p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs italic">
                          "Elizabeth's initial prejudice against Darcy gradually transforms through key revelations,
                          mirroring Austen's exploration of how true understanding requires moving beyond first
                          impressions and social assumptions."
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Textual Evidence Tab */}
            <TabsContent value="evidence">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Using Textual Evidence Effectively</h3>
                <p className="mb-6">
                  Strong textual evidence forms the foundation of compelling arguments. Learn how to select, integrate,
                  and analyze quotations that support your thesis effectively.
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Evidence Selection Criteria</CardTitle>
                  <CardDescription>Choose quotes that strengthen your argument</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Relevance</h4>
                      <p className="text-sm text-muted-foreground">
                        Select quotes that directly support your point and contribute to your overall argument.
                      </p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Specificity</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose precise, detailed quotes rather than vague or overly general statements.
                      </p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Literary Richness</h4>
                      <p className="text-sm text-muted-foreground">
                        Prefer quotes with literary techniques, figurative language, or symbolic meaning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Integration Techniques</h3>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Signal Phrases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use varied signal phrases to introduce quotations smoothly and provide context.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm mb-2">
                          <strong>Examples:</strong>
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>• "Orwell emphasizes this control when he writes..."</li>
                          <li>• "The narrator's perspective shifts as we see..."</li>
                          <li>• "This theme becomes explicit in the powerful image..."</li>
                          <li>• "Shakespeare's language intensifies the mood through..."</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Embedding Quotations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Seamlessly integrate short phrases within your own sentences for smooth flow.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm mb-2">
                          <strong>Example:</strong>
                        </p>
                        <p className="text-sm">
                          Winston's recognition that "freedom is the freedom to say that two plus two make four"
                          encapsulates Orwell's belief that intellectual integrity forms the foundation of human liberty.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
