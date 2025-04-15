import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";




export const GET = async ()=>{

    const ids  =[
        "cm89iadh7006kvnlcpag9g85t",
        "cm89i9eu40052vnlcev6j7atk",
        "cm89i9vwe005qvnlcgtm11q6t",
        "cm89ia8j60068vnlc5kzn5klx",
        "cm89iq5sg0157vnlc1zzmtywm",
        "cm89i9ynd005wvnlcbgclbf3w",
        "cm89iazf80072vnlczn5s9623",
        "cm89iaav3006evnlcgdzkyoda",
        "cm89ijvvo00cjvnlcz7egsw9m",
        "cm89j5m900309vnlctf9j1g4w",
        "cm89iken200ezvnlc6srvkh6y",
        "cm89j6m1p034tvnlckxgcediv",
        "cm89ipgpt0123vnlc7nl1avy1",
        "cm89j63hq032hvnlcgajxdbot",
        "cm89iy9u30237vnlchyqjt7tx",
        "cm89isj4901dxvnlcnyjfuhbm",
        "cm89j7io20397vnlc32drw41n",
        "cm89ipien012bvnlcvntx0vjv",
        "cm89ibngq008kvnlcrzheodwd",
        "cm89j7tfm03ajvnlckg3q9tmc",
        "cm89inhp500t3vnlc73n27770",
        "cm89iberj0088vnlc8fgit54a",
        "cm89iqm0r016xvnlctnetkcga",
        "cm89iq3no014zvnlc8p4r73uj",
        "cm89j7ye503b7vnlct2i6oh6h",
        "cm89ixfqp01zlvnlcoxwolzog",
        "cm89it7g001gzvnlc3t6fmlah",
        "cm89intl300unvnlcgrrkf3te",
        "cm89innoz00tvvnlcgzkiga20",
        "cm89isppd01ervnlc8kyn3lpy",
        "cm89ipyb0014dvnlc7xokotrq",
        "cm89iyuke025hvnlcpre3xu1r",
        "cm89iyyg4025vvnlc3ajvl6bb",
        "cm89j8kd303e7vnlc0yudhto1",
        "cm89iwz2p01xpvnlc3l6plt4e",
        "cm89j372h02p1vnlcrpnvh3zd",
        "cm89imxm600qhvnlceckmg1rb",
        "cm89izsxn029lvnlcxkamtkzb",
        "cm89isdx601d9vnlchbvkm7zb",
        "cm89iqdgc0161vnlcjtpjiwrd",
        "cm89ikjfm00flvnlc7ytemher",
        "cm89inpe600u3vnlcdexe4sbz",
        "cm89i90rq004evnlcmrvvpmef"
    ]
    try {
        const  fix = ids.map( async (id )=>{

            const allFav = await prisma.favorite.count({
                where :{
                    bookId : id
                }
            })
            if(allFav){
                console.log(
                    {

                        count : allFav ,
                        id ,
                    }
                )
                await prisma.book.update({
                    where :{
                        id 
                    },
                    data :{
                        totalFavorites : allFav
                    }
                })
            }


        })
        return NextResponse.json(fix)

        
    } catch (error) {
        console.log(error)
        
    }


}