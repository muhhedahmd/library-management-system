"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown,  Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { categoryWithchildren } from "@/Types"
import { useGetCountAdminBookQuery } from "@/store/QueriesApi/booksApi"
import { Author, Publisher } from "@prisma/client"

interface DataTableProps<BooksRes, TValue> {
  handleSearchChange :  (e: React.ChangeEvent<HTMLInputElement>) => void
  searchValue : string ,
setSearchValue : React.Dispatch<React.SetStateAction<string>>

  authors: Author[] | []
  publisher: Publisher[] | []
  columns: ColumnDef<BooksRes, TValue>[]
  data: BooksRes[] | undefined
  categories: categoryWithchildren[] | undefined
  loadMoreBook: () => void
  isLoadingBooks: boolean
  hasMore: boolean,
  isFetching: boolean,
  handleFilterChange: (field: string, value: string) => void
}

export function DataTable<TData, TValue>({
  searchValue,
setSearchValue,
  authors,
  handleSearchChange,
  publisher,
  columns,
  data,
  categories,
  loadMoreBook,
  isFetching,
  isLoadingBooks,
  hasMore,
  handleFilterChange,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: count } = useGetCountAdminBookQuery()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  // const [isIntersecting, setIsIntersecting] = useState(false)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Get current filter values from URL
  const currentSearch = searchParams.get("search") || ""
  const currentCategory = searchParams.get("category") || ""
  const currentAuthor = searchParams.get("author") || ""
  const currentPublisher = searchParams.get("publisher") || ""
  // const currentAvailable = searchParams.get("available") || ""

  useEffect(() => {
    setSearchValue(currentSearch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearch])

  // Create table instance
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Update URL with filters
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
    handleFilterChange(key, value)
  }

  // Debounced search handler

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Don't observe if we're already loading or there's no more data
    if (!hasMore || isFetching || isLoadingBooks || !tableContainerRef.current) return

    observerRef.current = new IntersectionObserver((entries) => {
      // If the loading element is visible and we're not already fetching
      if (entries[0]?.isIntersecting && !isFetching && hasMore) {
        loadMoreBook()
      }
    },
      { threshold: 0.1 },)


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
  }, [hasMore, isFetching, isLoadingBooks])

  // Set up intersection observer for infinite scrolling
  //   useEffect(() => {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         const [entry] = entries
  //         setIsIntersecting(entry.isIntersecting)
  //       },
  //       { threshold: 0.1 },
  //     )

  //     const currentLoadingRef = loadingRef.current


  //     return () => {
  //       if (currentLoadingRef) {
  //         observer.unobserve(currentLoadingRef)
  //       }
  //     }
  //   }, [loadingRef])

  // Load more data when the loading element is visible
  //   useEffect(() => {
  //     if (isIntersecting && hasMore && !isLoadingBooks) {
  //       loadMoreBook()
  //     }
  //   }, [isIntersecting, hasMore, isLoadingBooks, loadMoreBook])

  // Clean up debounce on unmount


  return (
    <div className="p-2">
      <div className="flex flex-col  sm:flex-row items-center py-4 gap-2">

        <div className="relative flex-1 min-w-[200px]">

          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search books..." value={searchValue} onChange={handleSearchChange} className="pl-8" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={currentCategory} onValueChange={(value) => updateSearchParams("category", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentAuthor} onValueChange={(value) => updateSearchParams("author", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentPublisher} onValueChange={(value) => updateSearchParams("publisher", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Publisher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Publisher</SelectItem>
              {publisher?.map((publisher) => (
                <SelectItem key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Select value={currentAvailable} onValueChange={(value) => updateSearchParams("available", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Unavailable</SelectItem>
            </SelectContent>
          </Select> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md w-full border overflow-hidden">
        <div ref={tableContainerRef} className="max-h-[70vh] overflow-auto scrollbar-modern">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-muted/50">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isLoadingBooks || isFetching ?

                <TableRow
                className="hover:bg-muted/50 transition-colors"

                >

                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col  w-full gap-6">
                      {
                        Array.from({ length: 10 }).map((_, index) => (
                          <div key={index} className="flex flex-row  w-full gap-6">
                            <div className="h-6 animate-wave rounded w-full text-center"></div>
                            <div className="h-6 animate-wave rounded w-full text-center"></div>
                            <div className="h-6 animate-wave rounded w-full text-center"></div>
                            <div className="h-6 animate-wave rounded w-full text-center"></div>
                            <div className="h-6 animate-wave rounded w-full text-center"></div>
                          </div>


                        ))

                      }
                    </div>
                  </TableCell>
                </TableRow> :
                (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
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
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {count?.count || "..."} books
          </p>
        </div>
      </div>
    </div>
  )
}
