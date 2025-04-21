"use client"

import { BooksRes } from "@/Types"
import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem extends BooksRes {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (book: BooksRes) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number ,
  setCart : React.Dispatch<React.SetStateAction<CartItem[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setLoaded(true)
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, loaded])

  const addToCart = (book: BooksRes) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...book, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
setCart ,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

