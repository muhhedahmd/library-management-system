import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const skip = +(searchParams.get("skip") ?? 0)
  const take = +(searchParams.get("take") ?? 10)
  const categoryId = searchParams.get("categoryId") as string
  const publisherId = searchParams.get("publisherId") as string
  const authorId = searchParams.get("authorId") as string
  const query = searchParams.get("query") as string

  const session = (await getServerSession(authOptions)) as CustomSession
  const userId = session?.user?.id

  if (!session || !userId || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId }

  if (categoryId && categoryId !== "all") where.categoryId = categoryId
  if (publisherId && publisherId !== "all") where.publisherId = publisherId
  if (authorId && authorId !== "all") where.authorId = authorId

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { keywords: { has: query } },
    ]
  }

  // ── Resolve child categories in parallel with nothing else blocking it ────
  if (categoryId && categoryId !== "all") {
    const childCategories = await prisma.category.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    })
    where.categoryId = { in: [...childCategories.map((c) => c.id), categoryId] }
  }

  try {
    const books = await prisma.book.findMany({
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
        publisher: { select: { id: true, name: true, website: true, createdAt: true, updatedAt: true } },
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
      },
      skip: skip * take,
      take,
    })

    return NextResponse.json(books, { status: 200 })
  } catch (error) {
    console.error("adminBook error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
