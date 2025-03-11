"use client"

import type React from "react"

import type { Book } from "@/lib/data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/app/_comonents/cart/cart-provider"
import Image from "next/image"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(book)

  }

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <Link href={`/books/${book.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            // layout="responsive"
            width={300}
            height={200}
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-2 right-2">{book.category}</Badge>
        </div>
        <CardContent className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold line-clamp-1 mb-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          <div className="mt-auto">
            <p className="font-bold text-primary">{formatCurrency(book.price)}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 gap-2">
          <Button variant="default" size="sm" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Heart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}

