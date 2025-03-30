import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"

// Get user preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id

    const preferences = await prisma.userPreference.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
      },
    })

    // Group preferences by type
    const categoryPreferences = preferences.filter((p) => p.categoryId)
    const authorPreferences = preferences.filter((p) => p.authorId)

    return NextResponse.json({
      preferences,
      categoryPreferences,
      authorPreferences,
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
  }
}

// Add or update a preference
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await req.json()

    const { categoryId, authorId, weight = 5 } = data

    if (!categoryId && !authorId) {
      return NextResponse.json({ error: "Either categoryId or authorId is required" }, { status: 400 })
    }

    // Validate weight is between 1 and 10
    const validWeight = Math.min(Math.max(1, weight), 10)

    // Create or update the preference
    const preference = await prisma.userPreference.upsert({
      where: {
        userId_categoryId_authorId: {
          userId,
          categoryId: categoryId || null,
          authorId: authorId || null,
        },
      },
      update: {
        weight: validWeight,
      },
      create: {
        userId,
        categoryId: categoryId || null,
        authorId: authorId || null,
        weight: validWeight,
      },
    })

    return NextResponse.json({ preference })
  } catch (error) {
    console.error("Error updating user preference:", error)
    return NextResponse.json({ error: "Failed to update user preference" }, { status: 500 })
  }
}

