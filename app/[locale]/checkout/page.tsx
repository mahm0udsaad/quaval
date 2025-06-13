"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/[locale]/contexts/CartContext"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import { useCurrency } from "@/app/[locale]/contexts/CurrencyContext"
import { createPaymentIntent } from "@/app/[locale]/actions/stripe"
import { getUserProfile, updateUserProfile } from "@/app/[locale]/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Package,
  Truck,
  Shield,
  LogIn,
  User,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StripeProvider } from "./stripe-provider"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useTranslate } from "@/lib/i18n-client"
import { sendOrderConfirmationEmail } from "@/lib/email/action"

// CartItem interface for type safety
interface CartItem {
  id: number
  name: string
  partNumber?: string
  price: number
  quantity: number
  image?: string
}

// Helper function to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp.slice(-6)}${random}`
}

// Main checkout page component
export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const { selectedCurrency, convertPrice } = useCurrency()
  const router = useRouter()
  const { t } = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [email, setEmail] = useState(user?.email || "")
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })
  const [step, setStep] = useState(1) // 1: Information, 2: Payment
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>("")

  // Calculate total
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15.0 // Fixed shipping cost
  const tax = subtotal * 0.13 // 13% tax
  const total = subtotal + shipping + tax

  // Convert prices to selected currency
  const convertedSubtotal = convertPrice(subtotal)
  const convertedShipping = convertPrice(shipping)
  const convertedTax = convertPrice(tax)
  const convertedTotal = convertPrice(total)

  // Generate order number when component mounts
  useEffect(() => {
    if (!orderNumber) {
      setOrderNumber(generateOrderNumber())
    }
  }, [orderNumber])

  // Load user profile data if logged in
  useEffect(() => {
    async function loadUserProfile() {
      if (user && !profileLoaded) {
        try {
          const { profile, error } = await getUserProfile(user.id)

          if (error) {
            console.error("Error loading profile:", error)
            return
          }

          if (profile) {
            // Pre-fill shipping address if available
            if (profile.address) {
              const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ")

              setShippingAddress({
                name: fullName || "",
                address: profile.address || "",
                city: profile.city || "",
                state: profile.state || "",
                postalCode: profile.postal_code || "",
                country: profile.country || "",
              })
            }

            setProfileLoaded(true)
          }
        } catch (err) {
          console.error("Failed to load user profile:", err)
        }
      }
    }

    loadUserProfile()
  }, [user, profileLoaded])

  // Create payment intent when component mounts
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
      return
    }

    async function createIntent() {
      try {
        // Format shipping address for the API
        const formattedShippingAddress = {
          name: shippingAddress.name,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        }

        const response = await createPaymentIntent(cartItems, user?.id, email, formattedShippingAddress)

        if (response.error) {
          setError(response.error)
          return
        }

        if (response.clientSecret) {
          setClientSecret(response.clientSecret)
        }
      } catch (err) {
        setError(t('checkout.fillAllFields'))
      }
    }

    if (step === 2 && user) {
      createIntent()
    }
  }, [cartItems, user, email, router, step, shippingAddress, t])

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !shippingAddress.name ||
      !email ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError(t('checkout.fillAllFields'))
      return
    }

    setError(null)

    // If user is logged in, save shipping address to profile
    if (user) {
      try {
        setIsLoading(true)
        const result = await updateUserProfile(user.id, shippingAddress)

        if (result.error) {
          console.error("Error saving address to profile:", result.error)
          // Continue anyway, this is not critical
        }
      } catch (err) {
        console.error("Failed to update profile:", err)
        // Continue anyway, this is not critical
      } finally {
        setIsLoading(false)
      }
    }

    setStep(2)
  }

  const handleBackToInformation = () => {
    setStep(1)
  }

  // Redirect to sign in page with return URL
  const handleSignIn = () => {
    // Save the cart to localStorage before redirecting
    router.push(`/auth/signin?returnUrl=${encodeURIComponent("/checkout")}`)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('checkout.emptyCartTitle')}</h1>
        <p className="mb-8">{t('checkout.emptyCartMessage')}</p>
        <Link href="/products" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2" />
          {t('cart.continueShopping')}
        </Link>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  // If user is not logged in, show sign in prompt
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{t('checkout.signInRequired')}</CardTitle>
                <CardDescription>{t('checkout.signInMessage')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <User className="h-16 w-16 text-primary opacity-80" />
                </div>
                <p className="text-center text-gray-600">
                  {t('checkout.accountDetailsNeeded')}
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleSignIn} size="lg" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('checkout.signInToContinue')}
                  </Button>
                  <Link href={`/auth/signup?returnUrl=${encodeURIComponent("/checkout")}`}>
                    <Button variant="outline" size="lg" className="w-full">
                      {t('checkout.createNewAccount')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t bg-gray-50 p-4">
                <Link
                  href="/cart"
                  className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('checkout.returnToCart')}
                </Link>
              </CardFooter>
            </Card>

            {/* Order Summary (Mobile) */}
            <div className="mt-6">
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    {t('checkout.orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center p-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          {item.partNumber && <p className="text-xs text-gray-500">Part #: {item.partNumber}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {selectedCurrency.symbol} {convertPrice(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('cart.subtotal')}</span>
                        <span>
                          {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('cart.shipping')}</span>
                        <span>
                          {selectedCurrency.symbol} {convertedShipping.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('checkout.tax')}</span>
                        <span>
                          {selectedCurrency.symbol} {convertedTax.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>{t('cart.total')}</span>
                        <span>
                          {selectedCurrency.symbol} {convertedTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">{t('checkout.title')}</h1>
          <div className="flex justify-center mb-8">
            <div className="flex items-center text-sm">
              <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span>{t('checkout.information')}</span>
              </div>
              <div className="w-10 h-0.5 mx-2 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span>{t('checkout.payment')}</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('checkout.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Order Information */}
            <div className="md:col-span-2">
              {step === 1 ? (
                <div className="space-y-8">
                  {/* Shipping Information */}
                  <Card className="overflow-hidden border-0 shadow-md">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        {t('checkout.shippingInformation')}
                      </CardTitle>
                      {user && (
                        <CardDescription>
                          {t('checkout.shippingInfoSaved')}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleContinueToPayment} className="grid gap-6">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="email" className="font-medium">
                              {t('checkout.email')}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="name" className="font-medium">
                              {t('checkout.fullName')}
                            </Label>
                            <Input
                              id="name"
                              value={shippingAddress.name}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                              required
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address" className="font-medium">
                              {t('checkout.address')}
                            </Label>
                            <Input
                              id="address"
                              value={shippingAddress.address}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                              required
                              className="border-gray-300 focus:border-primary focus:ring-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="city" className="font-medium">
                                {t('checkout.city')}
                              </Label>
                              <Input
                                id="city"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="state" className="font-medium">
                                {t('checkout.stateProvince')}
                              </Label>
                              <Input
                                id="state"
                                value={shippingAddress.state}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="postalCode" className="font-medium">
                                {t('checkout.postalCode')}
                              </Label>
                              <Input
                                id="postalCode"
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="country" className="font-medium">
                                {t('checkout.country')}
                              </Label>
                              <Input
                                id="country"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <Link
                            href="/cart"
                            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('checkout.returnToCart')}
                          </Link>
                          <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading ? (
                              <span className="flex items-center">
                                <ShoppingBag className="mr-2 h-4 w-4 animate-spin" />
                                {t('checkout.processing')}
                              </span>
                            ) : (
                              t('checkout.continueToPayment')
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Order Summary (Mobile) */}
                  <div className="md:hidden">
                    <Card className="overflow-hidden border-0 shadow-md">
                      <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          {t('checkout.orderSummary')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center p-4">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                                <Image
                                  src={item.image || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-1"
                                />
                                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="font-medium text-sm">{item.name}</h3>
                                {item.partNumber && <p className="text-xs text-gray-500">Part #: {item.partNumber}</p>}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {selectedCurrency.symbol} {convertPrice(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{t('cart.subtotal')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('cart.shipping')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedShipping.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('checkout.tax')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedTax.toFixed(2)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>{t('cart.total')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trust Badges */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <Shield className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">{t('checkout.securePayment')}</h3>
                        <p className="text-xs text-gray-500">{t('checkout.securePaymentDesc')}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Truck className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">{t('checkout.fastShipping')}</h3>
                        <p className="text-xs text-gray-500">{t('checkout.fastShippingDesc')}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">{t('checkout.qualityGuarantee')}</h3>
                        <p className="text-xs text-gray-500">{t('checkout.qualityGuaranteeDesc')}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Package className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-medium text-sm">{t('checkout.easyReturns')}</h3>
                        <p className="text-xs text-gray-500">{t('checkout.easyReturnsDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Payment Information */}
                  <Card className="overflow-hidden border-0 shadow-md">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        {t('checkout.paymentInformation')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {clientSecret ? (
                        <StripeProvider clientSecret={clientSecret}>
                          <CheckoutForm
                            clientSecret={clientSecret}
                            email={email}
                            shippingAddress={shippingAddress}
                            orderNumber={orderNumber}
                            cartItems={cartItems}
                            subtotal={subtotal}
                            shipping={shipping}
                            tax={tax}
                            total={total}
                            onBack={handleBackToInformation}
                          />
                        </StripeProvider>
                      ) : (
                        <div className="py-8">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Summary (Mobile) */}
                  <div className="md:hidden">
                    <Card className="overflow-hidden border-0 shadow-md">
                      <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          {t('checkout.orderSummary')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center p-4">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                                <Image
                                  src={item.image || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-1"
                                />
                                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="font-medium text-sm">{item.name}</h3>
                                {item.partNumber && <p className="text-xs text-gray-500">Part #: {item.partNumber}</p>}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {selectedCurrency.symbol} {convertPrice(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{t('cart.subtotal')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('cart.shipping')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedShipping.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('checkout.tax')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedTax.toFixed(2)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>{t('cart.total')}</span>
                              <span>
                                {selectedCurrency.symbol} {convertedTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary (Desktop) */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      {t('checkout.orderSummary')}
                    </CardTitle>
                    <CardDescription>
                      {cartItems.length} {cartItems.length === 1 ? t('checkout.itemInCart') : t('checkout.itemsInCart')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-80 overflow-y-auto divide-y">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center p-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                            <Image
                              src={item.image || "/placeholder.svg?height=64&width=64"}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                            <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            {item.partNumber && <p className="text-xs text-gray-500">Part #: {item.partNumber}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {selectedCurrency.symbol} {convertPrice(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('cart.subtotal')}</span>
                          <span>
                            {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('cart.shipping')}</span>
                          <span>
                            {selectedCurrency.symbol} {convertedShipping.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('checkout.tax')}</span>
                          <span>
                            {selectedCurrency.symbol} {convertedTax.toFixed(2)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>{t('cart.total')}</span>
                          <span>
                            {selectedCurrency.symbol} {convertedTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-md border-0">
                  <h3 className="text-sm font-medium mb-2">{t('checkout.weAccept')}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-blue-600 rounded"></div>
                    <div className="w-10 h-6 bg-red-500 rounded"></div>
                    <div className="w-10 h-6 bg-yellow-400 rounded"></div>
                    <div className="w-10 h-6 bg-blue-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Checkout form with Stripe Elements
function CheckoutForm({
  clientSecret,
  email,
  shippingAddress,
  orderNumber,
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  onBack,
}: {
  clientSecret: string
  email: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  orderNumber: string
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  onBack: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { t } = useTranslate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    // Validate form
    if (
      !shippingAddress.name ||
      !email ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError(t('checkout.fillAllFields'))
      setIsLoading(false)
      return
    }

    // Save shipping address to session storage for success page
    sessionStorage.setItem("shippingAddress", JSON.stringify(shippingAddress))

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
        payment_method_data: {
          billing_details: {
            name: shippingAddress.name,
            email: email,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
          },
        },
      },
    })
    
    console.log('submitError', submitError)
    if (submitError) {
      setError(submitError.message || t('checkout.error'))
      setIsLoading(false)
    }
    // Note: If payment succeeds, Stripe will redirect to success page
    // The success page will handle email sending and cart clearing
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <div className="p-4 border rounded-md bg-white">
          <PaymentElement 
            className="payment-element" 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card'],
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('checkout.back')}
        </Button>

        <Button type="submit" size="lg" disabled={isLoading || !stripe || !elements} className="min-w-[150px]">
          {isLoading ? (
            <span className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4 animate-spin" />
              {t('checkout.processing')}
            </span>
          ) : (
            <span className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              {t('checkout.payNow')}
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
