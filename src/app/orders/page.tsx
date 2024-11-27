'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Loader2, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { io } from 'socket.io-client';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addons?: string[];
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryInfo: {
    address: string;
    contact: string;
  };
  createdAt: string;
}

type SortField = 'date' | 'total' | 'status';
type SortOrder = 'asc' | 'desc';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
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
        setOrders(prev => prev.map(o => o._id === orderId ? order : o));
        toast.success(`Order status updated to ${status}`);
      });

      // Fetch initial orders
      fetchOrders();

      // Cleanup socket connection
      return () => {
        socket.disconnect();
      };
    }
  }, [status, router, session?.user?.id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/orders?userId=${session.user.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'total':
          comparison = b.total - a.total;
          break;
        case 'status':
          comparison = a.orderStatus.localeCompare(b.orderStatus);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortField, sortOrder]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50 min-h-screen">
      {/* Header Section with proper spacing for transparent navbar */}
      <div className="pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4">
              My Orders
            </h1>
            <p className="text-lg text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
              Track and manage your orders from Kusina Amadeo
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-brand-600 dark:text-brand-400">Real-time updates active</span>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2.5 border border-brand-200 dark:border-brand-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-8 py-2.5 border border-brand-200 dark:border-brand-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
            <p className="mt-2 text-brand-600 dark:text-brand-400">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-brand-600 dark:text-brand-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your search criteria.' 
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => router.push('/menu')}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="flex gap-6 pb-4 border-b border-brand-200 dark:border-brand-700 mb-6">
              <button
                onClick={() => handleSort('date')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  sortField === 'date' 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-brand-500 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
                }`}
              >
                Date
                {sortField === 'date' && (
                  sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleSort('total')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  sortField === 'total' 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-brand-500 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
                }`}
              >
                Total
                {sortField === 'total' && (
                  sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleSort('status')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  sortField === 'status' 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-brand-500 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
                }`}
              >
                Status
                {sortField === 'status' && (
                  sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredAndSortedOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-brand-800/50 rounded-xl shadow-sm border border-brand-200 dark:border-brand-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Order ID:</span>
                          <span className="text-sm text-brand-900 dark:text-brand-100 font-mono">{order._id}</span>
                        </div>
                        <p className="text-sm text-brand-500 dark:text-brand-500">
                          {format(new Date(order.createdAt), 'PPpp')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-semibold text-xl text-brand-600 dark:text-brand-400">
                          ₱{order.total.toFixed(2)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.orderStatus)}`}>
                            {order.orderStatus.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.paymentStatus)}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {expandedOrder === order._id && (
                      <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 bg-brand-50 dark:bg-brand-800/50 p-4 rounded-xl">
                              {item.image && (
                                <div className="relative w-24 h-24 flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-lg text-brand-900 dark:text-brand-100">{item.name}</p>
                                    <p className="text-brand-600 dark:text-brand-400 mt-1">
                                      Quantity: {item.quantity} × ₱{item.price.toFixed(2)}
                                    </p>
                                    {item.addons && item.addons.length > 0 && (
                                      <p className="text-brand-500 dark:text-brand-500 text-sm mt-2">
                                        Add-ons: {item.addons.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <p className="font-semibold text-lg text-brand-600 dark:text-brand-400">
                                    ₱{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-brand-200 dark:border-brand-700 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-medium text-brand-900 dark:text-brand-100 mb-3 text-lg">Delivery Information</h3>
                              <div className="bg-brand-50 dark:bg-brand-800/50 p-4 rounded-xl">
                                <p className="text-brand-600 dark:text-brand-400 mb-2">
                                  <span className="font-medium">Address:</span> {order.deliveryInfo.address}
                                </p>
                                <p className="text-brand-600 dark:text-brand-400">
                                  <span className="font-medium">Contact:</span> {order.deliveryInfo.contact}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-brand-900 dark:text-brand-100 mb-3 text-lg">Payment Details</h3>
                              <div className="bg-brand-50 dark:bg-brand-800/50 p-4 rounded-xl">
                                <p className="text-brand-600 dark:text-brand-400 mb-2">
                                  <span className="font-medium">Method:</span> {order.paymentMethod.toUpperCase()}
                                </p>
                                <p className="text-brand-600 dark:text-brand-400">
                                  <span className="font-medium">Status:</span> {order.paymentStatus.toUpperCase()}
                                </p>
                                <div className="mt-4 pt-3 border-t border-brand-200 dark:border-brand-700">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-brand-900 dark:text-brand-100">Total Amount:</span>
                                    <span className="font-semibold text-xl text-brand-600 dark:text-brand-400">₱{order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
