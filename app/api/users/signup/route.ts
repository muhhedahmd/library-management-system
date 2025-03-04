import prisma from "@/lib/prisma";
import { GENDER, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    

  const response  = await req.json();
 
  const {email,
    password,
    name  ,
    gender,

    role } =  response  as {
      email: string;
      password: string;
      name :string ,
      role: UserRole;
      gender : GENDER

    }


  if (
    !email ||
    !password ||
     !name || !gender ||
    !role 
  )  {
    return NextResponse.json(
      {
        message: "Missing required fields",
        email,
        password, name, 
        role,
        gender
      },
      { status: 400 }
    );
  }
  try {


    


    const existingUser = await prisma.user.findMany({
      where: {
        OR: [{ email }],
      },
    });

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name : name.trim() , 
        
        email: email.trim(),
        password: hashedPassword.trim(),
        gender,
        role,
        profile: {
          create: {},
        },
 
      },
      select: {
        id: true,
        email: true,
        gender : true  ,
        role: true,
        name :true ,
        updatedAt : true ,
        createdAt : true ,
        // first_name: true,
        // last_name: true,
        // user_name: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error processing request", error },
      { status: 500 }
    );
  }
}

