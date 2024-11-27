'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    addons?: string[];
  }>;
  total: number;
  orderStatus: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  pickupInfo: {
    pickupTime: string;
    contactNumber: string;
    specialInstructions?: string;
  };
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export default function TestReceipt() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Check if user is admin
      if (session?.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchOrders(currentPage);
    }
  }, [status, session, currentPage]);

  const fetchOrders = async (page: number) => {
    try {
      setLoading(true);
      setError('');
      // Get all orders for admin with pagination
      const response = await fetch(`/api/admin/orders?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: OrdersResponse = await response.json();
      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } else {
        console.error('Unexpected API response:', data);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testReceipt = async (orderId: string, email: string) => {
    try {
      setMessage(`Sending receipt for order ${orderId}...`);
      const response = await fetch('/api/admin/orders/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Receipt sent successfully for order ${orderId}!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error testing receipt:', error);
      setMessage('Failed to send receipt. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4">
              Test Receipt Generation
            </h1>
            <p className="text-lg text-brand-600 dark:text-brand-400">
              Select an order to test the receipt generation and email sending functionality.
            </p>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-brand-800/50 rounded-xl shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-brand-700 dark:text-brand-300">
                      Order #{order._id}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-brand-700 dark:text-brand-300">
                      Total: ₱{order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-brand-600 dark:text-brand-400">
                      Status: {order.orderStatus.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-brand-200 dark:border-brand-700 pt-4">
                  <h4 className="font-medium text-brand-700 dark:text-brand-300 mb-2">Items:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-brand-600 dark:text-brand-400">
                        {item.quantity}x {item.name} - ₱{(item.price * item.quantity).toFixed(2)}
                        {item.addons && item.addons.length > 0 && (
                          <div className="text-sm ml-4">
                            Add-ons: {item.addons.join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-brand-200 dark:border-brand-700 pt-4">
                  <h4 className="font-medium text-brand-700 dark:text-brand-300 mb-2">Pickup Information:</h4>
                  {order.pickupInfo ? (
                    <div className="space-y-1 text-brand-600 dark:text-brand-400">
                      <p>Pickup Time: {new Date(order.pickupInfo.pickupTime).toLocaleString()}</p>
                      <p>Contact Number: {order.pickupInfo.contactNumber}</p>
                      {order.pickupInfo.specialInstructions && (
                        <p>Special Instructions: {order.pickupInfo.specialInstructions}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-brand-500">No pickup information available</p>
                  )}
                </div>

                <div className="border-t border-brand-200 dark:border-brand-700 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-brand-600 dark:text-brand-400">
                      Payment: {order.paymentMethod.toUpperCase()}
                    </p>
                    <p className="text-brand-600 dark:text-brand-400">
                      Status: {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => testReceipt(order._id, order.userId.email)}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                    disabled={loading}
                  >
                    Send Test Receipt
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
