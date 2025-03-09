import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"
import prisma from "@/lib/prisma"
import { categorySchema } from "@/app/_comonents/ZodScheams"

// Schema for category creation


export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as CustomSession
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check authorization (only ADMIN and EDITOR can create categories)
    if (session.user.role !== "ADMIN" && session.user.role !== "MEMBER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = categorySchema.parse(body)

    // Create category
    const category = await prisma.category.create({
      data: {
    name :validatedData.name ,
    description : validatedData.description
        // validatedData
    },

    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    console.error("Error creating category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

