import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const readingHistory = await prisma.readingHistory.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: {
          include: {
            author: true,
            bookCovers: true,
          },
        },
      },
      orderBy: {
        lastReadAt: "desc",
      },
      take: 10,
    })

    return NextResponse.json(readingHistory)
  } catch (error) {
    console.error("Error fetching reading history:", error)
    return NextResponse.json({ error: "Failed to fetch reading history" }, { status: 500 })
  }
}
