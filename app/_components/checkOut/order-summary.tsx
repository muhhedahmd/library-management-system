import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Cart } from "../cart/cart-summary"
import { BookThumbnail } from "../BookThumbnail"

interface OrderSummaryProps {
  cart: Cart
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  // Calculate subtotal
  const subtotal = cart.items.reduce((total, item) => {
    return total + item.price * (item.quantity || 1)
  }, 0)

  // Calculate tax (if applicable)
  const taxRate = 0.0 // 0% for digital goods in many jurisdictions
  const tax = subtotal * taxRate

  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-12 h-16 relative flex-shrink-0">
                <BookThumbnail
                          title={item.title}
                          author={item.author.name}
                          description={item.description}
                          tag={item.category?.name}
                          className="w-full h-full"
                        />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.fileFormat}</p>
              </div>
              <div className="text-sm font-medium">${item.price}</div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="text-xs text-muted-foreground mt-4">
          <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </CardContent>
    </Card>
  )
}

