import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOption"
// import { z } from "zod"
import prisma from "@/lib/prisma"
import { CustomSession, shapeOfResponseOfRatingOfUser, shapeOfResponseToggleRatting } from "@/Types"
import { Rating } from "@prisma/client"


// Schema for rating validation
// const ratingSchema = z.object({
//     bookId: z.string().min(1, "Book ID is required"),
//     value: z.number().int().min(1).max(5),
//     review: z.string().optional(),
// })

// GET: Fetch ratings for a book
export async function GET(request: Request) {
    

    try {
        const { searchParams } = new URL(request.url)
        const bookId = searchParams.get("bookId")

        const session = await getServerSession(authOptions) as CustomSession

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!bookId) {
            return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
        }

        // Build query based on parameters
        const userId = session.user.id


        // Get ratings with user information
        const rating = await prisma.rating.findUnique({
            where: {
                userId_bookId: {
                    bookId,
                    userId
                }
            },
            select: {
                id :true ,
                bookId : true ,
                rating :true ,
                review : true ,
                updatedAt : true ,
                createdAt :true ,
                userId :true ,
                user: {
                    select: {
                        name: true,
                        id: true,
                        gender: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                        profile: {
                            select: {
                                profilePictures: true
                            }
                        }
                    }
                },
            },

        })

        const transformRating = {
            id: rating?.id,
            bookId: rating?.bookId,
            rating: rating?.rating,
            review: rating?.review,
            updatedAt: rating?.updatedAt,
            createdAt: rating?.createdAt,
            userId: rating?.userId,
            user: {
                name: rating?.user?.name,
                id: rating?.user?.id,
                gender: rating?.user?.gender,
                email: rating?.user?.email,
                role: rating?.user?.role,
                createdAt: rating?.user?.createdAt,
                updatedAt: rating?.user?.updatedAt,
                profile: {
                    profilePictures: rating?.user?.profile?.profilePictures,
                }
            }
        } as shapeOfResponseOfRatingOfUser

        // Get book rating statistics

        return NextResponse.json(transformRating)
    } catch (error) {
        console.error("Error fetching ratings:", error)
        return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
    }
}

// POST: Create or update a rating
export async function POST(request: Request) {

    try {
        const session = await getServerSession(authOptions) as CustomSession

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id
        const data = await request.json() as {
            bookId?: string;
            value?: number;
            review?: string;
        }

        // Validate input data
        // const validationResult = ratingSchema.safeParse(data)
        // if (!validationResult.success) {
        //     return NextResponse.json(
        //         {
        //             error: "Invalid data",
        //             details: validationResult.error.format(),
        //         },
        //         { status: 400 },
        //     )
        // }

        const { bookId, value, review } = data

        // Check if book exists
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                favorites: {
                    where: {
                        userId: userId
                    }
                }
            }
        })

        if (!book) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 })
        }

        // Check if user has already rated this book
        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        })

        // Start a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            let rating: Rating

            if (existingRating) {
                // Update existing rating
                rating = await tx.rating.update({
                    where: {
                        id: existingRating.id,
                    },
                    data: {
                        rating: value,
                        review: review,
                        updatedAt: new Date(),
                    },
                })
            } else {
                // Create new rating
                rating = await tx.rating.create({
                    data: {
                        userId,
                        bookId,
                        rating: value,
                        review: review || "",
                    },
                })
            }

            // Recalculate average rating and total ratings
            const aggregations = await tx.rating.aggregate({
                where: {
                    bookId,
                },
                _avg: {
                    rating: true,
                },
                _count: {
                    rating: true,
                },
            })

            // Update book with new statistics
            await tx.book.update({
                where: {
                    id: bookId,
                },
                data: {
                    averageRating: aggregations._avg.rating || 0,
                    totalRatings: aggregations._count.rating || 0,
                },
            })

            // Update user preferences based on rating
            if (value >= 3) {
                // For high ratings (4-5), strengthen user preference for this book's category
                const categoryId = book.categoryId

                // Check if preference exists
                const authorId = book.authorId
                const existingPreference = await tx.userPreference.findFirst({
                    where: {
                        userId,
                        categoryId,
                        authorId
                    },
                })

                if (existingPreference) {
                    // Increase weight of existing preference
                    await tx.userPreference.update({
                        where: {
                            id: existingPreference.id,
                        },
                        data: {
                            weight: Math.min(10, existingPreference.weight + 1), // Cap at 10
                        },
                    })
                } else {
                    // Create new preference
                    await tx.userPreference.create({
                        data: {
                            authorId,
                            userId,
                            categoryId,
                            weight: 5 + (book?.favorites?.length ? 1 : 0), // Start with medium weight
                        },
                    })
                }

                // Also add author preference

            }

            return { rating, isNew: !existingRating }
        })


        return NextResponse.json({
            message: result.isNew ? "created" : "updated",
            rating: result.rating,
        } as shapeOfResponseToggleRatting, { status: 200 })
    } catch (error) {
        console.error("Error creating/updating rating:", error)
        return NextResponse.json({ error: "Failed to save rating" }, { status: 500 })
    }
}

