"use client"

import { useState, useEffect } from "react"

import type { Book } from "@/lib/data"
import { books as allBooks } from "@/lib/data"
import { useSearchParams } from "next/navigation"
import { BookCard } from "./book-card"

export default function BookGrid() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Simulate API call with a small delay
    setLoading(true)
    const timer = setTimeout(() => {
      let filteredBooks = [...allBooks]

      // Apply category filter
      const category = searchParams.get("category")
      if (category && category !== "all") {
        filteredBooks = filteredBooks.filter((book) => book.category === category)
      }

      // Apply author filter
      const author = searchParams.get("author")
      if (author && author !== "all") {
        filteredBooks = filteredBooks.filter((book) => book.author === author)
      }

      // Apply publisher filter
      const publisher = searchParams.get("publisher")
      if (publisher && publisher !== "all") {
        filteredBooks = filteredBooks.filter((book) => book.publisher === publisher)
      }

      // Apply price filter
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      if (minPrice) {
        filteredBooks = filteredBooks.filter((book) => book.price >= Number.parseFloat(minPrice))
      }
      if (maxPrice) {
        filteredBooks = filteredBooks.filter((book) => book.price <= Number.parseFloat(maxPrice))
      }

      // Apply sort
      const sort = searchParams.get("sort")
      if (sort) {
        switch (sort) {
          case "title-asc":
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
            break
          case "title-desc":
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title))
            break
          case "price-asc":
            filteredBooks.sort((a, b) => a.price - b.price)
            break
          case "price-desc":
            filteredBooks.sort((a, b) => b.price - a.price)
            break
          case "date-asc":
            filteredBooks.sort((a, b) => new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime())
            break
          case "date-desc":
            filteredBooks.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime())
            break
          case "rating-desc":
            filteredBooks.sort((a, b) => b.rating - a.rating)
            break
        }
      }

      setBooks(filteredBooks)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[2/3] bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No books found</h2>
        <p className="text-muted-foreground">Try adjusting your filters to find what you re looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

