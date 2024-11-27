import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import ProductCustomization from './ProductCustomization';
import type { IProduct } from '@/models/Product';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  product: IProduct;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function MenuCard({ product }: MenuCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full group relative bg-white dark:bg-brand-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-brand-100/50 dark:border-brand-800 flex flex-col overflow-hidden"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl p-2">
          {(product.variants?.length > 0 || product.addons?.length > 0) && (
            <div className="absolute top-2 right-2 z-10 bg-brand-600/90 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-brand-500/20 transform hover:scale-105 transition-all duration-300">
              Customizable
            </div>
          )}
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-[1.02] scale-[0.95]",
                "hover:brightness-105"
              )}
              style={{ transform: 'scale(0.9)' }}
              priority={false}
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-800 dark:to-brand-900 flex items-center justify-center">
              <span className="text-brand-400 dark:text-brand-500">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-brand-800 dark:text-brand-100 mb-1 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-brand-600 dark:text-brand-300 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-brand-700 dark:text-brand-200">
              ₱{product.price.toLocaleString()}
            </span>
            <Button
              onClick={() => setIsCustomizing(true)}
              size="sm"
              className="bg-brand-600 hover:bg-brand-700 text-white transition-all duration-300"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>

      <ProductCustomization
        product={product}
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
      />
    </>
  );
}
