import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") || "10")

    // Get user's explicit preferences
    const userPreferences = await prisma.userPreference.findMany({
      where: { userId },
    })

    // If no preferences, return popular books
    if (userPreferences.length === 0) {
      const popularBooks = await getPopularBooks(limit)
      return NextResponse.json({ recommendations: popularBooks })
    }

    // Extract category and author IDs with their weights
    const categoryPrefs = userPreferences
      .filter((pref) => pref.categoryId)
      .map((pref) => ({
        categoryId: pref.categoryId as string,
        weight: pref.weight,
      }))

    const authorPrefs = userPreferences
      .filter((pref) => pref.authorId)
      .map((pref) => ({
        authorId: pref.authorId as string,
        weight: pref.weight,
      }))

    // Get books the user has already interacted with
    const userInteractions = await prisma.$transaction([
      prisma.rating.findMany({
        where: { userId },
        select: { bookId: true },
      }),
      prisma.favorite.findMany({
        where: { userId },
        select: { bookId: true },
      }),
      prisma.readingHistory.findMany({
        where: { userId },
        select: { bookId: true },
      }),
    ])

    const interactedBookIds = [
      ...userInteractions[0].map((r) => r.bookId),
      ...userInteractions[1].map((f) => f.bookId),
      ...userInteractions[2].map((h) => h.bookId),
    ]

    // Find books matching user preferences
    const books = await prisma.book.findMany({
      where: {
        OR: [
          categoryPrefs.length > 0 ? { categoryId: { in: categoryPrefs.map((p) => p.categoryId) } } : {},
          authorPrefs.length > 0 ? { authorId: { in: authorPrefs.map((p) => p.authorId) } } : {},
        ],
        AND: {
          id: {
            notIn: interactedBookIds, // Exclude books the user has already interacted with
          },
        },
      },
      include: {
        author: true,
        category: {
          include: {
              parent: {
                  select: {
                      name: true,
                      id: true

                  }
              }
          },
      },
        publisher: true,
        bookCovers: {
          where: {
            type: "THUMBNAIL",
          },
          take: 1,
        },
      },
    })

    // Score books based on preference weights
    const scoredBooks = books.map((book) => {
      let score = 0

      // Add category preference score
      const categoryPref = categoryPrefs.find((p) => p.categoryId === book.categoryId)
      if (categoryPref) {
        score += categoryPref.weight
      }

      // Add author preference score
      const authorPref = authorPrefs.find((p) => p.authorId === book.authorId)
      if (authorPref) {
        score += authorPref.weight
      }

      return {
        ...book,
        preferenceScore: score,
      }
    })

    // Sort by preference score and take the top results
    const recommendations = scoredBooks.sort((a, b) => b.preferenceScore - a.preferenceScore).slice(0, limit)

    // Log the recommendations
    await logRecommendations(userId, recommendations, "preference-based")

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error getting preference-based recommendations:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

// Get popular books as a fallback
async function getPopularBooks(limit: number) {
  return await prisma.book.findMany({
    orderBy: {
      popularity: "desc",
    },
    include: {
      author: true,
      category: {
        include: {
            parent: {
                select: {
                    name: true,
                    id: true

                }
            }
        },
    },
      publisher: true,
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

// Log recommendations for analysis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logRecommendations(userId: string, recommendations: any[], algorithm: string) {
  try {
    await prisma.$transaction(
      recommendations.map((rec) =>
        prisma.recommendationLog.create({
          data: {
            userId,
            bookId: rec.id,
            algorithm,
            score: rec.preferenceScore || 0,
          },
        }),
      ),
    )
  } catch (error) {
    console.error("Error logging recommendations:", error)
  }
}

