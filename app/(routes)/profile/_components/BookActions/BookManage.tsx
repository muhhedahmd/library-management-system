"use client"
// import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ArrowLeftCircleIcon, Plus } from "lucide-react"
// import { authOptions } from "@/lib/authOption"
import { DataTable } from "./dataTable"
import { columns } from "./Columns"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useGetAdminBookQuery } from "@/store/QueriesApi/booksApi"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { setAuthorPagination, setCategoryPagination, setPublisherPagination } from "@/store/Slices/paggnitionSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
const BookForm = dynamic(() => import('./BookForm'), {
    ssr: false,
});

// Optional mock initial data (for edit form)


export default function BooksPage({
    // searchParams,
    userIdParam,
    setOpenManageBooks
}: {
    setOpenManageBooks: React.Dispatch<React.SetStateAction<boolean>>
    userIdParam: string
    // searchParams: { [key: string]: string | string[] | undefined }
}) {
    //   const session = await getServerSession(authOptions)




    const dispatch = useDispatch()
    const limit = 10 // Number of items to load per page

    // categories query
    const { page: catePage, hasMore: CateHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const {
        data: categories,
        isLoading: isLoadingCategories,
        // isFetching: isFetchingCate,
    } = useGetCategoriesQuery({ pgnum: catePage, pgsize: limit })
    const loadMoreCate = () => {
        if (categories?.hasMore) {
            dispatch(setCategoryPagination({ page: catePage + 1, hasMore: CateHasMore }))
        }
    }

    // author query
    const { page: AuthorPages, hasMore: AuthorHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const {
        data: Authors,
        isLoading: isLoadingAuthor,
        // isFetching: isFetchingAuthor,
    } = useGetAuthorsQuery({ pgnum: AuthorPages, pgsize: limit })
    const loadMoreAuthor = () => {
        if (Authors?.hasMore) {
            dispatch(setAuthorPagination({ page: AuthorPages + 1, hasMore: AuthorHasMore }))
        }
    }

    // publisher query
    const { page: publisherPages, hasMore: publisherHasMore } = useSelector(
        (state: RootState) => state.pagination.PaginationCategory,
    )
    const {
        data: publisher,
        isLoading: isLoadingpublisher,
        // isFetching: isFetchingpublisher,
    } = useGetPublisherQuery({ pgnum: publisherPages, pgsize: limit })
    const loadMorePublisher = () => {
        if (publisher?.hasMore) {
            dispatch(setPublisherPagination({ page: publisherPages + 1, hasMore: publisherHasMore }))
        }
    }



    // Parse query parameters
    // const search = typeof searchParams.search === "string" ? searchParams.search : ""
    //   const category = typeof searchParams.category === "string" ? searchParams.category : ""
    //   const available = searchParams.available === "true" ? true : searchParams.available === "false" ? false : undefined

    // Build filter conditions
    //   const where = {
    //     ...(search
    //       ? {
    //           OR: [
    //             { title: { contains: search, mode: "insensitive" } },
    //             { isbn: { contains: search, mode: "insensitive" } },
    //             { author: { name: { contains: search, mode: "insensitive" } } },
    //           ],
    //         }
    //       : {}),
    //     ...(category ? { categoryId: category } : {}),
    //     ...(available !== undefined ? { available } : {}),
    //   }

    // Fetch books with filters
    //   const books = await prisma.book.findMany({
    //     where,
    //     include: {
    //       author: true,
    //       publisher: true,
    //       category: true,
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //   })

    //   // Fetch categories for filter dropdown
    //   const categories = await prisma.category.findMany({
    //     orderBy: {
    //       name: "asc",
    //     },
    //   })

    // Transform data for the table

    const Router = useRouter()




    const [CreateBookDialog, setCreateBookDialog] = useState(false)

    useEffect(() => {

        if (CreateBookDialog) {
            // push to the router 
            Router.push(`/profile/${userIdParam}?books=managebooks&action=createbook`)
        }
    }, [Router, CreateBookDialog, userIdParam])



    const { data, isLoading: isLoadingBooks } = useGetAdminBookQuery({
        skip: 0,
        take: 10
    })

    console.log(data)
    if (isLoadingBooks) {
        return <div>
            loading...
        </div>
    }
    return (
        <>
            {
                !CreateBookDialog &&


                <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className=" mb-3 flex justify-start items-center gap-3">
                            <Button
                                onClick={() => {
                                    setCreateBookDialog(false)
                                    setOpenManageBooks(false)
                                    Router.push(`/profile/${userIdParam}`)
                                    // Router.back()// replace with the real path to the profile page  when ready
                                }}
                                size="icon" variant="ghost" className="">
                                <ArrowLeftCircleIcon />
                            </Button>
                            <h2 className="text-xl font-semibold">
                                Your Books
                            </h2>
                        </div>                        <Button onClick={() => {
                            setCreateBookDialog(true)
                        }} >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>

                    <DataTable columns={columns} data={data} categories={categories?.data} />
                </div>
            }



            {
                CreateBookDialog &&
                <div className="w-full">

                    <div className=" mb-3 flex justify-start items-center gap-3">
                        <Button

                            onClick={() => {
                                setCreateBookDialog(false)
                                Router.push(`/profile/${userIdParam}?books=managebooks`)
                                // Router.back()  // replace with the real path to the profile page  when ready
                            }}
                            size="icon" variant="ghost" className="">
                            <ArrowLeftCircleIcon />
                        </Button>
                        <h2 className="text-xl font-semibold">
                            Create Book
                        </h2>
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
            }

        </>
    )
}

