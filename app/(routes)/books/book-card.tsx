"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, ImageIcon, LucideView } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/app/_components/cart/cart-provider"
import { BooksRes } from "@/Types"
import BlurredImage from "../../_components/imageWithBlurHash"
import { StarRating } from "../starRatting/starRatting"
import { useRouter } from "next/navigation"
import { useGetIsBookFavQuery, useToggleBookFavMutation } from "@/store/QueriesApi/booksApi"
import { cn } from "@/lib/utils"

interface BookCardProps {
  book: BooksRes
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart()
  const router = useRouter()

  const {
    isLoading: isBookFavLoading,
    data: isBookFavData,
  } = useGetIsBookFavQuery({
    bookId: book.id,
  })

  const BookThumbanil = book?.bookCovers[0] || undefined

  const [toggle, { isLoading }] = useToggleBookFavMutation()
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(book)

  }

  const AvgRating  = book?.averageRating || 
  book?.ratings?.reduce((acc , cur)=>{
    return acc + +cur.rating
  }  , 0) / book?.ratings?.length || 0  


  


  return (
    <Card key={book.id} className=" pt-0  pb-0 overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <Link href={`/books/${book.id}`} className="flex-1 flex flex-col">

        <div className="group relative aspect-square w-full overflow-hidden  ">          {
          BookThumbanil ?
            <BlurredImage
              alt={BookThumbanil.name || ""}
              className={"w-full h-full"}
              height={BookThumbanil?.height || 0 }
              width={BookThumbanil?.width || 0}
              imageUrl={BookThumbanil?.fileUrl}
              quality={100}
              blurhash={BookThumbanil?.blurHash || ""}
            />
            :
            <div
              className={`text-center w-full h-full flex justify-center items-center `}>
              <ImageIcon className="w-6 h-6 " />
            </div>
        }
          <Badge onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
          }} className="absolute top-2 right-2">{
          book.category.parentId  !== null ? 
          <>
          <p className="cursor-pointer rounded-sm hover:underline transition-all duration-200" onClick={() => router.push(`/books?categoryId=${book.category.parentId}`)}>
            {book?.category?.parent?.name && book?.category?.parent?.name?.length > 20 ? book?.category?.parent?.name?.slice(0, 20) + "..." : book?.category?.parent?.name} 
            </p> / <p className=" cursor-pointer hover:underline rounded-sm transition-all duration-200" onClick={() => router.push(`/books?categoryId=${book.category.id}`)}>
            {book.category.name.length > 10 ? book.category.name.slice(0, 10) + "..." : book.category.name}
            </p>
          </>
           : <p className="cursor-pointer rounded-md" onClick={() => router.push(`/books?categoryId=${book.category.id}`)}>
            {book.category.name.length > 20 ? book.category.name.slice(0, 30) + "..." : book.category.name}
            
            {/* {book.category.name} */}
            </p>
          }

          </Badge>
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="
            absolute bottom-0 left-0 w-full transform translate-y-full 
            transition-transform 
            duration-300 ease-in-out
             group-hover:translate-y-0 
            flex-row
             flex justify-center
             items-start 
             h-fit
             backdrop-blur-md bg-black/30"
          >
            <div className="flex flex-col gap-3 my-3 ">
              <StarRating
                readonly
                maxStars={5}
                

                initialRating={AvgRating && +AvgRating.toFixed(1) || 0}
              />


            </div>
            <div className="flex flex-col gap-3 mt-3 ml-2">



            </div>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col p-4">

          <h3 className="font-semibold line-clamp-1 mb-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author.name}</p>
          <div className="mt-auto">
            <p className="font-bold text-primary">${book.price}</p>
          </div>
        </CardContent>

        <CardFooter
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="p-4 pt-0 gap-2">
          {
            !book?.purchase?.length ?
              <Button variant="default" size="sm" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button> :
              <Button

                onClick={() => router.push(`/library/view/${book.id}`)}
                variant="outline" size="sm" className="flex-1  h-9 cursor-pointer transition-all"  >
                <LucideView className="h-4 w-4 mr-2" />
                read now
              </Button>

          }
          {
            isBookFavLoading || isLoading ?
              <Button
              disabled
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                variant="outline" size="icon" className=" cursor-default animate-wave  h-9 w-9">

              </Button>
              : <Button
                onClick={(() => {
                  toggle({
                    totalFavorites: +book.totalFavorites,
                    bookId: book.id,
                  })
                    .then((res) => {
                      console.log(res, "Book Favorited")
                    })
                    .catch((error) => {
                      console.error("Error updating book favorite status", error)
                    })
                })}
                variant="outline" size="icon" className="h-9 w-9">

                <Heart className={cn("h-4 w-4",
                  isBookFavData && "fill-red-500  stroke-red-500 "
                )} />
                {
                  book.totalFavorites
                }
              </Button>

          }

        </CardFooter>
      </Link>

    </Card>
  )
}

