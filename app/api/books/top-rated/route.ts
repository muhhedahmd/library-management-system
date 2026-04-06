import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const take = Number.parseInt(searchParams.get("take") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const categoryId = searchParams.get("categoryId")
    const minRating = Number.parseFloat(searchParams.get("minRating") || "2.0")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      averageRating: { gte: minRating },
      totalRatings: { gte: 1 },
    }

    if (categoryId) where.categoryId = categoryId

    const topRatedBooks = await prisma.book.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        isbn: true,
        authorId: true,
        userId: true,
        publisherId: true,
        categoryId: true,
        fileUrl: true,
        fileSize: true,
        fileFormat: true,
        language: true,
        pages: true,
        key: true,
        fileHash: true,
        publishedAt: true,
        price: true,
        available: true,
        createdAt: true,
        updatedAt: true,
        popularity: true,
        averageRating: true,
        totalRatings: true,
        totalFavorites: true,
        keywords: true,
        purchase: { select: { id: true } },
        ratings: { select: { id: true, rating: true, userId: true, bookId: true } },
        author: { select: { id: true, name: true, bio: true, createdAt: true, updatedAt: true } },
        publisher: { select: { id: true, name: true, website: true, createdAt: true, updatedAt: true } },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
            parent: { select: { name: true, id: true } },
          },
        },
        bookCovers: {
          where: { type: "THUMBNAIL" },
          take: 1,
          select: {
            id: true,
            fileUrl: true,
            blurHash: true,
            width: true,
            height: true,
            name: true,
            type: true,
          },
        },
      },
      // DB handles the sort — no JS sort needed after fetching
      orderBy: [
        { averageRating: "desc" },
        { totalRatings: "desc" },
      ],
      skip: skip * take,
      take,
    })

    const hasMore = topRatedBooks.length >= take

    const response = NextResponse.json({ data: topRatedBooks, hasMore })
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600")
    return response
  } catch (error) {
    console.error("Error fetching top-rated books:", error)
    return NextResponse.json({ error: "Failed to fetch top-rated books" }, { status: 500 })
  }
}
