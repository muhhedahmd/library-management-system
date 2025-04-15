import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ categories: [] })
    }

    const categories = await prisma.category.findMany({
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

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error searching categories:", error)
    return NextResponse.json({ error: "Failed to search categories" }, { status: 500 })
  }
}
