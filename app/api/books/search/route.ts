import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const searchParams = new URL(req.url).searchParams
  const query = searchParams.get("q") || ""

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive" // optional, for case-insensitive search
            }
          },
          {
            keywords: {
              has: query
            }
          }
        ]
      },
      include: {
        bookCovers: {
          where: {
            type: "THUMBNAIL"
          }
        }
        ,
      },
      take: 8
    })

    return NextResponse.json(books)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
