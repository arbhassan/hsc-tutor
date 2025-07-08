"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookText,
  Target,
  CheckCircle,
  Award,
  Users,
  Lightbulb,
  FileText,
  Star,
  BookOpen,
  Quote,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  Clipboard,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBookData } from "@/lib/data/book-data"

const getText = (textId: string) => {
  return getBookData(textId)
}

export default function HSCRubricConnections({ params }: { params: Promise<{ textId: string }> }) {
  const { textId } = use(params)
  const text = getText(textId)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBand, setSelectedBand] = useState<string>("all")
  const [selectedModule, setSelectedModule] = useState<string>("common")

  if (!text || text.title === "Book Not Found") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <p className="text-muted-foreground">
            The book you are looking for does not exist or is not yet available.
          </p>
          <Button asChild className="mt-4">
            <Link href="/knowledge-bank/text-mastery">Go Back</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Mock HSC rubric data - in real implementation, this would come from a database
  const hscRubricData = {
    modules: [
      {
        id: "common",
        title: "Common Module: Texts and Human Experiences",
        outcomes: [
          "EN12-1: Independently responds to, composes and evaluates a range of complex texts for understanding, interpretation, critical analysis, imaginative expression and pleasure",
          "EN12-2: Uses, evaluates and justifies processes, strategies and knowledge required to construct meaning from and compose texts",
          "EN12-3: Critically analyses and uses language forms, features and structures of texts",
          "EN12-4: Adapts and applies knowledge, skills and understanding of language concepts and literary devices",
          "EN12-5: Thinks imaginatively, creatively, interpretively and critically",
          "EN12-6: Investigates and explains the relationships between texts",
          "EN12-7: Evaluates the diverse ways texts can represent personal and public worlds",
          "EN12-8: Explains and evaluates nuanced cultural assumptions and values in texts",
          "EN12-9: Reflects on, evaluates and monitors own learning and refines individual and collaborative processes"
        ],
        criteria: [
          {
            id: "understanding",
            title: "Understanding of texts and human experiences",
            bands: {
              "A": "Demonstrates extensive understanding of how texts represent individual and collective human experiences",
              "B": "Demonstrates clear understanding of how texts represent individual and collective human experiences", 
              "C": "Demonstrates understanding of how texts represent individual and collective human experiences",
              "D": "Demonstrates limited understanding of how texts represent individual and collective human experiences",
              "E": "Demonstrates minimal understanding of how texts represent individual and collective human experiences"
            }
          },
          {
            id: "analysis",
            title: "Analysis of language forms and features",
            bands: {
              "A": "Skilfully analyses a range of language forms and features in texts",
              "B": "Effectively analyses language forms and features in texts",
              "C": "Analyses language forms and features in texts",
              "D": "Describes language forms and features in texts",
              "E": "Identifies language forms and features in texts"
            }
          },
          {
            id: "synthesis",
            title: "Synthesis and evaluation",
            bands: {
              "A": "Insightfully evaluates how texts represent human experiences through content, language and form",
              "B": "Evaluates how texts represent human experiences through content, language and form",
              "C": "Explains how texts represent human experiences through content, language and form",
              "D": "Describes how texts represent human experiences through content, language and form",
              "E": "Identifies how texts represent human experiences through content, language and form"
            }
          }
        ]
      }
    ]
  }

  const filteredConnections = text.rubricConnections.filter(connection =>
    connection.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href={`/knowledge-bank/text-mastery/${textId}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} />
              <span>Back to {text.title}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                HSC Module A
              </Badge>
              <Badge variant="outline" className="text-xs">
                {text.rubricConnections.length} Connections
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Page header */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-50 rounded-full">
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HSC Rubric Connections</h1>
          <p className="text-xl text-gray-600 mb-4">{text.title}</p>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Understand how {text.title} aligns with HSC assessment criteria and learning outcomes. 
            This detailed analysis will help you master the text for high-level performance in exams and assessments.
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={18} />
                Search Rubric Connections
              </CardTitle>
              <CardDescription>
                Find specific rubric criteria and their textual connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Select value={selectedBand} onValueChange={setSelectedBand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Bands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bands</SelectItem>
                    <SelectItem value="A">Band A</SelectItem>
                    <SelectItem value="B">Band B</SelectItem>
                    <SelectItem value="C">Band C</SelectItem>
                    <SelectItem value="D">Band D</SelectItem>
                    <SelectItem value="E">Band E</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Common Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common Module</SelectItem>
                    <SelectItem value="moduleA">Module A</SelectItem>
                    <SelectItem value="moduleB">Module B</SelectItem>
                    <SelectItem value="moduleC">Module C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HSC Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                HSC Assessment Overview
              </CardTitle>
              <CardDescription>
                How this text supports achievement across HSC band descriptors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Learning Outcomes</h3>
                  <p className="text-sm text-gray-600">
                    Addresses 9 key HSC English outcomes through sophisticated textual analysis
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Assessment Criteria</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive coverage of understanding, analysis, and synthesis requirements
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Band Achievement</h3>
                  <p className="text-sm text-gray-600">
                    Strategic pathways to achieve Band 5 and Band 6 performance levels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rubric Criteria Analysis */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Criteria Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of how {text.title} supports each HSC assessment criterion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="understanding" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="understanding">Understanding</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="synthesis">Synthesis</TabsTrigger>
                </TabsList>
                
                {hscRubricData.modules[0].criteria.map((criterion) => (
                  <TabsContent key={criterion.id} value={criterion.id} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">{criterion.title}</h4>
                        <div className="space-y-4">
                          {Object.entries(criterion.bands).map(([band, description]) => (
                            <Card key={band} className={`p-4 ${band === 'A' ? 'border-green-500 bg-green-50' : band === 'B' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                              <div className="flex items-start gap-3">
                                <Badge variant={band === 'A' ? 'default' : band === 'B' ? 'secondary' : 'outline'} className="font-semibold">
                                  Band {band}
                                </Badge>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 mb-3">{description}</p>
                                  <div className="bg-white/70 p-3 rounded-md">
                                    <h5 className="font-medium text-sm mb-1">How {text.title} supports this band:</h5>
                                    <p className="text-xs text-gray-600">
                                      {criterion.id === 'understanding' && 
                                        "The text's complex exploration of human nature, morality, and social hierarchies provides rich material for demonstrating sophisticated understanding of individual and collective experiences."
                                      }
                                      {criterion.id === 'analysis' && 
                                        "The author's use of symbolism, metaphor, and characterization techniques offers multiple layers for detailed language analysis and interpretation."
                                      }
                                      {criterion.id === 'synthesis' && 
                                        "The text's thematic depth and literary craftsmanship enable students to make insightful connections between form, content, and meaning."
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Specific Rubric Connections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Specific Rubric Connections</h2>
          
          {filteredConnections.map((connection, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {connection.concept}
                </CardTitle>
                <CardDescription className="text-base">
                  {connection.explanation}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="explanation" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                    <TabsTrigger value="evidence">Evidence</TabsTrigger>
                    <TabsTrigger value="application">Application</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="explanation" className="mt-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Rubric Connection</h4>
                        <p className="text-gray-700 leading-relaxed">{connection.explanation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Why This Matters</h4>
                        <p className="text-gray-700 leading-relaxed">
                          This connection demonstrates sophisticated understanding of how texts explore the human condition. 
                          Students who can articulate these connections show the analytical depth required for high-band performance.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="evidence" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-3">Textual Evidence</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{connection.textConnections}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Supporting Quotes</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {text.quotes.slice(0, 2).map((quote, quoteIdx) => (
                            <Card key={quoteIdx} className="p-3">
                              <blockquote className="text-sm italic mb-2">
                                "{quote.text.length > 80 ? `${quote.text.substring(0, 80)}...` : quote.text}"
                              </blockquote>
                              <div className="text-xs text-gray-500">
                                {quote.chapter} - {quote.technique}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="application" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-3">How to Apply This in Essays</h4>
                      <div className="space-y-3">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Introduction</h5>
                          <p className="text-sm text-gray-600">
                            Use this connection to establish your thesis and demonstrate sophisticated understanding from the outset.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Body Paragraphs</h5>
                          <p className="text-sm text-gray-600">
                            Integrate this concept with specific textual analysis to support your arguments with concrete evidence.
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Conclusion</h5>
                          <p className="text-sm text-gray-600">
                            Synthesize this connection with other themes to demonstrate the text's broader significance.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assessment" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-3">Assessment Potential</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            Band 5-6 Indicators
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Sophisticated analysis of textual features</li>
                            <li>• Insightful connections to human experience</li>
                            <li>• Nuanced understanding of context</li>
                            <li>• Skilful use of metalanguage</li>
                          </ul>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            Common Question Types
                          </h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Text and human experience essays</li>
                            <li>• Comparative analysis tasks</li>
                            <li>• Creative response with reflection</li>
                            <li>• Unseen text analysis</li>
                          </ul>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Outcomes Mapping */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                HSC Learning Outcomes Coverage
              </CardTitle>
              <CardDescription>
                How {text.title} addresses each HSC English learning outcome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hscRubricData.modules[0].outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 mb-1">{outcome}</p>
                      <div className="flex justify-between items-center">
                        <Progress value={85} className="w-32 h-2" />
                        <Badge variant="secondary" className="text-xs">Strongly Supported</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 