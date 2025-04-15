"use client"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ChevronDown, Heart, TrendingUp } from "lucide-react"
import { useGetBooksAnalyticsQuery, useGetStaticsQuery } from "@/store/QueriesApi/booksApi"
import { BooksResForAnalytics, orderBy, orderByDirection } from "@/Types"
import BlurredImage from "@/app/_components/imageWithBlurHash"
import { StarRating } from "../../starRatting/starRatting"
import Tip from "@/app/_components/tip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { setPaginationAdminBooksFav, setPaginationAdminBooksPopularity, setPaginationAdminBooksReadingHistory } from "@/store/Slices/paggnitionSlice"
export default function Dashboard({
}) {
    const { data: statics, isLoading, isFetching } = useGetStaticsQuery()
    // Mock data - in a real app, this would come from your database

    const { page: skipbooksAnalyticsPopularity } = useSelector((state: RootState) => state.pagination.PaginationAdminBooksPopularity)
    const { page: skipbooksAnalyticsFav } = useSelector((state: RootState) => state.pagination.PaginationAdminBooksFav)
    const { page: skipbooksAnalyticsReadingHistory } = useSelector((state: RootState) => state.pagination.PaginationAdminBooksReadingHistory)
    const dispatch = useDispatch<AppDispatch>()
   
    const { data: booksAnalyticsFav, isLoading: isBooksAnalyticsLoadingFav, isFetching: isBooksAnalyticsFetchingFav } = useGetBooksAnalyticsQuery({
        take: 20,
        skip: skipbooksAnalyticsFav,
        orderByField: "favorites" as orderBy,
        orderByDir: "desc" as orderByDirection
    })
    const { data: booksAnalyticsPopularity, isLoading: isBooksAnalyticsLoadingPopularity, isFetching: isBooksAnalyticsFetchingPopularity } = useGetBooksAnalyticsQuery({
        take: 20,
        skip: skipbooksAnalyticsPopularity,
        orderByField: "popularity" as orderBy,
        orderByDir: "desc" as orderByDirection
    })
    const { data: booksAnalyticsReadingHistory, isLoading: isBooksAnalyticsLoadingReadingHistory, isFetching: isBooksAnalyticsFetchingReadingHistory } = useGetBooksAnalyticsQuery({
        take: 20,
        skip: skipbooksAnalyticsReadingHistory,
        orderByField: "readingHistory" as orderBy,
        orderByDir: "desc" as orderByDirection
    })

    return (
        <main className="container mx-auto py-4 pb-0">
            {/* <h1 className="text-2xl font-bold mb-8">Book Sales Dashboard</h1> */}

            <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-5 mb-6">
                {
                    isLoading || isFetching ?
                        Array.from({ length: 5 }).map((_, index) => (
                            <Card className="animate-pulse p-0 px-0  min-w-fit max-w-fit" key={index}>

                                <CardContent className="p-0 px-0">


                                    <div className="flex animate-wave h-32   w-40 rounded-md   items-center justify-center">
                                    </div>
                                </CardContent>
                            </Card>
                        ))

                        :
                        (
                            <>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground w-max">Total Books Purchased</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{Math.round(statics?.purchaseAggregate?._count || 0)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">+{Math.round(statics?.purchaseAggregate?._count || 0)}% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">${Math.round(statics?.purchaseAggregate?._sum?.price || 0)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">+{Math.round((statics?.purchaseAggregate?._sum?.price || 0) / (statics?.purchaseAggregate?._count || 0))}% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Total favorites</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {
                                                statics?.favoriteAggregate?._count || 0
                                            }
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">+
                                            {
                                                Math.round((statics?.favoriteAggregate?._count || 0) / (statics?.favoriteAggregate?._count || 0) * 32)
                                            }
                                            % from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Total rating</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {
                                                statics?.ratingAggregate?._count || 0
                                            }
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            {
                                                Math.round((statics?.ratingAggregate?._avg?.rating || 0) * 100) / 100
                                            }
                                            <p>
                                                Avg rating
                                            </p>
                                        </span>

                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Readers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{
                                            statics?.readingHistoryAggregate?._count || 0
                                        }</div>
                                        <p className="text-xs text-muted-foreground mt-1">+
                                            {
                                                Math.round((statics?.readingHistoryAggregate?._count || 0) / (statics?.readingHistoryAggregate?._count || 0) * 100)
                                            }

                                            % from last month</p>
                                    </CardContent>
                                </Card>
                            </>
                        )
                }

            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Book Purchase Analytics</CardTitle>
                    <CardDescription>View books by popularity, favorites, and reading history</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="popularity">
                        <TabsList className="mb-4">
                            <TabsTrigger value="popularity" className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Popularity
                            </TabsTrigger>
                            <TabsTrigger value="favorites" className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Favorites
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Reading History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="popularity" className="space-y-4">

                            {
                                isBooksAnalyticsLoadingPopularity || isBooksAnalyticsFetchingPopularity ?
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <BookCardLoader key={index} />
                                    ))
                                    :booksAnalyticsPopularity?.data?.popularity.data?.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                            <div className="w-full flex justify-center items-center">

                                <Button
                                    disabled={

                                        isBooksAnalyticsLoadingPopularity
                                        || isBooksAnalyticsFetchingPopularity ||
                                        !booksAnalyticsPopularity?.data?.popularity?.hasMore
                                    }
                                    onClick={() => {
                                        dispatch(
                                            setPaginationAdminBooksPopularity({
                                                page: skipbooksAnalyticsPopularity + 1,
                                                hasMore:!booksAnalyticsPopularity?.data?.popularity?.hasMore
                                                                                            })
                                        )

                                    }}
                                    variant={"outline"}>
                                    load more
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="favorites" className="space-y-4">

                            {
                                isBooksAnalyticsLoadingFav || isBooksAnalyticsFetchingFav ?
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <BookCardLoader key={index} />
                                    ))
                                    :
                                    booksAnalyticsFav?.data?.favorites.data?.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                            <div className="w-full flex justify-center items-center">

                                <Button
                                    disabled={
                                        isBooksAnalyticsLoadingFav
                                        || isBooksAnalyticsFetchingFav ||
                                        booksAnalyticsFav?.data?.favorites.data?.length
                                        && booksAnalyticsFav?.data?.favorites.data?.length < 20 || false
                                    }
                                    onClick={() => {
                                        dispatch(
                                            setPaginationAdminBooksFav({
                                                page: skipbooksAnalyticsFav + 1,
                                                hasMore:    booksAnalyticsFav?.data?.favorites.data?.length
                                                && booksAnalyticsFav?.data?.favorites.data?.length < 20 || false
                                            })
                                        )

                                    }}
                                    variant={"outline"}>
                                    load more
                                </Button>
                            </div>

                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">

                            {
                                isBooksAnalyticsLoadingReadingHistory || isBooksAnalyticsFetchingReadingHistory ?
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <BookCardLoader key={index} />
                                    ))
                                    :
                                    booksAnalyticsReadingHistory?.data?.readingHistory.data?.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                            <div className="w-full flex justify-center items-center">

                                <Button
                                    disabled={
                                        isBooksAnalyticsLoadingReadingHistory
                                        || isBooksAnalyticsFetchingReadingHistory ||
                                        !booksAnalyticsReadingHistory?.data.readingHistory.hasMore
                                    }
                                    onClick={() => {
                                        dispatch(
                                            setPaginationAdminBooksReadingHistory({
                                                page: skipbooksAnalyticsReadingHistory + 1,
                                                hasMore:  booksAnalyticsReadingHistory?.data.readingHistory.hasMore || false
                                            })
                                        )

                                    }}
                                    variant={"outline"}>
                                    load more
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    )
}


function BookCardLoader() {
    return (
        <div className="flex items-center justify-between w-full p-4 rounded-lg border">

            <div className="flex flex-row gap-2">


                <div className="flex animate-wave h-20 w-20 rounded-md" />
                <div className="flex flex-col gap-2">
                    <div className="flex animate-wave h-4 w-[20rem] rounded-md" />
                    <div className="flex animate-wave h-4 w-[15rem] rounded-md" />
                    <div className="flex animate-wave h-4 w-[10rem] rounded-md" />
                </div>
            </div>

            <div className="flex flex-col gap-2">

                <div className="flex animate-wave h-6   w-[4rem] rounded-md   items-center justify-center" />
                <div className="flex animate-wave h-6   w-[5rem] rounded-md   items-center justify-center" />
            </div>

        </div>
    )
}
function BookCard({ book }: { book: BooksResForAnalytics }) {


    console.log({ book })
    const cover = book.bookCovers && book.bookCovers.length > 0 ? book.bookCovers[0] : null

    return (
        <div className="flex items-center p-4 rounded-lg border">
            {
                cover ?
                    <BlurredImage
                        quality={100}
                        blurhash={cover.blurHash || ""}
                        imageUrl={cover.fileUrl || "/placeholder.svg"}
                        alt={`Cover of ${book.title}`}
                        width={cover.width || 80}
                        height={cover.height || 100}

                        className="h-20 w-20 object-cover rounded mr-4"
                    />
                    :
                    <div className="flex animate-wave h-20 w-15 rounded-md   items-center justify-center">
                        <BookOpen className="h-4 w-4" />
                    </div>
            }




            <div className="flex-1">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author.name}</p>
                <div className="flex items-center justify-start mt-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                        {book.purchase?.length || 0} purchases
                    </div>
                    <div className="flex items-center w-max  px-3 ml-2 justify-center h-8 rounded-full bg-muted text-xs font-medium">
                        <StarRating
                            initialRating={book?.ratings.length > 0 ? book?.ratings.reduce((acc, curr) => acc + curr.rating, 0) / book?.ratings.length : 0}
                            size={16}
                            readonly
                            className="text-muted-foreground py-3"
                        />
                    </div>
                </div>
            </div>

            <div className="ml-4">

                <div className="flex -space-x-2 mb-2">


                    {book?.purchase?.length && book?.purchase?.map((purchase,) => (
                        <Tip key={purchase.id} trigger={
                            <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarImage src={
                                    purchase.user.profile && purchase.user.profile.profilePictures.length > 0 && purchase?.user?.profile?.profilePictures[0]?.secureUrl &&
                                    purchase?.user?.profile?.profilePictures[0]?.secureUrl || ""} alt={purchase?.user?.name} />
                                <AvatarFallback>{purchase?.user?.name[0]}</AvatarFallback>
                            </Avatar>

                        } content={
                            <Card

                                className="w-fit bg-muted">
                                <CardHeader className="p-0 hidden">
                                    {/* <CardTitle>{purchase?.user?.name}</CardTitle> */}
                                </CardHeader>

                                <CardContent className=" w-full justify-center items-center flex flex-col gap-2">
                                    {/* <div className="flex flex-col gap-2"> */}

                                    <Link href={`/users/${purchase?.user?.id}`} className=" w-full justify-center items-center flex flex-col gap-2">
                                        <Avatar className="border-2 border-background h-12 w-12">
                                            <AvatarImage src={
                                                purchase.user.profile && purchase.user.profile.profilePictures.length > 0 && purchase?.user?.profile?.profilePictures[0]?.secureUrl &&
                                                purchase?.user?.profile?.profilePictures[0]?.secureUrl || ""} alt={purchase?.user?.name} />
                                            <AvatarFallback>{purchase?.user?.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex  flex-row gap-2">

                                            <p className="text-sm font-medium">{purchase?.user?.name}</p>
                                            <Badge variant="outline">{purchase?.user?.role
                                            }</Badge>
                                        </div>
                                        <div className="flex flex-row gap-2">

                                            <p>
                                                buy at {new Date(purchase?.createdAt).toLocaleDateString()}
                                            </p>

                                        </div>
                                        {/* </div> */}
                                    </Link>

                                </CardContent>
                            </Card>
                        }>

                        </Tip>


                        // <Tip trigger={<Avatar key={i} className="border-2 border-background h-8 w-8"></Avatar>} content={<p>{purchase?.user?.name}</p>}>

                    ))}

                    {book?.purchase?.length && book?.purchase?.length > 3 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                            +{book?.purchase?.length - 3}
                        </div>
                    )}
                </div>


                <Button variant="outline" size="sm" className="w-full">
                    <span>View Details</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

