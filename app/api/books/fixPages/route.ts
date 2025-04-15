import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export const PUT = async (req: Request) => {

    const searchParms = new URL(req.url).searchParams
    const bookId = searchParms.get("bookId") || ""
    const body = await req.json()
    if (!bookId || !body.pages) return NextResponse.json({ error: "BookId is required" }, { status: 400 })

    try {
        const book = await prisma.book.update({ where: { id: bookId }, data: { pages: `${body.pages}`} })

        return NextResponse.json({ book }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })

    }
}
