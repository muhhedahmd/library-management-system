import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Members",
  description: "Browse library members and their profiles.",
}

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
