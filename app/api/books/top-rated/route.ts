import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const take = Number.parseInt(searchParams.get("take") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
        const categoryId = searchParams.get("categoryId")
    const minRating = Number.parseFloat(searchParams.get("minRating") || "2.0")

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      averageRating: {
        gte: minRating ,
      },
      totalRatings: {
        gte: 1, // At least one rating
      },
    }

    if (categoryId) {
      // whereClause.categoryId = categoryId
    }

    // Get top-rated books
    const topRatedBooks = await prisma.book.findMany({
      where: whereClause,
      include: {

   
        category: {
            include: {
                parent: {
                    select: {
                        name: true,
                        id: true

                    }
                }
            },
        },
        ratings: true,
        author: true,
        publisher: true,

        bookCovers: {
            where: {
                type: "THUMBNAIL"
            },
            take: 1
        }
    },
      orderBy: [
        {
          averageRating: "desc",
        },
        {
          totalRatings: "desc",
        },
      ],
      skip: skip * take,
      take 
    })
    if( topRatedBooks.length < 10) {
      return NextResponse.json({
        data :topRatedBooks.sort((a,b)=> b.averageRating - a.averageRating ) ,
        hasMore : false 
  
      })
    }

    return NextResponse.json({
      data :topRatedBooks.sort((a,b)=> b.averageRating - a.averageRating ) ,
      hasMore : true 

    })


  } catch (error) {
    console.error("Error fetching top-rated books:", error)
    return NextResponse.json({ error: "Failed to fetch top-rated books" }, { status: 500 })
  }
}

