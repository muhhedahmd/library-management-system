
import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { UploadedFileData } from "uploadthing/types";


const utapi = new UTApi();

export const POST = async (req: Request) => {
    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;
  
    if (!session || !userId || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const isbn = formData.get("isbn") as string
    const authorId = formData.get("authorId") as string
    const publisherId = formData.get("publisherId") as string
    const categoryId = formData.get("categoryId") as string
    const language = formData.get("language") as string
    const pages = formData.get("pages") as string
    const fileSize = formData.get("fileSize") as string
    const fileFormat = formData.get("fileFormat") as string
    const price = formData.get("price") as string
    const available = formData.get("available") as unknown as boolean
    const thumbnail = formData.get("thumbnail") as File 
    const pdfFile = formData.get("pdfFile") as File 

    try {
        const uploadResultPdf = await utapi.uploadFiles(pdfFile);
        if (uploadResultPdf.error) throw new Error("File upload failed");
        let thumbnailUrl : UploadedFileData | null= null;
        if (thumbnail) {
            const thumbnailUpload = await utapi.uploadFiles(
              new File([thumbnail], "thumbnail", { type: "image/png" })
            );
            if (!thumbnailUpload.error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                thumbnailUrl = thumbnailUpload.data;
            }
        }

        const upload = await prisma.book.create({
            data: {
                title,
                description,
                isbn,
                author: { connect: { id: authorId } },
                publisher: { connect: { id: publisherId } },
                category: { connect: { id: categoryId } },
                language,
                pages,
                fileSize,
                fileFormat,
                price: parseFloat(price),
                available,
                thumbnail: thumbnailUrl?.ufsUrl || null,
                pdf: uploadResultPdf.data.ufsUrl,
            },
            include: {
                author: true,
                publisher: true,
                category: true,
            },
        })

    } catch (error) {
        
    }


}