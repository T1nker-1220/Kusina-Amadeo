import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sendEmail';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    await sendEmail({
      to: email,
      subject: 'Test Email from Kusina De Amadeo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>Hello,</p>
          <p>This is a test email from Kusina De Amadeo to verify that the email configuration is working correctly.</p>
          <p>Best regards,<br>Kusina De Amadeo Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Test email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
