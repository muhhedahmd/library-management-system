import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to get recommendations" }, { status: 401 })
    }

    const userId = session.user.id
    const searchParams = req.nextUrl.searchParams
    const method = searchParams.get("method") || "hybrid"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let recommendations

    switch (method) {
      case "rating":
        recommendations = await getratingsBasedRecommendations(userId, limit)
        break
      case "favorite":
        recommendations = await getFavoriteBasedRecommendations(userId, limit)
        break
      case "category":
        recommendations = await getCategoryBasedRecommendations(userId, limit)
        break
      case "author":
        recommendations = await getAuthorBasedRecommendations(userId, limit)
        break
      case "hybrid":
      default:
        recommendations = await getHybridRecommendations(userId, limit)
        break
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

// Recommendation based on user's ratings
async function getratingsBasedRecommendations(userId: string, limit: number) {

  // Get books that the user has rated highly (4 or 5)
  const userHighratingss = await prisma.rating.findMany({
    where: {
      userId,
      rating: {
        gte: 4, // 4 or higher on a 5-point scale
      },
    },
    include: {
      book: {
        include: {
          category: true,
          author: true,
        },
      },
    },
  })

  // Extract category and author IDs from highly rated books
  const categoryIds = userHighratingss.map((rating) => rating.book.categoryId)
  const authorIds = userHighratingss.map((rating) => rating.book.authorId)
  const ratedBookIds = userHighratingss.map((rating) => rating.bookId)

  // Find books with similar categories or authors that the user hasn't rated yet
  return await prisma.book.findMany({
    where: {
      OR: [
        {
          categoryId: {
            in: categoryIds,
          },
        },
        {
          authorId: {
            in: authorIds,
          },
        },
      ],
      AND: {
        id: {
          notIn: ratedBookIds, // Exclude books the user has already rated
        },
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
    take: limit,
  })
}

// Recommendation based on user's favorites
async function getFavoriteBasedRecommendations(userId: string, limit: number) {
  // Get books that the user has favorited
  const userFavorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      book: {
        include: {
          category: true,
          author: true,
        },
      },
    },
  })

  // Extract category and author IDs from favorited books
  const categoryIds = userFavorites.map((favorite) => favorite.book.categoryId)
  const authorIds = userFavorites.map((favorite) => favorite.book.authorId)
  const favoritedBookIds = userFavorites.map((favorite) => favorite.bookId)

  // Find books with similar categories or authors that the user hasn't favorited yet
  return await prisma.book.findMany({
    where: {
      OR: [
        {
          categoryId: {
            in: categoryIds,
          },
        },
        {
          authorId: {
            in: authorIds,
          },
        },
      ],
      AND: {
        id: {
          notIn: favoritedBookIds, // Exclude books the user has already favorited
        },
      },
    },
    include: {
      author: true,
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
    take: limit,
  })
}

// Recommendation based on categories the user has shown interest in
async function getCategoryBasedRecommendations(userId: string, limit: number) {

  // Find categories the user has shown interest in (through ratings or favorites)
  const userInteractions = await prisma.$transaction([
    prisma.rating.findMany({
      where: { userId },
      include: { book: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      include: { book: true },
    }),
  ])

  const ratings = userInteractions[0]
  const favorites = userInteractions[1]

  // Count category occurrences to find most preferred categories
  const categoryCount: Record<string, number> = {}

  // Add categories from rated books
  ratings.forEach((rating) => {
    const categoryId = rating.book.categoryId
    categoryCount[categoryId] = (categoryCount[categoryId] || 0) + rating.rating // Weight by rating
  })

  // Add categories from favorited books
  favorites.forEach((favorite) => {
    const categoryId = favorite.book.categoryId
    categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 5 // Weight favorites highly
  })

  // Sort categories by count and get top 3
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([categoryId]) => categoryId)

  // Get books from top categories that user hasn't interacted with
  const interactedBookIds = [...ratings.map((r) => r.bookId), ...favorites.map((f) => f.bookId)]

  return await prisma.book.findMany({
    where: {
      categoryId: {
        in: topCategories,
      },
      id: {
        notIn: interactedBookIds,
      },
    },
    include: {
      author: true,
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
    take: limit,
  })
}

// Recommendation based on authors the user has shown interest in
async function getAuthorBasedRecommendations(userId: string, limit: number) {
    
  // Find authors the user has shown interest in (through ratings or favorites)
  const userInteractions = await prisma.$transaction([
    prisma.rating.findMany({
      where: { userId },
      include: { book: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      include: { book: true },
    }),
  ])

  const ratings = userInteractions[0]
  const favorites = userInteractions[1]

  // Count author occurrences to find most preferred authors
  const authorCount: Record<string, number> = {}

  // Add authors from rated books
  ratings.forEach((rating) => {
    const authorId = rating.book.authorId
    authorCount[authorId] = (authorCount[authorId] || 0) + rating.rating // Weight by rating
  })

  // Add authors from favorited books
  favorites.forEach((favorite) => {
    const authorId = favorite.book.authorId
    authorCount[authorId] = (authorCount[authorId] || 0) + 5 // Weight favorites highly
  })

  // Sort authors by count and get top 3
  const topAuthors = Object.entries(authorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([authorId]) => authorId)

  // Get books from top authors that user hasn't interacted with
  const interactedBookIds = [...ratings.map((r) => r.bookId), ...favorites.map((f) => f.bookId)]

  return await prisma.book.findMany({
    where: {
      authorId: {
        in: topAuthors,
      },
      id: {
        notIn: interactedBookIds,
      },
    },
    include: {
      author: true,
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
    take: limit,
  })
}

// Hybrid recommendation combining multiple approaches
async function getHybridRecommendations(userId: string, limit: number) {
  // Get recommendations from different methods
  const [ratingRecs, favoriteRecs, categoryRecs, authorRecs, popularBooks] = await Promise.all([
    getratingsBasedRecommendations(userId, limit),
    getFavoriteBasedRecommendations(userId, limit),
    getCategoryBasedRecommendations(userId, limit),
    getAuthorBasedRecommendations(userId, limit),
    getPopularBooks(limit),
  ])

  // Combine and deduplicate recommendations
  const allRecommendations = [...ratingRecs, ...favoriteRecs, ...categoryRecs, ...authorRecs, ...popularBooks]

  // Deduplicate by book ID
  const uniqueBooks = Array.from(new Map(allRecommendations.map((book) => [book.id, book])).values())

  // Return the top recommendations up to the limit
  return uniqueBooks.slice(0, limit)
}

// Get popular books based on average ratings and number of ratings
async function getPopularBooks(limit: number) {
  // Get books with their average ratings
  const booksWithratingss = await prisma.book.findMany({
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
  const booksWithScores = booksWithratingss.map((book) => {
    const ratings = book.ratings
    const ratingCount = ratings.length
    const averageratings = ratingCount > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount : 0

    // Calculate a popularity score (weighted average)
    // This formula gives weight to both the average rating and the number of ratings
    const popularityScore = averageratings * 0.7 + Math.min(ratingCount / 10, 1) * 0.3

    return {
      ...book,
      averageratings,
      ratingCount,
      popularityScore,
    }
  })

  // Sort by popularity score and return top results
  return booksWithScores.sort((a, b) => b.popularityScore - a.popularityScore).slice(0, limit)
}

