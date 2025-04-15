import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOption"
import prisma from "@/lib/prisma"
import { UTApi } from "uploadthing/server"
import { CustomSession } from "@/Types"

const utapi = new UTApi()

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }>}) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: (await params).bookId },
      include: {
        author: true,
        publisher: true,
        category: true,
        bookCovers: true,
      },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const session = await getServerSession(authOptions) as CustomSession

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    // Extract basic book data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const isbn = formData.get("isbn") as string
    const authorId = formData.get("authorId") as string
    const publisherId = formData.get("publisherId") as string
    const categoryId = formData.get("categoryId") as string
    const language = formData.get("language") as string
    const pages = formData.get("pages") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const fileFormat = formData.get("fileFormat") as string
    const fileSize = formData.get("fileSize") as string
    const publishedAt = new Date(formData.get("publishedAt") as string)
    const available = formData.get("available") === "true"

    // Handle new PDF if uploaded
    
    
    let pdfUpdateData = {}
    const pdfFile = formData.get("pdfFile") as File | null



    const book = await prisma.book.findUnique({
      where: { id: (await params).bookId },
      include: {
        author: true,
        publisher: true,
        category: true,
        bookCovers: true,
      },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (pdfFile) {
      // Get the old PDF key to delete it later
      const oldBook = await prisma.book.findUnique({
        where: { id: (await params).bookId },
        select: { key: true },
      })

      // Upload new PDF
      const uploadResultPdf = await utapi.uploadFiles(pdfFile)

      if (uploadResultPdf.error) {
        throw new Error("PDF upload failed")
      }

      if (oldBook?.key) {
        // Delete the old PDF file
        await utapi.deleteFiles(oldBook.key)
      }

      pdfUpdateData = {
        fileUrl: uploadResultPdf.data.url,
        key: uploadResultPdf.data.key,
        fileHash: uploadResultPdf.data.fileHash,
      }
    }

    // Handle covers
    const existingCoversJson = formData.get("existingCovers") as string
    const deletedCoversJson = formData.get("deletedCovers") as string

    const existingCovers = existingCoversJson ? JSON.parse(existingCoversJson) : []
    const deletedCovers = deletedCoversJson ? JSON.parse(deletedCoversJson) : []

    // Delete removed covers
    if (deletedCovers.length > 0) {
      // Get the keys of covers to delete
      const coversToDelete = await prisma.bookCover.findMany({
        where: { id: { in: deletedCovers } },
        select: { key: true },
      })

      // Delete files from uploadthing
      for (const cover of coversToDelete) {
        if (cover.key) {
          await utapi.deleteFiles(cover.key)
        }
      }

      // Delete from database
      await prisma.bookCover.deleteMany({
        where: { id: { in: deletedCovers } },
      })
    }

    // Update existing covers (mainly for type changes)
    for (const cover of existingCovers) {
      await prisma.bookCover.update({
        where: { id: cover.id },
        data: { type: cover.type },
      })
    }

    // Handle new cover uploads
    const numNewCovers = Number.parseInt((formData.get("numNewCovers") as string) || "0")

    for (let i = 0; i < numNewCovers; i++) {
      const coverFile = formData.get(`newCover${i}`) as File | null
      // const coverType = formData.get(`newCoverType${i}`) as string

      if (coverFile) {
        const coverUpload = await utapi.uploadFiles(coverFile)

        if (coverUpload.error) {
          continue
        }

        // Create new cover in database
        await prisma.bookCover.create({
          data: {
            bookId: (await params).bookId,
            type: "THUMBNAIL",
            fileUrl: coverUpload.data.ufsUrl,
            fileHash: coverUpload.data.fileHash,
            key: coverUpload.data.key,
            fileFormat: coverFile.type,
            fileSize: String(coverFile.size),
            name: coverFile.name,
          },
        })
      }
    }

    // Update the book
    console.log(
       {
        title,
        description,
        isbn,
        authorId,
        publisherId,
        categoryId,
        language,
        pages,
        price,
        fileFormat,
        fileSize,
        publishedAt,
        available,
        ...pdfUpdateData,
      },

    )
    const updatedBook = await prisma.book.update({
      where: { id:(await params).bookId },
      include:{
        author : true  ,
        publisher : true , 
        category : true ,
      },
      data: {
        title,
        description,
        isbn,
        authorId : authorId ||book.authorId ,
        publisherId  : publisherId || book.publisherId ,
        categoryId : categoryId || book.categoryId,
        language,
        pages,
        price,
        fileFormat,
        fileSize,
        publishedAt,
        available,
        ...pdfUpdateData,
      },
    })

    return NextResponse.json({ success: true, book: updatedBook })
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500 })
  }
}
