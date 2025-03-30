"use client"
import { redirect } from "next/navigation"
// import { authOptions } from "@/lib/authOption"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "../../_components/cart/cart-provider"
import CheckoutForm from "../../_components/checkOut/checkout-form"
import OrderSummary from "../../_components/checkOut/order-summary"

export default function CheckoutPage() {
  // const session = await getServerSession(authOptions)

  // if (!session?.user) {
  //   redirect("/api/auth/signin?callbackUrl=/checkout")
  // }

const {cart } =useCart()

  // Redirect to cart if empty
  if (cart?.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary cart={{
             items:cart ,
             subtotal: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
             total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.1,
             tax: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.07,
          }} />
        </div>
      </div>
    </div>
  )
}

