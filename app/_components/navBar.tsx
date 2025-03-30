"use client"
import { BookOpen, } from 'lucide-react'
import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DropdownMenuDemo } from './UserLogDropMenuNav'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavBar = () => {
  const pathname = usePathname()

  if(pathname.match("/books")){
return null
  }
    return (
        <header className="border-b w-full p-4 pb-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="sm:container flex h-16 items-center justify-between">
       {
   
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LibraryPro</span>
          </div>
          }
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">

<DropdownMenuDemo/>
            <ThemeToggle/>
          </div>
        </div>
    
      </header>
    )
}

export default NavBar