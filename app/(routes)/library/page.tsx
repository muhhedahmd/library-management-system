import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOption"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import {  CustomSession } from "@/Types"
import prisma from "@/lib/prisma"


async function getLibraryItems(userId: string) {

    const purchase = await prisma.purchase.findMany({

        where: {
            userId: userId
        }
    })
    const libraryItems = await prisma.book.findMany({


        where: {
            id: {
                in: purchase.map((pur) => pur.bookId)
            }
        },
        include: {
            purchase:{
                select:{
                    purchaseDate:true,
                },
                take:1
            },
            author: true,
            bookCovers: {
                where: {
                    type: "THUMBNAIL",
                },
            },

        },
        orderBy: {

        },
    })

    return libraryItems
}

export default async function LibraryPage() {
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/library")
    }

    const libraryItems = await getLibraryItems(session?.user?.id)
    if (!libraryItems) return null

    return (
        <div className="container py-10 px-4 max-w-full">
            <div className="container mx-auto">

                <h1 className="text-3xl font-bold mb-2">My Library</h1>
                <p className="text-muted-foreground mb-8">Select a book from the sidebar or browse your collection below</p>

                {libraryItems.length === 0 ? (
                    <div className="text-center py-16 space-y-6">
                        <div className="mx-auto bg-muted rounded-full h-24 w-24 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold">Your library is empty</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            You haven&apos;t purchased any books yet. Browse our collection to find your next favorite read.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/books">Browse Books</Link>
                        </Button>
                    </div>
                ) : (
                    <div className=" container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {libraryItems.map((item) => (
                            <LibraryItemCard key={item?.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LibraryItemCard({ item }: { item: any }) {
    return (
        <div className="group relative  bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border">
            <Link href={`/library/view/${item.id}`} className="block">

                <div className="relative aspect-square overflow-hidden">

                    <Image
                        src={item?.bookCovers[0]?.fileUrl || "/placeholder.svg?height=300&width=200"}
                        alt={item.title}
                        width={item?.bookCovers[0]?.width}
                        height={item?.bookCovers[0]?.height}
                        
                        quality={100}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                </div>
                <div className="p-4 h-fit">
                    <h3 className="font-medium line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.author.name}</p>

                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Purchased {formatDistanceToNow(new Date(item?.purchase[0]?.purchaseDate), { addSuffix: true })}</span>
                    </div>
                </div>
            </Link>
      
        </div>
    )
}

