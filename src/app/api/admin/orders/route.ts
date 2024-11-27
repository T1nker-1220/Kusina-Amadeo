import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getOrders, updateOrderStatus, getOrderById } from "@/lib/db/orders";
import { sendOrderStatusEmail } from "@/lib/email";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status") || "all";
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const { orders, total, totalPages, currentPage } = await getOrders({
      page,
      perPage: limit,
      status,
    });

    return NextResponse.json({
      orders,
      total,
      totalPages,
      currentPage
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updated = await updateOrderStatus(orderId, status);

    if (order.email) {
      try {
        await sendOrderStatusEmail(updated);
      } catch (emailError) {
        console.error("Failed to send status email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      order: updated
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
