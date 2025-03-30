import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


 
export const GET = async (req :Request)=>{
    const session = (await getServerSession(authOptions)) as CustomSession;

    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!session || !userId ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const purchase = await prisma.purchase.findMany({
            where: {
                userId: userId
            }
        })
        const libraryItems = await prisma.book.findMany({
    
            where: {
                id: {
                    in: purchase.map((pur) => pur.bookId)
                }
            },
            include: {
                purchase:{
                    select:{
                        purchaseDate:true,
                    },
                    take:1
                },
                author: true,
                category: true,
                bookCovers: {
                    where: {
                        type: "THUMBNAIL",
                    },
                },
    
            },
            orderBy: {
                totalRatings : "desc"
    
            },
        }) 
        return NextResponse.json(libraryItems)
        
    } catch (error) {
        console.error("Error fetching library items:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
    }

} 