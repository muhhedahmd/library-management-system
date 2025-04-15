import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"




export const GET = async()=>{


    const BookId = "cm89j8noo03envnlcvjypsisn"
    

    

    try {
        const rating =  await prisma.book.findUnique({
            where :{
                id:BookId
            },
            select : {
                ratings :true
            }
        })
        if(rating){

            const totalStars =  rating?.ratings.reduce((acc , cur)=> { 
                return +acc + cur.rating } , 0)
                const avg = totalStars / rating?.ratings.length
             
                
                await prisma.book.update({
                    where :{
                        id : BookId
                    } ,
                    data:{
                        averageRating : avg,
                        totalRatings : rating.ratings.length
                    }
                })
                

                return NextResponse.json({
                    avg ,
                    totalStars ,
                    totalRatings : rating.ratings.length
                })
                
                
            }
        
    } catch (error) {
        console.log(error)




    }




}