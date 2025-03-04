import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { email: string; password: string; } =
    await request.json();
  console.log({
    ...body,
  });
  const isExisiting = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: body.email,
        },
        
      ],
    },
  });
  try {
    if (isExisiting.length > 0) {
      const comparePass = await compare( body.password , isExisiting[0].password);
     console.log(comparePass)
      if (comparePass) {
        const {
          email,
          id,
          name ,
          createdAt , 
          updatedAt , 
          gender ,
          role,
        } = isExisiting[0];
   
        return NextResponse.json(
          {
            name ,
            createdAt , 
            updatedAt , 
            gender ,

            email,
            id,
            role,
          },
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
    return NextResponse.json({ message: "try again later" }, { status: 400 });
  }
}
