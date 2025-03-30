"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn, formatCurrency } from "@/lib/utils"
import { books } from "@/lib/data"
import { ChevronRight, Filter, Loader2, SlidersHorizontal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import InfiniteScroll from "react-infinite-scroller"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { setAuthorPagination, setCategoryPagination, setPublisherPagination } from "@/store/Slices/paggnitionSlice"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
import FilterSelect from "./FilterSelect"
// import { setPostsPagination } from "@/store/Slices/paggnitionSlice"

interface FilterBarProps {
  className?: string
}

export function FilterBar({ className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useDispatch()
  const limit = 10 // Number of items to load per page

  // categories query
  const { page: catePage, hasMore: CateHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCate,
  } = useGetCategoriesQuery({ pgnum: catePage, pgsize: limit })
  const loadMoreCate = () => {
    if (!isFetchingCate && !isLoadingCategories && categories?.hasMore) {
      dispatch(setCategoryPagination(
        { page: catePage + 1, hasMore: CateHasMore }
      ))
    }
  }
  // Extract unique values for filters


  const { page: AuthorPages, hasMore: AuthorHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: Authors,
    // isLoading: isLoadingAuthor,
    // isFetching: isFetchingAuthor,
  } = useGetAuthorsQuery({ pgnum: AuthorPages, pgsize: limit })
  const loadMoreAuthor = () => {
    if (Authors.hasMore) {
      dispatch(setAuthorPagination({ page: AuthorPages + 1, hasMore: AuthorHasMore }))
    }
  }
  const { page: publisherPages, hasMore: publisherHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: publisher,
    // isLoading: isLoadingpublisher,
    // isFetching: isFetchingpublisher,
  } = useGetPublisherQuery({ pgnum: publisherPages, pgsize: limit })
  console.log(publisher)
  const loadMorePublisher = () => {
    if ( publisher.hasMore) {
      console.log("loadMorePublisher")
      dispatch(setPublisherPagination({ page: publisherPages + 1, hasMore: publisherHasMore }))
    }
  }

  // Find min and max prices
  const minBookPrice = Math.min(...books.map((book) => book.price))
  const maxBookPrice = Math.max(...books.map((book) => book.price))

  // Initialize state from URL params
  useEffect(() => {
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    setPriceRange([
      minPrice ? Number.parseFloat(minPrice) : minBookPrice,
      maxPrice ? Number.parseFloat(maxPrice) : maxBookPrice,
    ])
  }, [searchParams, minBookPrice, maxBookPrice])

  // Create a query string from the current search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  // Update URL when filters change
  const updateFilters = (params: Record<string, string | null>) => {
    router.push(`${pathname}?${createQueryString(params)}`)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    updateFilters({ sort: value })
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value === "all" ? null : value })
  }

  // Handle author change
  const handleChangeAuthors = (value: string) => {
    updateFilters({ author: value === "all" ? null : value })
  }

  // // Handle publisher change
  const handleChangePublisher = (value: string) => {
    updateFilters({ publisher: value === "all" ? null : value })
  }

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  // Apply price filter
  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    })
    setIsOpen(false)
  }

  // Reset all filters
  const resetFilters = () => {
    router.push(pathname)
    setPriceRange([minBookPrice, maxBookPrice])
    setIsOpen(false)
  }

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <Select value={searchParams.get("sort") || ""} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

   
        <Select
          value={searchParams.get("category") || "all"} onValueChange={handleCategoryChange}

        >
          <SelectTrigger className="min-w-[100px]">
            <SelectValue placeholder={""} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMoreCate}
              hasMore={CateHasMore}

              loader={
                <div className="p-2 text-center w-full flex justify-center items-center" key="loader">
                  <Loader2 className="animate-spin w-4 h-4" />
                </div>
              }
              useWindow={false}
            >
              <div className="space-y-1 p-1">
                {categories?.data.map((category) => (
                  <div key={category.id} className="space-y-1">
                    {/* Parent category */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                        aria-expanded={expandedCategories[category.id]}
                      >
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${expandedCategories[category.id] ? "rotate-90" : ""
                            }`}
                        />
                      </button>
                      <SelectItem
                        value={category.name}
                        className="flex-1 cursor-pointer">
                        <span className="font-medium">
                          {category.name.length > 25 ? `${category.name.substring(0, 25)}...` : category.name}
                        </span>
                      </SelectItem>
                    </div>

                    {/* Children categories */}
                    {expandedCategories[category.id] && category.children.length > 0 && (
                      <div className="ml-6 pl-2 border-l border-muted space-y-1">
                        {category.children.map((child) => (
                          <SelectItem
                          
                            value={child.name}
                            key={`${child.id}`} // Unique key combining parent and child IDs
                            className="py-1 text-sm"
                          >
                            {child.name}
                          </SelectItem>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </SelectContent>
        </Select>



        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md p-2">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your book search with these filters</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6 p-4">

              <div className="space-y-2">
                <Label>Author</Label>
    
                <FilterSelect
                onValueChange={handleChangeAuthors}
    
              categories={Authors?.data}
                  hasMore={AuthorHasMore}
                  loadMore={loadMoreAuthor}
                  placeholder="Select Author..."

                />
                {/* <Select value={searchParams.get("author") || "all"} onValueChange={handleAuthorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>

              <div className="space-y-2">
                <Label>Publisher</Label>

                <FilterSelect
                  onValueChange={handleChangePublisher}
                  categories={publisher?.data}
                  hasMore={publisherHasMore}
                  loadMore={loadMorePublisher}
                  placeholder="Select publisher..."

                />

              
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Price Range</Label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[minBookPrice, maxBookPrice]}
                    min={minBookPrice}
                    max={maxBookPrice}
                    step={0.01}
                    value={priceRange}
                    onValueChange={(value) => handlePriceChange(value as [number, number])}
                    className="py-4"
                  />
                </div>
              </div>
            </div>
            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={applyPriceFilter}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span>{searchParams.toString() ? "Filtered results" : `Showing all ${books.length} books`}</span>
      </div>
    </div>
  )
}

