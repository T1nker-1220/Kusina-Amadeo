"use client";

import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Order {
  _id: string;
  name: string;
  email: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/admin/orders?limit=5');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }
        const data: OrdersResponse = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load orders";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/80 transition-colors duration-200"
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {order.name || 'Guest Order'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.email || 'No email provided'}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-PH', { 
                  style: 'currency', 
                  currency: 'PHP' 
                }).format(order.total)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
