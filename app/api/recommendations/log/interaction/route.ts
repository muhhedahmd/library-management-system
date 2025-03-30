import { type NextRequest, NextResponse } from "next/server"
import  prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

// Log user interaction with a recommendation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await req.json()

    const { logId, bookId, clicked = true, interacted = false } = data

    // We need either a logId or a bookId to find the recommendation
    if (!logId && !bookId) {
      return NextResponse.json({ error: "Either logId or bookId is required" }, { status: 400 })
    }

    let log

    if (logId) {
      // Update by log ID
      log = await prisma.recommendationLog.update({
        
        where: { id: logId },
        data: {
          clicked,
          interacted,
        },
      })
    } else {
      // Find the most recent recommendation for this book and user
      const recentLog = await prisma.recommendationLog.findFirst({

        where: {
          userId,
          bookId,
          createdAt: {
            // Look for recommendations in the last 7 days
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (recentLog) {
        // Update the existing log
        log = await prisma.recommendationLog.update({
          where: { id: recentLog.id },
          data: {
            clicked,
            interacted,
          },
        })
      } else {
        // Create a new log if none exists
        log = await prisma.recommendationLog.create({
          data: {
            userId,
            bookId,
            algorithm: "unknown", // We don't know which algorithm was used
            score: 0,
            clicked,
            interacted,
          },
        })
      }
    }

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("Error logging recommendation interaction:", error)
    return NextResponse.json({ error: "Failed to log recommendation interaction" }, { status: 500 })
  }
}

