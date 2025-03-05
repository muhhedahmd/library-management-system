import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { GENDER, Profile, ProfilePicture, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export const GET = async (req: Request) => {
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const Profile = await prisma.profile.findUnique({
            where: {
                userId: userId
            },
       
            include: {
                user:{
                    select:{
                        id :true
                    }
                },
                profilePictures: true
            }
        })
        return NextResponse.json(Profile,
            {
                status: 200
            }
        )


    } catch (error) {
        return NextResponse.json(error, {
            status: 400
        })

    }




}