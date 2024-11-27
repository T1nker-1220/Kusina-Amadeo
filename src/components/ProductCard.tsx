'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import AddToCartButton from './AddToCartButton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Addon {
  name: string;
  price: number;
}

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    addons?: Addon[];
    image?: string;
  };
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { name, description, price, category, _id: productId, addons, image } = product;
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());
  const [showAddons, setShowAddons] = useState(false);

  const toggleAddon = (index: number) => {
    const newSelectedAddons = new Set(selectedAddons);
    if (selectedAddons.has(index)) {
      newSelectedAddons.delete(index);
    } else {
      newSelectedAddons.add(index);
    }
    setSelectedAddons(newSelectedAddons);
  };

  const calculateTotalPrice = () => {
    let total = price;
    selectedAddons.forEach((index) => {
      if (addons && addons[index]) {
        total += addons[index].price;
      }
    });
    return total;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-card dark:bg-card/95",
        "border border-brand-200/50 dark:border-brand-800/50",
        "shadow-lg shadow-brand-900/5 hover:shadow-xl hover:shadow-brand-900/10",
        "transform transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        <Image
          src={imageError ? '/images/products/placeholder-food.jpg' : (image || '/images/products/placeholder-food.jpg')}
          alt={name}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            isHovered ? 'scale-110' : 'scale-100'
          )}
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Price Tag */}
        <motion.div 
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className={cn(
            "absolute top-4 right-4 z-20",
            "gradient-accent",
            "text-white px-4 py-1.5 rounded-full",
            "shadow-lg backdrop-blur-sm",
            "border border-white/10"
          )}>
          <span className="font-medium">₱{price.toFixed(2)}</span>
        </motion.div>

        {/* Category Badge */}
        <div className={cn(
          "absolute top-4 left-4 z-20",
          "bg-white/90 dark:bg-brand-900/90",
          "text-brand-600 dark:text-brand-400",
          "px-3 py-1 rounded-full text-sm",
          "shadow-lg backdrop-blur-sm",
          "border border-brand-200/50 dark:border-brand-700/50"
        )}>
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className={cn(
            "text-xl font-bold",
            "text-brand-800 dark:text-brand-100",
            "line-clamp-1"
          )}>
            {name}
          </h3>
          <p className={cn(
            "text-sm",
            "text-brand-600/90 dark:text-brand-300/90",
            "line-clamp-2"
          )}>
            {description}
          </p>
        </div>

        {/* Add-ons Section */}
        {addons && addons.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowAddons(!showAddons)}
              className={cn(
                "text-sm font-medium",
                "text-brand-600 dark:text-brand-400",
                "hover:text-brand-700 dark:hover:text-brand-300",
                "transition-colors"
              )}
            >
              {showAddons ? 'Hide Add-ons' : 'Show Add-ons'}
            </button>

            <AnimatePresence>
              {showAddons && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {addons.map((addon, index) => (
                    <label
                      key={addon.name}
                      className={cn(
                        "flex items-center justify-between",
                        "p-2 rounded-lg",
                        "bg-brand-50/50 dark:bg-brand-800/30",
                        "border border-brand-100 dark:border-brand-700/50",
                        "cursor-pointer",
                        "hover:bg-brand-100/50 dark:hover:bg-brand-800/50",
                        "transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAddons.has(index)}
                          onChange={() => toggleAddon(index)}
                          className="rounded border-brand-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="text-sm text-brand-700 dark:text-brand-300">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                        +₱{addon.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton 
          product={{
            id: productId,
            name,
            price: calculateTotalPrice(),
            image,
            description,
            addons: Array.from(selectedAddons)
              .map(index => addons?.[index])
              .filter((addon): addon is Addon => addon !== undefined)
          }}
          className={cn(
            "w-full",
            "btn-primary",
            "hover:scale-105"
          )}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
