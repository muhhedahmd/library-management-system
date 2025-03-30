import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"
import prisma from "@/lib/prisma"
import { ReadingHistory } from "@prisma/client"


export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get user's reading history
    const readingHistory = await prisma.readingHistory.findMany({
      where: {
        userId,
        // Only consider books that were completed or had significant progress
        OR: [{ completed: true }, { pagesRead: { gt: 50 } }, { readingTimeMinutes: { gt: 30 } }],
      },
      include: {
        book: {
          select: {
            id: true,
            categoryId: true,
            authorId: true,
          },
        },
      },
      orderBy: {
        lastReadAt: "desc",
      },
      take: limit, // Get more history to analyze patterns
    })

    // If no reading history, return popular books
    if (readingHistory.length === 0) {
      const popularBooks = await getPopularBooks(limit)
      return NextResponse.json({ recommendations: popularBooks })
    }

    // Extract category and author IDs with engagement scores
    const categoryEngagement: Record<string, number> = {}
    const authorEngagement: Record<string, number> = {}
    const interactedBookIds: string[] = []

    // First pass: calculate engagement scores

    for (const history of readingHistory) {
      const categoryId = history.book.categoryId
      const authorId = history.book.authorId

      // Skip if missing essential data
      if (!categoryId || !authorId) continue

      // Calculate engagement score based on reading metrics
      const engagementScore = calculateEngagementScore(history)

      // Add to category engagement
      categoryEngagement[categoryId] = (categoryEngagement[categoryId] || 0) + engagementScore

      // Add to author engagement
      authorEngagement[authorId] = (authorEngagement[authorId] || 0) + engagementScore

      // Track books the user has already interacted with
      interactedBookIds.push(history.bookId)
    }

    // Find books matching user's reading patterns
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { categoryId: 
              { in: Object.keys(categoryEngagement) } 
           },
           // authors is not good assigns to books on cate so give a not good result
          // { authorId: { in: Object.keys(authorEngagement) } },
        ],
        AND: {
          id: {
            notIn: interactedBookIds, // Exclude books the user has already read
          },
        },
      },
      include: {
        author: true,
        category: true,
        bookCovers: {
          where: {
            type: "THUMBNAIL",
          },
          take: 1,
        },
      },
      take: limit * 3, // Get more books to score and filter
    })

    // Score books based on reading history
    const scoredBooks = books.map((book) => {
      let score = 0

      // Add category engagement score
      if (categoryEngagement[book.categoryId]) {
        score += categoryEngagement[book.categoryId]
      }

      // Add author engagement score (weighted more heavily)
      if (authorEngagement[book.authorId]) {
        score += authorEngagement[book.authorId] * 1.5
      }

      return {
        ...book,
        _score: score, // Use _score to avoid conflicts with book properties
      }
    })

    // Sort by engagement score and take the top results
    const sortedBooks = scoredBooks
      .filter((book) => book._score > 0) // Only include books with positive scores
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)

    // Format the response
    const recommendations = sortedBooks.map((book) => ({

      score : book._score,
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
      category: book.category,
      categoryName: book.category.name,
      bookCovers: book.bookCovers,
      publishedAt: book.publishedAt,
      pages: book.pages,
      language: book.language,
      fileFormat: book.fileFormat,
    }))

    // Log recommendations if needed
    await logRecommendations(userId, sortedBooks, "reading-based")

    return NextResponse.json({ recommendations  })

  } catch (error) {
    console.error("Error getting reading-based recommendations:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

// Calculate engagement score based on reading metrics
function calculateEngagementScore(history: ReadingHistory) {
  let score = 0

  // Completed books get a high base score
  if (history.completed) {
    score += 10
  }

  // Add score based on pages read (if available)
  const pagesRead = history.pagesRead || 0
  if (pagesRead > 0) {
    score += Math.min(pagesRead / 50, 5) // Cap at 5 points
  }

  // Add score based on reading time (if available)
  const readingTimeMinutes = history.readingTimeMinutes || 0
  if (readingTimeMinutes > 0) {
    score += Math.min(readingTimeMinutes / 60, 5) // Cap at 5 points
  }

  // Recent books get a recency bonus
  const lastReadAt = history.lastReadAt ? new Date(history.lastReadAt) : new Date()
  const daysSinceLastRead = Math.max(1, Math.floor((Date.now() - lastReadAt.getTime()) / (1000 * 60 * 60 * 24)))

  const recencyBonus = Math.max(0, 5 - Math.log10(daysSinceLastRead) * 2)
  score += recencyBonus

  // Abandoned books get a penalty
  if (history.abandonedAt) {
    score *= 0.3 // 70% reduction
  }


  return score
}

// Get popular books as a fallback
async function getPopularBooks(limit: number) {

  // Find books with most favorites or reading history entries
  const books = await prisma.book.findMany({
    where: {
      available: true,
    },
    include: {
      author: true,
      category: true,
      bookCovers: {
        where: {
          type: "THUMBNAIL",
        },
        take: 1,
      },
      _count: {
        select: {
          favorites: true,
          readingHistory: true,
        },
      },
    },
    orderBy: [
      {
       popularity : "desc"
      },
      {
        favorites: {
          _count: "desc",
        },
      },
      {
        readingHistory: {
          _count: "desc",
        },
      },
    ],
    take: limit,
  })

  return books.map((book) => ({
    id: book.id,
    title: book.title,
    description: book.description,
    author: {
      id: book.author.id,
      name: book.author.name,
    },
    category: {
      id: book.category.id,
      name: book.category.name,
    },
    bookCovers: book.bookCovers,
    publishedAt: book.publishedAt,
    pages: book.pages,
    language: book.language,
    fileFormat: book.fileFormat,
  }))
}

// Log recommendations for analysis

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logRecommendations(userId: string, recommendations: any[], algorithm: string) {
  try {
    // Use a more efficient approach for bulk inserts
    const logData = recommendations.map((rec) => ({
      userId,
      bookId: rec.id,
      algorithm,
      score: rec._score || 0,
    }))

    // Use createMany for better performance with multiple records
    await prisma.recommendationLog.createMany({
      data: logData,
      skipDuplicates: true, // Skip if the same recommendation already exists
    })
  } catch (error) {
    console.error("Error logging recommendations:", error)
    // Don't throw the error - just log it and continue
  }
}

