import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { email: string; password: string; } =
    await request.json();

  try {
    const isExisiting = await prisma.user.findUnique({

      where: {
        
            email: body.email,
          
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

    if (isExisiting) {
      const comparePass = await compare(body.password, isExisiting.password);
      if (comparePass) {
        const {
          email,
          id,
          name,
          createdAt,
          updatedAt,
          gender,
          role,
          profile
        } = isExisiting;

        return NextResponse.json(
          {
            name,
            createdAt,
            updatedAt,
            gender,
            email,
            id,
            role,
            profile
          } as unknown as CustomSession['user'],
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "password incorrect" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "some thing went wrong" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ message: "try again later"  , err}, { status: 400 });
  }
}
