"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import type { Book } from "@/lib/data"
import { books } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Star } from "lucide-react"
import { useCart } from "@/app/_comonents/cart/cart-provider"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
//   const { toast } = useToast()

  useEffect(() => {
    // Simulate API call with a small delay
    const timer = setTimeout(() => {
      const foundBook = books.find((b) => b.id === id)
      setBook(foundBook || null)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [id])

  const handleAddToCart = () => {
    if (book) {
      addToCart(book)
    //   toast({
    //     title: "Added to cart",
    //     description: `${book.title} has been added to your cart.`,
    //   })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 h-96 bg-gray-200 rounded"></div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-32 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Book not found</h1>
        <p>Sorry, the book you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="w-full md:w-1/3">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
            <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Book Details */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl mb-2">by {book.author}</p>

          <div className="flex items-center mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({book.reviewCount} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{book.category}</Badge>
            <Badge variant="outline">{book.publisher}</Badge>
            <Badge variant="secondary">{book.publicationDate}</Badge>
          </div>

          <div className="text-2xl font-bold mb-4 text-primary">{formatCurrency(book.price)}</div>

          <Separator className="my-4" />

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{book.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              Add to Wishlist
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">ISBN</p>
              <p>{book.isbn}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pages</p>
              <p>{book.pages}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Language</p>
              <p>{book.language}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Format</p>
              <p>{book.format}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

