import type { Metadata } from "next"
import DiscoverPageClient from "./DiscoverPageClient"

export const metadata: Metadata = {
  title: "Discover Books | Language Education Library",
  description: "Explore new releases, bestsellers, and top-rated books in our collection",
}

export default function DiscoverPage() {
  return<div
   className="p-3"
  >

    <DiscoverPageClient
    />
  </div>
}

