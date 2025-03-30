import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"



export const GET = async (req: Request, { params }: { params: Promise<{ bookId: string }> }) => {


    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const bookId = (await params).bookId

    try {
        const isBued = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                bookId
            },
        })
        const book = await prisma.book.findUnique({

            where: {
                id: bookId

            },
            omit: {
                fileUrl: isBued ? false : true,
            },
            include: {
                 
                purchase: {
                    where: {
                        userId: session.user.id

                    },
                },
                _count: {
                    select: {
                        favorites: true,
                        ratings: true
                    }
                },

                author: true,
                publisher: true,
                category: {
                    include: {
                        parent: true,
                    },
                },
                bookCovers: true,

                readingHistory: {
                    where: {
                        bookId
                    },
                    include: {
                        user: {
                            omit: {
                                password: true
                            }
                        },
                    },
                },
            },

        })

        return NextResponse.json(book, {
            status: 200
        })




    } catch (err) {
        console.error("Error fetching book:", err)
        return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })

    }
}