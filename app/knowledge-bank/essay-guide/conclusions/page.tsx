import Link from "next/link"
import { ArrowLeft, Target, RefreshCw, Sparkles, Globe, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConclusionsGuidePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4">
          <Link href="/knowledge-bank/essay-guide" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Essay Guide
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Essay Conclusions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Master the art of crafting powerful conclusions that synthesize your arguments, reinforce your thesis, and leave a lasting impression on your reader.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-6">The Complete Guide to Essay Conclusions</h2>
          <p className="text-lg mb-8">
            Your conclusion is your final opportunity to convince your reader and demonstrate the significance of your argument. A strong conclusion doesn't just summarize—it synthesizes, reinforces, and elevates your analysis to leave a powerful final impression.
          </p>

          {/* Conclusion Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-16">
            {/* Thesis Restatement */}
            <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-blue-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 1
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  Thesis Restatement
                </CardTitle>
                <CardDescription>Reinforcing your central argument</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "Through its systematic manipulation of language, control of information, and suppression of individual thought, '1984' ultimately reveals that the weaponization of language represents the most insidious form of totalitarian control."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Reaffirms your position with new phrasing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Demonstrates consistency throughout essay</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Shows sophisticated understanding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Argument Synthesis */}
            <Card className="relative overflow-hidden border-t-4 border-t-purple-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-purple-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 2
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <RefreshCw className="h-5 w-5 text-purple-500" />
                  </div>
                  Argument Synthesis
                </CardTitle>
                <CardDescription>Connecting your key points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-purple-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "The interplay between Newspeak's linguistic restrictions, the Party's historical revisionism, and the psychological manipulation of thoughtcrime creates a comprehensive system of control that operates simultaneously on cognitive, emotional, and social levels."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Shows how arguments work together</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Demonstrates analytical depth</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Reveals complex understanding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Impactful Closing */}
            <Card className="relative overflow-hidden border-t-4 border-t-green-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-green-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 3
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  Impactful Closing
                </CardTitle>
                <CardDescription>Memorable final statement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "In our contemporary era of information warfare and digital surveillance, Orwell's warning resonates with chilling relevance: when language itself becomes a weapon, the very foundations of human thought and freedom are under siege."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Creates lasting impression</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Uses sophisticated language</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Demonstrates contemporary relevance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Broader Implications */}
            <Card className="relative overflow-hidden border-t-4 border-t-amber-500">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute transform rotate-45 bg-amber-500 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Component 4
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-amber-500" />
                  </div>
                  Broader Implications
                </CardTitle>
                <CardDescription>Universal significance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-amber-50 rounded-md mb-4">
                  <p className="text-sm italic">
                    "Orwell's exploration of linguistic manipulation extends beyond the confines of dystopian fiction to illuminate fundamental questions about power, truth, and human agency in any society where language shapes reality."
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Connects to universal themes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Shows enduring relevance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Demonstrates sophisticated insight</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="techniques" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="techniques">Restatement Techniques</TabsTrigger>
              <TabsTrigger value="synthesis">Synthesis Strategies</TabsTrigger>
              <TabsTrigger value="impact">Creating Impact</TabsTrigger>
            </TabsList>

            {/* Restatement Techniques Tab */}
            <TabsContent value="techniques">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Thesis Restatement Techniques</h3>
                <p className="mb-6">
                  Effective thesis restatement goes beyond mere repetition. It demonstrates growth in your understanding and reinforces your argument with sophisticated rephrasing that shows the depth of your analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-lg">❌ Weak Restatement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic bg-red-50 p-3 rounded">
                        "In conclusion, Orwell uses language to explore power in '1984' through Newspeak, propaganda, and thought control, as stated in my introduction."
                      </p>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p><strong>Problems:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Mechanical repetition</li>
                          <li>No growth in understanding</li>
                          <li>Weak transition phrase</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-lg">✅ Strong Restatement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic bg-green-50 p-3 rounded">
                        "Through its systematic deconstruction of linguistic freedom, '1984' ultimately reveals that the weaponization of language represents the most insidious form of totalitarian control—one that operates not through external force but through the corruption of thought itself."
                      </p>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p><strong>Strengths:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Sophisticated rephrasing</li>
                          <li>Deeper analytical insight</li>
                          <li>Elevated language</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Key Techniques</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Semantic Variation</p>
                        <p className="text-sm text-muted-foreground">
                          Use synonyms and different phrasing while maintaining the same core meaning
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Elevated Language</p>
                        <p className="text-sm text-muted-foreground">
                          Use more sophisticated vocabulary and complex sentence structures
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Added Insight</p>
                        <p className="text-sm text-muted-foreground">
                          Include additional understanding gained through your analysis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Conceptual Depth</p>
                        <p className="text-sm text-muted-foreground">
                          Show how your understanding has evolved and deepened
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Synthesis Strategies Tab */}
            <TabsContent value="synthesis">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Argument Synthesis Strategies</h3>
                <p className="mb-6">
                  Effective synthesis demonstrates how your individual arguments work together to create a comprehensive understanding. It shows the interconnections between your points and reveals the complexity of your analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <RefreshCw className="h-5 w-5 text-purple-500 mr-2" />
                        Connecting Arguments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-purple-50 p-4 rounded-md mb-4">
                        <p className="text-sm italic">
                          "The manipulation of Newspeak works in tandem with the Party's control of historical records, creating a dual assault on both present understanding and past truth, while the enforcement of thoughtcrime ensures that even private dissent becomes impossible."
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Shows relationships between points</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Uses linking phrases effectively</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Demonstrates systematic thinking</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Globe className="h-5 w-5 text-amber-500 mr-2" />
                        Cumulative Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-amber-50 p-4 rounded-md mb-4">
                        <p className="text-sm italic">
                          "Together, these linguistic strategies create a totalitarian system that is more insidious than physical oppression because it operates at the level of consciousness itself, making resistance not just dangerous but literally unthinkable."
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Shows combined effect of arguments</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Demonstrates comprehensive understanding</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">Reveals analytical sophistication</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-4">Synthesis Techniques</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-purple-600 mb-2">Causal Relationships</h5>
                      <p className="text-sm text-muted-foreground">
                        Show how one argument leads to or enables another: "Because X, therefore Y becomes possible..."
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">Complementary Effects</h5>
                      <p className="text-sm text-muted-foreground">
                        Demonstrate how arguments work together: "While X operates on the conscious level, Y targets the subconscious..."
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">Escalating Intensity</h5>
                      <p className="text-sm text-muted-foreground">
                        Show progressive development: "From X through Y to Z, the control becomes increasingly absolute..."
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-amber-600 mb-2">Systemic Integration</h5>
                      <p className="text-sm text-muted-foreground">
                        Reveal how parts form a whole: "These elements combine to create a comprehensive system that..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Creating Impact Tab */}
            <TabsContent value="impact">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Creating Lasting Impact</h3>
                <p className="mb-6">
                  A powerful conclusion doesn't just end your essay—it elevates it. Through strategic use of language, contemporary relevance, and universal insights, you can create a conclusion that resonates with your reader long after they've finished reading.
                </p>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contemporary Relevance</CardTitle>
                    <CardDescription>Connect the text to current issues and concerns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <p className="text-sm italic">
                        "In our age of social media echo chambers and algorithmic content curation, Orwell's vision of controlled information has evolved into a subtler but no less dangerous reality, where the manipulation of language shapes not just individual thought but collective consciousness."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Techniques:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Reference current events or technologies</li>
                          <li>• Draw parallels to contemporary society</li>
                          <li>• Show the text's ongoing relevance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Benefits:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Demonstrates critical thinking</li>
                          <li>• Shows analytical depth</li>
                          <li>• Creates reader engagement</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Universal Insights</CardTitle>
                    <CardDescription>Reveal broader truths about human nature and society</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <p className="text-sm italic">
                        "Ultimately, '1984' serves as a timeless reminder that the greatest threat to human freedom may not come from external oppression but from the gradual erosion of our capacity to think independently—a warning that transcends any single political system or historical moment."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Techniques:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Identify universal themes</li>
                          <li>• Connect to fundamental human experiences</li>
                          <li>• Show timeless relevance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Benefits:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Demonstrates sophistication</li>
                          <li>• Shows depth of understanding</li>
                          <li>• Creates lasting impression</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sophisticated Language</CardTitle>
                    <CardDescription>Use elevated vocabulary and complex structures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 p-4 rounded-md mb-4">
                      <p className="text-sm italic">
                        "Through its prescient exploration of linguistic manipulation, '1984' illuminates the paradox at the heart of totalitarian control: the more comprehensively a system seeks to dominate human thought, the more it reveals the indomitable power of language to shape reality itself."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Techniques:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Use sophisticated vocabulary</li>
                          <li>• Employ complex sentence structures</li>
                          <li>• Create rhythmic, memorable phrases</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Benefits:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Shows linguistic sophistication</li>
                          <li>• Creates memorable impact</li>
                          <li>• Demonstrates writing skill</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Conclusion Mistakes */}
          <div className="bg-red-50 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4 text-red-800">Common Conclusion Mistakes to Avoid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-700 mb-3">What NOT to do:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm">Start with "In conclusion" or "To conclude"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm">Simply repeat your introduction verbatim</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm">Introduce completely new ideas or evidence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm">End abruptly without synthesis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm">Use weak, formulaic language</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-3">What TO do instead:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Begin with sophisticated transition phrases</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Restate thesis with enhanced understanding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Synthesize existing arguments effectively</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Create a memorable final impression</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Use elevated, sophisticated language</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Complete Sample Conclusion */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4">Complete Sample Conclusion</h3>
            <div className="bg-white p-6 rounded-md border-l-4 border-l-primary">
              <p className="text-sm leading-relaxed mb-4">
                <span className="bg-blue-100 px-2 py-1 rounded">
                  Through its systematic deconstruction of linguistic freedom, '1984' ultimately reveals that the weaponization of language represents the most insidious form of totalitarian control—one that operates not through external force but through the corruption of thought itself.
                </span> <span className="bg-purple-100 px-2 py-1 rounded">
                  The interplay between Newspeak's cognitive restrictions, the Party's historical revisionism, and the psychological enforcement of thoughtcrime creates a comprehensive system that attacks human autonomy at its source: the capacity for independent thought.
                </span> <span className="bg-green-100 px-2 py-1 rounded">
                  In our contemporary era of information manipulation and digital surveillance, Orwell's warning resonates with chilling prescience, reminding us that the greatest threat to human freedom may not come from external oppression but from the gradual erosion of our ability to think critically and speak truthfully.
                </span> <span className="bg-amber-100 px-2 py-1 rounded">
                  Ultimately, '1984' serves as both a warning and a call to vigilance, illuminating the eternal struggle between those who would control truth and those who would preserve the fundamental human right to think, speak, and exist freely.
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium mb-2">Component Analysis:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="bg-blue-100 px-1 py-0.5 rounded text-xs">Thesis Restatement</span></li>
                    <li><span className="bg-purple-100 px-1 py-0.5 rounded text-xs">Argument Synthesis</span></li>
                    <li><span className="bg-green-100 px-1 py-0.5 rounded text-xs">Contemporary Relevance</span></li>
                    <li><span className="bg-amber-100 px-1 py-0.5 rounded text-xs">Universal Insight</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Strengths:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Sophisticated language and structure</li>
                    <li>• Clear connection to contemporary issues</li>
                    <li>• Memorable final impression</li>
                    <li>• Demonstrates analytical depth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Exercises */}
          <div className="bg-primary/5 p-6 rounded-lg mb-12">
            <h3 className="text-xl font-bold mb-4">Practice Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exercise 1: Thesis Restatement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Take your original thesis statement and rewrite it three different ways, each showing progressively deeper understanding.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Version 1: Simple rephrasing</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Version 2: Add analytical insight</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Version 3: Elevate language and complexity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exercise 2: Synthesis Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Write a paragraph that shows how your three main arguments work together to support your thesis.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Use linking phrases to show relationships</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Show cumulative effect of arguments</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">Demonstrate comprehensive understanding</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center bg-white p-8 rounded-lg border">
            <h3 className="text-xl font-bold mb-4">Master All Components</h3>
            <p className="text-muted-foreground mb-6">
              You've learned how to craft powerful conclusions. Now explore the other essential components of essay writing to create complete, compelling arguments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/knowledge-bank/essay-guide/introductions">
                <Button variant="outline" className="w-full sm:w-auto">
                  Review Introductions
                </Button>
              </Link>
              <Link href="/knowledge-bank/essay-guide/body-paragraphs">
                <Button variant="outline" className="w-full sm:w-auto">
                  Master Body Paragraphs
                </Button>
              </Link>
              <Link href="/knowledge-bank/essay-guide">
                <Button className="w-full sm:w-auto">
                  Back to Essay Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 