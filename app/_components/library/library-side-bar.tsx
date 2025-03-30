"use client"

import {  useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BooksRes } from "@/Types"
import { useGetBooklibraryQuery } from "@/store/QueriesApi/booksApi"
import LibrarySidebarSkeleton from "./Library-sidebar-skeleton"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/MainUserSlice"
import { cn } from "@/lib/utils"





export default function LibrarySidebar({sheet}:{sheet?:boolean}) {
  const CachedUser = useSelector(userResponse)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
//   const router = useRouter()
    const {
        data: libraryItems  ,
        isLoading ,
        isFetching
    } = useGetBooklibraryQuery({userId:CachedUser?.id})

  // Filter items based on search query and active tab
  if(     !libraryItems && (isFetching || isLoading))  {
    return <LibrarySidebarSkeleton />
    
  }
  
  const filteredItems = libraryItems?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "recent") {
      // Filter for recently added items (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)      
      return matchesSearch && new Date(item?.purchase?.[0]?.purchaseDate || "") >= thirtyDaysAgo
    }
    if (activeTab === "favorites") {
      // This would ideally check if the book is favorited
      return matchesSearch
    }

    return matchesSearch
  })

  // Check if a book is currently being viewed
  const isViewingBook = pathname.includes("/library/view/")
  const currentBookId = isViewingBook ? pathname.split("/library/view/")[1] : null


  return (  
    <div
      className={` border-r bg-background flex-col transition-all duration-300 ${
        isCollapsed && !sheet ? "w-[60px]" : "w-full md:w-80" 
      } ${sheet && "w-full md:w-full"}`}
    >
      <div className={cn(
        " flex items-center justify-between p-4 h-14 border-b" ,
        sheet && "hidden "
      )}>
        {!isCollapsed && <h2 className="font-semibold text-lg">My Library</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            // onKeyUp={handleSearch}
            />
          </div>
        </div>
      )}

      {!isCollapsed && (
        <Tabs defaultValue="all" className="px-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <Separator className="my-2" />

      <ScrollArea className="flex-1 max-h-[67vh] overflow-auto">

        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {searchQuery ? "No books match your search" : "Your library is empty"}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredItems?.map((item) => (
              <BookItem key={item.id} item={item} isCollapsed={isCollapsed} isActive={currentBookId === item.id} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="outline" className={`w-full ${isCollapsed ? "p-2 h-10" : ""}`} asChild>
          <Link href="/books">
            {isCollapsed ? (
              <BookOpen className="h-4 w-4" />
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Books
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  )
}

function BookItem({
  item,
  isCollapsed,
  isActive,
}: {
  item: BooksRes
  isCollapsed: boolean
  isActive: boolean
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/library/view/${item.id}`)
  }

  if (isCollapsed) {
    return (
      <Button variant={isActive ? "secondary" : "ghost"} size="icon" className="w-full h-10 mb-1" onClick={handleClick}>
        <BookOpen className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Link
    href={`/library/view/${item.id}`}
    //   variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start h-auto py-2 px-2"
    //   onClick={handleClick}
    >
      <div className="flex items-center w-full">
        <div className="w-14 h-14 relative flex-shrink-0 rounded overflow-hidden mr-3">
          <Image
            src={item.bookCovers?.[0]?.fileUrl || "/placeholder.svg?height=56&width=40"}
            alt={item.title}
            fill
            className="object-center"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-medium text-sm truncate">{item.title.length > 40  ?item.title.substring(20) + "...": item.title}</p>
          <p className="text-xs text-muted-foreground truncate">{item.author.name}</p>
        </div>
      </div>
    </Link>
  )
}

