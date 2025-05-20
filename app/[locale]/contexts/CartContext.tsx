"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// First, import the necessary dependencies at the top
import { useAuth } from "./AuthContext"
import { supabase } from "@/lib/supabase"

// Update the CartItem interface to include partNumber and export it
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  partNumber?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

// Initialize with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

// Then update the CartProvider component to include saving to Supabase
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItemsState] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItemsState(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing stored cart:", error)
      }
    }
  }, [])

  // Load user cart from Supabase when user logs in
  useEffect(() => {
    const loadUserCart = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("user_settings")
            .select("cart_items")
            .eq("user_id", user.id)
            .single()

          if (data && !error && data.cart_items) {
            setCartItemsState(data.cart_items)
            localStorage.setItem("cart", JSON.stringify(data.cart_items))
          }
        } catch (error) {
          console.error("Error loading user cart:", error)
        }
      }
    }

    loadUserCart()
  }, [user])

  // Save cart to localStorage and Supabase
  const saveCart = async (items: CartItem[]) => {
    setCartItemsState(items)
    localStorage.setItem("cart", JSON.stringify(items))

    // Save to Supabase if user is logged in
    if (user) {
      try {
        // First check if the user already has a record
        const { data, error: fetchError } = await supabase
          .from("user_settings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle()

        if (fetchError) {
          console.error("Error checking user settings:", fetchError)
          return
        }

        if (data) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("user_settings")
            .update({
              cart_items: items,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)

          if (updateError) {
            console.error("Error updating user cart:", updateError)
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase.from("user_settings").insert({
            user_id: user.id,
            cart_items: items,
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error inserting user cart:", insertError)
          }
        }
      } catch (error) {
        console.error("Error saving user cart:", error)
      }
    }
  }

  const addToCart = (product: CartItem) => {
    setCartItemsState((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      let newItems

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item,
        )
      } else {
        newItems = [...prevItems, product]
      }

      saveCart(newItems)
      return newItems
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItemsState((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId)
      saveCart(newItems)
      return newItems
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItemsState((prevItems) => {
      const newItems = prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = () => {
    setCartItemsState([])
    saveCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
