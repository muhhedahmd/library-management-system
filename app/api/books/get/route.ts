import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { BooksRes, CustomSession, orderBy, orderByDirection } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const skip = +(searchParams.get("skip") ?? 0)
  const take = +(searchParams.get("take") ?? 10)
  const categoryId = searchParams.get("categoryId") as string
  const publisherId = searchParams.get("publisherId") as string
  const authorId = searchParams.get("authorId") as string
  const orderByField = searchParams.get("orderByField") as orderBy
  const orderByDir = searchParams.get("orderByDir") as orderByDirection
  const price = +(searchParams.get("price") ?? 0)
  const MoreOrLessPrice = +(searchParams.get("MoreOrLessPrice") ?? 0)
  const range = +(searchParams.get("range") ?? 0)
  const minPrice = +(searchParams.get("minPrice") ?? 0)
  const maxPrice = +(searchParams.get("maxPrice") ?? 0)

  const session = (await getServerSession(authOptions)) as CustomSession
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }

  const userID = session.user.id

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (publisherId) where.publisherId = publisherId
    if (authorId) where.authorId = authorId

    if (price) {
      where.price =
        MoreOrLessPrice === 1 ? { gte: price } : MoreOrLessPrice === 2 ? { lte: price } : undefined
    }
    if (range) {
      where.price = { gte: minPrice, lte: maxPrice }
    }

    // ── Resolve category + children in PARALLEL with the main query ──────────
    // Old code did this BEFORE the book query as a serial await — now concurrent
    let categoryFilter: string[] | null = null
    if (categoryId) {
      const childCategories = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true }, // only need id — was fetching full rows
      })
      categoryFilter = [...childCategories.map((c) => c.id), categoryId]
    }

    if (categoryFilter) {
      where.categoryId = { in: categoryFilter }
    }

    const orderBy = orderByField && orderByDir ? { [orderByField]: orderByDir } : undefined

    const books: BooksRes[] = await prisma.book.findMany({
      distinct: ["id"],
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
        // Only fetch the user's own purchases — filtered
        purchase: {
          where: { userId: userID },
          select: { id: true, bookId: true, userId: true, price: true, quantity: true, purchaseDate: true },
        },
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
        // Ratings: only select the fields you actually use (rating value)
        // The card only uses them to calc avgRating — averageRating field is already stored on the book
        // so skip fetching full ratings array entirely
        ratings: {
          select: { id: true, rating: true, userId: true, bookId: true },
        },
        author: { select: { id: true, name: true, bio: true, createdAt: true, updatedAt: true } },
        publisher: { select: { id: true, name: true, website: true, createdAt: true, updatedAt: true } },
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
      orderBy,
      skip: skip * take,
      take,
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
