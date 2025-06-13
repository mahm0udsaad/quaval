import { transporter } from './config';
import { getOrderConfirmationTemplate, getOrderStatusUpdateTemplate, getPaymentConfirmationTemplate } from './template';

// Email types for different notifications
export type EmailType = 
  | 'order_confirmation'
  | 'order_status_update'
  | 'payment_confirmation'
  | 'payment_failed'
  | 'account_notification';

// Template data interfaces
interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  shippingAddress: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  items: Array<{
    name: string;
    specs: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface PaymentConfirmationData {
  customerName: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  lastFourDigits: string;
  orderNumber: string;
  subtotal: number;
  shipping: number;
  taxRate: number;
  tax: number;
}

interface OrderStatusUpdateData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  statusClass: 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  trackingUrl?: string;
  trackingDisplay: 'block' | 'none';
  estimatedDelivery: string;
  progressWidth: number;
  processingClass: string;
  processingIcon: string;
  shippedClass: string;
  shippedIcon: string;
  deliveredClass: string;
  deliveredIcon: string;
  items: Array<{
    name: string;
    specs: string;
    quantity: number;
  }>;
}

interface PaymentFailedData {
  customerName: string;
  orderNumber: string;
  errorMessage?: string;
}

interface AccountNotificationData {
  customerName: string;
  title: string;
  message: string;
}

// Base email options interface
interface BaseEmailOptions {
  to: string;
  subject: string;
  type: EmailType;
}

// Email content interface
interface EmailContent {
  html: string;
  text?: string;
}

// Email templates mapping
const emailTemplates: Record<EmailType, (data: any) => EmailContent> = {
  order_confirmation: (data: OrderConfirmationData) => ({
    html: getOrderConfirmationTemplate({
      ...data,
      shippingAddress: {
        name: data.customerName,
        address: data.shippingAddress,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        country: data.country
      },
      items: data.items.map(item => ({
        name: item.name,
        model: item.specs.split('|')[0].trim(),
        quantity: item.quantity,
        innerDiameter: item.specs.split('|')[1]?.trim() || '',
        outerDiameter: item.specs.split('|')[2]?.trim() || '',
        price: item.price
      }))
    }),
    text: `Order Confirmation - Order #${data.orderNumber}`
  }),
  order_status_update: (data: OrderStatusUpdateData) => ({
    html: getOrderStatusUpdateTemplate({
      ...data,
      orderStatus: data.orderStatus as 'Processing' | 'Shipped' | 'Delivered',
      progress: {
        processing: data.statusClass === 'processing',
        shipped: data.statusClass === 'shipped',
        delivered: data.statusClass === 'delivered'
      },
      items: data.items.map(item => ({
        name: item.name,
        model: item.specs.split('|')[0].trim(),
        quantity: item.quantity,
        innerDiameter: item.specs.split('|')[1]?.trim() || '',
        outerDiameter: item.specs.split('|')[2]?.trim() || ''
      }))
    }),
    text: `Order Status Update - Order #${data.orderNumber}`
  }),
  payment_confirmation: (data: PaymentConfirmationData) => ({
    html: getPaymentConfirmationTemplate(data),
    text: `Payment Confirmation - Order #${data.orderNumber}`
  }),
  payment_failed: (data: PaymentFailedData) => ({
    html: `
      <h1>Payment Failed</h1>
      <p>Dear ${data.customerName},</p>
      <p>We were unable to process your payment for order #${data.orderNumber}</p>
      ${data.errorMessage ? `<p>Error: ${data.errorMessage}</p>` : ''}
      <p>Please try again or contact our support team.</p>
    `,
    text: `Payment Failed - Order #${data.orderNumber}`
  }),
  account_notification: (data: AccountNotificationData) => ({
    html: `
      <h1>${data.title}</h1>
      <p>Dear ${data.customerName},</p>
      <p>${data.message}</p>
    `,
    text: `${data.title} - ${data.message}`
  })
};

// Main email service class
export class EmailService {
  private static instance: EmailService;
  private readonly from = 'Quaval Bearings <onlinesales@quaval.ca>';

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send an email using the specified template and data
   */
  public async sendEmail<T extends EmailType>(
    options: BaseEmailOptions & { type: T },
    data: T extends 'order_confirmation' ? OrderConfirmationData
      : T extends 'order_status_update' ? OrderStatusUpdateData
      : T extends 'payment_confirmation' ? PaymentConfirmationData
      : T extends 'payment_failed' ? PaymentFailedData
      : AccountNotificationData
  ): Promise<boolean> {
    try {
      console.log('📧 [SMTP SERVICE] Starting email send process')
      console.log('📧 [SMTP SERVICE] Email type:', options.type)
      console.log('📧 [SMTP SERVICE] Recipient:', options.to)
      console.log('📧 [SMTP SERVICE] Subject:', options.subject)
      
      const template = emailTemplates[options.type];
      if (!template) {
        console.error('❌ [SMTP SERVICE] Email template not found for type:', options.type)
        throw new Error(`Email template not found for type: ${options.type}`);
      }

      console.log('📧 [SMTP SERVICE] Template found, generating content...')
      const content = template(data);
      console.log('📧 [SMTP SERVICE] Content generated, HTML length:', content.html.length, 'characters')
      
      const mailOptions = {
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: content.html,
        text: content.text
      };

      console.log('📧 [SMTP SERVICE] Mail options prepared, sending via transporter...')
      console.log('📧 [SMTP SERVICE] From:', this.from)
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log('✅ [SMTP SERVICE] Email sent successfully!')
      console.log('📧 [SMTP SERVICE] Message ID:', info.messageId)
      console.log('📧 [SMTP SERVICE] Response:', info.response)
      
      return true;
    } catch (error) {
      console.error('❌ [SMTP SERVICE] Failed to send email:', error);
      console.error('❌ [SMTP SERVICE] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        command: (error as any)?.command,
        response: (error as any)?.response,
        responseCode: (error as any)?.responseCode
      });
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  public async sendOrderConfirmation(to: string, orderData: OrderConfirmationData): Promise<boolean> {
    console.log('📧 [ORDER CONFIRMATION] Starting order confirmation email')
    console.log('📧 [ORDER CONFIRMATION] Order number:', orderData.orderNumber)
    console.log('📧 [ORDER CONFIRMATION] Customer:', orderData.customerName)
    
    const result = await this.sendEmail(
      {
        to,
        subject: `Order Confirmation - #${orderData.orderNumber}`,
        type: 'order_confirmation'
      },
      orderData
    );
    
    if (result) {
      console.log('✅ [ORDER CONFIRMATION] Order confirmation email sent successfully')
    } else {
      console.error('❌ [ORDER CONFIRMATION] Failed to send order confirmation email')
    }
    
    return result;
  }

  /**
   * Send order status update email
   */
  public async sendOrderStatusUpdate(to: string, orderData: OrderStatusUpdateData): Promise<boolean> {
    return this.sendEmail(
      {
        to,
        subject: `Order Status Update - #${orderData.orderNumber}`,
        type: 'order_status_update'
      },
      orderData
    );
  }

  /**
   * Send payment confirmation email
   */
  public async sendPaymentConfirmation(to: string, paymentData: PaymentConfirmationData): Promise<boolean> {
    return this.sendEmail(
      {
        to,
        subject: `Payment Confirmation - #${paymentData.orderNumber}`,
        type: 'payment_confirmation'
      },
      paymentData
    );
  }

  /**
   * Send payment failed email
   */
  public async sendPaymentFailed(to: string, paymentData: PaymentFailedData): Promise<boolean> {
    return this.sendEmail(
      {
        to,
        subject: `Payment Failed - #${paymentData.orderNumber}`,
        type: 'payment_failed'
      },
      paymentData
    );
  }

  /**
   * Send general account notification
   */
  public async sendAccountNotification(to: string, notificationData: AccountNotificationData): Promise<boolean> {
    return this.sendEmail(
      {
        to,
        subject: notificationData.title,
        type: 'account_notification'
      },
      notificationData
    );
  }
} 