import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";




export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    try {

        const books = await prisma.book.findMany({
            where: {
                userId: userId
            },
            include: {
                author: true,
                ratings: true,
                category: true
            },
            skip: skip * take,
            take: take
        })
        return NextResponse.json(books, {
            status: 200
        })

    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });

    }
}