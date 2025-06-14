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
import { Loader2, Mail, Package, Truck, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getOrderStatusUpdateTemplate, OrderStatusUpdateData } from "@/lib/email/template"
import { sendOrderStatusUpdateEmail } from "@/lib/email/action"

type OrderDetailsModalProps = {
  order: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
}

export function OrderDetailsModal({ order, isOpen, onOpenChange, onStatusChange }: OrderDetailsModalProps) {
  const [emailSubject, setEmailSubject] = useState(`Update on your order #${order?.order_number || order?.id?.slice(-6).toUpperCase()}`)
  const [emailBody, setEmailBody] = useState("")
  const [awbNumber, setAwbNumber] = useState(order?.awb_number || "")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isUpdatingAwb, setIsUpdatingAwb] = useState(false)

  // Format the shipping address from shipping_address
  const shippingAddress = order?.shipping_address
    ? typeof order.shipping_address === "string"
      ? JSON.parse(order.shipping_address)
      : order.shipping_address
    : null

  // Set user email from order data when modal opens
  useEffect(() => {
    if (isOpen && order?.user_email) {
      setUserEmail(order.user_email)
    }
  }, [isOpen, order?.user_email])

  // Generate email template based on status
  const generateEmailTemplate = (status: string) => {
    if (!order) return ""

    const orderData: OrderStatusUpdateData = {
      customerName: shippingAddress?.name || "Valued Customer",
      orderNumber: order.order_number || order.id?.slice(-6).toUpperCase() || "",
      orderDate: new Date(order.created_at).toLocaleDateString(),
      orderStatus: status.charAt(0).toUpperCase() + status.slice(1) as 'Processing' | 'Shipped' | 'Delivered',
      items: order.cart?.map((item: any) => ({
        name: item.name || item.title || "Product",
        model: item.partNumber || item.model || "",
        quantity: item.quantity || 1,
        innerDiameter: item.innerDiameter || "",
        outerDiameter: item.outerDiameter || "",
      })) || [],
      trackingInfo: awbNumber ? {
        number: awbNumber,
        url: `https://track.example.com/${awbNumber}` // Replace with actual tracking URL
      } : undefined,
      estimatedDelivery: estimatedDelivery || "3-5 business days",
      progress: {
        processing: status === "processing" || status === "shipped" || status === "delivered",
        shipped: status === "shipped" || status === "delivered",
        delivered: status === "delivered"
      }
    }

    return getOrderStatusUpdateTemplate(orderData)
  }

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    setSelectedStatus(newStatus)
    await onStatusChange(order.id, newStatus)
    setUpdatingStatus(false)

    // Auto-generate email template for the new status
    const template = generateEmailTemplate(newStatus)
    setEmailBody(template)
    setEmailSubject(`Your order #${order?.order_number || order?.id?.slice(-6).toUpperCase()} has been ${newStatus}`)
  }

  // Update AWB number
  const handleAwbUpdate = async () => {
    if (!awbNumber.trim()) return

    setIsUpdatingAwb(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({ awb_number: awbNumber })
        .eq("id", order.id)

      if (error) {
        console.error("Error updating AWB number:", error)
      } else {
        // Update local state if needed
        console.log("AWB number updated successfully")
      }
    } catch (err) {
      console.error("Error updating AWB number:", err)
    } finally {
      setIsUpdatingAwb(false)
    }
  }

  // Send email function
  const sendEmailNotification = async () => {
    if (!userEmail) {
      console.error("No email address available")
      return
    }

    setIsSending(true)

    try {
      const emailData = {
        email: userEmail,
        customerName: shippingAddress?.name || "Valued Customer",
        orderNumber: order.order_number || order.id?.slice(-6).toUpperCase() || "",
        orderDate: new Date(order.created_at).toLocaleDateString(),
        orderStatus: selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
        awbNumber: awbNumber || undefined,
        estimatedDelivery: estimatedDelivery || "3-5 business days",
        items: order.cart?.map((item: any) => ({
          name: item.name || item.title || "Product",
          partNumber: item.partNumber || item.model || "",
          quantity: item.quantity || 1,
          innerDiameter: item.innerDiameter || "",
          outerDiameter: item.outerDiameter || "",
        })) || []
      }
      
      const result = await sendOrderStatusUpdateEmail(emailData)
      
      if (result.success) {
        // Create a notification for the user
        if (order.user_id) {
          await supabase.from("notifications").insert({
            user_id: order.user_id,
            message: `We sent you an email about your order #${order.order_number || order.id?.slice(-6).toUpperCase()}`,
            type: "info",
            read: false,
          })
        }

        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 3000)
      } else {
        console.error("Failed to send email:", result.error)
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSending(false)
    }
  }

  // Initialize email template when modal opens
  useEffect(() => {
    if (isOpen && order) {
      const template = generateEmailTemplate(selectedStatus)
      setEmailBody(template)
      setAwbNumber(order.awb_number || "")
    }
  }, [isOpen, order, selectedStatus])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order?.order_number || order?.id?.slice(-6).toUpperCase()}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order?.created_at).toLocaleString()} by {order?.user_email || userEmail || "Guest"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            <TabsTrigger value="tracking">AWB & Tracking</TabsTrigger>
            <TabsTrigger value="email">Send Email</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.cart && order.cart.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {order.cart.map((item: any, index: number) => (
                        <div key={index} className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name || item.title} 
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-medium">{item.name || item.title}</h4>
                              <p className="text-sm text-gray-500">
                                Part: {item.partNumber} | Qty: {item.quantity}
                              </p>
                              {(item.innerDiameter || item.outerDiameter) && (
                                <p className="text-sm text-gray-500">
                                  Inner Ø: {item.innerDiameter} | Outer Ø: {item.outerDiameter}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Subtotal:</span>
                      <span>${((order?.total || 0) - (order?.shipping || 0) - (order?.tax || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Shipping:</span>
                      <span>${(order?.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Tax:</span>
                      <span>${(order?.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${(order?.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="status">Status:</Label>
                      <Select
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger className="w-[150px]">
                          {updatingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Badge className={getStatusColor(selectedStatus)}>
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
                    <p><strong>Name:</strong> {shippingAddress.name}</p>
                    <p><strong>Address:</strong> {shippingAddress.address}</p>
                    <p><strong>City:</strong> {shippingAddress.city}</p>
                    <p><strong>Province:</strong> {shippingAddress.province}</p>
                    <p><strong>Postal Code:</strong> {shippingAddress.postalCode || shippingAddress.postal_code}</p>
                    <p><strong>Country:</strong> {shippingAddress.country}</p>
                    {shippingAddress.phone && (
                      <p><strong>Phone:</strong> {shippingAddress.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping information available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  AWB & Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="awb">AWB Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="awb"
                      value={awbNumber}
                      onChange={(e) => setAwbNumber(e.target.value)}
                      placeholder="Enter AWB/Tracking number"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAwbUpdate}
                      disabled={isUpdatingAwb || !awbNumber.trim()}
                      size="sm"
                    >
                      {isUpdatingAwb ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery">Estimated Delivery</Label>
                  <Input
                    id="delivery"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    placeholder="e.g., 3-5 business days"
                  />
                </div>

                {awbNumber && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tracking Number:</strong> {awbNumber}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This tracking number will be included in customer emails when the order status is updated to "Shipped"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email Notification
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Preview and send order status update email to customer
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-to">To</Label>
                  <Input
                    id="email-to"
                    value={userEmail || order?.user_email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-body">Email Content</Label>
                  <div className="border rounded-md">
                    <div className="p-2 bg-gray-50 border-b text-xs text-gray-600">
                      HTML Preview - This email uses your template from lib/email/template.ts
                    </div>
                    <div 
                      className="p-4 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: emailBody }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const template = generateEmailTemplate(selectedStatus)
                      setEmailBody(template)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Regenerate Template
                  </Button>
                  <Button
                    onClick={sendEmailNotification}
                    disabled={isSending || !emailBody || (!userEmail && !order?.user_email)}
                    className="ml-auto"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>

                {emailSent && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">✓ Email sent successfully!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Helper function for status colors
function getStatusColor(status: string) {
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
