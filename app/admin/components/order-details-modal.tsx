"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, Package } from "lucide-react"
import { supabase } from "@/lib/supabase"

type OrderDetailsModalProps = {
  order: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
}

const emailTemplates = {
  pending: `Dear Customer,

Thank you for your order #{{orderNumber}}. We have received your order and are processing it. 
You will receive another email once your order has been processed.

Best regards,
Quaval Bearings Team`,

  processing: `Dear Customer,

Your order #{{orderNumber}} is now being processed. We are preparing your items for shipment.
You will receive a notification once your order has been shipped.

Best regards,
Quaval Bearings Team`,

  shipped: `Dear Customer,

Great news! Your order #{{orderNumber}} has been shipped and is on its way to you.
You can track your package using the following tracking number: {{trackingNumber}}

Estimated delivery date: {{estimatedDelivery}}

Best regards,
Quaval Bearings Team`,

  delivered: `Dear Customer,

Your order #{{orderNumber}} has been delivered. We hope you are satisfied with your purchase.
If you have any questions or concerns, please don't hesitate to contact us.

We would appreciate if you could take a moment to review your purchase.

Best regards,
Quaval Bearings Team`,

  cancelled: `Dear Customer,

Your order #{{orderNumber}} has been cancelled as requested.
If you have any questions or would like to place a new order, please contact our customer service.

Best regards,
Quaval Bearings Team`,
}

export function OrderDetailsModal({ order, isOpen, onOpenChange, onStatusChange }: OrderDetailsModalProps) {
  const [emailSubject, setEmailSubject] = useState(`Update on your order #${order?.id?.slice(-6).toUpperCase()}`)
  const [emailBody, setEmailBody] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending")
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Format the shipping address from shipping_info
  const shippingAddress = order?.shipping_info
    ? typeof order.shipping_info === "string"
      ? JSON.parse(order.shipping_info)
      : order.shipping_info
    : null

  // Fetch user email when modal opens
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (order?.user_id && isOpen) {
        const { data, error } = await supabase.from("profiles").select("email").eq("id", order.user_id).single()

        if (!error && data) {
          setUserEmail(data.email)
        } else {
          // Try to get from auth.users as fallback
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id)
          if (!userError && userData?.user) {
            setUserEmail(userData.user.email)
          }
        }
      }
    }

    fetchUserEmail()
  }, [order?.user_id, isOpen])

  // Handle email template selection
  const handleTemplateSelect = (status: string) => {
    let template = emailTemplates[status as keyof typeof emailTemplates] || ""

    // Replace placeholders
    template = template.replace(/{{orderNumber}}/g, order?.id?.slice(-6).toUpperCase() || "")
    template = template.replace(/{{trackingNumber}}/g, trackingNumber || "[Add Tracking Number]")
    template = template.replace(/{{estimatedDelivery}}/g, estimatedDelivery || "[Add Estimated Delivery Date]")

    setEmailBody(template)
  }

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    setSelectedStatus(newStatus)
    await onStatusChange(order.id, newStatus)
    setUpdatingStatus(false)

    // Auto-select email template for the new status
    handleTemplateSelect(newStatus)
  }

  // Send email function
  const sendEmail = async () => {
    setIsSending(true)

    try {
      // In a real application, you would send the email here
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the email details
      console.log("Email sent:", {
        to: userEmail || order.user_email,
        subject: emailSubject,
        body: emailBody,
      })

      // Create a notification for the user
      if (order.user_id) {
        await supabase.from("notifications").insert({
          user_id: order.user_id,
          message: `We sent you an email about your order #${order.id.slice(-6).toUpperCase()}`,
          type: "info",
          read: false,
        })
      }

      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order?.id?.slice(-6).toUpperCase()}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order?.created_at).toLocaleString()} by {order?.user_email || "Guest"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            <TabsTrigger value="email">Send Email</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.items && order.items.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <p className="font-medium">Total</p>
                      <p className="font-bold">${order?.total?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="status">Update Order Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={updatingStatus}>
                      <SelectTrigger className="w-[200px] bg-white">
                        {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SelectValue />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge
                      className={`ml-2 ${
                        selectedStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedStatus === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : selectedStatus === "shipped"
                              ? "bg-green-100 text-green-800"
                              : selectedStatus === "delivered"
                                ? "bg-green-500 text-white"
                                : selectedStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                {shippingAddress ? (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {shippingAddress.name}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {shippingAddress.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span> {shippingAddress.city}
                    </p>
                    <p>
                      <span className="font-medium">State/Province:</span> {shippingAddress.state}
                    </p>
                    <p>
                      <span className="font-medium">Postal Code:</span> {shippingAddress.postal_code}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span> {shippingAddress.country}
                    </p>
                    {shippingAddress.phone && (
                      <p>
                        <span className="font-medium">Phone:</span> {shippingAddress.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No shipping information available</p>
                  </div>
                )}

                {selectedStatus === "shipped" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery">Estimated Delivery</Label>
                      <Input
                        id="delivery"
                        type="date"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Email to Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template">Select Email Template</Label>
                    <Select onValueChange={handleTemplateSelect} defaultValue={order?.status || "pending"}>
                      <SelectTrigger className="w-full mt-1 bg-white">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Order Received</SelectItem>
                        <SelectItem value="processing">Order Processing</SelectItem>
                        <SelectItem value="shipped">Order Shipped</SelectItem>
                        <SelectItem value="delivered">Order Delivered</SelectItem>
                        <SelectItem value="cancelled">Order Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="body">Email Body</Label>
                    <Textarea
                      id="body"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={10}
                      className="mt-1 font-mono"
                    />
                  </div>

                  <Button
                    onClick={sendEmail}
                    disabled={isSending || !emailBody.trim() || (!userEmail && !order?.user_email)}
                    className="w-full"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : emailSent ? (
                      <>Email Sent Successfully</>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email to {userEmail || order?.user_email || "Customer"}
                      </>
                    )}
                  </Button>

                  {!userEmail && !order?.user_email && (
                    <p className="text-sm text-red-500">Cannot send email: No customer email address available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
