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
  clearCartFromSupabase: () => Promise<void>
}

// Initialize with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  clearCartFromSupabase: async () => {},
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
        console.log('🛒 [CART CONTEXT] Loading user cart for:', user.id)
        try {
          const { data, error } = await supabase
            .from("user_settings")
            .select("cart_items")
            .eq("user_id", user.id)
            .single()

          if (error) {
            console.log('🛒 [CART CONTEXT] No existing user settings found:', error.message)
            // User doesn't have settings yet, keep current cart
          } else if (data && data.cart_items && Array.isArray(data.cart_items) && data.cart_items.length > 0) {
            console.log('🛒 [CART CONTEXT] Found existing cart with', data.cart_items.length, 'items')
            setCartItemsState(data.cart_items)
            localStorage.setItem("cart", JSON.stringify(data.cart_items))
          } else {
            console.log('🛒 [CART CONTEXT] User has empty cart in database')
            // User has empty cart in database, this is normal after checkout
          }
        } catch (error) {
          console.error("🛒 [CART CONTEXT] Error loading user cart:", error)
        }
      }
    }

    loadUserCart()
  }, [user])

  // Save cart to localStorage and Supabase (without updating state)
  const saveCart = async (items: CartItem[]) => {
    console.log('🛒 [CART CONTEXT] Saving cart:', items.length, 'items')
    localStorage.setItem("cart", JSON.stringify(items))
    console.log('🛒 [CART CONTEXT] Cart saved to localStorage')

    // Save to Supabase if user is logged in
    if (user) {
      console.log('🛒 [CART CONTEXT] User logged in, saving to Supabase')
      try {
        // First try to update existing record
        const { error: updateError } = await supabase
          .from("user_settings")
          .update({
            cart_items: items,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (updateError) {
          console.log('🛒 [CART CONTEXT] Update failed, trying upsert:', updateError.message)
          
          // If update fails (no existing record), try upsert
          const { error: upsertError } = await supabase
            .from("user_settings")
            .upsert({
              user_id: user.id,
              cart_items: items,
              email_notifications: true,
              marketing_emails: true,
              updated_at: new Date().toISOString(),
            })

          if (upsertError) {
            console.error("🛒 [CART CONTEXT] Error upserting user cart:", upsertError)
          } else {
            console.log('🛒 [CART CONTEXT] Cart upserted to Supabase successfully')
          }
        } else {
          console.log('🛒 [CART CONTEXT] Cart updated in Supabase successfully')
        }
      } catch (error) {
        console.error("🛒 [CART CONTEXT] Error saving user cart:", error)
      }
    } else {
      console.log('🛒 [CART CONTEXT] No user logged in, skipping Supabase save')
    }
  }

  const addToCart = (product: CartItem) => {
    console.log('🛒 [CART CONTEXT] Adding to cart:', product.name, 'quantity:', product.quantity)
    
    setCartItemsState((prevItems) => {
      console.log('🛒 [CART CONTEXT] Previous cart items:', prevItems.length)
      
      const existingItem = prevItems.find((item) => item.id === product.id)
      let newItems

      if (existingItem) {
        console.log('🛒 [CART CONTEXT] Item exists, updating quantity from', existingItem.quantity, 'to', existingItem.quantity + product.quantity)
        newItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item,
        )
      } else {
        console.log('🛒 [CART CONTEXT] New item, adding to cart')
        newItems = [...prevItems, product]
      }

      console.log('🛒 [CART CONTEXT] New cart items:', newItems.length)
      
      // Save to storage and Supabase after state update
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
    console.log('🛒 [CART CONTEXT] Clearing cart')
    setCartItemsState([])
    // Only clear localStorage, don't save empty cart to Supabase immediately
    // This prevents interference with checkout process
    localStorage.setItem("cart", JSON.stringify([]))
  }

  const clearCartFromSupabase = async () => {
    console.log('🛒 [CART CONTEXT] Clearing cart from Supabase')
    try {
      if (user) {
        console.log('🛒 [CART CONTEXT] User found, clearing Supabase cart for user:', user.id)
        const { error } = await supabase
          .from("user_settings")
          .update({
            cart_items: [],
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          
        if (error) {
          console.error("🛒 [CART CONTEXT] Error clearing user cart:", error)
        } else {
          console.log('🛒 [CART CONTEXT] Supabase cart cleared successfully')
        }
      } else {
        console.log('🛒 [CART CONTEXT] No user found, skipping Supabase clear')
      }
    } catch (error) {
      console.error("🛒 [CART CONTEXT] Error clearing user cart:", error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartFromSupabase,
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
