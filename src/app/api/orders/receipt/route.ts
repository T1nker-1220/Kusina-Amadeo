import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import Receipt from '@/components/Receipt';
import { getOrderById } from '@/lib/orders';
import { sendOrderConfirmation } from '@/lib/email';
import React from 'react';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    // Get order details
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate PDF
    const pdfStream = await renderToStream(React.createElement(Receipt, { order }));
    const chunks: Uint8Array[] = [];
    
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    
    const pdfBuffer = Buffer.concat(chunks);

    // Send email with PDF receipt
    await sendOrderConfirmation(order, order.user.email, pdfBuffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
