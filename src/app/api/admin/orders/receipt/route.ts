import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrderById } from '@/lib/db/orders';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { orderId, email } = body;
    
    if (!orderId || !email) {
      return NextResponse.json({ error: 'Order ID and email are required' }, { status: 400 });
    }

    // Get order details
    console.log('Fetching order:', orderId);
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Log order details for debugging
    console.log('Order details:', {
      id: order._id,
      items: order.items.length,
      total: order.total,
      pickupInfo: order.pickupInfo,
      email
    });

    // Send email with HTML receipt
    console.log('Sending receipt to:', email);
    await sendOrderConfirmation(email, order);
    console.log('Receipt sent successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Receipt sent successfully'
    });

  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json({ 
      error: 'Failed to send receipt',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
