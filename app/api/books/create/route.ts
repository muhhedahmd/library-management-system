
import { authOptions } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { bookcoverType } from "@prisma/client";
import { encode } from "blurhash";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { UTApi } from "uploadthing/server";
import { UploadedFileData } from "uploadthing/types";

export type blurHashResponse = {

    blurHash: string,
    info: sharp.OutputInfo

}
const utapi = new UTApi();
async function generateBlurhash(buffer: Buffer): Promise<blurHashResponse> {
    try {
        const { data, info } = await sharp(buffer)
            .raw()
            .ensureAlpha()
            .resize(32, 32, { fit: "inside" })
            .toBuffer({ resolveWithObject: true });
        return {
            blurHash: encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4),
            info
        };

    } catch (error) {
        throw new Error(error.message);
    }
}

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
    const publishedAt = formData.get("publishedAt") as string
    const categoryId = formData.get("categoryId") as string
    const language = formData.get("language") as string
    const pages = formData.get("pages") as string
    const fileSize = formData.get("fileSize") as string
    const fileFormat = formData.get("fileFormat") as string
    const price = formData.get("price") as string
    const available = formData.get("available") as unknown as boolean
    const thumbnail = formData.get("thumbnail") as File
    const pdfFile = formData.get("pdfFile") as File
    const numBookCovers = formData.get("num-book-covers") as string

    console.log(
        {
            title,
            description,
            isbn,
            authorId,
            publisherId,
            publishedAt,
            categoryId,
            language,
            pages,
            fileSize,
            fileFormat,
            price,
            available,
            thumbnail,
            pdfFile,
            numBookCovers
        }

    )
    try {

        const uploadResultPdf = await utapi.uploadFiles(pdfFile);
        if (uploadResultPdf.error) throw new Error("File upload failed");
        let thumbnailData: UploadedFileData | null = null;
        let blurhash: blurHashResponse | null = null
        if (thumbnail) {

            const thumbnailUpload = await utapi.uploadFiles(
                new File([thumbnail], "thumbnail", { type: "image/png" })
            );
            blurhash = await generateBlurhash(Buffer.from(await thumbnail.arrayBuffer()))

            if (!thumbnailUpload.error) {
                thumbnailData = thumbnailUpload.data;

            }
            const imageData: {
                type: bookcoverType,
                fileUrl: string;
                blurHash: string;
                width: number;
                height: number;
                fileFormat: string;
                thumbnailUrl: string;
                fileHash: string;
                key: string;
                name: string;
                fileSize: number
            }[] = []

            if (+numBookCovers) {

                for (let idx = 0; idx < +numBookCovers.length; idx++) {

                    const Img = formData.get(`cover-images-${idx}`) as File
                    console.log(`cover-images-${idx}
                        cover-images-hash-${idx}
                        cover-images-info-${idx}`,
                        Img
                    )
                    const coverUpload = await utapi.uploadFiles(Img);
                    const coverImagesHash = formData.get(`cover-images-hash-${idx}`) as string
                    const coverImagesinfo = JSON.parse(formData.get(`cover-images-info-${idx}`) as string) as {
                        width: number,
                        height: number
                    }

                    const data = {
                        type: "Image" as bookcoverType,
                        fileUrl: coverUpload.data.ufsUrl,
                        blurHash: coverImagesHash,
                        width: +coverImagesinfo?.width,
                        height: + coverImagesinfo?.height,
                        fileFormat: coverUpload.data.type,
                        thumbnailUrl: coverUpload.data.ufsUrl,
                        fileHash: coverUpload.data.fileHash,
                        key: coverUpload.data.key,
                        name: coverUpload.data.name,
                        fileSize: thumbnailData.size


                    
                    }
                    imageData.push(
                        {
                            ...data
                        }
                    )

                }
                imageData.push(

                    {
                        type: "THUMBNAIL",
                        fileUrl: thumbnailData.ufsUrl,
                        blurHash: blurhash?.blurHash,
                        width: +blurhash?.info?.width,
                        height: + blurhash?.info?.height,
                        fileFormat: thumbnailData.type,
                        thumbnailUrl: thumbnailData.ufsUrl,
                        fileHash: thumbnailData.fileHash,
                        key: thumbnailData.key,
                        name: thumbnailData.name,
                        fileSize: thumbnailData.size

                    }
                )


            }


            const CreateBook = await prisma.book.create({

                data: {
                    fileUrl: uploadResultPdf.data.ufsUrl,
                    isbn,
                    title,
                    authorId,
                    categoryId,
                    key: uploadResultPdf.data.key,
                    description,
                    language,
                    pages,
                    fileSize,
                    fileFormat,
                    available : +available  ? true : false,
                    fileHash: uploadResultPdf.data.fileHash,
                    price,
                    publisherId,
                    publishedAt: new Date(publishedAt),
                    bookCovers: {
                        createMany: imageData && {
                            data: imageData.map((item) => {
                                return {
                                    type: item.type,
                                    fileUrl: item.fileUrl,
                                    blurHash: item?.blurHash,
                                    width: +item.width,
                                    height: +item?.height,
                                    fileFormat: item.type,
                                    fileHash: item.fileHash,
                                    key: item.key,
                                    fileSize: item.fileSize.toString(),
                                    name: item.name,



                                }

                            })
                        }
                    }

                }

            })


            return NextResponse.json(CreateBook, {
                status: 201,

            })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, {
            status: 400,

        })
    }


}