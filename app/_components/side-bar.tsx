"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Book, BookOpen, ChevronRight, ChevronsUp, ChevronUp, Home, Library, ListFilter, Loader2, LoaderCircle, ShoppingCart, Smile, Star, Tag } from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  // useSidebar,
  // useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { useState } from "react"
import { useSelector } from "react-redux"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { ThemeToggle } from "./ThemeToggle"

// Extract unique categories


// const dispatch = useDispatch()
const limit = 100 // Number of items to load per page

// categories query


export function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const router = useRouter()
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCate,
  } = useGetCategoriesQuery({ pgnum: 0, pgsize: limit })

  const pathname = usePathname()
  const [toggleCategoryMenu, setToggleCategoryMenu] = useState(false)
  // console.log(categories)


  const CachedUser = useSelector(userResponse)
  const IsLoading = useSelector(isLoading)



  return (
    <div className={cn("relative z-100    text-[19px]",)}>

      <ShadcnSidebar variant="floating" >

        <SidebarHeader className="flex items-center justify-between p-4 mt-3">

          <div className=" w-full flex items-center justify-between gap-2">
            <div className="flex justify-start items-center gap-2">

              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">LibraryPro</span>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="h-5 w-5" />
                  <span className="text-[18px] font-semibold">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/library"}>
                <Link href="/library">
                  <Book className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">My library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className=" pl-0 overflow-hidden" >
                <div className="flex items-center  w-full gap-2">
                  <Button variant="ghost" className="w-full font-normal    justify-between transition-all duration-200" onClick={() => {
                    setToggleCategoryMenu(!toggleCategoryMenu)
                  }}>
                    <div className="flex items-center gap-2">

                      <Tag className="h-5 w-5" />
                      <p className="text-[17px] font-semibold ">Categories</p>
                    </div>
                    <ChevronUp className={`h-4 w-4 text-muted-foreground transition-transform ${toggleCategoryMenu ? "rotate-180" : ""}`} />
                  </Button>
                </div>
              </SidebarMenuButton>
              <SidebarMenuSub className={`h-0 overflow-hidden transition-all duration-200 ${toggleCategoryMenu ? "h-auto" : ""}`}>
                {isLoadingCategories || isFetchingCate ? (
                  <SidebarMenuSubItem>
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </SidebarMenuSubItem>
                ) : (
                  categories?.data?.map((category) => (
                    <div key={category.id}>

                      <SidebarMenuSubItem key={`item-${category.id}`}>  {/* Add unique key here */}

                        <div className="flex items-center w-full">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className="p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                            aria-expanded={expandedCategories[category.id]}
                          >
                            <ChevronRight
                              className={`h-4 w-4 text-muted-foreground transition-transform ${expandedCategories[category.id] ? "rotate-90" : ""
                                }`}
                            />
                          </button>
                          <SidebarMenuSubButton

                            onClick={() => {
                              router.push(`/books?categoryId=${category.id}`)
                            }}
                            asChild
                            // href={}
                            isActive={pathname === `/books?categoryId=${category.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <span className=" text-[17px] min-w-max font-semibold ">

                              {category.name.length > 15 ? category.name.substring(0, 15) + "..." : category.name}

                            </span>

                          </SidebarMenuSubButton>
                        </div>
                      </SidebarMenuSubItem>

                      {/* Children categories */}
                      {expandedCategories[category.id] &&
                        category.children.length > 0 &&
                        category.children.map((child) => (

                          <SidebarMenuSubItem key={`${category.id}-${child.id}`} className="ml-6 pl-2 border-l border-muted">
                            <SidebarMenuSubButton
                              onClick={() => {
                                router.push(`/books?categoryId=${child.id}`)
                              }}
                              asChild
                              isActive={pathname === `/books?categoryId=${child.id}`}
                              className="py-1 mt-1 text-sm"
                            >
                              <span className=" min-w-max font-semibold ">{child.name.length > 15 ? child.name.substring(0, 15) + "..." : child.name}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </div>
                  ))
                )}
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/bestsellers"}>
                <Link href="/discover?tab=bestsellers">
                  <Star className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">Bestsellers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/bestsellers"}>
                <Link href="/discover?tab=top-rated">
                  <ChevronsUp className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">Top rated</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
              
              asChild isActive={pathname === "/new-releases"}>
                <Link href="/discover?tab=new-releases">
                  <Library className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">New Releases</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>

              <SidebarMenuButton asChild isActive={pathname === "/books"}>
                <Link href="/books">
                  <ListFilter className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">Browse All</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/recommendation"}>
                <Link href="/recommendation">
                  <Smile className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">Recommendation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/cart"}>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-[17px] font-semibold ">Cart</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>


              <SidebarMenuButton asChild isActive={pathname === "/books"}>

              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">

          <div
            className="  md:hidden w-full rounded-md p-2 border flex items-center justify-between"
          >
            <p className="text-[17px] font-semibold">
              THEME
            </p>

            <ThemeToggle />
          </div>

          {
            IsLoading ? (
              <div className="flex justify-center p-4 bg-muted items-center">
                <LoaderCircle
                  className="w-4 h-4 animate-spin"
                />
              </div>
            ) : CachedUser ? (
              <>
                <Button variant="outline" className="w-full h-10 justify-start" asChild>
                  <Link href={`/profile/${CachedUser.id}`}>
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={CachedUser?.profile?.profilePictures?.[0]?.secureUrl} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-[17px]  font-semibold">{CachedUser?.name?.toLocaleUpperCase()}</span>
                  </Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/auth/signin">
                  <span className="text-[17px] font-semibold">Login</span>
                </Link>
              </Button>
            )
          }


        </SidebarFooter>
      </ShadcnSidebar>
    </div>
  )
}

