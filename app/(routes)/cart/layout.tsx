import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the books in your cart before checkout.",
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
