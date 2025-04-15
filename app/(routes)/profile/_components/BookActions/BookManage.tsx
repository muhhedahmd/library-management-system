"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { ArrowLeftCircleIcon, Plus } from "lucide-react"
import { columns } from "./Columns"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useGetAdminBookQuery } from "@/store/QueriesApi/booksApi"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import {
    setAdminBooksPagination,
    setAuthorPagination,
    setCategoryPagination,
    setPublisherPagination,
} from "@/store/Slices/paggnitionSlice"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
import type { BooksRes } from "@/Types"
import { DataTable } from "./dataTable"
import { debounce } from "lodash"

const BookForm = dynamic(() => import("./BookForm"), {
    ssr: false,
})

export default function BookManage({
    userIdParam,
    setOpenManageBooks,
}: {
    setOpenManageBooks: React.Dispatch<React.SetStateAction<boolean>>
    userIdParam: string
}) {
    const dispatch = useDispatch()
    const limit = 10 // Number of items to load per page
    const Router = useRouter()
    const pathname = usePathname()
    const [CreateBookDialog, setCreateBookDialog] = useState(false)
    const [allBooks, setAllBooks] = useState<BooksRes[]>([])
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState("")
    const currentSearch = searchParams.get("search") || ""
    const [filter, setFilter] = useState({
        categoryId: "",
        publisherId: "",
        authorId: "",
    })

    // categories query
    const { page: catePage, hasMore: CateHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery({ pgnum: catePage, pgsize: limit })
    const loadMoreCate = () => {
        if (categories?.hasMore) {
            dispatch(setCategoryPagination({ page: catePage + 1, hasMore: CateHasMore }))
        }
    }

    // author query
    const { page: AuthorPages, hasMore: AuthorHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const { data: Authors, isLoading: isLoadingAuthor } = useGetAuthorsQuery({ pgnum: AuthorPages, pgsize: limit })
    const loadMoreAuthor = () => {
        if (Authors?.hasMore) {
            dispatch(setAuthorPagination({ page: AuthorPages + 1, hasMore: AuthorHasMore }))
        }
    }

    // publisher query
    const { page: publisherPages, hasMore: publisherHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const { data: publisher, isLoading: isLoadingpublisher } = useGetPublisherQuery({
        pgnum: publisherPages,
        pgsize: limit,
    })
    const loadMorePublisher = () => {
        if (publisher?.hasMore) {
            dispatch(setPublisherPagination({ page: publisherPages + 1, hasMore: publisherHasMore }))
        }
    }

    // Books query with infinite scrolling
    const { page: bookPages, hasMore: bookHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationAdminBooks,
    )

    const { data, isLoading: isLoadingBooks, isFetching } = useGetAdminBookQuery({
        skip: bookPages ,
        take: limit,
        categoryId: filter.categoryId,
        publisherId: filter.publisherId,
        authorId: filter.authorId,
        query  : searchValue
    })

  
  useEffect(() => {
      setSearchValue(currentSearch)
    }, [currentSearch])

  const debouncedSearch = debounce((value: string) => {
    updateSearchParams("search", value)
  }, 300)

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    Router.push(`${pathname}?${params.toString()}`)
    handleFilterChange(key, value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    debouncedSearch(e.target.value)
  }
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

    // Accumulate books data for infinite scrolling
    useEffect(() => {
        if (data?.data) {
           setAllBooks(data?.data)
        }
    }, [data, bookPages])

    // Reset pagination when filters change
    useEffect(() => {
        dispatch(setAdminBooksPagination({ page: 0, hasMore: true }))
        setAllBooks([])
    }, [filter, dispatch])

    const handleFilterChange = (field: string, value: string) => {

        setFilter((prev) => ({ ...prev, [field+"Id"]: value === "all" ? ""  : value }))
    }

    const loadMoreBook = () => {
        if (bookHasMore && (!isLoadingBooks || !isFetching)) {
            dispatch(setAdminBooksPagination({ page: bookPages + 1, hasMore: data?.hasMore || false }))
        }
    }

    if (isLoadingBooks && bookPages === 0) {
        return <div className="w-full flex justify-center items-center py-12">Loading...</div>
    }

    return (
        <>
            {!CreateBookDialog && (
                <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className="mb-3 flex justify-start items-center gap-3">
                            <Button
                                onClick={() => {
                                    setCreateBookDialog(false)
                                    setOpenManageBooks(false)
                                    Router.push(`/profile/${userIdParam}/managebooks`)
                                }}
                                size="icon"
                                variant="ghost"
                            >
                                <ArrowLeftCircleIcon />
                            </Button>
                            <h2 className="text-xl font-semibold">Your Books</h2>
                        </div>
                        <Button onClick={() => setCreateBookDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border">
                        <DataTable
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        handleSearchChange={handleSearchChange}
                            isFetching={isFetching}
                            handleFilterChange={handleFilterChange}
                            loadMoreBook={loadMoreBook}
                            isLoadingBooks={isLoadingBooks}
                            hasMore={data?.hasMore || false}
                            columns={columns}
                            data={allBooks || []}
                            categories={categories?.data}
                            authors={Authors?.data || []}
                            publisher={publisher?.data || []}
                        />
                    </div>
                </div>
            )}

            {CreateBookDialog && (
                <div className="w-full">
                    <div className="mb-3 flex justify-start items-center gap-3">
                        <Button onClick={() => setCreateBookDialog(false)} size="icon" variant="ghost">
                            <ArrowLeftCircleIcon />
                        </Button>
                        <h2 className="text-xl font-semibold">Create Book</h2>
                    </div>
                    <BookForm
                        Authors={Authors}
                        categories={categories}
                        publisher={publisher}
                        isLoadingAuthor={isLoadingAuthor}
                        isLoadingCategories={isLoadingCategories}
                        isLoadingpublisher={isLoadingpublisher}
                        loadMoreAuthor={loadMoreAuthor}
                        loadMoreCate={loadMoreCate}
                        loadMorePublisher={loadMorePublisher}
                    />
                </div>
            )}
        </>
    )
}
