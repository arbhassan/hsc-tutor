"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Globe,
  User,
  BookText,
  Clock,
  Search,
  Calendar,
  Map,
  Users,
  Brain,
  Scroll,
  Crown,
  Building,
  Feather,
  Heart,
  Zap,
  Eye,
  Target,
  BookOpen,
  Library,
  GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { getBookData } from "@/lib/data/book-data"

const getText = (textId: string) => {
  return getBookData(textId)
}

export default function ContextInformation({ params }: { params: Promise<{ textId: string }> }) {
  const { textId } = use(params)
  const text = getText(textId)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContext, setSelectedContext] = useState<string>("all")

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

  // Enhanced context data with more detailed information
  const contextSections = [
    {
      id: "historical",
      title: "Historical Context",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-blue-50",
      data: text.contexts.historical,
      expanded: {
        timeline: [
          { year: "1800s", event: "Industrial Revolution transforms society", impact: "Major social and economic changes affect literature" },
          { year: "1850s", event: "Rise of realism in literature", impact: "Authors begin focusing on everyday life and social issues" },
          { year: "1860s", event: "Social reform movements gain momentum", impact: "Literature becomes vehicle for social commentary" },
        ],
        majorEvents: [
          { event: "Political upheavals", description: "Changes in government and social structures" },
          { event: "Economic transformations", description: "Shift from agricultural to industrial economy" },
          { event: "Social movements", description: "Campaigns for rights and social justice" },
        ],
        influence: "These historical conditions directly influenced the themes, characters, and social commentary present in the text."
      }
    },
    {
      id: "biographical",
      title: "Biographical Context",
      icon: <User className="h-5 w-5" />,
      color: "bg-purple-50",
      data: text.contexts.biographical,
      expanded: {
        lifeStages: [
          { stage: "Early Life", description: "Formative experiences that shaped worldview" },
          { stage: "Career Development", description: "Professional experiences and literary influences" },
          { stage: "Major Works Period", description: "Time of greatest creative output and recognition" },
        ],
        personalInfluences: [
          { influence: "Family background", impact: "Shaped values and perspectives" },
          { influence: "Educational experiences", impact: "Developed intellectual framework" },
          { influence: "Professional relationships", impact: "Influenced literary style and themes" },
        ],
        connection: "The author's personal experiences directly inform the character development and thematic concerns in the text."
      }
    },
    {
      id: "cultural",
      title: "Cultural Context",
      icon: <Users className="h-5 w-5" />,
      color: "bg-amber-50",
      data: text.contexts.cultural,
      expanded: {
        socialStructures: [
          { structure: "Class hierarchies", description: "Rigid social divisions affecting character interactions" },
          { structure: "Gender roles", description: "Societal expectations shaping character behavior" },
          { structure: "Family structures", description: "Traditional family units and their dynamics" },
        ],
        culturalMovements: [
          { movement: "Romanticism", description: "Emphasis on emotion and individual experience" },
          { movement: "Realism", description: "Focus on authentic representation of life" },
          { movement: "Social reform", description: "Movements for social change and justice" },
        ],
        impact: "Cultural norms and values of the period are both reflected and challenged in the text."
      }
    },
    {
      id: "philosophical",
      title: "Philosophical Context",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-green-50",
      data: text.contexts.philosophical,
      expanded: {
        philosophicalSchools: [
          { school: "Utilitarianism", description: "Greatest good for greatest number" },
          { school: "Existentialism", description: "Individual existence and choice" },
          { school: "Humanism", description: "Dignity and worth of human beings" },
        ],
        keyThinkers: [
          { thinker: "John Stuart Mill", contribution: "Individual liberty and social progress" },
          { thinker: "Charles Darwin", contribution: "Evolution and natural selection" },
          { thinker: "Karl Marx", contribution: "Class struggle and social change" },
        ],
        influence: "Philosophical debates of the era permeate the text's exploration of human nature, morality, and social responsibility."
      }
    }
  ]

  const filteredSections = contextSections.filter(section =>
    selectedContext === "all" || section.id === selectedContext
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
                4 Context Areas
              </Badge>
              <Badge variant="outline" className="text-xs">
                {text.publicationYear}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Page header */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-50 rounded-full">
              <Globe className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Context Information</h1>
          <p className="text-xl text-gray-600 mb-4">{text.title}</p>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Dive deep into the historical, biographical, cultural, and philosophical contexts that shaped {text.title}. 
            Understanding these contexts is crucial for sophisticated textual analysis and HSC success.
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={18} />
                Explore Context Areas
              </CardTitle>
              <CardDescription>
                Search and filter different contextual aspects of the text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Search context information..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    variant={selectedContext === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContext("all")}
                  >
                    All Contexts
                  </Button>
                  <Button
                    variant={selectedContext === "historical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContext("historical")}
                  >
                    Historical
                  </Button>
                  <Button
                    variant={selectedContext === "biographical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContext("biographical")}
                  >
                    Biographical
                  </Button>
                  <Button
                    variant={selectedContext === "cultural" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContext("cultural")}
                  >
                    Cultural
                  </Button>
                  <Button
                    variant={selectedContext === "philosophical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContext("philosophical")}
                  >
                    Philosophical
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Contextual Overview</CardTitle>
              <CardDescription>
                How different contexts interconnect to shape meaning in {text.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contextSections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedContext === section.id || selectedContext === "all"
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedContext(section.id)}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-full mr-3 ${section.color}`}>
                        {section.icon}
                      </div>
                      <h3 className="font-semibold text-sm">{section.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{section.data.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {section.data.keyPoints.length} key points
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Context Analysis */}
        <div className="space-y-8">
          {filteredSections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className={`${section.color} border-b`}>
                <CardTitle className="flex items-center text-2xl">
                  <div className="p-2 bg-white rounded-full mr-3">
                    {section.icon}
                  </div>
                  {section.data.title}
                </CardTitle>
                <CardDescription className="text-base text-gray-700">
                  {section.data.content}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                    <TabsTrigger value="connections">Text Connections</TabsTrigger>
                    <TabsTrigger value="significance">Significance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Key Points</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {section.data.keyPoints.map((point, idx) => (
                            <Card key={idx} className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-xs">{idx + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700">{point}</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="detailed" className="mt-6">
                    <div className="space-y-6">
                      {section.id === "historical" && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Historical Timeline
                          </h4>
                          <div className="space-y-4">
                            {section.expanded.timeline.map((item, idx) => (
                              <Card key={idx} className="p-4">
                                <div className="flex items-start gap-4">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {item.year}
                                  </Badge>
                                  <div className="flex-1">
                                    <h5 className="font-medium mb-1">{item.event}</h5>
                                    <p className="text-sm text-gray-600">{item.impact}</p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {section.id === "biographical" && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Life Stages and Influences
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-3">Life Stages</h5>
                              <div className="space-y-2">
                                {section.expanded.lifeStages.map((stage, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{stage.stage}</h6>
                                    <p className="text-xs text-gray-600">{stage.description}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-3">Personal Influences</h5>
                              <div className="space-y-2">
                                {section.expanded.personalInfluences.map((influence, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{influence.influence}</h6>
                                    <p className="text-xs text-gray-600">{influence.impact}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.id === "cultural" && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Cultural Landscape
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-3">Social Structures</h5>
                              <div className="space-y-2">
                                {section.expanded.socialStructures.map((structure, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{structure.structure}</h6>
                                    <p className="text-xs text-gray-600">{structure.description}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-3">Cultural Movements</h5>
                              <div className="space-y-2">
                                {section.expanded.culturalMovements.map((movement, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{movement.movement}</h6>
                                    <p className="text-xs text-gray-600">{movement.description}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.id === "philosophical" && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Philosophical Framework
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-3">Philosophical Schools</h5>
                              <div className="space-y-2">
                                {section.expanded.philosophicalSchools.map((school, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{school.school}</h6>
                                    <p className="text-xs text-gray-600">{school.description}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-3">Key Thinkers</h5>
                              <div className="space-y-2">
                                {section.expanded.keyThinkers.map((thinker, idx) => (
                                  <Card key={idx} className="p-3">
                                    <h6 className="font-medium text-sm">{thinker.thinker}</h6>
                                    <p className="text-xs text-gray-600">{thinker.contribution}</p>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="connections" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">How This Context Shapes the Text</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 leading-relaxed">
                            {section.expanded.influence || section.expanded.connection || section.expanded.impact}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Related Quotes</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {text.quotes.slice(0, 4).map((quote, idx) => (
                            <Card key={idx} className="p-4">
                              <blockquote className="text-sm italic mb-2">
                                "{quote.text.length > 100 ? `${quote.text.substring(0, 100)}...` : quote.text}"
                              </blockquote>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{quote.chapter}</span>
                                <Badge variant="outline" className="text-xs">
                                  {quote.technique}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="significance" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Why This Context Matters</h4>
                        <div className="space-y-4">
                          <Card className="p-4">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              For HSC Analysis
                            </h5>
                            <p className="text-sm text-gray-600">
                              Understanding this context allows for sophisticated analysis that demonstrates 
                              awareness of how texts are shaped by their time and place of creation.
                            </p>
                          </Card>
                          
                          <Card className="p-4">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              For Character Understanding
                            </h5>
                            <p className="text-sm text-gray-600">
                              This context explains character motivations, conflicts, and development 
                              within the specific social and intellectual framework of the period.
                            </p>
                          </Card>
                          
                          <Card className="p-4">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              For Thematic Analysis
                            </h5>
                            <p className="text-sm text-gray-600">
                              Contextual knowledge deepens understanding of how themes reflect, 
                              challenge, or transcend the concerns of their historical moment.
                            </p>
                          </Card>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Contemporary Relevance</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700 leading-relaxed">
                            While rooted in its specific historical moment, this context remains relevant today 
                            because it addresses universal human concerns about society, identity, and moral responsibility 
                            that continue to resonate with modern audiences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Integration */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Integrated Timeline
              </CardTitle>
              <CardDescription>
                Key events and influences arranged chronologically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {text.timelineEvents.map((event, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <div className="ml-12">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {event.year}
                          </Badge>
                          <Badge variant={event.type === "World" ? "secondary" : "default"} className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 