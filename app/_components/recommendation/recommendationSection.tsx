"use client"

import { useState } from "react"
import { Tabs, TabsContent,  } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetRecommendationsQuery,
  useGetCollaborativeRecommendationsQuery,
  useGetPreferenceBasedRecommendationsQuery,
  useGetReadingBasedRecommendationsQuery,
  useGetTrendingBooksQuery,
} from "@/store/QueriesApi/recommendationApi"
import { BookCard } from "@/app/(routes)/books/book-card"
import RecommendationSideBar from "./RecommendationSideBar"

export default function RecommendationSection() {
  const [limit, setLimit] = useState(6)

  const [MethodList, setMethodList] = useState<
    "rating" | "favorite" | "category" | "author" | "hybrid"
  >("category")
  const { data: mainRecommendations, isLoading: isLoadingMain } = useGetRecommendationsQuery({
    limit,
    method: MethodList
  })
  const { data: collaborative, isLoading: isLoadingCollaborative } = useGetCollaborativeRecommendationsQuery({ limit })
  const { data: preferenceBased, isLoading: isLoadingPreference } = useGetPreferenceBasedRecommendationsQuery({ limit })
  const { data: readingBased, isLoading: isLoadingReading } = useGetReadingBasedRecommendationsQuery({ limit })
  const { data: trending, isLoading: isLoadingTrending } = useGetTrendingBooksQuery({ limit })


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
      // 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">

        {books.map((book) => (
          <div className="  " key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3 items-start">
      <Tabs onValueChange={(value) => {
        if (value === "rating" || value === "favorite" || value === "category" || value === "author" || value === "hybrid") {
          setMethodList(value as "rating" | "favorite" | "category" | "author" | "hybrid")
        }


      }} defaultValue="all" className="w-full flex ">
        <div className="flex flex-row w-full gap-3">

          <RecommendationSideBar
          isLoadingMain={isLoadingMain}
          isLoadingCollaborative={isLoadingCollaborative}
          isLoadingPreference={isLoadingPreference}
          isLoadingReading={isLoadingReading}
          isLoadingTrending={isLoadingTrending}

          loadMore={loadMore} />



          <div className="  container  ">

            <TabsContent value="all" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="rating" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="favorite" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="category" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="author" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="hybrid" className="mt-0">
              {renderBookGrid(mainRecommendations?.recommendations, isLoadingMain)}
            </TabsContent>

            <TabsContent value="collaborative" className="mt-0">
              {renderBookGrid(collaborative?.recommendations, isLoadingCollaborative)}
            </TabsContent>

            <TabsContent value="preference" className="mt-0">
              {renderBookGrid(preferenceBased?.recommendations, isLoadingPreference)}
            </TabsContent>

            <TabsContent value="reading" className="mt-0">
              {renderBookGrid(readingBased?.recommendations, isLoadingReading)}
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              {renderBookGrid(trending?.recommendations, isLoadingTrending)}
            </TabsContent>
            

          </div>
        </div>

      </Tabs>
    </div>
  )
}

