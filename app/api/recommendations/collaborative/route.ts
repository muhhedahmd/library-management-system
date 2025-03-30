import { type NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to get recommendations" }, { status: 401 })
    }

    const userId = session.user.id
    const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") || "10")

    const recommendations = await getCollaborativeRecommendations(userId, limit)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error getting collaborative recommendations:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

// Collaborative filtering recommendation system
async function getCollaborativeRecommendations(userId: string, limit: number) {
  // 1. Get all books the current user has rated
  const userRatings = await prisma.rating.findMany({
    where: { userId },
    select: { bookId: true, rating: true },
  })

  // If user has no ratings, return popular books instead
  if (userRatings.length === 0) {
    return getPopularBooks(limit)
  }

  // 2. Find similar users based on rating patterns
  const userRatedBookIds = userRatings.map((r) => r.bookId)

  // Find users who have rated at least one of the same books
  const similarUsers = await prisma.rating.findMany({
    where: {
      bookId: { in: userRatedBookIds },
      userId: { not: userId }, // Exclude the current user
    },
    select: { userId: true },
    distinct: ["userId"],
  })

  const similarUserIds = similarUsers.map((u) => u.userId)

  // 3. Get all ratings from similar users
  const similarUsersRatings = await prisma.rating.findMany({
    where: {
      userId: { in: similarUserIds },
    },
    select: { userId: true, bookId: true, rating: true },
  })

  // 4. Calculate similarity scores between current user and similar users
  const userSimilarityScores: Record<string, number> = {}

  for (const similarUserId of similarUserIds) {
    // Get ratings from the similar user
    const similarUserRatings = similarUsersRatings.filter((r) => r.userId === similarUserId)

    // Find books that both users have rated
    const commonBookIds = userRatings
      .map((r) => r.bookId)
      .filter((bookId) => similarUserRatings.some((r) => r.bookId === bookId))

    // If no common books, skip this user
    if (commonBookIds.length === 0) continue

    // Calculate Pearson correlation coefficient
    let sum1 = 0,
      sum2 = 0,
      sum1Sq = 0,
      sum2Sq = 0,
      pSum = 0
    const n = commonBookIds.length

    for (const bookId of commonBookIds) {
      const userRating = userRatings.find((r) => r.bookId === bookId)?.rating || 0
      const similarUserRating = similarUserRatings.find((r) => r.bookId === bookId)?.rating || 0

      sum1 += userRating
      sum2 += similarUserRating
      sum1Sq += userRating ** 2
      sum2Sq += similarUserRating ** 2
      pSum += userRating * similarUserRating
    }

    // Calculate Pearson correlation
    const num = pSum - (sum1 * sum2) / n
    const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n))

    const similarity = den === 0 ? 0 : num / den

    // Store similarity score (only if positive correlation)
    if (similarity > 0) {
      userSimilarityScores[similarUserId] = similarity
    }
  }

  // 5. Get books rated highly by similar users that the current user hasn't rated
  const userRatedBooks = new Set(userRatings.map((r) => r.bookId))
  const recommendationScores: Record<string, { score: number; count: number }> = {}

  // Calculate weighted scores for each book
  for (const rating of similarUsersRatings) {
    // Skip if the current user has already rated this book
    if (userRatedBooks.has(rating.bookId)) continue

    // Skip if the similarity score is not positive
    const similarityScore = userSimilarityScores[rating.userId] || 0
    if (similarityScore <= 0) continue

    // Calculate weighted score
    const weightedRating = rating.rating * similarityScore

    if (!recommendationScores[rating.bookId]) {
      recommendationScores[rating.bookId] = { score: 0, count: 0 }
    }

    recommendationScores[rating.bookId].score += weightedRating
    recommendationScores[rating.bookId].count += 1
  }

  // Calculate average weighted scores
  const bookScores = Object.entries(recommendationScores)
    .map(([bookId, { score, count }]) => ({
      bookId,
      score: count > 0 ? score / count : 0,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  // 6. Fetch the recommended books with their details
  const recommendedBookIds = bookScores.map((item) => item.bookId)

  if (recommendedBookIds.length === 0) {
    return getPopularBooks(limit)
  }

  // Update the book query to include publisher and correctly handle bookCovers
  return await prisma.book
    .findMany({
      where: {
        id: { in: recommendedBookIds },
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
      // Preserve the order of recommendations
      orderBy: {
        id: "asc",
      },
    })
    .then((books) => {
      // Sort books according to their recommendation scores
      return books.sort((a, b) => {
        const scoreA = bookScores.find((s) => s.bookId === a.id)?.score || 0
        const scoreB = bookScores.find((s) => s.bookId === b.id)?.score || 0
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
  const booksWithScores = booksWithRatings.map((book) => {
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

