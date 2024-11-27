"use client";

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { MapPinIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Hero = dynamic(() => import('@/components/home/Hero'), {
  loading: () => <LoadingSpinner />
});

const Featured = dynamic(() => import('@/components/home/Featured'), {
  loading: () => <LoadingSpinner />
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      {/* Hero Section */}
      <AnimateOnScroll animation="fade-in" delay={100}>
        <section className="relative pt-24">
          <div className="container mx-auto px-4">
            <Hero />
          </div>
        </section>
      </AnimateOnScroll>

      {/* Quick Info Section */}
      <AnimateOnScroll animation="fade-in" delay={150}>
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Location */}
              <div className="bg-white dark:bg-brand-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-brand-100/20 dark:border-brand-700/30">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-700/30 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 mb-2">Visit Us</h3>
                    <p className="text-brand-600 dark:text-brand-400">107 i Purok 4 Dagatan, Amadeo, Cavite</p>
                    <a 
                      href="https://maps.app.goo.gl/nYwvNFvRrAeyDLMG7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-sm mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white dark:bg-brand-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-brand-100/20 dark:border-brand-700/30">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-700/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 mb-2">Opening Hours</h3>
                    <p className="text-brand-600 dark:text-brand-400">Open Daily</p>
                    <p className="text-brand-600 dark:text-brand-400">5:00 AM - 12:00 AM</p>
                    <p className="text-sm text-brand-500 dark:text-brand-400 mt-2">Delivery: 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-brand-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-brand-100/20 dark:border-brand-700/30">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-700/30 rounded-lg">
                    <PhoneIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 mb-2">Contact Us</h3>
                    <p className="text-brand-600 dark:text-brand-400">Mobile: +63 960 508 8715</p>
                    <p className="text-brand-600 dark:text-brand-400">Tel: (046) 890-9060</p>
                    <a 
                      href="mailto:marquezjohnnathanieljade@gmail.com"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-sm mt-2 inline-block"
                    >
                      Send us an email →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Featured Section */}
      <AnimateOnScroll animation="slide-up" delay={200}>
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4">
                Featured Dishes
              </h2>
              <p className="text-lg text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
                Discover our most popular and beloved Filipino dishes, carefully prepared with authentic recipes
              </p>
            </div>
            <Featured />
          </div>
        </section>
      </AnimateOnScroll>
    </main>
  );
}
