import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import { CustomSession, ReadingHistoryForBook } from "@/Types"


export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const bookId = searchParams.get('bookId')

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);


    try {
        const readingHistory = await prisma.readingHistory.findMany({
            where: {
                bookId: bookId
            },
            include: {
                user: {
                   
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                profilePictures: true
                            }
                        }
                    }
                }
            },
            skip  : skip * take,
            take : take,
            orderBy: {
                createdAt: "desc"
            }
        }) as ReadingHistoryForBook[]
        
        return NextResponse.json(readingHistory)
        
    } catch (error) {
        console.error("Error fetching reading history:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}   
