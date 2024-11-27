import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  try {
    console.log('Attempting to send email with following configuration:');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('From:', process.env.SMTP_FROM);
    console.log('To:', to);
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Kusina De Amadeo <kusinadeamadeo@gmail.com>',
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function generatePasswordResetEmail(email: string, resetUrl: string): EmailOptions {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your Kusina De Amadeo account.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
      <p>Best regards,<br>Kusina De Amadeo Team</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  `;

  return {
    to: email,
    subject: 'Reset Your Password - Kusina De Amadeo',
    html,
  };
}
