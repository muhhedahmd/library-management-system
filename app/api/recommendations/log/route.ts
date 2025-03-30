import { type NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"


// Log that recommendations were shown to a user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await req.json()

    const { recommendations } = data

    if (!recommendations || !Array.isArray(recommendations)) {
      return NextResponse.json({ error: "Recommendations array is required" }, { status: 400 })
    }

    // Create recommendation logs
    const logs = await prisma.$transaction(
      recommendations.map((rec) =>
        prisma.recommendationLog.create({
          data: {
            userId,
            bookId: rec.bookId,
            algorithm: rec.algorithm || "hybrid",
            score: rec.score || 0,
          },
        }),
      ),
    )

    return NextResponse.json({ success: true, count: logs.length })
  } catch (error) {
    console.error("Error logging recommendations:", error)
    return NextResponse.json({ error: "Failed to log recommendations" }, { status: 500 })
  }
}

// Get recommendation logs for analysis
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    // Only allow admins to access this endpoint
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams
    const algorithm = searchParams.get("algorithm")
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      createdAt: {
        gte: startDate,
      },
    }

    if (algorithm) {
      whereClause.algorithm = algorithm
    }

    // Get logs with aggregated metrics
    const logs = await prisma.recommendationLog.findMany({
      where: whereClause,
      include: {
        book: {
          select: {
            title: true,
            author: { select: { name: true } },
          },
        },
      },
    })

    // Calculate metrics
    const totalRecommendations = logs.length
    const clickedRecommendations = logs.filter((log) => log.clicked).length
    const interactedRecommendations = logs.filter((log) => log.interacted).length

    const clickThroughRate = totalRecommendations > 0 ? clickedRecommendations / totalRecommendations : 0

    const interactionRate = totalRecommendations > 0 ? interactedRecommendations / totalRecommendations : 0

    // Group by algorithm
    const algorithmPerformance = logs.reduce(
      (acc, log) => {
        const alg = log.algorithm
        if (!acc[alg]) {
          acc[alg] = { total: 0, clicked: 0, interacted: 0   ,
            clickThroughRate: 0, interactionRate: 0,
          }
        }

        acc[alg].total += 1
        if (log.clicked) acc[alg].clicked += 1
        if (log.interacted) acc[alg].interacted += 1

        return acc
      },
      {} as Record<string, { total: number; clicked: number; interacted: number ,        clickThroughRate, interactionRate
       }>,
    )

    // Calculate rates for each algorithm
    Object.keys(algorithmPerformance).forEach((alg) => {
      const perf = algorithmPerformance[alg]
      perf.clickThroughRate = perf.total > 0 ? perf.clicked / perf.total : 0
      perf.interactionRate = perf.total > 0 ? perf.interacted / perf.total : 0
    })

    return NextResponse.json({
      metrics: {
        totalRecommendations,
        clickedRecommendations,
        interactedRecommendations,
        clickThroughRate,
        interactionRate,
      },
      algorithmPerformance,
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
    })
  } catch (error) {
    console.error("Error fetching recommendation logs:", error)
    return NextResponse.json({ error: "Failed to fetch recommendation logs" }, { status: 500 })
  }
}

