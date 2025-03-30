import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"



export const GET = async (req: Request) => {

    const url = new URL(req.url)
    const bookId = url.searchParams.get("bookId")
    const session = await getServerSession(authOptions) as CustomSession
    const userId = session.user.id
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    try {

        const fav = await prisma.favorite.findUnique({
            where: {
                userId_bookId: {

                    userId,
                    bookId
                }

            }
        })
        if (fav) {
            return NextResponse.json({ fav },
                { status: 200 }
            )
        }

        return NextResponse.json({},
            { status: 404 }
        )


    } catch (error) {
        console.log(error)
        return NextResponse.json({ err: "Error fetching favorite", error }, { status: 500 })
    }
}



export const POST = async (req: Request) => {


    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()



    try {
        const isFav = await prisma.favorite.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId: body.bookId
                }
            }
        })
        const findBook = await prisma.book.findUnique({
            where: {
                id: body.bookId
            },


            select: {
                readingHistory: {
                    take: 1,
                    select: {
                        completed: true,
                        pagesRead: true,
                    }
                },
                averageRating: true,
                pages: true,
                // ratings: true,
                purchase: true,
                authorId: true,
                categoryId: true,
                totalFavorites: true
            }
        })
        if (!findBook) {

            return NextResponse.json({ error: "Book not found" }, { status: 404 })
        }

        const weightMap = {
            favorite: isFav ? 5 : 0,
            purchase: findBook.purchase?.length ? 10 : 0,
            complete: findBook?.readingHistory?.length
                && findBook?.readingHistory?.[0]?.completed
                || (findBook.readingHistory?.[0]?.pagesRead / + findBook?.pages) * 100 >= 67 ?
                8 : 0
            ,
            rate: findBook?.averageRating && findBook?.averageRating > 3.5 ? 5 : 0
        };
        const numericValues = Object.values(weightMap).filter(value => typeof value === 'number');

        const sum = numericValues.reduce((acc, value) => acc + value, 0);
        const average = sum === 0 ? 1 : 25 / sum;
        await prisma.userPreference.upsert({
            where: {
                userId_categoryId_authorId: {
                    userId,
                    categoryId: findBook.categoryId,
                    authorId: findBook.authorId
                }
            },
            update: {
                weight: average
            },
            create: {
                category: {
                    connect: {
                        id: findBook.categoryId,

                    }
                },
                author: {
                    connect: {

                        id: findBook.authorId,
                    }
                },
                weight: average,
                user: {
                    connect: {
                        id: userId 
                    }

                }
            },

        })
        if (!isFav) {
            const fav = await prisma.favorite.create({
                data: {
                    userId,
                    bookId: body.bookId
                }
            })
            await prisma.book.update({
                where: {
                    id: body.bookId
                },
                data: {
                    totalFavorites: +findBook.totalFavorites + 1
                }
            })

            return NextResponse.json({
                tag: "ADD",
                fav
            }, { status: 200 })
        }
        else {
            const fav = await prisma.favorite.delete({
                where: {
                    userId_bookId: {
                        userId,
                        bookId: body.bookId
                    }
                }
            })
            await prisma.book.update({
                where: {
                    id: body.bookId
                },
                data: {
                    totalFavorites: +findBook.totalFavorites - 1
                }
            })
            return NextResponse.json({
                tag: "DEL",
                fav
            }, { status: 200 })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ err: "Error fetching favorite", error }, { status: 500 })
    }
}