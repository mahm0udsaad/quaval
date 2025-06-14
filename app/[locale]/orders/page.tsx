"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import ProtectedRoute from "@/app/[locale]/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Loader2, Package, ShoppingCart, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Order = {
  id: string
  order_number: string | null
  user_id: string
  created_at: string
  status: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    partNumber?: string
    image?: string
  }>
  shipping_address: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchOrderNumber, setSearchOrderNumber] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
    
    // Check if there's an order parameter in URL for direct tracking
    const orderParam = searchParams?.get('order')
    if (orderParam) {
      setSearchOrderNumber(orderParam)
      handleOrderSearch(orderParam)
    }
  }, [user, searchParams])

  const fetchOrders = async () => {
    if (!user) return

    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error)
        return
      }

      console.log("📦 Fetched orders:", data)
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleOrderSearch = async (orderNumber: string) => {
    if (!orderNumber.trim()) {
      fetchOrders()
      return
    }

    setSearchLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim())
        .eq("user_id", user?.id) // Only show user's own orders

      if (error) {
        console.error("Error searching for order:", error)
        return
      }

      console.log("🔍 Search results for order:", orderNumber, data)
      setOrders(data || [])
    } catch (error) {
      console.error("Error searching for order:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-green-500 text-white"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getOrderNumber = (order: Order) => {
    return order.order_number || `#${order.id.slice(-6).toUpperCase()}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {/* Order Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter order number (e.g., ORD-460024L2CZCL)"
                  value={searchOrderNumber}
                  onChange={(e) => setSearchOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleOrderSearch(searchOrderNumber)}
                />
              </div>
              <Button 
                onClick={() => handleOrderSearch(searchOrderNumber)}
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchOrderNumber("")
                  fetchOrders()
                }}
              >
                Show All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {searchOrderNumber ? `Search Results for "${searchOrderNumber}"` : "Order History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders || searchLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">
                  {searchOrderNumber ? "No orders found" : "No orders yet"}
                </h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  {searchOrderNumber 
                    ? `No orders found matching "${searchOrderNumber}". Please check the order number and try again.`
                    : "You haven't placed any orders yet. Browse our products and place your first order!"
                  }
                </p>
                {!searchOrderNumber && (
                  <Button className="mt-6" onClick={() => router.push("/products")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{getOrderNumber(order)}</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
