import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const GET = async (req: Request) => {
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;


    if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url)
    const search = url.searchParams.get("search")
    const isLibrary = + url.searchParams.get("isLibrary") as number ? true : false
    try {
        if (isLibrary) {

            const purchases = await prisma.purchase.findMany({
                where: {
                    userId,
                },
            })
            const Books = await prisma.book.findMany({
                where: {
                    AND: {
                        id: {
                            in: purchases.map((b) => b.bookId)
                        },

                        OR: [
                            { title: { contains: search } },
                            { author: { name: { contains: search } } },
                            { category: { name: { contains: search } } },
                            {
                                keywords: {
                                    equals: search.split(" ")
                                }
                            },
                        ],

                    }
                },
                include: {
                    category: true,
                    author: true,
                },
            })
            return NextResponse.json(Books, {
                status: 200,
            })
        }
        const Books = await prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: search } },
                    { author: { name: { contains: search } } },
                    { category: { name: { contains: search } } },
                    {
                        keywords: {
                            equals: search.split(" ")
                        }
                    },
                ],
            },
            include: {
                category: true,
                author: true,
            },
        })
        return NextResponse.json(Books, {
            status: 200,
        })




    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });

    }

}