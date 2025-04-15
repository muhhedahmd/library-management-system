"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BooksRes } from "@/Types"
import { BookCard } from "../book-card"
import { Book } from "@prisma/client"


interface BookRecommendationsProps {
  similarBooks: BooksRes[]
  popularBooks: Book[]
}

export default function BookRecommendations({ similarBooks, popularBooks }: BookRecommendationsProps) {
  const [, setActiveTab] = useState("similar")

  return (
    <Tabs defaultValue="similar" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="similar">Similar Books</TabsTrigger>
        <TabsTrigger value="popular">Popular Books</TabsTrigger>
      </TabsList>

      <TabsContent value="similar" className="pt-6">
        <div className="flex   gap-6 overflow-x-auto pb-4">
          {similarBooks?.map((book) => (
            book && <div key={book.id} className="w-[250px]">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="popular" className="pt-6">
        <div className="flex   gap-6 overflow-x-auto pb-4">
          {popularBooks?.map((book) => (
            book && <div key={book.id} className="w-[250px]">
              {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <BookCard key={book.id} book={book as any as BooksRes} />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}


