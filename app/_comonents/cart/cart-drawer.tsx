"use client"

import { ShoppingCart, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "./cart-provider"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, totalItems } = useCart()

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <SheetClose asChild>
              <Button className="mt-4" asChild>
                <Link href="/">Browse Books</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-24 flex-shrink-0">
                      <img
                        src={item.coverImage || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <SheetClose asChild>
                          <Link href={`/books/${item.id}`} className="font-medium hover:underline truncate">
                            {item.title}
                          </Link>
                        </SheetClose>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">by {item.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          {item.quantity} × {formatCurrency(item.price)}
                        </div>
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

