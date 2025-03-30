import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { CustomSession, shapeOfCheckOutReq } from "@/Types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"



export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions) as CustomSession
    if (!session?.user?.id) {
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
    }

    const data = await req.json() as shapeOfCheckOutReq
    try {

        const createCheckOut = await prisma.checkout.create({
            data: {
                userId: session.user.id,
                checkoutDate: new Date(),
                purchase :{
                    createMany:{
                        data: data.book.map((book) => {
                            return {
                                userId: session.user.id,
                                bookId: book.bookId,
                                quantity: book.quantity,
                                price: book.price
                            }
                        }),
                    }
                },
                address: {
                    create: {
                        city: data.city,
                        state: data.state,
                        postalCode: data.zip,
                        street: data.country,
                        country: data.country,
                        userId: session.user.id
                    }
                },
                totalPrice: data.total,
                dueDate: new Date(),

            },
       
        })


        return NextResponse.json(createCheckOut , { status: 200 })

    } catch (error) {
        console.error(error)
    }

}