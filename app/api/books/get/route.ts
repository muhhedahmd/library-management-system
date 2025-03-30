import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma"
import { BooksRes, CustomSession, orderBy, orderByDirection } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);
    const category = searchParams.get("category") as string;
    const publisher = searchParams.get("publisher") as string;
    const author = searchParams.get("author") as string;
    const orderByField = searchParams.get("orderByField") as orderBy;
    const orderByDir = searchParams.get("orderByDir") as orderByDirection;
    const price = +(searchParams.get("price") ?? 0)
    const MoreOrLessPrice = +(searchParams.get("MoreOrLessPrice") ?? 0)
    const range = +(searchParams.get("range") ?? 0)
    const minPrice = +(searchParams.get("minPrice") ?? 0)
    const maxPrice = +(searchParams.get("maxPrice") ?? 0)

    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }


    const userID = session.user.id

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (category) where.category = { name: category };
        if (publisher) where.publisher = { name: publisher };
        if (author) where.author = { name: author };

        if (price) {
            where.price = MoreOrLessPrice == 1
                ? { gte: price }
                : MoreOrLessPrice == 2 ?
                    { lte: price } : undefined
        }
        if (range) {
            where.price = { gte: minPrice, lte: maxPrice }
        }


        const orderBy = orderByField && orderByDir ? { [orderByField]: orderByDir } : undefined;


        const books: BooksRes[] = await prisma.book.findMany({
            distinct: ["id"],
            where: {
                ...where,

            },
            include: {

                purchase: {
                    where: {
                        userId: userID
                    }
                },
                category: true,
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
            orderBy,
            skip: skip * take,
            take: take,
        });
        console.log(books.map((book) => book.id))

        return NextResponse.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}