"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Sparkles, TrendingUp, Star } from "lucide-react"
import NewReleases from "@/app/_components/discover/new-releases"
import Bestsellers from "@/app/_components/discover/bestsellers"
import TopRatedBooks from "@/app/_components/discover/top-rated-books"
import { useRouter, useSearchParams } from "next/navigation"

// import CategoryFilter from "@/components/books/category-filter"

export default function DiscoverPageClient() {
  const searchParams = useSearchParams()
  const Router = useRouter()

  const [ActiveTab, setActiveTab] = useState("new-releases")


  useEffect(() => {
    const Tab = searchParams.get("tab")
    if (Tab) {
      setActiveTab(Tab)

    } else {
      setActiveTab("new-releases")
    }


  }, [searchParams])



  return (
    <div className="w-full py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Sparkles className="mr-3 h-8 w-8 text-primary" /> Discover Books
      </h1>

      <div className="mb-8">
        {/* <CategoryFilter onCategoryChange={setSelectedCategoryId} selectedCategoryId={selectedCategoryId} /> */}
      </div>


      
      <Tabs
        onValueChange={(val) => {
          
          Router.push(`/discover?tab=${val}`)
          setActiveTab(val)

          

        }}
        value={
          ActiveTab
        }
        defaultValue="new-releases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-releases" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            New Releases
          </TabsTrigger>
          <TabsTrigger value="bestsellers" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Bestsellers
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            Top Rated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-releases" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">New Releases</h2>
              <p className="text-muted-foreground">Books published in the last 30 days</p>
            </div>
            <Separator />
            <NewReleases limit={12} categoryId={ ""} days={30} />
          </div>
        </TabsContent>

        <TabsContent value="bestsellers" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Bestsellers</h2>
              <p className="text-muted-foreground">Our most popular books</p>
            </div>
            <Separator />
            <Bestsellers limit={12} categoryId={ ""} />
          </div>
        </TabsContent>

        <TabsContent value="top-rated" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Top Rated</h2>
              <p className="text-muted-foreground">Highest rated books by our readers</p>
            </div>
            <Separator />
            <TopRatedBooks limit={12} categoryId={ ""} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

