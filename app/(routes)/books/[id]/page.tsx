
import { Book } from "@prisma/client"
import { notFound } from "next/navigation"

import BookRecommendations from "./book-recomendations"
import BookDetails from "./bookDetails"
import { Separator } from "@/components/ui/separator"
import { BooksRes } from "@/Types"
import prisma from "@/lib/prisma"
// import BookRecommendations from "./book-recommendations"
// import ReadingHistoryCard from "./reading-history-card"


async function getBookDetails(id: string) {


  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      author: true,
      publisher: true,
      category: {
        include: {
          parent: true,
        },
      },
      bookCovers: true,
      favorites: {
        take: 5,
        include: {
          user: true,
        },
      },
      readingHistory: {
        take: 5,
        orderBy: {
          lastReadAt: "desc",
        },
        include: {
          user: true,
        },
      },
    },
  })

  if (!book) {
    return null
  }

  // Get similar books based on category
  const similarBooks = await prisma.book.findMany({

    where: {
      categoryId: book.categoryId,
      id: { not: book.id },
    },
    include: {
      author: true,
      category: true,
      publisher: true,

      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
      },
    },
    take: 6,
  })
  const splitIntoTagsTitle = book.title.split(" ")
  const splitIntoCate = book.category.name.split(" ")
  const simmlerCategory = await prisma.category.findMany({
    distinct: "name",
    where: {

      books: {
        every: {

          title: {
            in: [...splitIntoTagsTitle, ...splitIntoCate],
            mode: "insensitive"
          }

        },

      }
    }
  })

  // Get books by same author
  const authorBooks = await prisma.book.findMany({
    where: {
      authorId: book.authorId,
      id: { not: book.id },
    },
    include: {
      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
      },
    },
    take: 4,
  })
  // Get popular books (most favorited)
  const popularBooks = await prisma.book.findMany({
    include: {
      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
      },
      readingHistory: true,
      category: true,
      publisher: true,
      author: true,
      _count: {
        select: {
          favorites: true,
        },
      },
    },
    orderBy: {
      favorites: {
        _count: "desc",
      },
    },
    take: 6,
  })

  return {
    book,
    simmlerCategory,
  similarBooks,
    authorBooks,
    popularBooks,
  }
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const data = await getBookDetails(params.id)

  if (!data) {
    notFound()
  }

  const { similarBooks, popularBooks } = data

  // Find the main cover and thumbnail
  // const mainCover = book.bookCovers.find((cover) => cover.type === "Image") || book.bookCovers[0]
  // const thumbnail = book.bookCovers.find((cover) => cover.type === "THUMBNAIL")

  // Calculate reading stats


  return (

    <div className="w-full mx-auto py-8 px-4 md:px-6">


      {/* Book Details */}
      <BookDetails
        bookId={params.id}
      />

      {/* Recommendations */}
      <div className="mt-16">
        <Separator className="mb-8" />

        <h2 className="text-2xl font-bold mb-6">Recommended Books</h2>

        <BookRecommendations similarBooks={similarBooks as BooksRes[]} popularBooks={popularBooks as Book[]} />
      </div>
    </div>
  )
}

