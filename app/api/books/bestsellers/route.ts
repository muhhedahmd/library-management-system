import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const take = Number.parseInt(searchParams.get("limit") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const categoryId = searchParams.get("categoryId")

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      available: true,
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    // Get bestsellers based on library items (purchases)
    const bestsellers = await prisma.book.findMany({
      where: whereClause,
      include: {
        ratings : true ,
        author: true,
        category: true,
        bookCovers: {
          where: {
            type: "THUMBNAIL",
          },
        },
        _count: {
          select: {
            purchase: true, // Count of purchases
            favorites: true,
          },
        },
      },
      orderBy: [
        {
          purchase: {
            _count: "desc",
          },
        },
        {
          favorites: {
            _count: "desc",
          },
        },
      ],
      take,
      skip : +skip *  +take
    })
    if( bestsellers.length < 10) {
      return NextResponse.json({
        data :bestsellers ,
        hasMore : false 
  
      })
    }

    return NextResponse.json({
      data :bestsellers ,
      hasMore : true 

    })

  } catch (error) {
    console.error("Error fetching bestsellers:", error)
    return NextResponse.json({ error: "Failed to fetch bestsellers" }, { status: 500 })
  }
}

