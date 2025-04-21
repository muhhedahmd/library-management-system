"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Heart, History, BookOpen, ShoppingBag } from "lucide-react"
import BlurredImage from "@/app/_components/imageWithBlurHash"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { useGetFavoritesQuery, useGetMemberStatsQuery, useGetPurchasesQuery, useGetReadingHistoryQuery } from "@/store/QueriesApi/ProfileQuery"
import { StarRating } from "../../starRatting/starRatting"
import Link from "next/link"

// Temporary mock user ID - in a real app, this would come from authentication


export default function MemberDashboard({
    userId
} :{
    userId : string
}) {
  // RTK Query hooks
  const { data: memberStats
    // , isLoading: statsLoading

   } = useGetMemberStatsQuery(userId)
  const { data: readingHistory, isLoading: historyLoading } = useGetReadingHistoryQuery(userId)
  const { data: favorites, isLoading: favoritesLoading } = useGetFavoritesQuery(userId)
  const { data: purchases, isLoading: purchasesLoading } = useGetPurchasesQuery(userId)

  // Fallback data while loading
  const [stats, setStats] = useState({
    booksRead: 0,
    readingGoal: 20,
    favoriteBooks: 0,
    reviewsWritten: 0,
    readingStreak: 0,
    booksPurchased: 0,
  })

  // Update stats when data is loaded
  useEffect(() => {
    if (memberStats) {
      setStats(memberStats)
    }
  }, [memberStats])

  return (
    <main className="container mx-auto py-4 pb-0">
      <div className="grid gap-6 md:grid-cols-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Books Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.booksRead}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.booksRead / stats.readingGoal) * 100)}% of your goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reading Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.readingStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.favoriteBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">Books you love</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reviewsWritten}</div>
            <p className="text-xs text-muted-foreground mt-1">Helpful to others</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reading Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.readingGoal}</div>
            <p className="text-xs text-muted-foreground mt-1">Books this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.booksPurchased}</div>
            <p className="text-xs text-muted-foreground mt-1">Books owned</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Reading Journey</CardTitle>
          <CardDescription>Track your progress and discover new books</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Reading History
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="purchased" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Purchased Books
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              {historyLoading ? (
                <div className="text-center py-4">Loading reading history...</div>
              ) : readingHistory && readingHistory.length > 0 ? (
                readingHistory.map((item) => (
                  <MemberBookCard
                    key={item.id}
                    book={{
                      id: item.book.id,
                      title: item.book.title,
                      author: item.book.author.name,
                      progress: Math.round((item.pagesRead / Number.parseInt(item.book.pages || "100")) * 100),
                      lastRead: formatDate(item.lastReadAt),
                      cover: item.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.fileUrl || "",
                      blurHash: item.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.blurHash || "",
                    }}
                    type="history"
                  />
                ))
              ) : (
                <div className="text-center py-4">No reading history found.</div>
              )}
              <div className="w-full flex justify-center items-center">
                <Button variant={"outline"}>View All History</Button>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favoritesLoading ? (
                <div className="text-center py-4">Loading favorites...</div>
              ) : favorites && favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <MemberBookCard
                    key={favorite.id}
                    book={{
                      id: favorite.book.id,
                      title: favorite.book.title,
                      author: favorite.book.author.name,
                      rating: favorite.book.ratings[0]?.rating || 0,
                      added: formatDate(favorite.createdAt),
                      cover: favorite.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.fileUrl || "",
                      blurHash: favorite.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.blurHash || "",
                    }}
                    type="favorites"
                  />
                ))
              ) : (
                <div className="text-center py-4">No favorites found.</div>
              )}
              <div className="w-full flex justify-center items-center">
                <Button variant={"outline"}>View All Favorites</Button>
              </div>
            </TabsContent>

            <TabsContent value="purchased" className="space-y-4">
              {purchasesLoading ? (
                <div className="text-center py-4">Loading purchased books...</div>
              ) : purchases && purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <MemberBookCard
                    key={purchase.id}
                    book={{
                      id: purchase.book.id,
                      title: purchase.book.title,
                      author: purchase.book.author.name,
                      purchased: formatDate(purchase.purchaseDate),
                      price: purchase.price,
                      cover: purchase.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.fileUrl || "",
                      blurHash: purchase.book.bookCovers.find((cover) => cover.type === "THUMBNAIL")?.blurHash || "",
                    }}
                    type="purchased"
                  />
                ))
              ) : (
                <div className="text-center py-4">No purchased books found.</div>
              )}
              <div className="w-full flex justify-center items-center">
                <Button variant={"outline"}>View All Purchases</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`
  } else {
    return `${Math.floor(diffDays / 365)} years ago`
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MemberBookCard({ book, type }: { book: any; type: "history" | "favorites" | "purchased" }) {
  return (
    <div className="flex items-center p-4 rounded-lg border">
      {book.cover ? (
        <BlurredImage
          quality={100}
          blurhash={book.blurHash || ""}
          imageUrl={book.cover}
          alt={`Cover of ${book.title}`}
          width={80}
          height={100}
          className="h-20 w-20 object-cover rounded mr-4"
        />
      ) : (
        <div className="flex h-20 w-20 rounded-md bg-muted items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1">
        <Link href={`/books/${book.id}`} className="font-semibold">{book.title}</Link>
        <p className="text-sm text-muted-foreground">{book.author}</p>

        {type === "history" && (
          <div className="flex items-center mt-2">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">{book.progress}%</span>
          </div>
        )}

        {type === "favorites" && (
          <div className="flex items-center mt-2">
            <StarRating initialRating={book.rating} size={16} readonly className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-2">Added {book.added}</span>
          </div>
        )}

        {type === "purchased" && (
          <div className="flex items-center mt-2">
            <span className="text-xs text-muted-foreground">
              Purchased {book.purchased} • ${book.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="ml-4">
        <Button variant="outline" size="sm" className="w-full">
          <span>{type === "purchased" ? "Read" : "Continue"}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
