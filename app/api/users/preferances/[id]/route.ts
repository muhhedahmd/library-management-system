import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"



// DELETE: Remove a user preference
export async function DELETE(request: Request, {  params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const preferenceId =(await params).id

    // Check if the preference exists and belongs to the user
    const preference = await prisma.userPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    })

    if (!preference) {
      return NextResponse.json({ error: "Preference not found" }, { status: 404 })
    }

    // Delete the preference
    await prisma.userPreference.delete({
      where: {
        id: preferenceId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Preference deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user preference:", error)
    return NextResponse.json({ error: "Failed to delete preference" }, { status: 500 })
  }
}
