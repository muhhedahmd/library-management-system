"use client"
import { redirect } from "next/navigation"
import { useGetSingleBookQuery, useReadingTimeOfBookQuery } from "@/store/QueriesApi/booksApi"

import dynamic from "next/dynamic"
import loading from "@/app/(routes)/books/[id]/read/loading"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookHeart, BookOpen, BookOpenCheck, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// import ReadingView from "../../../books/[id]/read/readingView"

// import PDFReader from ""

// Import the PDF viewer component with dynamic import and disable SSR
const PDFReader = dynamic(() => import("@/app/(routes)/books/[id]/read/readingView"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    ),
})

// Helper function to generate dummy content for demonstration


export default function ReadPage({ id }: {
    id: string,
}) {


    const { data: book, isLoading, isFetching } = useGetSingleBookQuery({
        bookId: id
    })

    const { data: ReadingHistory, isLoading: isLoadingReading,
        isFetching: isLoadingReadingHistory
    } = useReadingTimeOfBookQuery({
        bookId: id
    })

    const averageReadingTime =
        book?.readingHistory?.length && book?.readingHistory?.length > 0
            ? book?.readingHistory.reduce((sum, history) => sum + (history.readingTimeMinutes || 0), 0) /
            book?.readingHistory?.length
            : 0

    const [completeReading, setCompleteReading] = useState<boolean>(false)
    // mutation of  single  book 

    if (!book && (isLoading || isFetching || isLoadingReading || isLoadingReadingHistory)) {
        return loading()
    }


    if (!book?.purchase?.length) {
        return <div>
            <h1>Book not purchased yet</h1>
            <button onClick={() => redirect(`/books/${book?.id}/purchase`)}>Purchase Book</button>
        </div>
    }




    return (
        <div>

            {
                completeReading ?
                    <>
                        <PDFReader
                        
                            book={book}
                            readingHistory={ReadingHistory || null}
                            pdfUrl={book.fileUrl}
                        />
                    </>
                    :
                    <div className="w-full min-h-[90vh]  flex justify-center items-center">
                        {
                            !ReadingHistory ? <Card className="">

                                <CardHeader>
                                    <CardTitle>
                                        Book:  {book.title}
                                    </CardTitle>
                                    <p className="text-sm">by: {book?.author?.name}</p>
                                </CardHeader>

                                <CardContent className="flex gap-3 flex-col justify-start items-start">
                                    <p className="text-sm">Total Readers: {book?.readingHistory?.length}</p>

                                    <Button 
                                    onClick={()=>{ 
                                        setCompleteReading(true) 
                                        

                                    }}
                                    >
                                        Start read
                                    </Button>
                                    <p className="w-max flex justify-start items-center">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        No reading history yet
                                    </p>
                                </CardContent>

                            </Card> :

                                <Card className="w-[30rem]">

                                    <CardHeader>

                                        <CardTitle className="text-xl">

                                            Reading Statistics

                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="">

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm">Completion Rate</span>
                                                    {/* <span className="text-sm font-medium">{completionRate.toFixed(0)}%</span> */}
                                                </div>
                                                <Progress color="#0f00f" value={

                                                    Math.round((ReadingHistory?.pagesRead / +( book?.pages || 0)) * 100)
                                                } className="h-2" />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">Total Readers</span>
                                                </div>
                                                <span className="font-medium">{
                                                    book?.readingHistory?.length
                                                }</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">Reading Time</span>
                                                </div>
                                                <span className="font-medium">{Math.round(averageReadingTime)} min</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">Pages</span>
                                                </div>
                                                <span className="font-medium">{book?.pages}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <BookOpenCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">readed Pages</span>
                                                </div>
                                                <span className="font-medium">{ReadingHistory?.pagesRead}</span>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    setCompleteReading(true)
                                                }}
                                                className="w-full">
                                                <BookHeart className="h-4 w-4 mr-2 text-muted-foreground" />
                                                continue  Reading

                                            </Button>
                                        </div>
                                    </CardContent>

                                </Card>



                        }

                    </div>

            }
        </div>
    )
}

