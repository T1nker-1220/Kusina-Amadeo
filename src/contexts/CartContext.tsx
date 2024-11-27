'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItemVariant {
  name: string;
  value: string;
}

interface CartItemAddon {
  name: string;
  quantity: number;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  variants?: CartItemVariant[];
  addons?: CartItemAddon[];
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === action.payload.id &&
          JSON.stringify(item.variants) === JSON.stringify(action.payload.variants) &&
          JSON.stringify(item.addons) === JSON.stringify(action.payload.addons)
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Update existing item
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const newTotal = calculateTotal(newItems);
      return { items: newItems, total: newTotal };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = calculateTotal(newItems);
      return { items: newItems, total: newTotal };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) return state;
      
      const newItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      const newTotal = calculateTotal(newItems);
      return { items: newItems, total: newTotal };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    case 'SET_CART':
      return action.payload;

    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    // Base price
    let itemTotal = item.price * item.quantity;
    
    // Add addon prices
    const addonsTotal = item.addons?.reduce((acc, addon) => acc + (addon.price * addon.quantity), 0) || 0;
    itemTotal += addonsTotal;
    
    return total + itemTotal;
  }, 0);
};

// Get initial state from localStorage if available
const getInitialState = (): CartState => {
  if (typeof window === 'undefined') return { items: [], total: 0 };
  
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart && Array.isArray(parsedCart.items)) {
        return {
          items: parsedCart.items,
          total: calculateTotal(parsedCart.items)
        };
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    localStorage.removeItem('cart');
  }
  
  return { items: [], total: 0 };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
