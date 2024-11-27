import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Get order statistics
    const [
      total,
      pending,
      completed,
      cancelled,
      totalAmount
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "pending" } }),
      prisma.order.count({ where: { orderStatus: "completed" } }),
      prisma.order.count({ where: { orderStatus: "cancelled" } }),
      prisma.order.aggregate({
        _sum: { total: true }
      })
    ]);

    return NextResponse.json({
      total,
      pending,
      completed,
      cancelled,
      totalAmount: totalAmount?._sum?.total || 0
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch order stats" }), 
      { status: 500 }
    );
  }
}
