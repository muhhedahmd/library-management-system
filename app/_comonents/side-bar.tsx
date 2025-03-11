"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, Library, ListFilter, ShoppingCart, Star, Tag } from "lucide-react"
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
  useSidebar,
  // useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { books } from "@/lib/data"
import { cn } from "@/lib/utils"

// Extract unique categories
const categories = Array.from(new Set(books.map((book) => book.category)))

export function Sidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <div className={cn("relative z-100  " , open && "w-[4rem]")}>

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
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/categories"}>
                <Link href="/categories">
                  <Tag className="h-5 w-5" />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {categories.map((category) => (
                  <SidebarMenuSubItem key={category}>
                    <SidebarMenuSubButton asChild isActive={pathname === `/categories/${category.toLowerCase()}`}>
                      <Link href={`/?category=${category}`}>{category}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/bestsellers"}>
                <Link href="/bestsellers">
                  <Star className="h-5 w-5" />
                  <span>Bestsellers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/new-releases"}>
                <Link href="/new-releases">
                  <Library className="h-5 w-5" />
                  <span>New Releases</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/browse"}>
                <Link href="/browse">
                  <ListFilter className="h-5 w-5" />
                  <span>Browse All</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/cart"}>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/account">
              <Avatar className="h-5 w-5 mr-2">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span>Account</span>
            </Link>
          </Button>
        </SidebarFooter>
      </ShadcnSidebar>
    </div>
  )
}

