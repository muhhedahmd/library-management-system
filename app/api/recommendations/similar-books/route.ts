import { type NextRequest, NextResponse } from "next/server"
import prisma  from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const bookId = searchParams.get("bookId")
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    const similarBooks = await getSimilarBooks(bookId, limit)

    return NextResponse.json({ recommendations: similarBooks })
  } catch (error) {
    console.error("Error getting similar books:", error)
    return NextResponse.json({ error: "Failed to get similar books" }, { status: 500 })
  }
}

// Get books similar to a specific book
async function getSimilarBooks(bookId: string, limit: number) {
  // Get the target book with its category and author
  const targetBook = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      category: true,
      author: true,
    },
  })

  if (!targetBook) {
    return []
  }

  // Find books with the same category or author
  const similarBooks = await prisma.book.findMany({
    where: {
      OR: [
        {
          categoryId: targetBook.categoryId,
        },
        {
          authorId: targetBook.authorId,
        },
      ],
      AND: {
        id: {
          not: bookId, // Exclude the target book
        },
      },
    },
    include: {
      author: true,
      publisher: true,
      category: true,
      ratings: {
        select: {
          rating: true,
        },
      },
      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
        take: 1,
      },
    },
    take: limit * 2, // Get more books than needed for scoring
  })

  // Calculate similarity scores
  const booksWithScores = similarBooks.map((book) => {
    let score = 0

    // Same category
    if (book.categoryId === targetBook.categoryId) {
      score += 5
    }

    // Same author
    if (book.authorId === targetBook.authorId) {
      score += 10
    }

    // Similar publication year (if available)
    if (targetBook.publishedAt && book.publishedAt) {
      const yearDiff = Math.abs(targetBook.publishedAt.getFullYear() - book.publishedAt.getFullYear())
      if (yearDiff < 5) {
        score += 3
      } else if (yearDiff < 10) {
        score += 1
      }
    }

    return {
      ...book,
      similarityScore: score,
    }
  })

  // Sort by similarity score and return top results
  return booksWithScores.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit)
}

