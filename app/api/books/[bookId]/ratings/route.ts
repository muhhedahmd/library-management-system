import prisma from "@/lib/prisma"
import { ratingResponse } from "@/Types"

import { NextResponse } from "next/server"




export const GET = async (req: Request, { params }: { params: Promise<{ bookId: string }> }) => {


    // const session = await getServerSession(authOptions) as CustomSession
    // if (!session?.user?.id) {
    //     return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    // }

    const bookId = (await params).bookId
    if (!bookId) {
        return NextResponse.json({
            messgae: "bookId not provided "
        }, {
            status: 404
        })
    }

    try {
        const findBook = await prisma.book.findUnique({
            where: {
                id: bookId

            },
            select: {
                ratings: {
                    include: {
                        user: {
                       
                            omit: {
                                password: true
                            },
                            include: {
                                profile: {
                                    include: {
                                        profilePictures: true
                                    }
                                }
                            }
                        }
                    }
                },
            }

        }) 
        if (findBook?.ratings.length) {

            return NextResponse.json(
                findBook?.ratings as ratingResponse[] |undefined,
                {
                    status: 200
                }
            )

        }
        else {
            return NextResponse.json(
                [],
                {
                    status: 200
                }
            )

        }
    } catch (error) {
        console.error("Error fetching ratings:", error)
        return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })

    }
}