'use client';

import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MapPin, Clock, CreditCard, Wallet } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cod'>('cod');

  useEffect(() => {
    const checkSession = async () => {
      if (!session?.user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      if (state.items.length === 0) {
        router.push('/cart');
      }
    };
    
    checkSession();
  }, [session, state.items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form values
    const pickupTime = (document.getElementById('pickupTime') as HTMLInputElement).value;
    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    const specialInstructions = (document.getElementById('specialInstructions') as HTMLTextAreaElement).value;

    // Validate required fields
    if (!pickupTime || !contactNumber) {
      alert('Please fill in all required fields (Pickup Time and Contact Number)');
      setIsLoading(false);
      return;
    }

    // Validate pickup time
    const selectedTime = new Date(pickupTime);
    const minTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    const maxTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    if (selectedTime < minTime || selectedTime > maxTime) {
      alert('Please select a pickup time between 2 hours and 7 days from now');
      setIsLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            addons: item.addons || []
          })),
          total: state.total,
          paymentMethod,
          pickupInfo: {
            pickupTime,
            contactNumber,
            specialInstructions: specialInstructions || undefined
          }
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      clearCart();
      router.push(`/orders/${orderData._id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || state.items.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
        <div className="pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="inline-block w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-600 dark:text-brand-400 animate-pulse">Processing your order...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4"
            >
              Complete Your Order
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-brand-600 dark:text-brand-400 max-w-2xl mx-auto"
            >
              You're just a few steps away from enjoying your delicious meal. Please review your order and choose your preferred payment method.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div 
              variants={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-800/50 rounded-xl shadow-lg p-6 md:p-8 border border-brand-200 dark:border-brand-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-brand-700 dark:text-brand-300">Order Summary</h2>
                <span className="text-sm text-brand-600 dark:text-brand-400">
                  ({state.items.length} {state.items.length === 1 ? 'item' : 'items'})
                </span>
              </div>

              {/* Order Details Section */}
              <div className="space-y-6">
                {/* Delivery Information */}
                <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-800/30 border border-brand-200 dark:border-brand-700">
                  <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 mb-2">Order Information</h3>
                  <ul className="space-y-2 text-sm text-brand-600 dark:text-brand-400">
                    <li>• Minimum order amount: ₱300</li>
                    <li>• Maximum items per order: 50</li>
                    <li>• Pre-order lead time: 2 hours to 7 days</li>
                    <li>• Operating hours: 8 AM to 10 PM</li>
                  </ul>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300">Your Items</h3>
                  <AnimatePresence mode="wait">
                    {state.items.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={item}
                        layout
                        className="flex items-center justify-between py-4 border-b border-brand-200 dark:border-brand-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="object-cover"
                              fill
                              sizes="(max-width: 64px) 100vw"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300">{item.name}</h3>
                            <p className="text-sm text-brand-600 dark:text-brand-400">Quantity: {item.quantity}</p>
                            {item.addons && item.addons.length > 0 && (
                              <p className="text-sm text-brand-600 dark:text-brand-400">
                                Add-ons: {item.addons.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-brand-700 dark:text-brand-300">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary Footer */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm text-brand-600 dark:text-brand-400">
                    <span>Subtotal</span>
                    <span>₱{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-600 dark:text-brand-400">
                    <span>Service Fee</span>
                    <span>₱0.00</span>
                  </div>
                  <div className="pt-4 border-t border-brand-200 dark:border-brand-700">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-brand-700 dark:text-brand-300">Total Amount</span>
                      <span className="text-brand-700 dark:text-brand-300">₱{state.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-brand-500 dark:text-brand-400 mt-1">
                      Inclusive of all applicable taxes
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Details and Payment */}
            <motion.div 
              variants={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-800/50 rounded-xl shadow-lg p-6 md:p-8 border border-brand-200 dark:border-brand-700"
            >
              <h2 className="text-2xl font-bold text-brand-700 dark:text-brand-300 mb-2">Order Details & Payment</h2>
              <p className="text-sm text-brand-600 dark:text-brand-400 mb-6">
                Please provide your pickup details and choose your preferred payment method.
              </p>

              <div className="space-y-6">
                {/* Pickup Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300">Pickup Information</h3>
                  
                  {/* Pickup Time */}
                  <div>
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                      Preferred Pickup Time
                    </label>
                    <input
                      type="datetime-local"
                      id="pickupTime"
                      name="pickupTime"
                      className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800/30 text-brand-700 dark:text-brand-300"
                      required
                      min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                    />
                    <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">
                      Must be at least 2 hours from now and within 7 days
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="e.g., 09123456789"
                      pattern="[0-9]{11}"
                      className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800/30 text-brand-700 dark:text-brand-300"
                      required
                    />
                    <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">
                      Enter your 11-digit mobile number
                    </p>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows={3}
                      placeholder="Any special requests or notes for your order?"
                      className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800/30 text-brand-700 dark:text-brand-300"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300">Payment Method</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    Choose your preferred payment method. All transactions are secure and encrypted.
                  </p>

                  {/* Cash on Pickup */}
                  <label className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    "border border-brand-200 dark:border-brand-700",
                    "flex items-center cursor-pointer",
                    paymentMethod === 'cod'
                      ? "bg-brand-500 text-white dark:bg-brand-400"
                      : "bg-transparent text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800/50"
                  )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'gcash' | 'cod')}
                      className="form-radio mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Cash on Pickup</div>
                        <div className="text-sm opacity-90">
                          Pay in cash when you pick up your order at our store
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* GCash */}
                  <label className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    "border border-brand-200 dark:border-brand-700",
                    "flex items-center cursor-pointer",
                    paymentMethod === 'gcash'
                      ? "bg-brand-500 text-white dark:bg-brand-400"
                      : "bg-transparent text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800/50"
                  )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'gcash' | 'cod')}
                      className="form-radio mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-medium">GCash</div>
                        <div className="text-sm opacity-90">
                          Quick and secure payment via GCash
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Payment Instructions */}
                  <motion.div 
                    variants={item}
                    className={cn(
                      "p-4 rounded-lg mt-4",
                      "bg-brand-50 dark:bg-brand-800/50",
                      "border border-brand-200 dark:border-brand-700"
                    )}
                  >
                    <h3 className="font-medium text-brand-700 dark:text-brand-300 mb-2">
                      {paymentMethod === 'gcash' ? 'GCash Payment Instructions' : 'Cash Payment Instructions'}
                    </h3>
                    <p className="text-sm text-brand-600 dark:text-brand-400">
                      {paymentMethod === 'gcash' 
                        ? 'After placing your order, you will receive our GCash details. Please make sure to include your order number in the payment reference for faster verification.'
                        : 'Please prepare the exact amount when picking up your order. Our staff will verify your order details upon pickup.'}
                    </p>
                  </motion.div>
                </div>

                {/* Additional Information */}
                <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-800/30 border border-brand-200 dark:border-brand-700">
                  <h3 className="font-medium text-brand-700 dark:text-brand-300 mb-2">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-brand-600 dark:text-brand-400">
                    <li>• Order confirmation will be sent to your email</li>
                    <li>• You can track your order status in the Orders section</li>
                    <li>• For any issues, contact us at {session?.user?.email}</li>
                  </ul>
                </div>

                {/* Place Order Button */}
                <motion.button
                  variants={item}
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full mt-4 px-4 py-3",
                    "rounded-lg text-sm font-medium",
                    "bg-brand-500 text-white dark:bg-brand-400",
                    "hover:bg-brand-600 dark:hover:bg-brand-500",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                    "transition-colors duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <span className="text-brand-200">•</span>
                      <span>₱{state.total.toFixed(2)}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
