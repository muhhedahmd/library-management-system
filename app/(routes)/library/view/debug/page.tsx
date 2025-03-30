"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function DebugPage() {
  const pathname = usePathname()

  useEffect(() => {
    console.log("Current pathname:", pathname)
  }, [pathname])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>Current pathname: {pathname}</p>
      <p className="mt-4">Check the console for more debugging information.</p>
    </div>
  )
}

