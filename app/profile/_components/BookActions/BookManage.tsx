"use client"
import { getServerSession } from "next-auth/next"
// import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftCircleIcon, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
// import { authOptions } from "@/lib/authOption"
import { DataTable } from "./dataTable"
import { columns } from "./Columns"
import BookForm from "./BookForm"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export const mockAuthors = [
    { id: "author1", name: "J.K. Rowling" },
    { id: "author2", name: "George R.R. Martin" },
    { id: "author3", name: "Stephen King" },
    { id: "author4", name: "Jane Austen" },
    { id: "author5", name: "Ernest Hemingway" },
];

export const mockPublishers = [
    { id: "pub1", name: "Penguin Random House" },
    { id: "pub2", name: "HarperCollins" },
    { id: "pub3", name: "Simon & Schuster" },
    { id: "pub4", name: "Macmillan Publishers" },
    { id: "pub5", name: "Oxford University Press" },
];

export const mockCategories = [
    { id: "cat1", name: "Fiction" },
    { id: "cat2", name: "Science Fiction" },
    { id: "cat3", name: "Mystery" },
    { id: "cat4", name: "Biography" },
    { id: "cat5", name: "History" },
    { id: "cat6", name: "Self-Help" },
];

// Optional mock initial data (for edit form)
export const mockInitialData = {
    id: "book123",
    title: "The Great Gatsby",
    description: "A novel by F. Scott Fitzgerald. It follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
    isbn: "9780743273565",
    authorId: "author5", // Ernest Hemingway
    publisherId: "pub1", // Penguin Random House
    categoryId: "cat1", // Fiction
    fileUrl: "https://example.com/books/great-gatsby.pdf",
    fileSize: 3500000, // 3.5 MB
    fileFormat: "PDF",
    thumbnailUrl: "https://example.com/covers/great-gatsby.jpg",
    language: "English",
    pages: 180,
    publishedAt: new Date("1925-04-10"),
    available: true,
    author: mockAuthors[0],
    publisher: mockPublishers[0],
    category: mockCategories[0]
};

export default function BooksPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    //   const session = await getServerSession(authOptions)

    // Parse query parameters
    const search = typeof searchParams.search === "string" ? searchParams.search : ""
    //   const category = typeof searchParams.category === "string" ? searchParams.category : ""
    //   const available = searchParams.available === "true" ? true : searchParams.available === "false" ? false : undefined

    // Build filter conditions
    //   const where = {
    //     ...(search
    //       ? {
    //           OR: [
    //             { title: { contains: search, mode: "insensitive" } },
    //             { isbn: { contains: search, mode: "insensitive" } },
    //             { author: { name: { contains: search, mode: "insensitive" } } },
    //           ],
    //         }
    //       : {}),
    //     ...(category ? { categoryId: category } : {}),
    //     ...(available !== undefined ? { available } : {}),
    //   }

    // Fetch books with filters
    //   const books = await prisma.book.findMany({
    //     where,
    //     include: {
    //       author: true,
    //       publisher: true,
    //       category: true,
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //   })

    //   // Fetch categories for filter dropdown
    //   const categories = await prisma.category.findMany({
    //     orderBy: {
    //       name: "asc",
    //     },
    //   })

    // Transform data for the table
    const formattedBooks = [mockInitialData].map((book) => ({
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        author: book.author.name,
        publisher: book.publisher.name,
        category: book.category.name,
        language: book.language,
        available: book.available,
        publishedAt: formatDate(book.publishedAt),
    }))
    const [CreateBookDialog, setCreateBookDialog] = useState(false)

    return (
        <>
            {
                !CreateBookDialog &&

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Books</h1>
                        <Button onClick={() => {
                            setCreateBookDialog(true)
                        }} >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>

                    <DataTable columns={columns} data={formattedBooks} categories={mockCategories} />
                </div>
            }



{
     CreateBookDialog &&
            <div>
                
                <div className=" mb-3 flex justify-start items-center gap-3">
                    <Button size="icon" variant="ghost" className="">
                        <ArrowLeftCircleIcon />
                    </Button>
                    <h2 className="text-xl font-semibold">
                        Create Book
                    </h2>
                </div>
                <BookForm
                    authors={mockAuthors}
                    categories={mockCategories}
                    publishers={mockPublishers}
                    initialData={mockInitialData}
                />

            </div>
}

        </>
    )
}

