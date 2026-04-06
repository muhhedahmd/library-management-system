import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as CustomSession
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }

  const bookId = new URL(req.url).searchParams.get("bookId")
  const userId = session.user.id

  try {
    const fav = await prisma.favorite.findUnique({
      where: { userId_bookId: { userId, bookId: bookId! } },
    })

    if (fav) return NextResponse.json({ fav }, { status: 200 })
    return NextResponse.json({}, { status: 404 })
  } catch (error) {
    console.error("Error fetching favorite:", error)
    return NextResponse.json({ err: "Error fetching favorite" }, { status: 500 })
  }
}

export const POST = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as CustomSession
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()
  const bookId: string = body.bookId

  try {
    // ── Fetch isFav + book data IN PARALLEL ─────────────────────────────────
    const [isFav, findBook] = await Promise.all([
      prisma.favorite.findUnique({
        where: { userId_bookId: { userId, bookId } },
        select: { id: true },
      }),
      prisma.book.findUnique({
        where: { id: bookId },
        select: {
          readingHistory: {
            take: 1,
            select: { completed: true, pagesRead: true },
          },
          averageRating: true,
          pages: true,
          purchase: { select: { id: true } },
          authorId: true,
          categoryId: true,
          totalFavorites: true,
        },
      }),
    ])

    if (!findBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Compute preference weight
    const weightMap = {
      favorite: isFav ? 5 : 0,
      purchase: findBook.purchase?.length ? 10 : 0,
      complete:
        findBook.readingHistory?.[0]?.completed ||
        (findBook.readingHistory?.[0]?.pagesRead ?? 0) / +(findBook.pages ?? 1) >= 0.67
          ? 8
          : 0,
      rate: findBook.averageRating && findBook.averageRating > 3.5 ? 5 : 0,
    }
    const sum = Object.values(weightMap).reduce((a, b) => a + b, 0)
    const weight = sum === 0 ? 1 : 25 / sum

    if (!isFav) {
      // ── ADD: run preference upsert + fav create + book counter in parallel ─
      const [, fav] = await Promise.all([
        prisma.userPreference.upsert({
          where: {
            userId_categoryId_authorId: {
              userId,
              categoryId: findBook.categoryId,
              authorId: findBook.authorId,
            },
          },
          update: { weight },
          create: {
            weight,
            user: { connect: { id: userId } },
            category: { connect: { id: findBook.categoryId } },
            author: { connect: { id: findBook.authorId } },
          },
        }),
        prisma.favorite.create({ data: { userId, bookId } }),
        prisma.book.update({
          where: { id: bookId },
          data: { totalFavorites: +findBook.totalFavorites + 1 },
        }),
      ])
      return NextResponse.json({ tag: "ADD", fav }, { status: 200 })
    } else {
      // ── REMOVE: run preference upsert + fav delete + book counter in parallel
      const [, fav] = await Promise.all([
        prisma.userPreference.upsert({
          where: {
            userId_categoryId_authorId: {
              userId,
              categoryId: findBook.categoryId,
              authorId: findBook.authorId,
            },
          },
          update: { weight },
          create: {
            weight,
            user: { connect: { id: userId } },
            category: { connect: { id: findBook.categoryId } },
            author: { connect: { id: findBook.authorId } },
          },
        }),
        prisma.favorite.delete({ where: { userId_bookId: { userId, bookId } } }),
        prisma.book.update({
          where: { id: bookId },
          data: { totalFavorites: Math.max(0, +findBook.totalFavorites - 1) },
        }),
      ])
      return NextResponse.json({ tag: "DEL", fav }, { status: 200 })
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return NextResponse.json({ err: "Error toggling favorite" }, { status: 500 })
  }
}
