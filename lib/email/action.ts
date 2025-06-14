'use server'

import { EmailService } from '@/lib/email/service'

interface OrderItem {
  id: string
  name: string
  partNumber?: string
  price: number
  quantity: number
  specs?: string
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface OrderConfirmationData {
  email: string
  orderNumber: string
  customerName: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
}

interface OrderStatusUpdateEmailData {
  email: string
  customerName: string
  orderNumber: string
  orderDate: string
  orderStatus: string
  awbNumber?: string
  estimatedDelivery: string
  items: Array<{
    name: string
    partNumber?: string
    quantity: number
    innerDiameter?: string
    outerDiameter?: string
  }>
}

export async function sendOrderConfirmationEmail(orderData: OrderConfirmationData) {
  try {
    console.log('📧 [EMAIL SERVICE] Starting order confirmation email process')
    console.log('📧 [EMAIL SERVICE] Recipient:', orderData.email)
    console.log('📧 [EMAIL SERVICE] Order Number:', orderData.orderNumber)
    console.log('📧 [EMAIL SERVICE] Customer Name:', orderData.customerName)
    console.log('📧 [EMAIL SERVICE] Items count:', orderData.items.length)
    console.log('📧 [EMAIL SERVICE] Shipping Address:', orderData.shippingAddress)
    console.log('📧 [EMAIL SERVICE] REAL Items being processed:', orderData.items.map(item => ({
      name: item.name,
      partNumber: item.partNumber,
      price: item.price,
      quantity: item.quantity
    })))
    
    const emailService = EmailService.getInstance()
    console.log('📧 [EMAIL SERVICE] Email service instance created')
    
    // Transform cart items to email service format (specs format)
    const emailItems = orderData.items.map(item => {
      // Create specs in format expected by email service: "model|innerDiameter|outerDiameter"
      let model = item.partNumber || item.name || 'N/A'
      let innerDiameter = 'N/A'
      let outerDiameter = 'N/A'
      
      // Try to extract dimensions from part number or specs
      if (item.partNumber) {
        // Extract dimensions if they exist in the part number format
        const dimensionMatch = item.partNumber.match(/(\d+).*?x.*?(\d+)/i)
        if (dimensionMatch) {
          innerDiameter = `${dimensionMatch[1]}mm`
          outerDiameter = `${dimensionMatch[2]}mm`
        }
        model = item.partNumber
      }
      
      // Create specs string in format: "model|innerDiameter|outerDiameter"
      const specs = `${model}|${innerDiameter}|${outerDiameter}`
      
      return {
        name: item.name,
        specs: specs,
        price: item.price,
        quantity: item.quantity
      }
    })
    
    console.log('📧 [EMAIL SERVICE] Items transformed for email service (specs format):', emailItems.map(item => ({
      name: item.name,
      specs: item.specs,
      price: item.price,
      quantity: item.quantity
    })))

    // Create email data in the format expected by EmailService (flattened structure)
    const emailData = {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      orderDate: new Date().toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      // Flatten shipping address as expected by EmailService
      shippingAddress: orderData.shippingAddress.address,
      city: orderData.shippingAddress.city,
      province: orderData.shippingAddress.state,
      postalCode: orderData.shippingAddress.postalCode,
      country: orderData.shippingAddress.country,
      items: emailItems,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total
    }

    console.log('📧 [EMAIL SERVICE] Final email data prepared for EmailService:', {
      orderNumber: emailData.orderNumber,
      orderDate: emailData.orderDate,
      itemCount: emailData.items.length,
      total: emailData.total,
      city: emailData.city,
      province: emailData.province,
      postalCode: emailData.postalCode,
      country: emailData.country,
      itemSpecs: emailData.items.map(item => item.specs)
    })

    console.log('📧 [EMAIL SERVICE] Calling email service to send confirmation with REAL data...')
    const success = await emailService.sendOrderConfirmation(orderData.email, emailData)
    
    console.log('📧 [EMAIL SERVICE] Email service response:', success)
    
    if (success) {
      console.log('✅ [EMAIL SERVICE] Order confirmation email sent successfully with REAL ORDER DATA')
      return { success: true }
    } else {
      console.error('❌ [EMAIL SERVICE] Failed to send email - service returned false')
      return { success: false, error: 'Failed to send email' }
    }
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Exception in email sending process:', error)
    console.error('❌ [EMAIL SERVICE] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return { success: false, error: 'Email service error' }
  }
}

export async function sendOrderStatusUpdateEmail(emailData: OrderStatusUpdateEmailData) {
  try {
    console.log('📧 [EMAIL SERVICE] Starting order status update email process')
    console.log('📧 [EMAIL SERVICE] Recipient:', emailData.email)
    console.log('📧 [EMAIL SERVICE] Order Number:', emailData.orderNumber)
    console.log('📧 [EMAIL SERVICE] Status:', emailData.orderStatus)
    
    const emailService = EmailService.getInstance()
    
    // Transform items to email service format
    const emailItems = emailData.items.map(item => ({
      name: item.name,
      specs: `${item.partNumber || ""}|${item.innerDiameter || ""}|${item.outerDiameter || ""}`,
      quantity: item.quantity,
    }))
    
    // Prepare order status update data for the email service
    const orderStatusData = {
      customerName: emailData.customerName,
      orderNumber: emailData.orderNumber,
      orderDate: emailData.orderDate,
      orderStatus: emailData.orderStatus,
      statusClass: emailData.orderStatus.toLowerCase() as 'processing' | 'shipped' | 'delivered',
      trackingNumber: emailData.awbNumber || undefined,
      trackingUrl: emailData.awbNumber ? `https://track.example.com/${emailData.awbNumber}` : undefined,
      trackingDisplay: emailData.awbNumber ? 'block' as const : 'none' as const,
      estimatedDelivery: emailData.estimatedDelivery,
      progressWidth: emailData.orderStatus.toLowerCase() === 'delivered' ? 100 : 
                    emailData.orderStatus.toLowerCase() === 'shipped' ? 66 : 
                    emailData.orderStatus.toLowerCase() === 'processing' ? 33 : 0,
      processingClass: emailData.orderStatus.toLowerCase() === 'processing' ? 'step-current' : 
                      (emailData.orderStatus.toLowerCase() === 'shipped' || emailData.orderStatus.toLowerCase() === 'delivered') ? 'step-completed' : 'step-pending',
      processingIcon: emailData.orderStatus.toLowerCase() === 'processing' ? '⟳' : 
                     (emailData.orderStatus.toLowerCase() === 'shipped' || emailData.orderStatus.toLowerCase() === 'delivered') ? '✓' : '1',
      shippedClass: emailData.orderStatus.toLowerCase() === 'shipped' ? 'step-current' : 
                   emailData.orderStatus.toLowerCase() === 'delivered' ? 'step-completed' : 'step-pending',
      shippedIcon: emailData.orderStatus.toLowerCase() === 'shipped' ? '⟳' : 
                  emailData.orderStatus.toLowerCase() === 'delivered' ? '✓' : '2',
      deliveredClass: emailData.orderStatus.toLowerCase() === 'delivered' ? 'step-current' : 'step-pending',
      deliveredIcon: emailData.orderStatus.toLowerCase() === 'delivered' ? '✓' : '3',
      items: emailItems
    }
    
    console.log('📧 [EMAIL SERVICE] Calling email service to send status update...')
    const success = await emailService.sendOrderStatusUpdate(emailData.email, orderStatusData)
    
    console.log('📧 [EMAIL SERVICE] Email service response:', success)
    
    if (success) {
      console.log('✅ [EMAIL SERVICE] Order status update email sent successfully')
      return { success: true }
    } else {
      console.error('❌ [EMAIL SERVICE] Failed to send email - service returned false')
      return { success: false, error: 'Failed to send email' }
    }
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Exception in email sending process:', error)
    console.error('❌ [EMAIL SERVICE] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return { success: false, error: 'Email service error' }
  }
}