// Interfaces for template data
export interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    model: string;
    quantity: number;
    innerDiameter: string;
    outerDiameter: string;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentConfirmationData {
  customerName: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  lastFourDigits: string;
  orderNumber: string;
  subtotal: number;
  shipping: number;
  tax: number;
  taxRate: number;
}

export interface OrderStatusUpdateData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: 'Processing' | 'Shipped' | 'Delivered';
  items: Array<{
    name: string;
    model: string;
    quantity: number;
    innerDiameter: string;
    outerDiameter: string;
  }>;
  trackingInfo?: {
    number: string;
    url: string;
  };
  estimatedDelivery: string;
  progress: {
    processing: boolean;
    shipped: boolean;
    delivered: boolean;
  };
}

// Helper functions
export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const replaceTemplateVariables = (template: string, variables: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    if (value === undefined) {
      console.warn(`Missing template variable: ${key}`);
      return match;
    }
    return String(value);
  });
};

// Template functions
export const getOrderConfirmationTemplate = (data: OrderConfirmationData): string => {
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-specs">Model: ${item.model} | Quantity: ${item.quantity} | Inner Ø: ${item.innerDiameter} | Outer Ø: ${item.outerDiameter}</div>
      </div>
      <div class="item-price">$${formatCurrency(item.price)}</div>
    </div>
  `).join('');

  const variables = {
    customerName: data.customerName,
    orderNumber: data.orderNumber,
    orderDate: data.orderDate,
    items: itemsHtml,
    subtotal: formatCurrency(data.subtotal),
    shipping: formatCurrency(data.shipping),
    tax: formatCurrency(data.tax),
    total: formatCurrency(data.total),
    shippingAddress: `${data.shippingAddress.name}<br>${data.shippingAddress.address}<br>${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postalCode}<br>${data.shippingAddress.country}`
  };

  return replaceTemplateVariables(orderConfirmationTemplate, variables);
};

export const getPaymentConfirmationTemplate = (data: PaymentConfirmationData): string => {
  const variables = {
    customerName: data.customerName,
    paymentAmount: formatCurrency(data.paymentAmount),
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId,
    paymentDate: data.paymentDate,
    lastFourDigits: data.lastFourDigits,
    orderNumber: data.orderNumber,
    subtotal: formatCurrency(data.subtotal),
    shipping: formatCurrency(data.shipping),
    tax: formatCurrency(data.tax),
    taxRate: data.taxRate
  };

  return replaceTemplateVariables(paymentConfirmationTemplate, variables);
};

export const getOrderStatusUpdateTemplate = (data: OrderStatusUpdateData): string => {
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-specs">Model: ${item.model} | Inner Ø: ${item.innerDiameter} | Outer Ø: ${item.outerDiameter}</div>
      </div>
      <div class="item-quantity">Qty: ${item.quantity}</div>
    </div>
  `).join('');

  const statusClass = data.orderStatus.toLowerCase();
  const progressWidth = data.progress.delivered ? 100 : data.progress.shipped ? 66 : data.progress.processing ? 33 : 0;
  
  const processingClass = data.progress.processing ? 'step-current' : data.progress.shipped || data.progress.delivered ? 'step-completed' : 'step-pending';
  const shippedClass = data.progress.shipped ? 'step-current' : data.progress.delivered ? 'step-completed' : 'step-pending';
  const deliveredClass = data.progress.delivered ? 'step-current' : 'step-pending';

  const processingIcon = data.progress.processing ? '⟳' : data.progress.shipped || data.progress.delivered ? '✓' : '1';
  const shippedIcon = data.progress.shipped ? '⟳' : data.progress.delivered ? '✓' : '2';
  const deliveredIcon = data.progress.delivered ? '✓' : '3';

  const trackingDisplay = data.trackingInfo ? 'block' : 'none';
  const trackingNumber = data.trackingInfo?.number || '';
  const trackingUrl = data.trackingInfo?.url || '#';

  const variables = {
    customerName: data.customerName,
    orderNumber: data.orderNumber,
    orderDate: data.orderDate,
    orderStatus: data.orderStatus,
    statusClass,
    items: itemsHtml,
    progressWidth,
    processingClass,
    shippedClass,
    deliveredClass,
    processingIcon,
    shippedIcon,
    deliveredIcon,
    trackingDisplay,
    trackingNumber,
    trackingUrl,
    estimatedDelivery: data.estimatedDelivery
  };

  return replaceTemplateVariables(orderStatusUpdateTemplate, variables);
};

// Private template strings - these are the actual template strings from the original file
const orderConfirmationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Confirmation - Quaval Rolling Bearing</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2c5aa0, #1e3d6f);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c5aa0;
        }
        
        .order-summary {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #2c5aa0;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .order-number {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        .order-date {
            color: #666;
            font-size: 14px;
        }
        
        .order-items {
            margin: 20px 0;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item-details {
            flex-grow: 1;
        }
        
        .item-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .item-specs {
            font-size: 14px;
            color: #666;
        }
        
        .item-price {
            font-weight: bold;
            color: #2c5aa0;
            font-size: 16px;
        }
        
        .total-section {
            background-color: #2c5aa0;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .total-row.final {
            font-size: 20px;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .shipping-info {
            background-color: #e8f4fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .shipping-title {
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .address {
            color: #555;
            line-height: 1.5;
        }
        
        .next-steps {
            background-color: #f0f8ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #4CAF50;
        }
        
        .next-steps h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        
        .next-steps li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }
        
        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4CAF50;
            font-weight: bold;
        }
        
        .contact-info {
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .contact-info h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .contact-details {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .contact-item {
            color: #555;
        }
        
        .contact-item strong {
            color: #2c5aa0;
        }
        
        .footer {
            background-color: #2c5aa0;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            opacity: 0.9;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            color: white;
            text-decoration: none;
            margin: 0 10px;
            padding: 8px 16px;
            background-color: rgba(255,255,255,0.2);
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .social-links a:hover {
            background-color: rgba(255,255,255,0.3);
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            
            .order-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .contact-details {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">Q</div>
                <div>
                    <div>QUAVAL</div>
                    <div style="font-size: 12px; font-weight: normal;">ROLLING BEARING</div>
                </div>
            </div>
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Hello {{customerName}},
            </div>
            
            <p>We're excited to confirm that we've received your order and it's being processed. Here are the details:</p>

            <!-- Order Summary -->
            <div class="order-summary">
                <div class="order-header">
                    <div class="order-number">Order #{{orderNumber}}</div>
                    <div class="order-date">{{orderDate}}</div>
                </div>

                <div class="order-items">
                    <!-- Sample items - replace with dynamic content -->
                    <div class="item">
                        <div class="item-details">
                            <div class="item-name">Deep Groove Ball Bearing</div>
                            <div class="item-specs">Model: 6204-2RS | Quantity: 10 | Inner Ø: 20mm | Outer Ø: 47mm</div>
                        </div>
                        <div class="item-price">$125.00</div>
                    </div>
                    <div class="item">
                        <div class="item-details">
                            <div class="item-name">Tapered Roller Bearing</div>
                            <div class="item-specs">Model: 30205 | Quantity: 5 | Inner Ø: 25mm | Outer Ø: 52mm</div>
                        </div>
                        <div class="item-price">$89.50</div>
                    </div>
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>$214.50</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>$15.00</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (HST):</span>
                        <span>$29.84</span>
                    </div>
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>$259.34</span>
                    </div>
                </div>
            </div>

            <!-- Shipping Information -->
            <div class="shipping-info">
                <div class="shipping-title">Shipping Address</div>
                <div class="address">
                    {{customerName}}<br>
                    {{shippingAddress}}<br>
                    {{city}}, {{province}} {{postalCode}}<br>
                    {{country}}
                </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                    <li>We'll process your order within 1-2 business days</li>
                    <li>You'll receive a shipping confirmation email with tracking information</li>
                    <li>Your order will be delivered within 5-7 business days</li>
                    <li>All bearings come with our quality guarantee and technical support</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>Need Help?</h3>
                <div class="contact-details">
                    <div class="contact-item">
                        <strong>Email:</strong><br>
                        support@quaval.ca
                    </div>
                    <div class="contact-item">
                        <strong>Phone:</strong><br>
                        1-800-QUAVAL-1
                    </div>
                    <div class="contact-item">
                        <strong>Hours:</strong><br>
                        Mon-Fri 8AM-6PM EST
                    </div>
                </div>
            </div>

            <p>Thank you for choosing Quaval Rolling Bearing. We appreciate your business and look forward to serving you again!</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Quaval Rolling Bearing</strong></p>
            <p>Your trusted partner for precision bearings and industrial solutions</p>
            <p>© 2024 Quaval Rolling Bearing. All rights reserved.</p>
            
            <div class="social-links">
                <a href="#">Website</a>
                <a href="#">LinkedIn</a>
                <a href="#">Contact Us</a>
            </div>
        </div>
    </div>
</body>
</html>`;

const paymentConfirmationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation - Quaval Rolling Bearing</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #28a745, #20c997);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #2c5aa0, #1e3d6f);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            font-size: 40px;
            color: #28a745;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #28a745;
        }
        
        .payment-summary {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .payment-amount {
            font-size: 36px;
            font-weight: bold;
            color: #155724;
            margin: 15px 0;
        }
        
        .payment-method {
            font-size: 16px;
            color: #155724;
            margin-bottom: 10px;
        }
        
        .transaction-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: bold;
            color: #495057;
        }
        
        .detail-value {
            color: #28a745;
            font-weight: bold;
        }
        
        .order-reference {
            background-color: #e8f4fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .order-reference h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .reference-number {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
            text-align: center;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            border: 2px dashed #2c5aa0;
            margin: 15px 0;
        }
        
        .receipt-section {
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .receipt-section h3 {
            color: #2c5aa0;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f1f1f1;
        }
        
        .breakdown-item:last-child {
            border-bottom: 2px solid #28a745;
            font-weight: bold;
            color: #28a745;
            padding-top: 15px;
            margin-top: 10px;
        }
        
        .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .security-note h4 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .security-note p {
            color: #856404;
            font-size: 14px;
        }
        
        .next-steps {
            background-color: #f0f8ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
        }
        
        .next-steps h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        
        .next-steps li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }
        
        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        
        .contact-info {
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .contact-info h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .footer {
            background-color: #28a745;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            opacity: 0.9;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            
            .payment-amount {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">Q</div>
                <div>
                    <div>QUAVAL</div>
                    <div style="font-size: 12px; font-weight: normal;">ROLLING BEARING</div>
                </div>
            </div>
            <div class="success-icon">✓</div>
            <h1>Payment Confirmed</h1>
            <p>Your payment has been successfully processed</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Hello {{customerName}},
            </div>
            
            <p>Great news! We've successfully received and processed your payment. Here are the details of your transaction:</p>

            <!-- Payment Summary -->
            <div class="payment-summary">
                <div class="payment-amount">$${'{paymentAmount}'}</div>
                <div class="payment-method">Paid via ${'{paymentMethod}'}</div>
                <p style="color: #155724; margin-top: 10px;">✓ Payment Successfully Processed</p>
            </div>

            <!-- Transaction Details -->
            <div class="transaction-details">
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">{{transactionId}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Date:</span>
                    <span class="detail-value">{{paymentDate}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">{{paymentMethod}} ending in {{lastFourDigits}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Currency:</span>
                    <span class="detail-value">CAD</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">Completed</span>
                </div>
            </div>

            <!-- Order Reference -->
            <div class="order-reference">
                <h3>Related Order</h3>
                <p>This payment is for the following order:</p>
                <div class="reference-number">Order #{{orderNumber}}</div>
                <p style="text-align: center; color: #6c757d;">Keep this reference number for your records</p>
            </div>

            <!-- Receipt Breakdown -->
            <div class="receipt-section">
                <h3>Payment Breakdown</h3>
                <div class="breakdown-item">
                    <span>Subtotal:</span>
                    <span>$${'{subtotal}'}</span>
                </div>
                <div class="breakdown-item">
                    <span>Shipping:</span>
                    <span>$${'{shipping}'}</span>
                </div>
                <div class="breakdown-item">
                    <span>HST ({{taxRate}}%):</span>
                    <span>$${'{tax}'}</span>
                </div>
                <div class="breakdown-item">
                    <span>Total Paid:</span>
                    <span>$${'{paymentAmount}'}</span>
                </div>
            </div>

            <!-- Security Note -->
            <div class="security-note">
                <h4>🔒 Secure Transaction</h4>
                <p>Your payment was processed securely using industry-standard encryption. We never store your complete credit card information on our servers.</p>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                    <li>Your order will be processed and prepared for shipment</li>
                    <li>You'll receive a shipping confirmation with tracking information</li>
                    <li>A receipt will be available in your account dashboard</li>
                    <li>Customer support is available for any questions</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>Need Help?</h3>
                <p>If you have any questions about this payment or your order, please contact us:</p>
                <p><strong>Email:</strong> billing@quaval.ca | <strong>Phone:</strong> 1-800-QUAVAL-1</p>
                <p><strong>Reference:</strong> Transaction ID {{transactionId}}</p>
            </div>

            <p>Thank you for your business. We appreciate your trust in Quaval Rolling Bearing!</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Quaval Rolling Bearing</strong></p>
            <p>Your trusted partner for precision bearings and industrial solutions</p>
            <p>© 2024 Quaval Rolling Bearing. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

const orderStatusUpdateTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update - Quaval Rolling Bearing</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2c5aa0, #1e3d6f);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .status-processing {
            background-color: #ffc107;
            color: #856404;
        }
        
        .status-shipped {
            background-color: #28a745;
            color: white;
        }
        
        .status-delivered {
            background-color: #17a2b8;
            color: white;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c5aa0;
        }
        
        .order-info {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #2c5aa0;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .order-number {
            font-size: 20px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        .tracking-section {
            background-color: #e8f4fd;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .tracking-number {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            margin: 15px 0;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            border: 2px dashed #2c5aa0;
        }
        
        .track-button {
            display: inline-block;
            background-color: #2c5aa0;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 15px;
            transition: background-color 0.3s;
        }
        
        .track-button:hover {
            background-color: #1e3d6f;
        }
        
        .progress-tracker {
            margin: 30px 0;
            padding: 25px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .progress-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .progress-steps {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin: 20px 0;
        }
        
        .progress-line {
            position: absolute;
            top: 20px;
            left: 10%;
            right: 10%;
            height: 3px;
            background-color: #e9ecef;
            z-index: 1;
        }
        
        .progress-line-filled {
            position: absolute;
            top: 20px;
            left: 10%;
            width: {{progressWidth}}%;
            height: 3px;
            background-color: #28a745;
            z-index: 2;
        }
        
        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 3;
            background-color: #f8f9fa;
            padding: 10px;
        }
        
        .step-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .step-completed {
            background-color: #28a745;
            color: white;
        }
        
        .step-current {
            background-color: #ffc107;
            color: #856404;
        }
        
        .step-pending {
            background-color: #e9ecef;
            color: #6c757d;
        }
        
        .step-text {
            font-size: 12px;
            text-align: center;
            font-weight: bold;
        }
        
        .delivery-estimate {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .delivery-estimate h3 {
            color: #155724;
            margin-bottom: 10px;
        }
        
        .delivery-date {
            font-size: 20px;
            font-weight: bold;
            color: #28a745;
        }
        
        .order-items {
            margin: 20px 0;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item-details {
            flex-grow: 1;
        }
        
        .item-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .item-specs {
            font-size: 14px;
            color: #666;
        }
        
        .item-quantity {
            font-weight: bold;
            color: #2c5aa0;
            font-size: 16px;
        }
        
        .contact-info {
            background-color: #fff;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .contact-info h3 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .footer {
            background-color: #2c5aa0;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            opacity: 0.9;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            
            .order-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .progress-steps {
                flex-direction: column;
                gap: 20px;
            }
            
            .progress-line, .progress-line-filled {
                display: none;
            }
            
            .item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">Q</div>
                <div>
                    <div>QUAVAL</div>
                    <div style="font-size: 12px; font-weight: normal;">ROLLING BEARING</div>
                </div>
            </div>
            <h1>Order Update</h1>
            <div class="status-badge status-{{statusClass}}">{{orderStatus}}</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Hello {{customerName}},
            </div>
            
            <p>Great news! Your order status has been updated. Here's what's happening with your Quaval order:</p>

            <!-- Order Information -->
            <div class="order-info">
                <div class="order-header">
                    <div class="order-number">Order #{{orderNumber}}</div>
                    <div style="color: #666; font-size: 14px;">Placed on {{orderDate}}</div>
                </div>

                <div class="order-items">
                    <div class="item">
                        <div class="item-details">
                            <div class="item-name">Deep Groove Ball Bearing</div>
                            <div class="item-specs">Model: 6204-2RS | Inner Ø: 20mm | Outer Ø: 47mm</div>
                        </div>
                        <div class="item-quantity">Qty: 10</div>
                    </div>
                    <div class="item">
                        <div class="item-details">
                            <div class="item-name">Tapered Roller Bearing</div>
                            <div class="item-specs">Model: 30205 | Inner Ø: 25mm | Outer Ø: 52mm</div>
                        </div>
                        <div class="item-quantity">Qty: 5</div>
                    </div>
                </div>
            </div>

            <!-- Tracking Section (only show if shipped) -->
            <div class="tracking-section" style="display: {{trackingDisplay}};">
                <h3>Tracking Information</h3>
                <p>Your order is on its way! Track your shipment using the number below:</p>
                <div class="tracking-number">{{trackingNumber}}</div>
                <a href="{{trackingUrl}}" class="track-button">Track Your Package</a>
            </div>

            <!-- Progress Tracker -->
            <div class="progress-tracker">
                <div class="progress-title">Order Progress</div>
                <div class="progress-steps">
                    <div class="progress-line"></div>
                    <div class="progress-line-filled"></div>
                    
                    <div class="step">
                        <div class="step-icon step-completed">✓</div>
                        <div class="step-text">Order<br>Received</div>
                    </div>
                    
                    <div class="step">
                        <div class="step-icon {{processingClass}}">{{processingIcon}}</div>
                        <div class="step-text">Processing</div>
                    </div>
                    
                    <div class="step">
                        <div class="step-icon {{shippedClass}}">{{shippedIcon}}</div>
                        <div class="step-text">Shipped</div>
                    </div>
                    
                    <div class="step">
                        <div class="step-icon {{deliveredClass}}">{{deliveredIcon}}</div>
                        <div class="step-text">Delivered</div>
                    </div>
                </div>
            </div>

            <!-- Delivery Estimate -->
            <div class="delivery-estimate">
                <h3>Estimated Delivery</h3>
                <div class="delivery-date">{{estimatedDelivery}}</div>
                <p>We'll notify you once your package is delivered</p>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>Questions About Your Order?</h3>
                <p>Our customer service team is here to help!</p>
                <p><strong>Email:</strong> support@quaval.ca | <strong>Phone:</strong> 1-800-QUAVAL-1</p>
            </div>

            <p>Thank you for choosing Quaval Rolling Bearing. We appreciate your business!</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Quaval Rolling Bearing</strong></p>
            <p>Your trusted partner for precision bearings and industrial solutions</p>
            <p>© 2024 Quaval Rolling Bearing. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;