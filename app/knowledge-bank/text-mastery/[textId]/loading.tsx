import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Heart, Quote } from "lucide-react"

export default function TextExploreLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            
          </div>
        </div>
      </header>

      <main className="container px-4 pb-16 mx-auto">
        {/* Text header with cover image */}
        <div className="flex flex-col items-center gap-6 py-8 mt-4 text-center md:flex-row md:text-left md:gap-8">
          <Skeleton className="w-36 h-52 md:w-44 md:h-64" />
          <div className="flex-1">
            <Skeleton className="w-20 h-5 mb-2" />
            <Skeleton className="w-64 h-8 mb-2" />
            <Skeleton className="w-40 h-6 mb-3" />
            <Skeleton className="w-full h-20 max-w-2xl" />

            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-24 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs defaultValue="context" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="context" className="flex gap-2 items-center" disabled>
              <BookOpen size={18} />
            Study Lessons
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex gap-2 items-center" disabled>
              <Quote size={18} />
              Quote Bank
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex gap-2 items-center" disabled>
              <Heart />
              <Heart size={18} />
              Favorites 
            </TabsTrigger>
          </TabsList>

          <TabsContent value="context">
            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="w-32 h-6" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="w-64 h-4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Themes Section */}
            <section className="mb-12">
              <Skeleton className="w-48 h-8 mb-6" />

              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16" />
                ))}
              </div>
            </section>

            {/* More skeleton sections */}
            {[...Array(3)].map((_, i) => (
              <section key={i} className="mb-12">
                <Skeleton className="w-48 h-8 mb-6" />
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="w-48 h-6" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="w-64 h-4" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="w-full h-24" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
