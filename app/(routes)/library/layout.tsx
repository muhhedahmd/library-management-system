import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOption"
import LibrarySidebar from "../../_components/library/library-side-bar"
import { CustomSession } from "@/Types"

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions) as CustomSession

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/library")
  }

  return (
    <div className="flex h-[90vh]   mt-4 flex-col md:flex-row">
      <div className="hidden lg:flex h-[90vh]" >
        <LibrarySidebar />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

