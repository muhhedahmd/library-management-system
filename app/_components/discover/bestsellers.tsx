"use client"

import {  useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Loader2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useGetBestsellersQuery } from "@/store/QueriesApi/booksApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setBestSellersPagination } from "@/store/Slices/paggnitionSlice"
import { Button } from "@/components/ui/button"

interface BestsellersProps {
  limit?: number
  categoryId?: string
}

export default function Bestsellers({ limit = 12, categoryId }: BestsellersProps) {
  const LIMIT = limit
  const dispatch = useDispatch()
  const containerRef = useRef<HTMLDivElement>(null)

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleLoadMore = async () => {
     if (!books?.hasMore || isLoading || isFetching || isLoadingMore) return
 
     setIsLoadingMore(true)
 
     try {
      dispatch(
        setBestSellersPagination({
          page: skip + 1,
          hasMore: books.hasMore || false
        })
      )
     } finally {
       setIsLoadingMore(false)
     }
   }
  const { page: skip } = useSelector(
    (state: RootState) => state.pagination.PaginationBestSellers
  )

  const {
    data: books,
    isLoading,
    isFetching
  } = useGetBestsellersQuery({
    take: LIMIT,
    skip: skip ,
    categoryId
  })

  // Reset pagination when component mounts or category changes

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
    return <div>No bestsellers found</div>
  }

  // Calculate the total index for badges
  const getBookIndex = (localIndex: number) => skip * LIMIT + localIndex;

  // Function to handle loading more data
  return (
    <div className="relative" ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    
          {books && books.data.map((book, index) => {
            const globalIndex = getBookIndex(index);
            return (
              <Card key={book.id} className="overflow-hidden p-0 group h-full">
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
                    {globalIndex < 3 ? (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900">
                        <Award className="h-3 w-3 mr-1" />#{globalIndex + 1} Bestseller
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link href={`/books/${book.id}`} className="hover:underline">
                    <h3 className="font-medium line-clamp-2">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{book.author.name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{book.category.name}</span>
                    <span className="font-medium">{book?.purchase?.length || ""} sold</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
