"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import ProtectedRoute from "@/app/[locale]/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Package, Truck, Calendar, AlertCircle } from "lucide-react"
import { getOrderById, type Order } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchOrder() {
      if (!user) return

      try {
        setIsLoading(true)
        const orderId = Number.parseInt(params.id)
        if (isNaN(orderId)) {
          setError("Invalid order ID")
          return
        }

        const orderData = await getOrderById(orderId)

        if (!orderData) {
          setError("Order not found")
          return
        }

        // Verify this order belongs to the current user
        if (orderData.user_id !== user.id) {
          setError("You don't have permission to view this order")
          return
        }

        setOrder(orderData)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/orders")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Order #{order.order_number}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Items</h3>
                      <div className="space-y-4">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-start space-x-4">
                            <div className="h-20 w-20 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                              {item.product?.images?.[0] ? (
                                <Image
                                  src={item.product.images[0] || "/placeholder.svg"}
                                  alt={item.product.part_number}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                <Link href={`/products/${item.product_id}`} className="hover:underline">
                                  {item.product?.part_number || "Product"}
                                </Link>
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.product?.family_brand} {item.product?.family_name}
                              </p>
                              <div className="flex justify-between mt-1">
                                <p className="text-sm">Qty: {item.quantity}</p>
                                <p className="font-medium">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(order.total * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${(order.total * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {order.status !== "Pending" && (
                      <div className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-gray-500">{new Date(order.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {(order.status === "Shipped" || order.status === "Delivered") && (
                      <div className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Shipped</p>
                          <p className="text-sm text-gray-500">{new Date(order.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {order.status === "Delivered" && (
                      <div className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-gray-500">{new Date(order.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {order.status === "Cancelled" && (
                      <div className="flex items-start">
                        <div className="mr-3 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Cancelled</p>
                          <p className="text-sm text-gray-500">{new Date(order.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Need Help?</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  )
}
