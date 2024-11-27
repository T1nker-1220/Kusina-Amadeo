'use client';

import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  // Calculate total
  const total = state.total;
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      <div className="pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-brand-600 dark:text-brand-400">
              {itemCount === 0 
                ? "Your cart is empty" 
                : `You have ${itemCount} item${itemCount === 1 ? '' : 's'} in your cart`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          {state.items.length === 0 ? (
            <motion.div 
              {...fadeIn}
              className="text-center py-12 bg-white dark:bg-brand-800/50 rounded-2xl shadow-sm"
            >
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-brand-100 dark:bg-brand-700/50 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon className="w-12 h-12 text-brand-500 dark:text-brand-400" />
                </div>
              </div>
              <p className="text-brand-600 dark:text-brand-400 mb-8">
                Start adding some delicious items to your cart!
              </p>
              <button
                onClick={() => router.push('/menu')}
                className="bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Browse Menu
              </button>
            </motion.div>
          ) : (
            <motion.div 
              {...fadeIn} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Group items by category */}
                {Object.entries(
                  state.items.reduce((acc, item) => {
                    // Only include items with a valid category
                    if (item.category && item.category !== 'Other') {
                      if (!acc[item.category]) {
                        acc[item.category] = [];
                      }
                      acc[item.category].push(item);
                    }
                    return acc;
                  }, {} as Record<string, typeof state.items>)
                )
                .sort(([a], [b]) => {
                  // Define category order
                  const order = ['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 pl-2">
                      {category}
                    </h3>
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-white dark:bg-brand-800/50 rounded-xl shadow-sm border border-brand-200 dark:border-brand-700 overflow-hidden"
                        >
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                              {item.image && (
                                <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                  <div>
                                    <h3 className="font-medium text-lg text-brand-900 dark:text-brand-100">
                                      {item.name}
                                    </h3>
                                    {/* Show variants */}
                                    {item.variants && item.variants.length > 0 && (
                                      <div className="mt-1">
                                        {item.variants.map(variant => (
                                          <p 
                                            key={variant.value} 
                                            className="text-sm text-brand-600 dark:text-brand-400"
                                          >
                                            Flavor: <span className="font-medium">{variant.value}</span>
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                    {/* Show addons with quantities and prices */}
                                    {item.addons && item.addons.length > 0 && (
                                      <div className="text-sm text-brand-500 dark:text-brand-400 mt-2">
                                        <p className="font-medium mb-1">Add-ons:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                          {item.addons.map((addon, index) => (
                                            <li key={index}>
                                              {addon.name} x{addon.quantity} ({formatPrice(addon.price * addon.quantity)})
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="p-1 rounded-full hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors"
                                      >
                                        <MinusIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                      </button>
                                      <span className="text-brand-900 dark:text-brand-100 min-w-[2rem] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="p-1 rounded-full hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors"
                                      >
                                        <PlusIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                      </button>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-brand-900 dark:text-brand-100">
                                        {formatPrice(item.price * item.quantity)}
                                      </p>
                                      <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div 
                  {...fadeIn}
                  className="bg-white dark:bg-brand-800/50 rounded-xl shadow-sm border border-brand-200 dark:border-brand-700 p-6 lg:sticky lg:top-24"
                >
                  <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100 mb-6">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {/* Items breakdown by category */}
                    <div className="space-y-4 mb-4">
                      {Object.entries(
                        state.items.reduce((acc, item) => {
                          if (item.category && item.category !== 'Other') {
                            if (!acc[item.category]) {
                              acc[item.category] = [];
                            }
                            acc[item.category].push(item);
                          }
                          return acc;
                        }, {} as Record<string, typeof state.items>)
                      )
                      .sort(([a], [b]) => {
                        const order = ['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'];
                        return order.indexOf(a) - order.indexOf(b);
                      })
                      .map(([category, items]) => (
                        <div key={category}>
                          <h3 className="text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                            {category}
                          </h3>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.id} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-brand-600 dark:text-brand-400">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="text-brand-900 dark:text-brand-100">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                                {/* Show flavor */}
                                {item.variants && item.variants.length > 0 && (
                                  <div className="text-xs text-brand-500 dark:text-brand-400 pl-2">
                                    Flavor: {item.variants[0].value}
                                  </div>
                                )}
                                {/* Show addons */}
                                {item.addons && item.addons.length > 0 && (
                                  <div className="text-xs text-brand-500 dark:text-brand-400 pl-2">
                                    {item.addons.map((addon, index) => (
                                      <div key={index}>
                                        + {addon.name} (×{addon.quantity})
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-brand-200 dark:border-brand-700">
                      <span className="text-brand-600 dark:text-brand-400">Subtotal</span>
                      <span className="text-brand-900 dark:text-brand-100">{formatPrice(total)}</span>
                    </div>

                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-brand-900 dark:text-brand-100">Total</span>
                      <span className="text-brand-600 dark:text-brand-400">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading || state.items.length === 0}
                      className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>

                    <button
                      onClick={() => router.push('/menu')}
                      className="w-full py-3 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                    >
                      Continue Shopping
                    </button>

                    {!session && (
                      <p className="text-sm text-center text-brand-500 dark:text-brand-400 mt-4">
                        Please <button 
                          onClick={() => router.push('/login?redirect=/cart')}
                          className="text-brand-600 dark:text-brand-300 hover:underline"
                        >
                          log in
                        </button> to proceed with checkout
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
