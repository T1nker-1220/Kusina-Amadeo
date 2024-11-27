import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, getOrdersByUserId } from '@/lib/db/orders';
import { sendOrderConfirmation } from '@/lib/email';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addons?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an order' },
        { status: 401 }
      );
    }

    const orderData = await req.json();
    const { items, total, paymentMethod, pickupInfo } = orderData;

    // Basic validation
    if (!items?.length) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      );
    }

    if (!['gcash', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Validate pickup info
    if (!pickupInfo?.pickupTime || !pickupInfo?.contactNumber) {
      return NextResponse.json(
        { error: 'Pickup information is required' },
        { status: 400 }
      );
    }

    // Create the order using the Prisma client
    const order = await createOrder({
      userId: session.user.id,
      email: session.user.email || undefined,
      name: session.user.name || undefined,
      total,
      items: items.map((item: OrderItem) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod,
      pickupTime: pickupInfo.pickupTime,
      contactNumber: pickupInfo.contactNumber,
      specialInstructions: pickupInfo.specialInstructions
    });

    // Send order confirmation email
    if (session.user.email) {
      try {
        await sendOrderConfirmation(session.user.email, order);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Order already exists' },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid product reference' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view orders' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Verify the user is requesting their own orders
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view these orders' },
        { status: 403 }
      );
    }

    const orders = await getOrdersByUserId(userId);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders. Please try again.' },
      { status: 500 }
    );
  }
}
