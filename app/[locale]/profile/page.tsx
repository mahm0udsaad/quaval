"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import ProtectedRoute from "@/app/[locale]/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Order = {
  id: string
  created_at: string
  status: string
  total: number
  items: any[]
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error)
      } else {
        setOrders(data || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/auth/signin")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="p-2 bg-gray-50 rounded-md">{user?.app_metadata?.provider || "Email"}</div>
                </div>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">{user?.id}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
                <Button variant="destructive" onClick={handleSignOut} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
                <CardDescription>View and track your order history</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">When you place orders, they will appear here.</p>
                    <Button className="mt-6" onClick={() => router.push("/products")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                          </div>
                          <Badge className={`mt-2 md:mt-0 ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                  {item.image ? (
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-8 h-8 object-contain"
                                    />
                                  ) : (
                                    <Package className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <p className="font-medium">Total</p>
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
