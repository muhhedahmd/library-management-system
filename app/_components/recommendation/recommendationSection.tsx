"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetRecommendationsQuery,
  useGetCollaborativeRecommendationsQuery,
  useGetPreferenceBasedRecommendationsQuery,
  useGetReadingBasedRecommendationsQuery,
  useGetTrendingBooksQuery,
} from "@/store/QueriesApi/recommendationApi"
import { BookCard } from "@/app/(routes)/books/book-card"

export default function RecommendationSection() {
  const [limit, setLimit] = useState(6)

  const { data: mainRecommendations, isLoading: isLoadingMain } = useGetRecommendationsQuery()
  const { data: collaborative, isLoading: isLoadingCollaborative } = useGetCollaborativeRecommendationsQuery({ limit })
  const { data: preferenceBased, isLoading: isLoadingPreference } = useGetPreferenceBasedRecommendationsQuery({ limit })
  const { data: readingBased, isLoading: isLoadingReading } = useGetReadingBasedRecommendationsQuery({ limit })
  const { data: trending, isLoading: isLoadingTrending } = useGetTrendingBooksQuery({ limit })

  console.log({
    readingBased

  })
  const loadMore = () => {
    setLimit((prev) => prev + 6)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderBookGrid = (books: any[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )
    }

    if (!books || books.length === 0) {
      return <p className="text-center py-10">No books found</p>
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">All Recommendations</TabsTrigger>
        <TabsTrigger value="collaborative">Collaborative</TabsTrigger>
        <TabsTrigger value="preference">Preference Based</TabsTrigger>
        <TabsTrigger value="reading">Reading Based</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        {renderBookGrid(mainRecommendations?.books, isLoadingMain)}
      </TabsContent>

      <TabsContent value="collaborative" className="mt-6">
        {renderBookGrid(collaborative?.recommendations, isLoadingCollaborative)}
      </TabsContent>

      <TabsContent value="preference" className="mt-6">
        {renderBookGrid(preferenceBased?.recommendations, isLoadingPreference)}
      </TabsContent>

      <TabsContent value="reading" className="mt-6">
        {renderBookGrid(readingBased?.recommendations, isLoadingReading)}
      </TabsContent>

      <TabsContent value="trending" className="mt-6">
        {renderBookGrid(trending?.trendingBooks, isLoadingTrending)}
      </TabsContent>

      <div className="mt-8 text-center">
        <Button onClick={loadMore} variant="outline">
          Load More
        </Button>
      </div>
    </Tabs>
  )
}

