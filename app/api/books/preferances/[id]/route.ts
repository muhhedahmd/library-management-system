import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"

// Delete a preference
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const preferenceId = params.id

    // Check if the preference exists and belongs to the user
    const existingPreference = await prisma.userPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    })

    if (!existingPreference) {
      return NextResponse.json({ error: "Preference not found" }, { status: 404 })
    }

    // Delete the preference
    await prisma.userPreference.delete({
      where: { id: preferenceId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting preference:", error)
    return NextResponse.json({ error: "Failed to delete preference" }, { status: 500 })
  }
}

// Update a preference weight
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)as CustomSession
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const preferenceId = params.id
    const data = await req.json()

    const { weight } = data

    if (weight === undefined) {
      return NextResponse.json({ error: "Weight is required" }, { status: 400 })
    }

    // Check if the preference exists and belongs to the user
    const existingPreference = await prisma.userPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    })

    if (!existingPreference) {
      return NextResponse.json({ error: "Preference not found" }, { status: 404 })
    }

    // Validate weight is between 1 and 10
    const validWeight = Math.min(Math.max(1, weight), 10)

    // Update the preference
    const preference = await prisma.userPreference.update({
      where: { id: preferenceId },
      data: {
        weight: validWeight,
      },
    })

    return NextResponse.json({ preference })
  } catch (error) {
    console.error("Error updating preference:", error)
    return NextResponse.json({ error: "Failed to update preference" }, { status: 500 })
  }
}

