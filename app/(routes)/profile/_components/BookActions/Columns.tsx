"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { BooksRes } from "@/Types"
import type { Author, Book } from "@prisma/client"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/MainUserSlice"
import { formatDistanceToNow } from "date-fns"
import BlurredImage from "@/app/_components/imageWithBlurHash"

export const columns: ColumnDef<BooksRes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnail",
    header: "Cover",
    cell: ({ row }) => {
      const book = row.original
      // Find thumbnail cover or use first cover
      const thumbnailCover = book.bookCovers?.[0]
      const coverUrl = thumbnailCover?.fileUrl || book.bookCovers?.[0]?.fileUrl || "/placeholder.svg"

      return (
        <div className="relative w-16 h-16 rounded-md overflow-hidden">
          <BlurredImage

          width={thumbnailCover.width || 100} 
          quality={100}
          height={thumbnailCover.height || 100}
          blurhash={thumbnailCover.blurHash || ""}
          imageUrl={coverUrl || "/placeholder.svg"} alt={book.title} 
           className="object-cover w-16 h-16 " 
            />
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Link href={`/books/${row.original.id}`} className="hover:underline">
            {row.getValue("title")}
          </Link>
          <div className="text-xs text-muted-foreground mt-1">ISBN: {row.original.isbn}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const  authorName = row.getValue("author") as Author

      return <Badge variant="outline">{authorName.name as string || 
      "author"
      }</Badge>
    },
  },
  {

    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const  categoryName = row.getValue("category") as Author

      return <Badge variant="outline">{categoryName.name}</Badge>
    },
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
    cell: ({ row }) => {
      const  publisherName = row.getValue("publisher") as Author

      return <Badge variant="outline">{publisherName.name}</Badge>
    },
  },
  {
    accessorKey: "available",
    header: "Status",
    cell: ({ row }) => {
      const available = row.getValue("available")
      return (
        <Badge variant={(available as boolean) ? "default" : "destructive"} className="capitalize">
          {available ? "Available" : "Unavailable"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const date = new Date(row.getValue("publishedAt"))
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">{formatDistanceToNow(date, { addSuffix: true })}</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original
      return <DropDownMenu book={book as unknown as Book} />
    },
  },
]

const DropDownMenu = ({ book }: { book: Book }) => {
  const user = useSelector(userResponse)!

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/books/${book.id}`}>View details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user?.id}/managebooks/${book.id}/editBook`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
