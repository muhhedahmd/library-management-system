import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"
import prisma from "@/lib/prisma"
import { authorSchema } from "@/app/_comonents/ZodScheams"

// Schema for author creation

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as CustomSession
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check authorization (only ADMIN and EDITOR can create authors)
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await req.json() as typeof authorSchema._type
    const validatedData = authorSchema.parse({
      bio: body.bio,
      birthdate: body.birthdate ? new Date(body.birthdate) : null,
      name: body.name,
      nationality: body.nationality

    })
    const isAlreadyExisitAuthor = await prisma.author.findFirst({
      where: {
        name: validatedData.name
      }
    })
    if (isAlreadyExisitAuthor) {
      return NextResponse.json({ message: "Author is already Exisit" }, { status: 400 })

    }
    // Create author
    const author = await prisma.author.create({
      data: {
        birthdate: validatedData.birthdate ? new Date(validatedData.birthdate) : null,
        name: validatedData.name,
        bio: validatedData.bio,
        nationality: validatedData.nationality,
      },
    })

    return NextResponse.json(author, { status: 201 })
  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    // }

    console.error("Error creating author:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

