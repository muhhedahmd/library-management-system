"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"
import { CartItem } from "./cart-provider"
export interface Cart {
    items: CartItem[]
    subtotal: number
    tax: number
    total: number
  }
  
  
interface CartSummaryProps {
  cart: Cart
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      // Navigate to checkout page
      router.push("/checkout")
    } catch (error) {
      console.error("Error proceeding to checkout:", error)
      setIsProcessing(false)
    }
  }

  // Calculate subtotal
  const subtotal = cart.items.reduce((total, item) => {
    const _price = +item.price 
    return total + _price * (item.quantity || 1)
  }, 0)

  // Calculate tax (if applicable)
  const taxRate = 0.0 // 0% for digital goods in many jurisdictions
  const tax = subtotal * taxRate

  // Calculate total
  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({cart.items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {taxRate > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing || cart.items.length === 0}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

