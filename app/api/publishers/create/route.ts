import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { z } from "zod"
import { authOptions } from "@/lib/authOption"
import { CustomSession } from "@/Types"
import prisma from "@/lib/prisma"
import { publisherSchema } from "@/app/_components/ZodScheams"

// Schema for publisher creation

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as CustomSession
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check authorization (only ADMIN and EDITOR can create publishers)
    if (session.user.role !== "ADMIN" ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = publisherSchema.parse(body)


    // Create publisher
    const publisher = await prisma.publisher.create({
      data:  {
        name : validatedData.name ,
        website : validatedData.website
    },
    })

    return NextResponse.json(publisher, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    console.error("Error creating publisher:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
