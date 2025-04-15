import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { BooksResForAnalytics, CustomSession, orderBy, orderByDirection } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);
    const orderByField = searchParams.get("orderByField") as orderBy;
    const orderByDir = searchParams.get("orderByDir") as orderByDirection;
    const orderBy = orderByField && orderByDir ?
        orderByField === "readingHistory" ? {
            readingHistory: {
                _count: orderByDir
            }
        } : orderByField === "popularity" ? {
            readingHistory: {
                _count: orderByDir
            }
        } : orderByField === "favorites" ? {
            ratings: {
                _count: orderByDir
            }
        } : { [orderByField]: orderByDir } : undefined;

    if (!session || !userId || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const books = await prisma.book.findMany({
            distinct: "id",
            where: {
                userId
            },
            include: {
                bookCovers: {
                    where: {
                        type: "THUMBNAIL"
                    },
                    take: 1
                },
                category: true,
                publisher: true,
                author: true,
                ratings: true,
                purchase: {
                    include: {
                        user: {
                            include: {
                                profile: {
                                    select: {
                                        profilePictures: true
                                    }
                                }
                            }
                        },
                    }
                }

            },

            orderBy,
            skip: skip * take,
            take: take,


        }) as BooksResForAnalytics[]

        return NextResponse.json({
            books,
            hasMore: books.length === take
        }, {
            status: 200
        })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}





