"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn, formatCurrency } from "@/lib/utils"
import { books } from "@/lib/data"
import { Filter, SlidersHorizontal } from "lucide-react"
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

interface FilterBarProps {
  className?: string
}

export function FilterBar({ className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [isOpen, setIsOpen] = useState(false)

  // Extract unique values for filters
  const categories = Array.from(new Set(books.map((book) => book.category)))
  const authors = Array.from(new Set(books.map((book) => book.author)))
  const publishers = Array.from(new Set(books.map((book) => book.publisher)))

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
  const handleAuthorChange = (value: string) => {
    updateFilters({ author: value === "all" ? null : value })
  }

  // Handle publisher change
  const handlePublisherChange = (value: string) => {
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

        <Select value={searchParams.get("category") || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your book search with these filters</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label>Author</Label>
                <Select value={searchParams.get("author") || "all"} onValueChange={handleAuthorChange}>
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
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Publisher</Label>
                <Select value={searchParams.get("publisher") || "all"} onValueChange={handlePublisherChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Publisher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Publishers</SelectItem>
                    {publishers.map((publisher) => (
                      <SelectItem key={publisher} value={publisher}>
                        {publisher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

