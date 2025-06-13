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

export async function sendOrderConfirmationEmail(orderData: OrderConfirmationData) {
  try {
    console.log('📧 [EMAIL SERVICE] Starting order confirmation email process')
    console.log('📧 [EMAIL SERVICE] Recipient:', orderData.email)
    console.log('📧 [EMAIL SERVICE] Order Number:', orderData.orderNumber)
    console.log('📧 [EMAIL SERVICE] Customer Name:', orderData.customerName)
    console.log('📧 [EMAIL SERVICE] Items count:', orderData.items.length)
    console.log('📧 [EMAIL SERVICE] Shipping Address:', orderData.shippingAddress)
    
    const emailService = EmailService.getInstance()
    console.log('📧 [EMAIL SERVICE] Email service instance created')
    
    // Transform cart items to email format
    const emailItems = orderData.items.map(item => ({
      name: item.name,
      specs: item.partNumber || item.specs || '',
      price: item.price,
      quantity: item.quantity
    }))
    
    console.log('📧 [EMAIL SERVICE] Items transformed for email:', emailItems.length, 'items')

    const emailData = {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      orderDate: new Date().toLocaleDateString(),
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

    console.log('📧 [EMAIL SERVICE] Email data prepared:', {
      orderNumber: emailData.orderNumber,
      orderDate: emailData.orderDate,
      itemCount: emailData.items.length,
      total: emailData.total,
      city: emailData.city,
      province: emailData.province,
      postalCode: emailData.postalCode,
      country: emailData.country
    })

    console.log('📧 [EMAIL SERVICE] Calling email service to send confirmation...')
    const success = await emailService.sendOrderConfirmation(orderData.email, emailData)
    
    console.log('📧 [EMAIL SERVICE] Email service response:', success)
    
    if (success) {
      console.log('✅ [EMAIL SERVICE] Order confirmation email sent successfully')
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