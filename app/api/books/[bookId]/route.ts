import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{ bookId: string }> }) => {
  const session = (await getServerSession(authOptions)) as CustomSession
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }

  const { bookId } = await params
  const userId = session.user.id

  try {
    // ── Run purchase check and book fetch IN PARALLEL ────────────────────────
    // Old code: await purchase → then await book (2 serial round-trips to DB)
    // New code: both fire at the same time
    const [isBought, book] = await Promise.all([
      prisma.purchase.findFirst({
        where: { userId, bookId },
        select: { id: true },
      }),
      prisma.book.findUnique({
        where: { id: bookId },
        include: {
          purchase: {
            where: { userId },
          },
          _count: {
            select: { favorites: true, ratings: true },
          },
          author: true,
          publisher: true,
          category: {
            include: { parent: true },
          },
          bookCovers: true,
          readingHistory: {
            where: { bookId },
            include: {
              user: { omit: { password: true } },
            },
          },
        },
      }),
    ])

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Omit fileUrl if not purchased (Prisma `omit` in findUnique doesn't support dynamic,
    // so we do it here at the response level — same effect, no extra query)
    if (!isBought) {
      const { fileUrl: _omit, ...bookWithoutFile } = book as typeof book & { fileUrl?: string }
      void _omit
      return NextResponse.json(bookWithoutFile, { status: 200 })
    }

    return NextResponse.json(book, { status: 200 })
  } catch (err) {
    console.error("Error fetching book:", err)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}
