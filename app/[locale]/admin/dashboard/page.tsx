"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/[locale]/contexts/AuthContext"
import ProtectedRoute from "@/app/[locale]/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
// Add imports for the SQL components
import { UserTablesSQL } from "@/app/admin/components/user-tables-sql"
import { OrdersTableSQL } from "@/app/admin/components/orders-table-sql"
import { NotificationsTableSQL } from "@/app/admin/components/notifications-table-sql"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Check if user has admin role (you would implement this based on your user metadata)
  const isAdmin = user?.email?.endsWith("@quaval.ca") || false

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      // Redirect non-admin users
      router.push("/")
    }
  }, [user, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Active user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">128</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>All time orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">256</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Revenue</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$12,450</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">john.doe@example.com - 2 hours ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Order #ORD-005 placed</p>
                <p className="text-sm text-gray-500">jane.smith@example.com - 4 hours ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Product inventory updated</p>
                <p className="text-sm text-gray-500">admin@quaval.ca - 6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Setup Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>Set up your database tables and initial data</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <UserTablesSQL />
              <OrdersTableSQL />
              <NotificationsTableSQL />
            </CardContent>
          </Card>
          {/* Other cards... */}
        </div>
      </div>
    </ProtectedRoute>
  )
}
