"use client"

import { useCart } from "@/app/_components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, BookOpen } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SuccessPage() {
  const {
    setCart
  } = useCart()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)
  setTimeout(() => {
    setCart([])
  }, 100)
  useEffect(() => {
    const orderIdParam = searchParams.get("orderId")
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
  }, [searchParams]) 

  return (
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <Card className="border-green-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. Your order has been confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{orderId || "Processing..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                  1
                </span>
                <span>You will receive an email confirmation with your order details.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                  2
                </span>
                <span>Digital purchases are available immediately in your library.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                  3
                </span>
                <span>You can download your purchases or read them online at any time.</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/library">
              <BookOpen className="mr-2 h-4 w-4" />
              Go to My Library
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
