"use client"

import { BookCard } from "@/app/(routes)/books/book-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetSimilarBooksQuery } from "@/store/QueriesApi/recommendationApi"

interface SimilarBooksSectionProps {
  bookId: string
  limit?: number
}

export default function SimilarBooksSection({ bookId, limit = 6 }: SimilarBooksSectionProps) {
  const { data, isLoading, error } = useGetSimilarBooksQuery({ bookId, limit })

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

  if (error) {
    return <p>Error loading similar books</p>
  }

  if (!data?.similarBooks || data.similarBooks.length === 0) {
    return <p>No similar books found</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.similarBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

