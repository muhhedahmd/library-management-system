"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
// import FavoriteButton from "./favorite-button"

interface PopularBooksProps {
  limit?: number
  categoryId?: string
}

export default function PopularBooks({ limit = 6, categoryId }: PopularBooksProps) {
  const { data, isLoading, error } = useGetPopularBooksQuery({ limit, categoryId })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i}>
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

  if (error || !data?.popularBooks.length) {
    return <div>No books found</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.popularBooks.map((book) => (
        <Card key={book.id} className="overflow-hidden group">
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
              {/* <FavoriteButton bookId={book.id} /> */}
            </div>
          </div>
          <CardContent className="p-4">
            <Link href={`/books/${book.id}`} className="hover:underline">
              <h3 className="font-medium line-clamp-2">{book.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{book.author.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

