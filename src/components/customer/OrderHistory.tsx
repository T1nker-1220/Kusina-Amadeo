import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { formatDate, formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
  pickupTime?: string;
  specialInstructions?: string;
}

export default function OrderHistory() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize socket connection
    const socket = io();

    // Join user-specific order updates channel
    socket.emit('join-order-updates', session.user.id);

    // Listen for user's new orders
    socket.on('user-new-order', ({ order }) => {
      setOrders(prev => [order, ...prev]);
      toast.success('New order placed successfully!');
    });

    // Listen for user's order updates
    socket.on('user-order-updated', ({ orderId, status, order }) => {
      setOrders(prev => prev.map(o => o.id === orderId ? order : o));
      toast.success(\`Order status updated to \${status}\`);
    });

    // Fetch initial orders
    fetchOrders();

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  const fetchOrders = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(\`/api/user/orders?userId=\${session.user.id}\`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div className={\`px-3 py-1 rounded-full text-sm \${getStatusColor(order.orderStatus)}\`}>
                {order.orderStatus}
              </div>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
              {order.pickupTime && (
                <p className="text-sm text-gray-600 mt-2">
                  Pickup Time: {order.pickupTime}
                </p>
              )}
              {order.specialInstructions && (
                <p className="text-sm text-gray-600 mt-2">
                  Special Instructions: {order.specialInstructions}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
