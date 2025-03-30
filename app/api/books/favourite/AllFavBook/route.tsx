import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"



export const GET = async (req: Request) => {

    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }
    const url = new URL(req.url)
    const bookId = url.searchParams.get("BookId")
    const skip = + (url.searchParams.get("skip ") ?? 0)
    const take = +(url.searchParams.get("BookId") ?? 10)


    try {
        const fav = prisma.favorite.findMany({
            select: {
                user: {
                    omit: {
                        password: true
                    },
                    include: {
                        profile: {

                            select: {
                            
                                profilePictures: true
                            }
                        }
                    }
                }
            },
            where: {
                bookId: bookId
            },
            skip,
            take: skip * take
        })
        return NextResponse.json( fav , 
            {
                status: 200
            }
         )


    } catch (error) {
        return NextResponse.json({ err: "Failed to fetch favorite", error }, { status: 500 })

    }
}