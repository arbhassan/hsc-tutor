import type React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Clock, Globe, Lightbulb, History, Link, FileText } from "lucide-react"

interface ContextSummaryProps {
  textId: string
}

const ContextSummary: React.FC<ContextSummaryProps> = ({ textId }) => {
  // This would come from an API in a real application
  const textData = getTextData(textId)

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      {/* Text Header */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <Image
          src={textData.coverImage || "/placeholder.svg"}
          alt={`${textData.title} cover`}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{textData.title}</h1>
          <p className="text-xl mb-2">by {textData.author}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {textData.genres.map((genre, index) => (
              <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-gray-700">{textData.introduction}</p>
        </CardContent>
      </Card>

      {/* Publication Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-emerald-600" />
              <h2 className="text-xl font-semibold">Publication Context</h2>
            </div>
            <p className="text-gray-700 mb-4">{textData.publicationContext}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Published: {textData.publicationDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Historical Context */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-amber-600" />
              <h2 className="text-xl font-semibold">Historical Context</h2>
            </div>
            <p className="text-gray-700">{textData.historicalContext}</p>
          </CardContent>
        </Card>
      </div>

      {/* Core Themes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-yellow-500" />
            <h2 className="text-xl font-semibold">Core Themes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textData.themes.map((theme, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                <p className="text-gray-600 text-sm">{theme.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* HSC Rubric Connections */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" />
            <h2 className="text-xl font-semibold">HSC Rubric Connections</h2>
          </div>
          <div className="space-y-4">
            {textData.hscConnections.map((connection, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold">{connection.module}</h3>
                <p className="text-gray-700 mt-1">{connection.relevance}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-purple-600" />
            <h2 className="text-xl font-semibold">Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {textData.timeline.map((event, index) => (
                <div key={index} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-500">
                    <span className="text-xs font-bold text-purple-700">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contemporary Connections */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Link className="text-teal-600" />
            <h2 className="text-xl font-semibold">Contemporary Connections</h2>
          </div>
          <div className="space-y-4">
            {textData.contemporaryConnections.map((connection, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{connection.title}</h3>
                <p className="text-gray-700">{connection.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-indigo-600" />
            <h2 className="text-xl font-semibold">Additional Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textData.additionalResources.map((resource, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-1">{getResourceIcon(resource.type)}</div>
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get the appropriate icon for resource type
function getResourceIcon(type: string) {
  switch (type.toLowerCase()) {
    case "book":
      return <BookOpen size={18} className="text-indigo-500" />
    case "website":
      return <Globe size={18} className="text-blue-500" />
    case "video":
      return <FileText size={18} className="text-red-500" />
    default:
      return <FileText size={18} className="text-gray-500" />
  }
}

// Helper function to get text data based on textId
function getTextData(textId: string) {
  // This would come from an API in a real application
  const texts = {
    '1984': {
      title: '1984',
      author: 'George Orwell',
      coverImage: '/big-brother-eye.png',
      genres: ['Dystopian', 'Political Fiction', 'Social Science Fiction'],
      introduction: '1984 is a dystopian novel by George Orwell published in 1949. The novel is set in Airstrip One (formerly known as Great Britain), a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.',
      publicationContext: 'Published in 1949, shortly after World War II, the novel reflects Orwell\'s concerns about totalitarianism, particularly Stalinism and the rise of fascism in Europe.',
      publicationDate: 'June 8, 1949',
      historicalContext: 'Written during the early Cold War period, the novel was influenced by the totalitarian regimes of Nazi Germany and Stalinist Russia. Orwell was deeply concerned about the threat to individual freedom posed by these regimes.',
      themes: [
        {\
          name: 'Totalitarianism
