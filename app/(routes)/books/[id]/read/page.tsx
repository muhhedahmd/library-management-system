"use client"
import { notFound, redirect } from "next/navigation"
import ReadingView from "./readingView"
import { useGetSingleBookQuery, useReadingTimeOfBookQuery } from "@/store/QueriesApi/booksApi"
import { useEffect, useState } from "react"


// Helper function to generate dummy content for demonstration


export default function ReadPage({ params }: { params: Promise<{ id: string }> }) {

  const [BookId, setBookId] = useState<string>("")
  useEffect(() => {
    (async () => {
      setBookId(
        (await params).id
      )
    })()
  }, [params])


  const { data: book  , isLoading ,isFetching} = useGetSingleBookQuery({
    bookId: BookId
  })

  const { data: ReadingHistory  , isLoading :isLoadingReading , 
    isFetching : isLoadingReadingHistory
  } = useReadingTimeOfBookQuery({
    bookId: BookId
  })

  console.log(book)

  if(isLoading || isFetching || isLoadingReading||isLoadingReadingHistory)
  {
    return <div>Loading...</div>
  }

  if (!book) {
    notFound()
  }

  if (!book.purchase?.length
  ) {
    return <div>
      <h1>Book not purchased yet</h1>
      <button onClick={() => redirect(`/books/${book.id}/purchase`)}>Purchase Book</button>
    </div>
  }




  return (
    <ReadingView
      book={book}
      readingHistory={ReadingHistory || null}
      pdfUrl={book.fileUrl}

    //   totalPages={data.totalPages}
    //   currentPage={data.currentPage}
    />
  )
}

