import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order and borrow or purchase books.",
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>
  <Suspense>

  {children}
  </Suspense>
  </>
}
