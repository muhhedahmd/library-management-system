import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          This page seems to have gone missing from the shelves. Try searching
          or head back home.
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" /> Go Home
          </Button>
        </Link>
        <Link href="/books">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" /> Browse Books
          </Button>
        </Link>
      </div>
    </div>
  );
}
