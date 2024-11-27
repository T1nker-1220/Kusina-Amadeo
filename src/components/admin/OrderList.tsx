"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { FiClock, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { io } from 'socket.io-client';

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  orderItems: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const ORDER_STATUSES = [
  'all',
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled'
] as const;

type OrderStatus = typeof ORDER_STATUSES[number];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io();

    // Join order updates channel
    socket.emit('join-order-updates', 'admin');

    // Listen for new orders
    socket.on('new-order', ({ order }) => {
      setOrders(prev => [order, ...prev]);
      toast.success('New order received!');
    });

    // Listen for order status updates
    socket.on('order-status-updated', ({ orderId, status, order }) => {
      setOrders(prev => prev.map(o => o.id === orderId ? order : o));
    });

    // Fetch initial orders
    fetchOrders();

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/admin/orders?page=${currentPage}&status=${filter}&limit=10`,
        {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }
      
      const data: OrdersResponse = await response.json();
      if (!data.orders || !Array.isArray(data.orders)) {
        throw new Error("Invalid response format");
      }
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error instanceof Error ? error.message : "Failed to load orders");
      toast.error("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      // Optimistic update
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      ));

      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      toast.success('Order status updated successfully');
    } catch (error) {
      // Revert optimistic update on error
      await fetchOrders();
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors
              ${filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {orders.map((order) => (
            <motion.div key={order.id} variants={item}>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{order.name || 'Guest'}</h3>
                    <p className="text-sm text-gray-500">{order.email || 'No email'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus as keyof typeof statusColors]}`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="mt-2 space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center text-sm">
                      <span className="flex-1">{item.product.name}</span>
                      <span className="text-gray-600">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>

                  {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        disabled={isUpdating}
                        className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <FiCheck className="inline-block mr-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={isUpdating}
                        className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <FiX className="inline-block mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
