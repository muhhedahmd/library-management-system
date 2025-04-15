"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useGetTopRatedQuery } from "@/store/QueriesApi/booksApi"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setTopRatedPagination } from "@/store/Slices/paggnitionSlice"
import { Button } from "@/components/ui/button"
import BlurredImage from "../imageWithBlurHash"

interface TopRatedBooksProps {
  limit?: number
  categoryId?: string
  minRating?: number
}

export default function TopRatedBooks({ limit = 6, categoryId, minRating = 1.0 }: TopRatedBooksProps) {
  const LIMIT = limit
  const dispatch = useDispatch()
  const containerRef = useRef<HTMLDivElement>(null)

  const { page: skip } = useSelector((state: RootState) => state.pagination.PaginationTopRated)

  const {
    data: books,
    isLoading,
    isFetching,
  } = useGetTopRatedQuery({
    categoryId: categoryId,
    minRating: minRating,
    skip: skip,
    take: LIMIT,
  })

  // Reset pagination when component mounts or filters change

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  if (isLoading && skip === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="p-0">
            <div className="aspect-[2/3] relative">
              <Skeleton className="h-full w-full absolute" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!books || (books.data.length === 0 && skip === 0)) {
    return <div>No top-rated books found</div>
  }

  // Function to handle loading more data


  const handleLoadMore = async () => {

    if (!books?.hasMore || isLoading || isFetching || isLoadingMore) return

    setIsLoadingMore(true)

    try {
      dispatch(
        setTopRatedPagination({
          page: skip + 1,
          hasMore: books.hasMore
        }),
      )
    } finally {
      setIsLoadingMore(false)
    }
  }


  return (
    <div className="relative " ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {books &&
          books.data?.map((book) => {
            const BookThumbanil = book?.bookCovers[0]

            return <Card key={book.id} className="p-0 overflow-hidden group h-full">

              <div className="group relative aspect-square w-full overflow-hidden  ">
                <Link href={`/books/${book.id}`}>
                 {BookThumbanil &&
                  <BlurredImage
                  alt={BookThumbanil.name || ""}
                  className={"w-full h-full"}
                  height={BookThumbanil?.height || 0}
                  width={BookThumbanil?.width || 0}
                  imageUrl={BookThumbanil?.fileUrl}
                    quality={100}
                    blurhash={BookThumbanil?.blurHash || ""}
                    />
                  }
                </Link>
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md flex items-center">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{book.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <Link href={`/books/${book.id}`} className="hover:underline">
                  <h3 className="font-medium line-clamp-2">{book.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{book.author.name}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {book.totalRatings} {book.totalRatings === 1 ? "rating" : "ratings"}
                </div>
              </CardContent>
            </Card>
          })}
      </div>
      <div className="flex justify-center pt-4 pb-8">
        <Button
          onClick={handleLoadMore}
          disabled={!books?.hasMore || isLoading || isFetching || isLoadingMore}
          variant="outline"
          className="min-w-[150px]"
        >
          {isLoading || isFetching || isLoadingMore ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Load More"
          )}
        </Button>
      </div>

    </div>
  )
}
