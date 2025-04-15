import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

// Mark a book as abandoned


export async function GET(req: Request, { params }: { params: Promise<{ id: string }>  }) {
  const session = await getServerSession(authOptions) as CustomSession
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }
  const userId = session.user.id
  const bookId = (await params).id

  try {
    const readingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_bookId:{

          bookId: bookId,
          userId,
        }
      },

    })
    return NextResponse.json(readingHistory, { status: 200 })

  } catch (error) {
    console.error(error)

    return NextResponse.json(error, { status: 400 })

  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const historyId = params.id
    const data = await req.json()

    const { abandoned = false } = data

    // Check if the reading history exists and belongs to the user
    const existingHistory = await prisma.readingHistory.findFirst({
      where: {
        id: historyId,
        userId,
      },
    })

    if (!existingHistory) {
      return NextResponse.json({ error: "Reading history not found" }, { status: 404 })
    }

    // Update the reading history
    const readingHistory = await prisma.readingHistory.update({
      where: { id: historyId },
      data: {
        abandonedAt: abandoned ? new Date() : null,
      },
    })

    return NextResponse.json({ readingHistory })
  } catch (error) {
    console.error("Error updating reading history:", error)
    return NextResponse.json({ error: "Failed to update reading history" }, { status: 500 })
  }
}

// Delete reading history
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const historyId = params.id

    // Check if the reading history exists and belongs to the user
    const existingHistory = await prisma.readingHistory.findFirst({
      where: {
        id: historyId,
        userId,
      },
    })

    if (!existingHistory) {
      return NextResponse.json({ error: "Reading history not found" }, { status: 404 })
    }

    // Delete the reading history
    await prisma.readingHistory.delete({
      where: { id: historyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reading history:", error)
    return NextResponse.json({ error: "Failed to delete reading history" }, { status: 500 })
  }
}

