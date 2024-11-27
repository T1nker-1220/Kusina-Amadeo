import prisma from './prisma';
import { Order, OrderItem } from '@prisma/client';

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}

interface GetOrdersOptions {
  page?: number;
  perPage?: number;
  status?: string;
  userId?: string;
}

export async function getOrders(options: GetOrdersOptions = {}) {
  const {
    page = 1,
    perPage = 10,
    status,
    userId
  } = options;

  try {
    console.log('Fetching orders with options:', { page, perPage, status, userId });
    const skip = (page - 1) * perPage;
    
    const where = {
      ...(status && status !== 'all' ? { orderStatus: status } : {}),
      ...(userId ? { userId } : {})
    };

    console.log('Query conditions:', where);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: perPage,
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    console.log(`Found ${orders.length} orders out of ${total} total`);

    const totalPages = Math.ceil(total / perPage);
    
    return {
      orders,
      total,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch orders: ${error.message}`
        : 'Failed to fetch orders'
    );
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    console.log('Updating order status:', { orderId, status });
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    // Emit real-time update
    if (global.io) {
      global.io.emit('order-status-updated', {
        orderId,
        status,
        order: updatedOrder
      });

      // Also emit to specific user if userId exists
      if (updatedOrder.userId) {
        global.io.to(`user-${updatedOrder.userId}`).emit('user-order-updated', {
          orderId,
          status,
          order: updatedOrder
        });
      }
    }

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

export async function getOrderStats(): Promise<OrderStats> {
  try {
    const [total, pending, completed, cancelled, totalAmount] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'pending' } }),
      prisma.order.count({ where: { orderStatus: 'completed' } }),
      prisma.order.count({ where: { orderStatus: 'cancelled' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { orderStatus: 'completed' }
      })
    ]);

    return {
      total,
      pending,
      completed,
      cancelled,
      totalAmount: totalAmount._sum.total || 0
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
}

export async function createOrder(data: {
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod?: string;
  pickupTime?: string;
  contactNumber?: string;
  specialInstructions?: string;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        name: data.name,
        phone: data.phone,
        total: data.total,
        orderItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
        paymentMethod: data.paymentMethod || 'cod',
        pickupTime: data.pickupTime,
        contactNumber: data.contactNumber,
        specialInstructions: data.specialInstructions
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    // Emit real-time update for new order
    if (global.io) {
      global.io.emit('new-order', { order });
      
      if (data.userId) {
        global.io.to(`user-${data.userId}`).emit('user-new-order', { order });
      }
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

export async function getRevenueData(): Promise<{ labels: string[]; data: number[] }> {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
          lte: today
        },
        orderStatus: 'completed'
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    const dailyRevenue = new Map<string, number>();
    const labels: string[] = [];
    const data: number[] = [];

    // Initialize the last 7 days with 0 revenue
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyRevenue.set(dateString, 0);
    }

    // Sum up the revenue for each day
    orders.forEach(order => {
      const dateString = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const currentTotal = dailyRevenue.get(dateString) || 0;
      dailyRevenue.set(dateString, currentTotal + order.total);
    });

    // Convert to arrays for chart data
    Array.from(dailyRevenue.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .forEach(([date, revenue]) => {
        labels.push(date);
        data.push(revenue);
      });

    return { labels, data };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}
