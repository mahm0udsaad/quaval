"use server"

import { redirect } from "next/navigation"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"
import type { CartItem } from "@/app/[locale]/contexts/CartContext"

// Define shipping address type
export interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
}

// Check if the Stripe key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey || stripeSecretKey.length === 0) {
  console.error("STRIPE_SECRET_KEY is not set or is empty")
}

// Initialize Stripe with your secret key with proper error handling
let stripe: Stripe | null = null
try {
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-04-30.basil",
    })
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error)
}

// Create a payment intent for Stripe Elements
export async function createPaymentIntent(
  cartItems: CartItem[],
  userId?: string,
  email?: string,
  shippingAddress?: ShippingAddress,
) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return {
        error: "Stripe is not properly configured. Please check your environment variables.",
      }
    }

    // Check if we have items to checkout
    if (!cartItems || cartItems.length === 0) {
      return {
        error: "Your cart is empty",
      }
    }

    // Calculate the total amount
    const amount = Math.round(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100)

    // Add shipping and tax
    const shipping = 1500 // $15.00
    const tax = Math.round(amount * 0.13) // 13% tax
    const totalAmount = amount + shipping + tax

    // DO NOT create order here - orders should only be created after successful payment
    // The success page will handle order creation with proper order numbers

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "cad",
      metadata: {
        userId: userId || "guest",
        // Store cart and shipping data in metadata for success page
        cartItems: JSON.stringify(cartItems),
        ...(shippingAddress && { shippingAddress: JSON.stringify(shippingAddress) }),
      },
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error) {
    console.error("Stripe payment intent error:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred during checkout",
    }
  }
}

// Legacy checkout session creation (keeping for reference)
export async function createCheckoutSession(
  cartItems: CartItem[],
  userId?: string,
  email?: string,
  shippingAddress?: ShippingAddress,
) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return {
        error: "Stripe is not properly configured. Please check your environment variables.",
        redirectToCart: true,
      }
    }

    // Check if we have items to checkout
    if (!cartItems || cartItems.length === 0) {
      return {
        error: "Your cart is empty",
        redirectToCart: true,
      }
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name,
          description: item.partNumber ? `Part #: ${item.partNumber}` : undefined,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // DO NOT create order here - orders should only be created after successful payment
    // The success page will handle order creation with proper order numbers

    // Get the site URL with fallback
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: {
        userId: userId || "guest",
        cartItems: JSON.stringify(cartItems),
        ...(shippingAddress && { shippingAddress: JSON.stringify(shippingAddress) }),
      },
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
    })

    // Redirect to the Stripe checkout page
    if (session.url) {
      redirect(session.url)
    }

    return { error: "Failed to create checkout session" }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return {
      error: error instanceof Error ? error.message : "An error occurred during checkout",
      redirectToCart: true,
    }
  }
}
