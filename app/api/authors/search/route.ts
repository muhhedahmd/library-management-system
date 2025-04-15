import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ authors: [] })
    }

    const authors = await prisma.author.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 20,
    })

    return NextResponse.json({ authors })
  } catch (error) {
    console.error("Error searching authors:", error)
    return NextResponse.json({ error: "Failed to search authors" }, { status: 500 })
  }
}
