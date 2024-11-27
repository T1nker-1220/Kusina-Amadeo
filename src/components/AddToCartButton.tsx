'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: {
    _id?: string;  // MongoDB style ID
    id?: string;   // Regular ID
    name: string;
    price: number;
    image?: string;
    description: string;
    addons?: Array<{
      name: string;
      price: number;
    }>;
  };
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Adding to cart...');

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Use _id if available, fallback to id, or generate a unique ID
      const itemId = product._id || product.id || Date.now().toString();
      
      addItem({
        id: itemId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        addons: product.addons,
      });

      toast.dismiss(toastId);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.dismiss(toastId);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={cn(
        "relative",
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2 rounded-lg",
        "bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600",
        "text-white font-medium",
        "transform transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
        className
      )}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Adding...</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
