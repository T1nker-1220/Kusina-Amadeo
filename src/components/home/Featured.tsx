'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Featured products from each category
const featuredProducts = [
  {
    category: "Budget Meals",
    title: "Pork Chaofan",
    description: "Our best-selling Pork Fried Rice Chinese Style, customizable with various add-ons.",
    image: "/images/products/pork-chaofan.jpg",
    price: 45,
    link: "/menu?category=Budget%20Meals"
  },
  {
    category: "Silog Meals",
    title: "Sisigsilog",
    description: "Savory sisig served with garlic rice and sunny side up egg.",
    image: "/images/products/sisigsilog.jpg",
    price: 95,
    link: "/menu?category=Silog%20Meals"
  },
  {
    category: "Ala Carte",
    title: "Fries",
    description: "Crispy and delicious french fries, perfect as a snack or side dish.",
    image: "/images/products/fries.jpg",
    price: 50,
    link: "/menu?category=Ala%20Carte"
  },
  {
    category: "Beverages",
    title: "Coke Float",
    description: "Refreshing Coca-Cola with creamy vanilla ice cream.",
    image: "/images/products/coke-float.jpg",
    price: 35,
    link: "/menu?category=Beverages"
  }
];

export default function Featured() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading of images
    const loadImages = async () => {
      const imagePromises = featuredProducts.map(product => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = product.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {featuredProducts.map((product, index) => (
        <motion.div
          key={product.title}
          variants={item}
          className="group relative"
        >
          <Link href={product.link} className="block">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-100 dark:bg-brand-800">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  "group-hover:scale-110",
                  isLoading ? "blur-sm" : "blur-0"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-brand-200">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {product.title}
                  </h3>
                  <p className="text-sm text-brand-100/90 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="pt-2">
                    <span className="text-lg font-bold text-brand-200">
                      ₱{product.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
