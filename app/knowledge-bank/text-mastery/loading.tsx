import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section Loading State */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-64 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />

          {/* Search and Filter Loading */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-10 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Most Popular Section Loading */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingTextCard key={i} />
          ))}
        </div>
      </div>

      {/* Main Content Loading */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingTextCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingTextCard() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}
