import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);
    const userId = searchParams.get("userId")
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id || !userId) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }


    try {
        const userPrefrance = await prisma.userPreference.findMany({
            where: {
                userId: userId,

            },
            select: {
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
                author: true,
            },
            orderBy: {
                weight: "desc"
            },
            skip: skip * take,
            take: take
        })
        const transform = {
            category: userPrefrance.map((item) => { return item.category }),
            author: userPrefrance.map((item) => { return item.author }),
        }


        return NextResponse.json(transform, { status: 200 })

    } catch (error) {

        console.error(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
