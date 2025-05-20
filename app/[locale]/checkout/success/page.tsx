"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useTranslate } from "@/lib/i18n-client"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")
  const [orderNumber, setOrderNumber] = useState<string>("")
  const { t } = useTranslate()
  const { user } = useAuth()

  useEffect(() => {
    // Generate a random order number only once when the component mounts
    const randomOrderId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setOrderNumber(randomOrderId)

    // Save the order to the database if we have a session_id and user
    if (session_id && user) {
      saveOrderToDatabase(randomOrderId)
    }
  }, [session_id, user])

  const saveOrderToDatabase = async (orderNum: string) => {
    try {
      // Get cart items from local storage
      const cartItemsJson = localStorage.getItem("cartItems")
      if (!cartItemsJson) return

      const cartItems = JSON.parse(cartItemsJson)
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total: total,
          items: cartItems,
          payment_intent: session_id,
        })
        .select()
        .single()

      if (orderError) {
        console.error("Error saving order:", orderError)
      }

      // Clear the cart after successful order
      localStorage.removeItem("cartItems")
    } catch (error) {
      console.error("Error saving order:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('checkout.thankYou')}</h1>
          <p className="text-gray-600 text-lg">{t('checkout.orderReceived')}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">{t('checkout.orderNumber')}</p>
                <p className="text-lg font-semibold">#{orderNumber}</p>
              </div>
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link href="/orders">
                  {t('checkout.viewOrderStatus')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">{t('checkout.whatHappensNext')}</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('checkout.orderConfirmation')}</h3>
                    <p className="text-gray-600">{t('checkout.emailConfirmation')}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('checkout.orderProcessing')}</h3>
                    <p className="text-gray-600">{t('checkout.processingDescription')}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('checkout.shipping')}</h3>
                    <p className="text-gray-600">{t('checkout.trackingInformation')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/products">{t('cart.continueShopping')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
