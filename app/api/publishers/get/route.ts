import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req :Request) {
    const { searchParams } = new URL(req.url);
    
    const pgNum = +(searchParams.get("pgnum") ?? 0);
    const pgSize = +(searchParams.get("pgsize") ?? 10);
    try {
      const publishers = await prisma.publisher.findMany({
        orderBy: {
          name: "asc",
        },
        skip: pgNum * pgSize,
        take: pgSize,
      })
  
      return NextResponse.json(publishers)
    } catch (error) {
      console.error("Error fetching publishers:", error)
      return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
  }
  
  