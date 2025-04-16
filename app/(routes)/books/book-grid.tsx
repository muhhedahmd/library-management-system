"use client"

import { useEffect, useRef, useState } from "react"
import { BookCard } from "./book-card"
import { useGetBooksQuery } from "@/store/QueriesApi/booksApi"
import { useSearchParams } from "next/navigation"
import type { orderBy, orderByDirection } from "@/Types"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setBooksPagination } from "@/store/Slices/paggnitionSlice"
import { Loader2 } from "lucide-react"

export default function BookGrid() {
  const [filteration, setFilteration] = useState<{
    authorId: string
    categoryId: string
    publisherId: string
    orderByField: orderBy
    orderByDir: orderByDirection
    price?: number
    MoreOrLessPrice?: number
    range?: number
    minPrice?: number
    maxPrice?: number
  }>({
    authorId: "",
    categoryId: "",
    publisherId: "",
    orderByField: "totalRatings",
    orderByDir: "desc",
    price: 0,
    range: 0,
    MoreOrLessPrice: 0,
    maxPrice: 0,
    minPrice: 0,
  })

  const { page: skip, hasMore } = useSelector((state: RootState) => state.pagination.PaginationBooks)

  const dispatch = useDispatch<AppDispatch>()

  const {
    isFetching,
    isLoading: isLoadingApi,
    data,
  } = useGetBooksQuery({
    skip: skip,
    take: 10,
    ...filteration,
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Don't observe if we're already loading or there's no more data
    if (!hasMore || isFetching || isLoadingApi) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // If the loading element is visible and we're not already fetching
        if (entries[0]?.isIntersecting && !isFetching && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    ) // Trigger when 10% of the element is visible

    // Start observing the loading element
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isFetching, isLoadingApi, data])

  const loadMore = () => {
    if (!hasMore || isLoadingApi || isFetching) return

    dispatch(
      setBooksPagination({
        page: skip + 1,
        hasMore: data?.hasMore || false,
      }),
    )
  }

  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!data?.data) return
    // Simulate API call with a small delay
    setIsLoading(true)

    // Apply category filter
    const categoryId = searchParams.get("categoryId")

    if (categoryId && categoryId !== "all") {
      dispatch(
        setBooksPagination({
          page: 0 ,
          hasMore: data?.hasMore || false,
        }),
      )

      setFilteration((prev) => {
        return {
          ...prev,
          categoryId,
        }
      })
    }

    // Apply author filter
    const authorId = searchParams.get("authorId")
    if (authorId && authorId !== "all") {
      dispatch(
        setBooksPagination({
          page: 0 ,
          hasMore: data?.hasMore || false,
        }),
      )
      setFilteration((prev) => {
        return {
          ...prev,
          authorId,
        }
      })
    }

    // Apply publisher filter
    const publisherId = searchParams.get("publisherId")
    if (publisherId && publisherId !== "all") {
      dispatch(
        setBooksPagination({
          page: 0 ,
          hasMore: data?.hasMore || false,
        }),
      )
      setFilteration((prev) => {
        return {
          ...prev,
          publisherId,
        }
      })
    }

    // Apply price filter
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice && maxPrice) {
      dispatch(
        setBooksPagination({
          page: 0 ,
          hasMore: data?.hasMore || false,
        }),
      )
      setFilteration((prev) => {
        return {
          ...prev,
          range: 1,
        }
      })
    }
    if (minPrice) {
      dispatch(
        setBooksPagination({
          page: 0 ,
          hasMore: data?.hasMore || false,
        }),
      )
      setFilteration((prev) => {
        return {
          ...prev,
          minPrice: Number.parseFloat(minPrice),
        }
      })
    }
    if (maxPrice) {
      setFilteration((prev) => {
        return {
          ...prev,
          maxPrice: Number.parseFloat(maxPrice),
        }
      })
    }

    // Apply sort
    const sort = searchParams.get("sort")
    if (sort) {
      switch (sort) {
        case "title-asc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "title",
              orderByDir: "asc",
            }
          })
          break
        case "title-desc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "title",
              orderByDir: "desc",
            }
          })
          break
        case "price-asc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "price",
              orderByDir: "asc",
            }
          })
          break
        case "price-desc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "price",
              orderByDir: "desc",
            }
          })
          break
        case "date-asc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "publishedAt",
              orderByDir: "asc",
            }
          })
          break
        case "date-desc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "publishedAt",
              orderByDir: "desc",
            }
          })
          break
        case "rating-desc":
          dispatch(
            setBooksPagination({
              page: 0 ,
              hasMore: data?.hasMore || false,
            }),
          )
          setFilteration((prev) => {
            return {
              ...prev,
              orderByField: "totalRatings",
              orderByDir: "desc",
            }
          })
          break
      }
    }

    setIsLoading(false)
  }, [data?.data, data?.hasMore, dispatch, searchParams])

  if (isLoading || !data?.data || isLoadingApi) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
            <div className="aspect-square animate-wave bg-muted/50 rounded-md mb-2"></div>
            <div className="h-4 animate-wave bg-muted/50 rounded w-3/4 mb-2"></div>
            <div className="h-3 animate-wave bg-muted/50 rounded w-1/2 mb-2"></div>
            <div className="h-5 animate-wave bg-muted/50 rounded w-1/4 mb-2"></div>
            <div className="h-8 animate-wave bg-muted/50 rounded w-full"></div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {
          isFetching||
          isLoadingApi && <Loader2 />

        }
        {data?.data
          .filter(
            (book, index, self) =>
              // Filter out duplicate books based on ID
              index === self.findIndex((b) => b.id === book.id),
          )
          .map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      {hasMore && (
        <div ref={loadingRef} className="w-full py-4 flex justify-center">
          {isFetching ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-300"></div>
            </div>
          ) : (
            <div className="h-10 invisible">Load more</div>
          )}
        </div>

)}
    </div>
  )
}