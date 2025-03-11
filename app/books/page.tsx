// // import { getServerSession } from "next-auth/next"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import { formatDate } from "@/lib/utils"
// // import { authOptions } from "@/lib/authOption"
// // import {CustomSession}from "@/Types"
// import prisma from "@/lib/prisma"
// import { DataTable } from "./data-table"
// import { columns } from "./columns"
// export default async function BooksPage({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
// //   const session = await getServerSession(authOptions) as CustomSession

import { FilterBar } from "../_comonents/filter-bar";
import { Header } from "../_comonents/header-books";
import BookGrid from "./book-grid";

//   // Parse query parameters
//   const search = typeof searchParams.search === "string" ? searchParams.search : ""
//   const category = typeof searchParams.category === "string" ? searchParams.category : ""
//   const available = searchParams.available === "true" ? true : searchParams.available === "false" ? false : undefined

//   // Build filter conditions
// //   const where = {
// //     ...(search
// //       ? {
// //           OR: [
// //             { title: { contains: search, mode: "insensitive" } },
// //             { isbn: { contains: search, mode: "insensitive" } },
// //             { author: { name: { contains: search, mode: "insensitive" } } },
// //           ],
// //         }
// //       : {}),
// //     ...(category ? { categoryId: category } : {}),
// //     ...(available !== undefined ? { available } : {}),
// //   }

//   // Fetch books with filters
//   const books = await prisma.book.findMany({
//     where : {
//         ...(search
//           ? {
//               OR: [
//                 { title: { contains: search, mode: "insensitive" } },
//                 { isbn: { contains: search, mode: "insensitive" } },
//                 { author: { name: { contains: search, mode: "insensitive" } } },
//               ],
//             }
//           : {}),
//         ...(category ? { categoryId: category } : {}),
//         ...(available !== undefined ? { available } : {}),
//       },
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

//   // Transform data for the table
//   const formattedBooks = books.map((book) => ({
//     id: book.id,
//     title: book.title,
//     isbn: book.isbn,
//     author: "test author",
//     publisher: "test publisher",
//     category: "test category",
//     language: book.language,
//     available: book.available,
//     publishedAt: formatDate(book.publishedAt),
//   }))

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">Books</h1>
//         <Button asChild>
//           <Link href="/books/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Book
//           </Link>
//         </Button>
//       </div>

//       <DataTable columns={columns} data={formattedBooks} categories={categories} />
//     </div>
//   )
// }



export default function Home() {
  return (
    <div className=" mx-auto px-4 py-6">

      <FilterBar className="my-6" />

      <BookGrid />
    </div>
  )
}


