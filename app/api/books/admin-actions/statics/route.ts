import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession, Statics } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const GET = async () => {
    const session = (await getServerSession(authOptions)) as CustomSession;
    
    const userId =  session?.user?.id; 
    
    if (!session || !userId || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    try {
        const favoriteAggregate = await prisma.favorite.aggregate({
            _count: true,
            _max :{
                createdAt: true
            },


            where: {
                book: {
                    userId: userId
                }
            }
        })


        const purchaseAggregate = await prisma.purchase.aggregate({
            _count: true,
            _sum:{
                price: true
            },
            where: {
                book: {
                    userId: userId
                    
                }
            }
        })
        const ratingAggregate = await prisma.rating.aggregate({
            _count: true,
            _avg : {
                rating: true
            } ,
            where: {
                book: {
                    userId: userId
                    
                }
            }
        })
        const readingHistoryAggregate = await prisma.readingHistory.aggregate({
            _count: true,

     
            where: {
                book: {
                    userId: userId,

                    readingHistory :{
                    some :{
                        pagesRead :{
                            gte :0 
                        }
                    }
                    }
                    
                }
            }
        })

        return NextResponse.json({
            favoriteAggregate,
            purchaseAggregate,
            ratingAggregate,
            readingHistoryAggregate
        } as Statics  , {
            status: 200
        })






        
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}
