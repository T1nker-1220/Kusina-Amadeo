"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import type { IProduct } from '@/models/Product';

const CategoryFilter = dynamic(() => import('@/components/menu/CategoryFilter'), {
  ssr: false,
  loading: () => <div className="h-12 w-full animate-pulse bg-gray-200 rounded-lg" />
});

const MenuCard = dynamic(() => import('@/components/menu/MenuCard'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] rounded-lg" />
});

const categories = ['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = new URL('/api/products', window.location.origin);
        if (selectedCategory) {
          url.searchParams.append('category', selectedCategory);
        }
        if (searchQuery) {
          url.searchParams.append('search', searchQuery);
        }

        const res = await fetch(url, {
          next: { revalidate: 60 },
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        setError(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, 300);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="py-8 space-y-6 flex flex-col items-center">
          <h1 className="text-2xl font-medium text-brand-800 dark:text-brand-100">
            Our Menu
          </h1>
          
          <div className="flex flex-col items-center gap-4 w-full max-w-xl">
            <Input
              type="search"
              placeholder="Search menu..."
              className="w-full max-w-xs"
              onChange={handleSearchChange}
            />
            <Suspense fallback={<div className="h-12 w-full animate-pulse bg-gray-200 rounded-lg" />}>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </Suspense>
          </div>
        </div>

        <div className="py-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-lg" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Suspense key={product._id} fallback={<Skeleton className="h-[400px] rounded-lg" />}>
                  <MenuCard product={product} />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-brand-600 dark:text-brand-300">
                No products found. Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
