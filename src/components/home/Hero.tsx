'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-dish.jpg"
          alt="Featured Filipino Dish"
          fill
          className="object-cover rounded-2xl"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-brand-950/70 rounded-2xl" />
      </div>

      <div className="relative container mx-auto px-6 md:px-8">
        <div className="max-w-4xl">
          <motion.div
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.div variants={slideUp}>
              <span className="inline-block px-4 py-2 rounded-full text-sm
                           bg-brand-100/10 backdrop-blur-sm border border-brand-100/10
                           text-brand-100 font-medium">
                Serving Since 2022
              </span>
            </motion.div>

            <motion.h1 
              variants={slideUp}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8"
            >
              A Taste of Home in
              <span className="block mt-2 text-brand-200">Amadeo, Cavite</span>
            </motion.h1>

            <motion.p 
              variants={slideUp}
              className="text-lg md:text-xl text-brand-100/90 leading-relaxed max-w-2xl"
            >
              From our humble beginnings in 2022, we've been serving authentic Filipino cuisine 
              with love and passion. Located in the heart of Amadeo, we're proud to be part of 
              the local community, serving students and families alike.
            </motion.p>

            <motion.div 
              variants={slideUp}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href="/menu"
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-6 py-3 rounded-lg font-medium",
                  "bg-brand-500 hover:bg-brand-600",
                  "text-white shadow-lg shadow-brand-500/25",
                  "transform transition-all duration-200",
                  "hover:scale-105 hover:shadow-xl hover:shadow-brand-500/20",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-brand-950"
                )}
              >
                View Our Menu
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://maps.app.goo.gl/nYwvNFvRrAeyDLMG7"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-6 py-3 rounded-lg font-medium",
                  "bg-brand-100/10 hover:bg-brand-100/20",
                  "text-brand-100 backdrop-blur-sm",
                  "border border-brand-100/10",
                  "transform transition-all duration-200",
                  "hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-brand-950"
                )}
              >
                Visit Us
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
