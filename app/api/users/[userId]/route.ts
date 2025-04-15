import { CustomSession } from "@/Types";
import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";





export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId: paramsUserId } = await params;

    const session = (await getServerSession(authOptions
    )) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId || userId !== paramsUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {

        const isExisiting = await prisma.user.findUnique({

            where: {
                id: paramsUserId,

            },
            select: {
                email: true,
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                gender: true,
                role: true,
                password: true,
                profile: {
                    include: {
                        profilePictures: true
                    }
                }
            }
        });
        return NextResponse.json(isExisiting);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }




}
