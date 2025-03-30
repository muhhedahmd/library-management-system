"use client"

// import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { toast } from "sonner"
import { CartItem } from "./cart-provider"

interface CartItemsProps {
    items: CartItem[]
}

export default function CartItems({ items }: CartItemsProps) {
    // const [cartItems, setCartItems] = useState<CartItem[]>(items)
    // const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({})

    // const handleRemoveItem = async (itemId: string) => {
    //     setIsRemoving((prev) => ({ ...prev, [itemId]: true }))

    //     try {
    //         const response = await fetch(`/api/cart/items/${itemId}`, {
    //             method: "DELETE",
    //         })

    //         if (!response.ok) {
    //             throw new Error("Failed to remove item from cart")
    //         }

    //         setCartItems(cartItems.filter((item) => item.id !== itemId))

    //         toast.success("Item removed", {

    //             description: "The item has been removed from your cart",
    //         })
    //     } catch (error) {
    //         console.error("Error removing item from cart:", error)
    //         toast.warning("Error", {

    //             description: "Failed to remove item from cart",
    //             // variant: "destructive",
    //         })
    //     } finally {
    //         setIsRemoving((prev) => ({ ...prev, [itemId]: false }))
    //     }
    // }

    return (
        <div className="space-y-4">
            {items?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                            <div className="ml-4  w-[8rem] h-[9rem] aspect-square  rounded-lg relative flex-shrink-0">
                                <Image
                                    src={item?.bookCovers?.find((item) => item.type === "THUMBNAIL")?.fileUrl || "/placeholder.svg?height=160&width=120"}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link href={`/books/${item.id}`} className="text-lg font-semibold hover:underline">
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">{item.author.name}</p>
                                    </div>
                                    <div className="text-lg font-semibold">${item.price}</div>
                                </div>

                                <div className="mt-2 text-sm">
                                    <span className="text-muted-foreground">Format:</span> {item.fileFormat}
                                </div>

                                {item.quantity > 1 &&

                                    <div  className="mt-1 text-sm">
                                        <p>
                                            the physical item doen&apos;t available yet
                                        </p>
                                        <span className="text-muted-foreground">Quantity:</span> {item.quantity}
                                    </div>
                                }


                                <div className="mt-auto pt-4 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        // onClick={() => handleRemoveItem(item.id)}
                                        // disabled={isRemoving[item.id]}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        {/* {isRemoving[item.id] ? "Removing..." : "Remove"} */}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
