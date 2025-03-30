import prisma from "@/lib/prisma"
import {  userWithProfile } from "@/Types"
import { NextRequest, NextResponse } from "next/server"


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            omit: {
                password: true
            },
            include: {
                profile: {
                    include: {
                        profilePictures: true
                    }
                }
                
            },
    }) as userWithProfile
        return NextResponse.json(user)

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error"  }, { status: 500 })
    }
}
