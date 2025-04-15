import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma"
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"


export const GET = async () => {
   
   try {
    
       const session = (await getServerSession(authOptions)) as CustomSession;
       const userId = session?.user?.id;
       
       if (!session || !userId || session.user.role !== "ADMIN") {
           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const count = await prisma.book.count({
            where: { userId }
        })
        return NextResponse.json({ count }, { status: 200 })
    } catch (error) {
     
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

    

}
