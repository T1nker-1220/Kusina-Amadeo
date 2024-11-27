import { IOrder } from '@/models/order';
import { formatPrice } from './utils';

export const generateOrderConfirmationEmail = (order: IOrder) => {
  const itemsList = order.items.map(item => {
    const addonsText = item.addons && item.addons.length > 0 
      ? `\n    Add-ons: ${item.addons.join(', ')}`
      : '';
    
    return `
    • ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}${addonsText}`;
  }).join('');

  // Handle pickup/delivery information
  const pickupSection = order.pickupInfo ? `
Pickup Information:
-----------------
Pickup Time: ${order.pickupInfo.pickupTime}
Contact Number: ${order.pickupInfo.contactNumber}
${order.pickupInfo.specialInstructions ? `Special Instructions: ${order.pickupInfo.specialInstructions}` : ''}
` : order.deliveryInfo ? `
Delivery Information:
------------------
Address: ${order.deliveryInfo.address}
Contact: ${order.deliveryInfo.contact}
${order.deliveryInfo.instructions ? `Instructions: ${order.deliveryInfo.instructions}` : ''}
` : '';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .order-details { background: #f9f9f9; padding: 20px; border-radius: 5px; }
        .items-list { margin: 20px 0; }
        .total { font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for ordering from Kusina De Amadeo!</p>
        </div>
        
        <div class="order-details">
          <h2>Order #${order._id}</h2>
          <p>Order Status: ${order.orderStatus}</p>
          
          <div class="items-list">
            <h3>Order Items:</h3>
            ${order.items.map(item => `
              <div>
                <p>
                  ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}
                  ${item.addons && item.addons.length > 0 
                    ? `<br><small>Add-ons: ${item.addons.join(', ')}</small>` 
                    : ''}
                </p>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            Total Amount: ${formatPrice(order.total)}
          </div>
          
          ${order.pickupInfo ? `
            <div class="pickup-info">
              <h3>Pickup Information</h3>
              <p>Pickup Time: ${order.pickupInfo.pickupTime}</p>
              <p>Contact Number: ${order.pickupInfo.contactNumber}</p>
              ${order.pickupInfo.specialInstructions 
                ? `<p>Special Instructions: ${order.pickupInfo.specialInstructions}</p>` 
                : ''}
            </div>
          ` : order.deliveryInfo ? `
            <div class="delivery-info">
              <h3>Delivery Information</h3>
              <p>Address: ${order.deliveryInfo.address}</p>
              <p>Contact: ${order.deliveryInfo.contact}</p>
              ${order.deliveryInfo.instructions 
                ? `<p>Instructions: ${order.deliveryInfo.instructions}</p>` 
                : ''}
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>A PDF receipt is attached to this email for your records.</p>
          <p>If you have any questions about your order, please contact us at kusinadeamadeo@gmail.com</p>
          <p>Thank you for choosing Kusina De Amadeo!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `Order Confirmation - Kusina de Amadeo #${order._id}`,
    text: `
Thank you for your order at Kusina de Amadeo!

Order Details:
-------------
Order ID: ${order._id}
Order Status: ${order.orderStatus}
Payment Method: ${order.paymentMethod.toUpperCase()}
Payment Status: ${order.paymentStatus}

Items:${itemsList}

Total Amount: ${formatPrice(order.total)}

${pickupSection}
We'll notify you once your order is ready. If you have any questions, please don't hesitate to contact us.

Thank you for choosing Kusina de Amadeo!
`,
    html: emailHtml
  };
};
