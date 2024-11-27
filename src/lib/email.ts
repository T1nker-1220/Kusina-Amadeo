import nodemailer from 'nodemailer';
import { IOrder } from '@/models/order';
import { generateOrderConfirmationEmail } from './email-templates';

// Create transporter only if credentials are available
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);

  if (!user || !pass || !host || !port) {
    console.warn('Email credentials missing:', {
      user: !!user,
      pass: !!pass,
      host: !!host,
      port: !!port
    });
    throw new Error('Email configuration is incomplete. Check your environment variables.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });
};

export async function sendOrderConfirmation(order: IOrder, email: string, pdfBuffer?: Buffer) {
  try {
    const transporter = createTransporter();
    const emailContent = generateOrderConfirmationEmail(order);

    const mailOptions: any = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Order Confirmation - #${order._id}`,
      html: emailContent,
    };

    // Attach PDF if provided
    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `order-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
}

export async function sendOrderStatusUpdate(order: IOrder, email: string) {
  try {
    const transporter = createTransporter();
    const statusMessage = getStatusMessage(order.orderStatus);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_FROM || 'Kusina De Amadeo <kusinadeamadeo@gmail.com>',
      to: email,
      subject: `Order Status Update - Kusina de Amadeo #${order._id}`,
      text: `
Dear Customer,

${statusMessage}

Order Details:
-------------
Order ID: ${order._id}
New Status: ${order.orderStatus.toUpperCase()}
Pickup Time: ${order.pickupInfo.pickupTime}

If you have any questions, please don't hesitate to contact us.

Best regards,
Kusina de Amadeo Team
`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .content {
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Status Update</h1>
    </div>

    <div class="content">
      <p>Dear Customer,</p>
      <p>${statusMessage}</p>

      <h2>Order Details</h2>
      <p>Order ID: ${order._id}</p>
      <p>New Status: ${order.orderStatus.toUpperCase()}</p>
      <p>Pickup Time: ${order.pickupInfo.pickupTime}</p>
    </div>

    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>Kusina de Amadeo Team</p>
    </div>
  </div>
</body>
</html>
`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
}

export async function sendOrderStatusEmail(order: IOrder) {
  try {
    // Get user email from the database
    const response = await fetch(`/api/users/${order.userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    
    if (userData.email) {
      await sendOrderStatusUpdate(order, userData.email);
    } else {
      console.error('User email not found');
    }
  } catch (error) {
    console.error('Error in sendOrderStatusEmail:', error);
    throw error;
  }
}

function getStatusMessage(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'Great news! Your order has been confirmed and is being processed.';
    case 'preparing':
      return 'Your order is now being prepared in our kitchen.';
    case 'ready':
      return 'Your order is ready for pickup! Please proceed to our store at your scheduled pickup time.';
    case 'completed':
      return 'Thank you for picking up your order! We hope you enjoy your meal.';
    case 'cancelled':
      return 'Your order has been cancelled. If you did not request this cancellation, please contact us immediately.';
    default:
      return 'There has been an update to your order.';
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password - Kusina de Amadeo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>Best regards,<br>Kusina de Amadeo Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function sendPasswordChangedEmail(email: string) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Changed Successfully - Kusina de Amadeo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Changed Successfully</h2>
          <p>Hello,</p>
          <p>Your password has been successfully changed.</p>
          <p>If you did not make this change, please contact us immediately.</p>
          <p>Best regards,<br>Kusina de Amadeo Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password changed notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw error;
  }
}
