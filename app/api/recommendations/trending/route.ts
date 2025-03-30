import { type NextRequest, NextResponse } from "next/server"
import prisma  from "@/lib/prisma"
import { BooksRes } from "@/Types"

export async function GET(req: NextRequest) {
  try {
    const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") || "10")
    const timeframe = req.nextUrl.searchParams.get("timeframe") || "month"

    let dateFilter: Date
    const now = new Date()

    switch (timeframe) {
      case "week":
        dateFilter = new Date(now.setDate(now.getDate() - 7))
        break
      case "month":
        dateFilter = new Date(now.setMonth(now.getMonth() - 1))
        break
      case "year":
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        dateFilter = new Date(now.setMonth(now.getMonth() - 1))
    }

    const trendingBooks = await getTrendingBooks(dateFilter, limit)

    return NextResponse.json({ recommendations: trendingBooks })
  } catch (error) {
    console.error("Error getting trending recommendations:", error)
    return NextResponse.json({ error: "Failed to get trending recommendations" }, { status: 500 })
  }
}

// Get trending books based on recent activity
async function getTrendingBooks(since: Date, limit: number) {
  // Get recent ratings
  const recentRatings = await prisma.rating.findMany({
    where: {
      createdAt: {
        gte: since,
      },
    },
    select: {
      bookId: true,
      rating: true,
    },
  })

  // Get recent favorites
  const recentFavorites = await prisma.favorite.findMany({
    where: {
      createdAt: {
        gte: since,
      },
    },
    select: {
      bookId: true,
    },
  })

  // Get recent loans
  const recentLoans = await prisma.loan.findMany({
    where: {
      loanDate: {
        gte: since,
      },
    },
    select: {
      bookId: true,
    },
  })

  // Calculate trending score for each book
  const bookScores: Record<string, number> = {}

  // Add scores from ratings (weighted by rating value)
  recentRatings.forEach(({ bookId, rating }) => {
    bookScores[bookId] = (bookScores[bookId] || 0) + rating
  })

  // Add scores from favorites (high weight)
  recentFavorites.forEach(({ bookId }) => {
    bookScores[bookId] = (bookScores[bookId] || 0) + 5
  })

  // Add scores from loans (medium weight)
  recentLoans.forEach(({ bookId }) => {
    bookScores[bookId] = (bookScores[bookId] || 0) + 3
  })

  // Sort books by score and get top trending
  const topBookIds = Object.entries(bookScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([bookId]) => bookId)

  // If no trending books found, return popular books
  if (topBookIds.length === 0) {
    return getPopularBooks(limit)
  }

  // Get book details
  return await prisma.book
    .findMany({
      where: {
        id: {
          in: topBookIds,
        },
      },
      include: {
        author: true,
        publisher: true, // Include publisher as per schema
        category: true,
        ratings: {
          select: {
            rating: true,
          },
        },
        bookCovers: {
          where: {
            type: "THUMBNAIL", // Use the correct enum value from schema
          },
          take: 1,
        },
      },
      // Preserve the order of trending books
      orderBy: {
        id: "asc",
      },
    })
    .then((books) => {
      // Sort books according to their trending scores
      return books.sort((a, b) => {
        const scoreA = bookScores[a.id] || 0
        const scoreB = bookScores[b.id] || 0
        return scoreB - scoreA
      })
    })
}

// Get popular books based on average ratings and number of ratings
async function getPopularBooks(limit: number) {
  // Get books with their average ratings
  const booksWithRatings = await prisma.book.findMany({
    include: {
      ratings: true,
      author: true,
      category: true,
      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
        take: 1,
      },
    },
  })

  // Calculate average rating and rating count for each book
  const booksWithScores = booksWithRatings.map((book: BooksRes) => {
    const ratings = book.ratings
    const ratingCount = ratings.length
    const averageRating = ratingCount > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount : 0

    // Calculate a popularity score (weighted average)
    const popularityScore = averageRating * 0.7 + Math.min(ratingCount / 10, 1) * 0.3

    return {
      ...book,
      averageRating,
      ratingCount,
      popularityScore,
    }
  })

  // Sort by popularity score and return top results
  return booksWithScores.sort((a, b) => b.popularityScore - a.popularityScore).slice(0, limit)
}

