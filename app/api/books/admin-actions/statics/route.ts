import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession, Statics } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async () => {
  const session = (await getServerSession(authOptions)) as CustomSession
  const userId = session?.user?.id

  if (!session || !userId || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // ── All 4 aggregates fire at the SAME TIME ───────────────────────────────
    // Old code: 4 serial awaits = 4× round-trip time
    // New code: one Promise.all = time of the slowest single query
    const [
      favoriteAggregate,
      purchaseAggregate,
      ratingAggregate,
      readingHistoryAggregate,
    ] = await Promise.all([
      prisma.favorite.aggregate({
        _count: true,
        _max: { createdAt: true },
        where: { book: { userId } },
      }),
      prisma.purchase.aggregate({
        _count: true,
        _sum: { price: true },
        where: { book: { userId } },
      }),
      prisma.rating.aggregate({
        _count: true,
        _avg: { rating: true },
        where: { book: { userId } },
      }),
      prisma.readingHistory.aggregate({
        _count: true,
        where: {
          book: {
            userId,
            readingHistory: { some: { pagesRead: { gte: 0 } } },
          },
        },
      }),
    ])

    return NextResponse.json(
      { favoriteAggregate, purchaseAggregate, ratingAggregate, readingHistoryAggregate } as Statics,
      { status: 200 }
    )
  } catch (error) {
    console.error("statics error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
