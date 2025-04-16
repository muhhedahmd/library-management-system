"use client"
import { TabsContent } from '@/components/ui/tabs'
import { useGetIsBookFavQuery, useGetSingleBookQuery, useToggleBookFavMutation } from '@/store/QueriesApi/booksApi'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BookmarkPlus, BookOpen, CalendarDays, ChevronRight
    , Clock, Download, Heart
    , Minus, Plus
    , Share2, ShoppingCart,
    Trash, Users
} from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BookPageLoading from './loading'
import BlurredImage from '@/app/_components/imageWithBlurHash'
import { Button } from '@/components/ui/button'
import DownloadButton from '@/app/_components/DownloadButton'
import { useCart } from '@/app/_components/cart/cart-provider'
import { Progress } from '@/components/ui/progress'
import { BooksRes } from '@/Types'
import { StarRating } from '@/app/(routes)/starRatting/starRatting'
import { cn } from '@/lib/utils'
import RatingTab from './RatingTab'
import ReadingHistoryCard from './reading-history'

const BookDetails = ({
    bookId
}: {
    bookId: string
}) => {
    const {
        isLoading,
        isFetching,
        error,
        data: book,
    } = useGetSingleBookQuery({
        bookId
    })

    const {
        addToCart,
        removeFromCart,
        updateQuantity,
        cart
    } = useCart()
    const {
        isLoading: isBookFavLoading,
        data: isBookFavData,
    } = useGetIsBookFavQuery({
        bookId: bookId,
    })


    const [toggle, { isLoading: isLoadingToggleFav }] = useToggleBookFavMutation()




    const [getQuantityOfBook, setgetQuantityOfBook] = useState<number>()


    useEffect(() => {
        if (!book) return;
        const _getQuantityOfBook = cart?.find((item) => item.id === bookId)?.quantity;
        setgetQuantityOfBook(_getQuantityOfBook);
    }, [book, bookId, cart]);

    const handleAddToCart = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addToCart(book as any as unknown as BooksRes)
        // setgetQuantityOfBook(1)/
    }
    if (isLoading || isFetching) {
        return <BookPageLoading />
    }
    if (!book) {
        return <h2>Book not found </h2>
    }
    if (error) {
        return <h2>Book not found </h2>
    }


    const totalReaders = book?.readingHistory.length
    const completedReaders = book?.readingHistory.filter((history) => history.completed).length
    const completionRate = totalReaders > 0 ? (completedReaders / totalReaders) * 100 : 0
    const averageReadingTime =
        book.readingHistory.length > 0
            ? book.readingHistory.reduce((sum, history) => sum + (history.readingTimeMinutes || 0), 0) /
            book.readingHistory.length
            : 0
    const mainCover = book.bookCovers.find((cover) => cover.type === "Image") || book.bookCovers[0]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover and Actions */}
            <div className="md:col-span-1">


                <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg mb-6">
                        <BlurredImage
                            // layout="fill"
                            // objectFit="cover"
                            height={mainCover.height || 100}
                            width={mainCover.width || 100}
                            quality={100}
                            blurhash={mainCover.blurHash ||
                                ""
                            }
                            imageUrl={mainCover?.fileUrl || "/placeholder.svg?height=450&width=300"}
                            alt={`Cover of ${book.title}`}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center w-full mb-6">

                        {
                            isLoadingToggleFav || isBookFavLoading ?

                                <Button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    variant="outline" size="icon" className=" cursor-default animate-wave  h-9 w-9">

                                </Button>
                                :

                                <Button

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
                                    variant="outline" size="icon" className="h-9 w-9 p-3">

                                    <Heart className={cn("h-4 w-4",
                                        isBookFavData && "fill-red-500  stroke-red-500 "
                                    )} />
                                    {
                                        book.totalFavorites > 0 ?
                                            book.totalFavorites - 1 === 0 ? null : book.totalFavorites - 1 :
                                            null
                                    }
                                </Button>
                        }

                        {/* <Button variant="outline" className="flex items-center gap-2">
                            <BookmarkPlus className="h-4 w-4" />
                            <span>Save</span>
                        </Button> */}
                        {/* <Button variant="outline" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                        </Button> */}
                    </div>

                    {
                        book.purchase?.length ?
                            <>

                                <DownloadButton
                                    item={
                                        {

                                            name: "download",
                                            mediaUrl: book.fileUrl
                                        }
                                    }
                                    className="w-full mb-4 bg-primary" >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </DownloadButton>
                                <Button variant="outline" className="w-full mb-4 bg-primary cursor-pointer">
                                    <Link href={`/library/view/${book.id}`}>
                                        start reading
                                    </Link>
                                </Button>
                            </>

                            : getQuantityOfBook ?

                                <div
                                    //  className="flex-1"
                                    className="w-full flex justify-start rounded-md text-muted-foreground items-center mb-4 bg-primary cursor-pointer" >
                                    <Button className='flex-1 cursor-pointer'>
                                        Check out
                                    </Button>

                                    <div className=' flex w-1/4 justify-between items-center'>
                                        {getQuantityOfBook === 1 ?
                                            <Button
                                                onClick={() => removeFromCart(book.id)}
                                                variant='destructive'
                                                className='bg-red-500 flex justify-center items-center rounded-none w-1/2 shadow-none'
                                            >


                                                <Trash />
                                            </Button>

                                            :
                                            <Button
                                                // className='w-1/2 '
                                                onClick={() => {
                                                    setgetQuantityOfBook((prev) => {
                                                        const newQuantity = prev - 1;
                                                        

                                                        return newQuantity; // Return the new value to update the state
                                                    });
                                                    
                                                    updateQuantity(book.id, cart && cart?.find((item) => item.id === book?.id)?.quantity - 1); // Use the newQuantity directly
                                                }}

                                                variant='secondary'
                                                className='bg-red-500 flex justify-center items-center rounded-none w-1/2 shadow-none'
                                            >

                                                <Minus
                                                    className='text-muted-foreground'


                                                />
                                            </Button>

                                        }
                                        <Button
                                            onClick={() => {
                                                setgetQuantityOfBook((prev) => {
                                                    const newQuantity = prev + 1;
                                                    console.log(
                                                        {
                                                            newQuantity
                                                        }
                                                    )

                                                    return newQuantity; // Return the new value to update the state
                                                });
                                                updateQuantity(book.id, cart?.find((item) => item.id === book?.id)?.quantity + 1); // Use the newQuantity directly
                                            }}
                                            variant='outline'
                                            className=' rounded-tr-md rounded-tl-none  rounded-bl-none w-1/2 shadow-none'

                                        >
                                            <Plus />
                                            <span>
                                                {
                                                    getQuantityOfBook

                                                }
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Button variant="default" size="sm" className="w-full mb-4 bg-primary cursor-pointer" onClick={handleAddToCart}>

                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>

                    }
                    <Card className="w-full">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Reading Statistics</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">Completion Rate</span>
                                        <span className="text-sm font-medium">{completionRate.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={completionRate} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Total Readers</span>
                                    </div>
                                    <span className="font-medium">{totalReaders}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Avg. Reading Time</span>
                                    </div>
                                    <span className="font-medium">{Math.round(averageReadingTime)} min</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Pages</span>
                                    </div>
                                    <span className="font-medium">{book.pages}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            <div className="md:col-span-2">
                <div className="flex flex-col space-y-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Link href="/books" className="hover:underline">
                            Books
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        {book.category.parent && (
                            <>
                                <a href={`/categories/${book.category.parent.id}`} className="hover:underline">
                                    {book.category.parent.name}
                                </a>
                                <ChevronRight className="h-4 w-4 mx-1" />
                            </>
                        )}
                        <a href={`/categories/${book.category.id}`} className="hover:underline">
                            {book.category.name}
                        </a>
                    </div>

                    {/* Title and Author */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{book.title}</h1>
                        <div className="flex items-center mt-2">
                            <span className="text-lg text-muted-foreground">By </span>
                            <a href={`/authors/${book.author.id}`} className="text-lg font-medium ml-1 hover:underline">
                                {book.author.name}
                            </a>
                        </div>
                    </div>

                    {/* Rating and Metadata */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">

                            <StarRating
                                readonly
                                // onChange={changeRating}
                                initialRating={book.averageRating && +book.averageRating.toFixed(1) || 0}

                                size={25}

                            />

                            <span className="ml-2 text-sm font-medium">{book.averageRating && +book.averageRating.toFixed(1) || 0}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({book._count.favorites} favorites)</span>
                        </div>

                        <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">Published {new Date(book.publishedAt || new Date()).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                                {book.language}
                            </Badge>
                        </div>
                    </div>

                    {/* Categories and Keywords */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant='secondary' className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{book.category.name}</Badge>
                        {book.keywords &&
                            book.keywords.map((keyword, index) => (
                                <Badge key={index} className="bg-secondary/10 hover:bg-secondary/20 border-none">
                                    {keyword}
                                </Badge>
                            ))}
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                    </div>

                    {/* Book Details Tabs */}
                    <Tabs defaultValue="details" className="w-full mt-6">

                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="readers">Readers</TabsTrigger>
                            <TabsTrigger value="ratings">Ratings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Publisher</h3>
                                    <p>{book.publisher.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
                                    <p>{book.isbn}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">File Format</h3>
                                    <p>{book.fileFormat}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                                    <p>{book.fileSize}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                                    <p>{book.language}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                                    <p>${book.price}</p>
                                </div>
                            </div>

                            {book.publisher.website && (
                                <div className="pt-2">
                                    <a
                                        href={book.publisher.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Visit publisher website
                                    </a>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="readers" className="pt-4">



                            <div className="space-y-4">
                                <ReadingHistoryCard book={book} />

                            </div>
                        </TabsContent>


                        <RatingTab
                            book={book}
                        />


                    </Tabs>


                </div>
            </div>
        </div>
    )
}

export default BookDetails