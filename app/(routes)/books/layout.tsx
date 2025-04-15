import type React from "react"
import type { Metadata } from "next"
import "./globals.css"




export const metadata: Metadata = {
  title: "Book Catalog",
  description: "Discover and purchase books from our extensive collection",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <div className=" flex justify-center w-full items-center">
      <div className=" overflow-hidden  w-full">

            <div className="flex   min-h-screen w-full flex-col">
              <div className="md:flex md:flex-1 ">

                {children}
              </div>
            </div>

        </div>

    </div>
  )
}

