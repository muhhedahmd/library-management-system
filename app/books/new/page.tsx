import { getServerSession } from "next-auth/next"

import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOption"
import {CustomSession} from "@/Types"
import prisma from "@/lib/prisma"
import BookForm from "@/app/profile/_components/BookActions/BookForm"

export default async function NewBookPage() {
  const session = await getServerSession(authOptions) as CustomSession

  // Check if user has permission to create books
  if (session?.user?.role !== "ADMIN" ) {
    redirect("/dashboard")
  }

  // Fetch authors, publishers, and categories for the form
  const [authors, publishers, categories] = await Promise.all([
    prisma.author.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.publisher.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
      </div>

      <BookForm authors={authors} publishers={publishers} categories={categories} />
    </div>
  )
}

