"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import { useCart } from "@/app/[locale]/contexts/CartContext"
import { supabase } from "@/lib/supabase"
import { useTranslate } from "@/lib/i18n-client"
import { sendOrderConfirmationEmail } from "@/lib/email/action"

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  partNumber?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const order = searchParams.get("order") // Get order number from URL
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [emailSent, setEmailSent] = useState(false)
  const [orderProcessed, setOrderProcessed] = useState(false) // Prevent duplicate processing
  const processingRef = useRef(false) // Additional ref to prevent React Strict Mode issues
  const { t } = useTranslate()
  const { user } = useAuth()
  const { cartItems, clearCart, clearCartFromSupabase } = useCart()

  useEffect(() => {
    console.log('🔄 Single useEffect triggered with:', {
      hasOrder: !!order,
      hasUser: !!user,
      cartItemsCount: cartItems.length,
      orderProcessed,
      processingRefCurrent: processingRef.current
    })

    // STEP 1: Component initialization and cleanup (runs once on mount)
    if (!processingRef.current && !orderProcessed) {
      console.log('🧹 Initializing component and cleaning up stale data')
      
      // Reset processing flags when component mounts
      processingRef.current = false
      setOrderProcessed(false)
      
      // Clean up old processed orders from sessionStorage
      try {
        const processedOrders = sessionStorage.getItem('processedOrders')
        if (processedOrders) {
          const ordersList = JSON.parse(processedOrders)
          // Keep only recent orders (this is a simple cleanup)
          if (ordersList.length > 10) {
            const recentOrders = ordersList.slice(-5) // Keep last 5 orders
            sessionStorage.setItem('processedOrders', JSON.stringify(recentOrders))
          }
        }
      } catch (error) {
        console.log('Error cleaning up processed orders:', error)
        sessionStorage.removeItem('processedOrders')
      }
    }

    // STEP 2: Order number handling
    let finalOrderNumber = order
    
    if (!finalOrderNumber) {
      // Generate a new order number if not in URL
      finalOrderNumber = `ORD-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      console.log('🆕 Generated new order number:', finalOrderNumber)
    } else {
      console.log('🔗 Using order number from URL:', finalOrderNumber)
    }
    
    setOrderNumber(finalOrderNumber)
    console.log('🎯 Order number set:', finalOrderNumber)

    // STEP 3: Order processing logic
    // Only process if we have user, cart items, and haven't processed yet
    if (user && cartItems.length > 0 && !orderProcessed && !processingRef.current) {
      console.log('✅ All conditions met for order processing:', finalOrderNumber)
      
      // Set processing flags immediately to prevent any race conditions
      console.log('🔒 Setting processing flags to prevent duplicates')
      setOrderProcessed(true)
      processingRef.current = true
      
      // Check sessionStorage for already processed orders
      const processedOrders = sessionStorage.getItem('processedOrders')
      const processedOrdersList = processedOrders ? JSON.parse(processedOrders) : []
      
      if (processedOrdersList.includes(finalOrderNumber)) {
        console.log('🚀 Order already processed in session:', finalOrderNumber)
        return
      }
      
      // Mark as processed in session immediately
      processedOrdersList.push(finalOrderNumber)
      sessionStorage.setItem('processedOrders', JSON.stringify(processedOrdersList))
      console.log('📝 Marked order as processed in session:', finalOrderNumber)
      
      // Process the order
      console.log('🚀 Starting order processing:', finalOrderNumber)
      processSuccessfulOrder(finalOrderNumber)
    } else {
      console.log('❌ Conditions not met for processing:', {
        hasUser: !!user,
        hasCartItems: cartItems.length > 0,
        notProcessed: !orderProcessed,
        refNotProcessing: !processingRef.current
      })
      
      if (cartItems.length === 0) {
        console.log('Cart already empty, order may have been processed')
      } else if (orderProcessed) {
        console.log('Order already processed, skipping')
      }
    }
  }, [user, cartItems, order]) // Minimal dependencies for optimal performance

  const processSuccessfulOrder = async (orderNum: string) => {
    try {
      console.log('🚀 Processing successful order:', orderNum)
      console.log('📦 Cart items to process:', cartItems.length, 'items')
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shipping = 15.0
      const tax = subtotal * 0.13
      const total = subtotal + shipping + tax

      console.log('💰 Order totals:', { subtotal, shipping, tax, total })

      // Get shipping address from session storage
      const shippingAddressJson = sessionStorage.getItem("shippingAddress")
      const shippingAddress: ShippingAddress | null = shippingAddressJson ? JSON.parse(shippingAddressJson) : null

      console.log('📍 Raw shipping address from sessionStorage:', shippingAddressJson)
      console.log('📍 Parsed shipping address:', shippingAddress)

      if (!shippingAddress || !user) {
        console.error("❌ No shipping address found or user not logged in")
        // Still clear cart even if we can't save order
        if (user) {
          await clearCartFromSupabase()
        }
        clearCart()
        return
      }

      console.log('📍 Shipping address found:', shippingAddress.name, shippingAddress.city)

      // Save order to database with proper order_number
      console.log('💾 Saving order to database...')
      
      // Use upsert-like logic to prevent duplicates
      try {
        // First, try to insert the order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            user_email: user.email,
            status: "pending",
            total: total,
            items: cartItems,
            order_number: orderNum,
            shipping_address: shippingAddress,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (orderError) {
          // Check if it's a duplicate key error (order already exists)
          if (orderError.code === '23505' || orderError.message.includes('duplicate')) {
            console.log('✅ Order already exists in database (duplicate key):', orderNum)
            // Fetch the existing order
            const { data: existingOrder } = await supabase
              .from("orders")
              .select("id, order_number")
              .eq("order_number", orderNum)
              .single()
            
            if (existingOrder) {
              console.log('✅ Found existing order:', existingOrder.order_number)
            }
          } else {
            console.error("❌ Error saving order:", orderError)
            console.error("❌ Full error details:", {
              message: orderError.message,
              code: orderError.code,
              details: orderError.details,
              hint: orderError.hint
            })
            throw orderError // Re-throw non-duplicate errors
          }
        } else {
          console.log("✅ Order saved successfully:", orderData?.id)
          console.log("✅ Order number in database:", orderData?.order_number)
        }
      } catch (dbError) {
        console.error("❌ Database operation failed:", dbError)
        // Continue with email sending even if database save fails
      }

      // Send confirmation email with real order data
      console.log('📧 Starting email sending process...')

      // Check if email was already sent for this order
      const sentEmails = sessionStorage.getItem('sentEmails')
      const sentEmailsList = sentEmails ? JSON.parse(sentEmails) : []
      
      if (sentEmailsList.includes(orderNum)) {
        console.log('📧 Email already sent for order:', orderNum)
        setEmailSent(true)
      } else {
        try {
          console.log('📧 Preparing email with REAL order data...')
          console.log('📧 Email recipient:', user.email)
          console.log('📧 Real order details for email:', {
            orderNumber: orderNum,
            customerName: shippingAddress.name,
            itemCount: cartItems.length,
            total: total,
            realItems: cartItems.map(item => ({
              name: item.name,
              partNumber: item.partNumber,
              price: item.price,
              quantity: item.quantity
            }))
          })

          const emailResult = await sendOrderConfirmationEmail({
            email: user.email || "",
            customerName: shippingAddress.name,
            orderNumber: orderNum,
            items: cartItems.map(item => ({
              id: item.id.toString(),
              name: item.name,
              partNumber: item.partNumber || "",
              price: item.price,
              quantity: item.quantity,
            })),
            shippingAddress: {
              name: shippingAddress.name,
              address: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
            subtotal,
            shipping,
            tax,
            total,
          })

          console.log('📧 Email service response:', emailResult)

          if (emailResult.success) {
            console.log('✅ Order confirmation email sent successfully to:', user.email)
            console.log('✅ Email contained real order data for order:', orderNum)
            setEmailSent(true)
            
            // Mark email as sent for this order
            sentEmailsList.push(orderNum)
            sessionStorage.setItem('sentEmails', JSON.stringify(sentEmailsList))
          } else {
            console.warn('⚠️ Failed to send order confirmation email:', emailResult.error)
          }
        } catch (emailError) {
          console.error('❌ Error in email sending process:', emailError)
        }
      }

      // Clear cart from Supabase database
      console.log('🗑️ Clearing cart from Supabase...')
      await clearCartFromSupabase()
      console.log('✅ Cart cleared from Supabase successfully')

      // Clear cart from local state and storage
      console.log('🗑️ Clearing local cart...')
      clearCart()
      localStorage.removeItem("cartItems")
      sessionStorage.removeItem("shippingAddress")
      
      console.log('✅ Order processing completed successfully')
    } catch (error) {
      console.error("❌ Error processing order:", error)
      // Still clear cart even if there's an error
      console.log('🗑️ Clearing cart due to error...')
      await clearCartFromSupabase()
      clearCart()
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
                    <p className="text-gray-600">
                      {emailSent 
                        ? t('checkout.emailConfirmationSent') 
                        : t('checkout.emailConfirmation')
                      }
                    </p>
                    {emailSent && (
                      <p className="text-green-600 text-sm mt-1">✓ Confirmation email sent</p>
                    )}
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
