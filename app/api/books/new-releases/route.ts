import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const take = Number.parseInt(searchParams.get("take") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const categoryId = searchParams.get("categoryId")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { available: true }
    if (categoryId) where.categoryId = categoryId

    const newReleases = await prisma.book.findMany({
      distinct: "id",
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
        _count: {
          select: { purchase: true, favorites: true },
        },
      },
      // DB handles sort — no JS sort needed
      orderBy: [
        { publishedAt: "desc" },
        { purchase: { _count: "desc" } },
        { favorites: { _count: "desc" } },
      ],
      take,
      skip: skip * take,
    })

    const hasMore = newReleases.length >= take

    const response = NextResponse.json({ data: newReleases, hasMore })
    response.headers.set("Cache-Control", "public, s-maxage=180, stale-while-revalidate=300")
    return response
  } catch (error) {
    console.error("Error fetching new releases:", error)
    return NextResponse.json({ error: "Failed to fetch new releases" }, { status: 500 })
  }
}
