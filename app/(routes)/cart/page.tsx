"use client"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { useCart } from "../../_components/cart/cart-provider"
import CartItems from "../../_components/cart/cart-items"
import CartSummary from "../../_components/cart/cart-summary"

export default  function CartPage() {
  const {cart} =useCart()

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8" /> Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="mx-auto bg-muted rounded-full h-24 w-24 flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you haven&apos;t added any books to your cart yet. Browse our collection to find your next favorite read.
          </p>
          <Button asChild className="mt-4">
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems items={cart} />
            <div className="mt-6">
              <Button variant="outline" asChild className="flex items-center">
                <Link href="/books">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartSummary cart={{
                items:cart ,
                subtotal: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
                total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.1,
                tax: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.07,
                // discount: 0, 
                }} />
          </div>
        </div>
      )}
    </div>
  )
}
