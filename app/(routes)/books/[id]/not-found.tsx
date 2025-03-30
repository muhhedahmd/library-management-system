import Link from "next/link"
import { BookX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BookNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-muted p-6">
          <BookX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Book Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn&apos;t find the book you&apos;re looking for. It might have been removed or the URL might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild>
            <Link href="/books">Browse All Books</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

