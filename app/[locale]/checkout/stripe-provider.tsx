"use client"

import type { ReactNode } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "")

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string | null
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  if (!clientSecret) {
    return <div>{children}</div>
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      {children}
    </Elements>
  )
}
