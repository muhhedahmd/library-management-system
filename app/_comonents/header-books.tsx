"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, Search } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { CartDrawer } from "./cart/cart-drawer"
import { ThemeToggle } from "./ThemeToggle"
import { DropdownMenuDemo } from "./UserLogDropMenuNav"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { toggleSidebar, open } = useSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Always show the toggle button on mobile, and on desktop when sidebar is collapsed */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "mr-2",
            // Only hide on desktop when sidebar is expanded
            // open && "md:hidden",
          )}
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Always show the logo */}
        <div
          className={cn(
            "flex items-center gap-2 mr-4",
            // Adjust spacing based on sidebar state
            // open ? "md:hidden" : "mr-4",
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LibraryPro</span>
          </Link>
        </div>

        {/* Central area with search and nav */}

        <div className={cn("flex-1 flex items-center gap-4 md:gap-6 justify-between md:justify-start" ,
            //  open && "ml-10"
             )}>
          <div className="relative w-full max-w-sm hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for books..." className="w-full pl-8" />
          </div>

          <nav
            className={cn(
              "hidden lg:flex items-center gap-6 text-sm",
              // Hide nav on large screens only when sidebar is open and screen size is medium
            //   open && "lg:hidden xl:flex",
            )}
          >
            <Link
              href="/"
              className={`font-medium ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`font-medium ${
                pathname === "/categories" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Categories
            </Link>
            <Link
              href="/bestsellers"
              className={`font-medium ${
                pathname === "/bestsellers" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Bestsellers
            </Link>
            <Link
              href="/new-releases"
              className={`font-medium ${
                pathname === "/new-releases" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              New Releases
            </Link>
          </nav>
        </div>

        {/* Right side controls always visible */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <CartDrawer />
          <DropdownMenuDemo />
        </div>
      </div>
    </header>
  )
}

