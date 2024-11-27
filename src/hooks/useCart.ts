'use client';

import { useState } from 'react';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { addItem, removeItem, updateQuantity, clearCart, state } = context;

  const addToCart = async ({ 
    productId, 
    quantity, 
    specialInstructions 
  }: { 
    productId: string; 
    quantity: number; 
    specialInstructions?: string; 
  }) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      addItem({
        id: productId,
        quantity,
        specialInstructions,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    removeFromCart: removeItem,
    updateQuantity,
    clearCart,
    cart: state.items,
    total: state.total,
    isLoading,
  };
}
