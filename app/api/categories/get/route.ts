import prisma from "@/lib/prisma"
// import { categoryWithchildren } from "@/Types"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const pgNum = +(searchParams.get("pgnum") ?? 0)
  const pgSize = +(searchParams.get("pgsize") ?? 10)

  try {
    // Step 1: Fetch only parent categories (where parentId is null) with pagination
    const parentCategories = await prisma.category.findMany({
      where: {
        parentId: null, // Only fetch parent categories
      },
      skip: pgNum * pgSize,
      take: pgSize,
    })

    // Step 2: Fetch all children for the fetched parent categories
    const parentIds = parentCategories.map((parent) => parent.id)
    const childCategories = await prisma.category.findMany({
      where: {
        parentId: {
          in: parentIds, // Fetch children for the fetched parent categories
        },
      },
    })

    // Step 3: Combine parents and their children
    const parentsWithChildren = parentCategories.map((parent) => ({
      ...parent,
      children: childCategories.filter((child) => child.parentId === parent.id),
    }))

    return NextResponse.json(parentsWithChildren)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}