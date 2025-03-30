import { type NextRequest, NextResponse } from "next/server"
import prisma  from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

// Get reading history for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)  as  CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id

    const readingHistory = await prisma.readingHistory.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: { select: { name: true } },
            bookCovers: {
              where: { type: "THUMBNAIL" },
              take: 1,
            },
            pages: true,
          },
        },
      },
      orderBy: { lastReadAt: "desc" },
    })

    return NextResponse.json({ readingHistory })
  } catch (error) {
    console.error("Error fetching reading history:", error)
    return NextResponse.json({ error: "Failed to fetch reading history" }, { status: 500 })
  }
}


// Update reading progress
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as  CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await req.json()

    const { bookId, pagesRead, readingTimeMinutes , completed = false } = data

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Get the book to check total pages
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { pages: true },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Calculate if the book is completed based on pages read
    const totalPages = book.pages ? Number.parseInt(book.pages) : 0
    const isCompleted = completed || (totalPages > 0 && pagesRead >= totalPages)

    // Update or create reading history



    const getReadingHistory = await prisma.readingHistory.findUnique({
      where: { userId_bookId: { userId, bookId } },
    })
    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: {
        pagesRead: getReadingHistory &&  getReadingHistory?.pagesRead <  pagesRead ? pagesRead    :getReadingHistory &&    getReadingHistory?.pagesRead|| undefined,
        readingTimeMinutes: {
          increment: readingTimeMinutes || 0,
        },
        lastReadAt: new Date(),
        completed: isCompleted,
        finishedAt: isCompleted ? new Date() : undefined,
        abandonedAt : new Date(),
        
      },
      create: {
        userId,
        bookId,
        pagesRead: getReadingHistory &&  getReadingHistory?.pagesRead <  pagesRead ? pagesRead    : getReadingHistory &&  getReadingHistory?.pagesRead|| undefined,
        readingTimeMinutes: readingTimeMinutes || 0,
        lastReadAt: new Date(),
        completed: isCompleted,
        finishedAt: isCompleted ? new Date() : undefined,
        abandonedAt : new Date()

      },
    })

    // If this is a new completion, update recommendations
    if (isCompleted && !readingHistory.completed) {
      // You could trigger recommendation updates here
      // or use a background job
    }

    return NextResponse.json( readingHistory )
  } catch (error) {
    console.error("Error updating reading history:", error)
    return NextResponse.json({ error: "Failed to update reading history" }, { status: 500 })
  }
}

