"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useGetNewReleasesQuery } from "@/store/QueriesApi/booksApi"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Button } from "@/components/ui/button"
import { setNewReleasesPagination } from "@/store/Slices/paggnitionSlice"

interface NewReleasesProps {
  limit?: number
  categoryId?: string
  days?: number
}

export default function NewReleases({ limit = 6, categoryId }: NewReleasesProps) {
  const LIMIT = 10
  const dispatch = useDispatch()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { page: skip } = useSelector((state: RootState) => state.pagination.PaginationNewReleases)

  const {
    data: books,
    isLoading,
    isFetching,
  } = useGetNewReleasesQuery({
    categoryId: categoryId || "",
    skip: skip, // Multiply by LIMIT to get proper pagination
    take: LIMIT,
  })

  // Reset pagination when component mounts or category changes
  useEffect(() => {
    dispatch(
      setNewReleasesPagination({
        page: 0,
        hasMore: true,
      }),
    )
  }, [dispatch, categoryId])

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

  if (books && books.data && books.data.length === 0 && skip === 0) {
    return <div>No new releases found</div>
  }

  const handleLoadMore = async () => {
    if (!books?.hasMore || isLoading || isFetching || isLoadingMore) return

    setIsLoadingMore(true)

    try {
      dispatch(
        setNewReleasesPagination({
          page: skip + 1,
          hasMore: books?.hasMore || false,
        }),
      )
    } finally {
      setIsLoadingMore(false)
    }
  }
  
  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {books && books?.data?.length && books?.data?.map((book) => (
        <Card key={book.id} className="p-0 overflow-hidden group">
          <div className="aspect-[2/3] relative">
            <Link href={`/books/${book.id}`}>
              <Image
                src={book.bookCovers[0]?.fileUrl || "/placeholder.svg?height=300&width=200"}
                alt={book.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
              >
                New
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <Link href={`/books/${book.id}`} className="hover:underline">
              <h3 className="font-medium line-clamp-2">{book.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{book.author.name}</p>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(book.publishedAt || new Date()), { addSuffix: true })}</span>
            </div>
          </CardContent>
        </Card>
          ))}
      </div>

      {books?.hasMore && (

        <div className="flex justify-center pt-4 pb-8">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading || isFetching || isLoadingMore}
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
      )}
    </div>
  )
}
