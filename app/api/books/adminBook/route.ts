import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";




export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const skip = +(searchParams.get("skip") ?? 0);
    const take = +(searchParams.get("take") ?? 10);
    const categoryId = searchParams.get("categoryId") as string;
    const publisherId = searchParams.get("publisherId") as string;
    const authorId = searchParams.get("authorId") as string;
    const query = searchParams.get("query") as string;
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (categoryId !== "all" && categoryId) where.category = { id: {
            equals : categoryId || ""
        }
     };
    if (publisherId !== "all" && publisherId) where.publisher = { id: {
        equals : publisherId || ""
    } };
    if (authorId !== "all" && authorId) where.author = { id:  {
        equals : authorId || ""
    } };

    if(query) {
        where.OR = [
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
    }

  if (categoryId) {
     
        const getChildCategories = await prisma.category.findMany({
            where: {
                parentId: categoryId
            }
        })
        where.category = { id: { in: [...getChildCategories.map((category) => category.id) , categoryId]} }
    }
    

    try {

        const books = await prisma.book.findMany({
            where: {
                userId: userId,
                ...where
            },
            include: {
                publisher: true,
                author: true,
                ratings: true,
                category: true,
                bookCovers: {
                    where: {
                        type: "THUMBNAIL"
                    },
                   

                }

            },

            skip: skip * take,
            take: take
        })




        return NextResponse.json(books, {
            status: 200
        })

    } catch (error) {
        console.log(error)

        return NextResponse.json({ error: (error as Error).message }, { status: 500 });

    }
}