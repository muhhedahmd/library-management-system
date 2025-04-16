import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get reading history count
    const readingHistoryCount = await prisma.readingHistory.count({
      where: {
        userId: userId,
        // completed: true,
      },
    })

    // Get favorites count
    const favoritesCount = await prisma.favorite.count({
      where: {
        userId: userId,
      },
    })

    // Get reviews count
    const reviewsCount = await prisma.rating.count({
      where: {
        userId: userId,
        review: {
          not: null,
        },
      },
    })

    // Get reading streak (simplified calculation)
    const readingHistory = await prisma.readingHistory.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        lastReadAt: "desc",
      },
      take: 30, // Last 30 days
    })

    // Simple streak calculation (this is a simplified version)
    let streak = 0
    // const today = new Date()
    const lastMonth = new Date()
    lastMonth.setDate(lastMonth.getDate() - 30)

    // This is a simplified streak calculation
    // In a real app, you'd want a more sophisticated algorithm
    if (readingHistory.length > 0) {
      streak = 7 // Placeholder value
    }

    // Get purchase count
    const purchaseCount = await prisma.purchase.count({
      where: {
        userId: userId,
      },
    })

    return NextResponse.json({
      booksRead: readingHistoryCount,
      readingGoal: 20, // Hardcoded for now, could be from user preferences
      favoriteBooks: favoritesCount,
      reviewsWritten: reviewsCount,
      readingStreak: streak,
      booksPurchased: purchaseCount,
    })
  } catch (error) {
    console.error("Error fetching member stats:", error)
    return NextResponse.json({ error: "Failed to fetch member stats" }, { status: 500 })
  }
}
