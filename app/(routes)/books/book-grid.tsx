"use client"

import { useEffect, useState } from "react"
import { BookCard } from "./book-card"
import { useGetBooksQuery } from "@/store/QueriesApi/booksApi"
import { useSearchParams } from "next/navigation"
import { orderBy, orderByDirection } from "@/Types"

export default function BookGrid() {

  const [filteration, setFilteration] = useState<
    {
      author: string,
      category: string,
      publisher: string,
      orderByField: orderBy,
      orderByDir: orderByDirection,
      price?: number
      MoreOrLessPrice?: number
      range?: number
      minPrice?: number
      maxPrice?: number
    }
  >(
    {
      author: "",
      category: "",
      publisher: "",
      orderByField: "totalRatings",
      orderByDir: "desc",
      price: 0,
      range: 0,
      MoreOrLessPrice: 0,
      maxPrice: 0,
      minPrice: 0,
    }
  )

  const {
    isFetching,
    isLoading: isLoadingApi,
    data
  } = useGetBooksQuery({
    skip: 0,
    take: 10,
    ...filteration


  })
  // const [Books, setBooks] = useState<BooksRes[]>(undefined)
  // const [books, setBooks] = useState<Book[]>([])
  const searchParams = useSearchParams()
  // useEffect(() => {
  //   if (!data?.data) return
  //   setBooks(data?.data)
  // }, [data?.data])

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!data?.data) return
    // Simulate API call with a small delay
    setIsLoading(true)
    // let filteredBooks = [...data?.data]


    // Apply category filter
    const category = searchParams.get("category")

    if (category && category !== "all") {
      setFilteration(
        (prev) => {
          return {
            ...prev,
            category
          }
        }
      )
      // filteredBooks = filteredBooks.filter((book) => book.category.name === category)
    }

    // Apply author filter
    const author = searchParams.get("author")
    if (author && author !== "all") {
      setFilteration(
        (prev) => {
          return {
            ...prev,
            author
          }
        }
      )
      // filteredBooks = filteredBooks.filter((book) => book.author.name === author)
    }

    // Apply publisher filter
    const publisher = searchParams.get("publisher")
    if (publisher && publisher !== "all") {
      setFilteration(
        (prev) => {
          return {
            ...prev,
            publisher
          }
        }
      )
      // filteredBooks = filteredBooks.filter((book) => book.publisher.name === publisher)
    }

    // Apply price filter
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
if(minPrice && maxPrice){
  setFilteration((prev) => {
    return {
      ...prev,
      range :1
    }
  })
}
    if (minPrice) {
      setFilteration((prev) => {
        return {
          ...prev,
          minPrice: Number.parseFloat(minPrice)
        }
      })

      // filteredBooks = filteredBooks.filter((book) => +book.price >= Number.parseFloat(minPrice))
    }
    if (maxPrice) {

      setFilteration((prev) => {
        return {
          ...prev,
          maxPrice: Number.parseFloat(maxPrice)
        }
      })
      // filteredBooks = filteredBooks.filter((book) => +book.price <= Number.parseFloat(maxPrice))
    }

    // Apply sort
    const sort = searchParams.get("sort")
    if (sort) {


      switch (sort) {
        case "title-asc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "title",
              orderByDir: "asc"
            }
          })
          console.log("title-asc" , filteration)
          // filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "title-desc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "title",
              orderByDir: "desc"
            }
          })
          // filteredBooks.sort((a, b) => b.title.localeCompare(a.title))
          break
        case "price-asc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "price",
              orderByDir: "asc"
            }
          })
          // filteredBooks.sort((a, b) => +a.price - +b.price)
          break
        case "price-desc":

          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "price",
              orderByDir: "desc"
            }
          })
          console.log("Filter-price-desc" , 
              filteration
          )
          // filteredBooks.sort((a, b) => +b.price - +a.price)
          break
        case "date-asc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "publishedAt",
              orderByDir: "asc"
            }
          })
          // filteredBooks.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
          break
        case "date-desc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "publishedAt",
              orderByDir: "desc"
            }
          })
          break
        case "rating-desc":
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "totalRatings",
              orderByDir: "desc"
            }
          })
    
          break
      }
    }

    // setBooks(filteredBooks)
    setIsLoading(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, searchParams])

  

  if (isLoading || isFetching || !data?.data || isLoadingApi) {
    return (
      <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">

        {Array.from({ length: 10 }).map((_, index) => (
          // <Card 

          // <div className="relative aspect-square overflow-hidden">

          <div key={index}
            className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
            {/* className="w-full"> */}
            <div className="aspect-square animate-wave bg-muted/50  rounded-md mb-2"></div>

            <div className="h-4 animate-wave bg-muted/50  rounded w-3/4 mb-2"></div>
            <div className="h-3 animate-wave bg-muted/50  rounded w-1/2 mb-2"></div>
            <div className="h-5 animate-wave bg-muted/50  rounded w-1/4 mb-2"></div>
            <div className="h-8 animate-wave bg-muted/50  rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (data?.data?.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No books found</h2>
        <p className="text-muted-foreground">Try adjusting your filters to find what you re looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
    {data?.data.filter((book, index, self) => 
      // Filter out duplicate books based on ID
      index === self.findIndex((b) => b.id === book.id)
    ).map((book) => (
      <BookCard key={book.id} book={book} />
    ))}
  </div>
  )
}

