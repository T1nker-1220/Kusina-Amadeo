"use client";

import Image from 'next/image';
import { FaHistory, FaUsers, FaHeart, FaClock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}

interface ValueCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

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
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function About() {
  const [activeTab, setActiveTab] = useState('journey');

  const timeline: TimelineEvent[] = [
    {
      year: '2022',
      title: 'Seeds of Flavor',
      description: 'Planted our culinary roots in the heart of Amadeo, Cavite, introducing authentic Filipino flavors to the local community.',
      image: '/images/about/2022.jpg'
    },
    {
      year: '2023',
      title: 'Growing Pains',
      description: 'Cultivated a loyal customer base, spreading joy one dish at a time. Despite challenges, our passion for food remained unshaken.',
      image: '/images/about/2023.jpg'
    },
    {
      year: '2024',
      title: 'A New Chapter',
      description: 'Relocated to a cozy spot next to our family home, now serving delicious meals to educational hubs and the local community.',
      image: '/images/about/2024.jpg'
    }
  ];

  const values: ValueCard[] = [
    {
      icon: FaHeart,
      title: 'Quality First',
      description: 'We serve authentic Filipino cuisine using the finest ingredients, ensuring every dish tells a story of our heritage.',
    },
    {
      icon: FaUsers,
      title: 'Family-Oriented',
      description: 'We create a warm, welcoming atmosphere where families can gather, share meals, and create lasting memories.',
    },
    {
      icon: FaHistory,
      title: 'Tradition',
      description: 'We honor traditional Filipino recipes while adding our own modern twist to create unique dining experiences.',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-900 to-brand-900/50">
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-300 mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-brand-400/90 max-w-3xl mx-auto">
              Experience the warmth of Filipino hospitality and the rich heritage of our cuisine
              at Kusina De Amadeo, where every dish tells a story of tradition and passion.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex rounded-lg bg-brand-800/50 p-1">
              {['journey', 'values', 'visit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                    activeTab === tab 
                      ? "bg-brand-700 text-brand-100" 
                      : "text-brand-400 hover:text-brand-300"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="space-y-24"
              >
                {timeline.map((event, index) => (
                  <motion.div
                    key={event.year}
                    variants={item}
                    className={cn(
                      "grid md:grid-cols-2 gap-8 md:gap-16 items-center",
                      index % 2 === 1 ? "md:grid-flow-dense" : ""
                    )}
                  >
                    <div className={cn(
                      "space-y-6",
                      index % 2 === 1 ? "md:col-start-2" : ""
                    )}>
                      <div className="inline-block px-4 py-2 rounded-full bg-brand-800 text-brand-300">
                        {event.year}
                      </div>
                      <h2 className="text-3xl font-bold text-brand-200">
                        {event.title}
                      </h2>
                      <p className="text-lg text-brand-400/90 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'values' && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      variants={item}
                      className="group p-8 rounded-2xl bg-brand-800/50 border border-brand-700/50
                               transition-all duration-300 hover:border-brand-600
                               hover:shadow-lg hover:shadow-brand-900/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-700/50 text-brand-300
                                    flex items-center justify-center mb-6
                                    transition-all duration-300 group-hover:bg-brand-600/50">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-200 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-brand-400/90">
                        {value.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'visit' && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-16"
              >
                <motion.div variants={item} className="space-y-8">
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-brand-800/50 border border-brand-700/50">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-700/50 text-brand-300
                                      flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-200 mb-3">Location</h3>
                          <p className="text-brand-400/90">
                            107 i Purok 4 Dagatan<br />
                            Amadeo, Cavite<br />
                            Philippines
                          </p>
                          <Link 
                            href="https://maps.app.goo.gl/nYwvNFvRrAeyDLMG7"
                            target="_blank"
                            className="inline-block mt-4 text-brand-300 hover:text-brand-200 transition-colors"
                          >
                            View on Google Maps →
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-800/50 border border-brand-700/50">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-700/50 text-brand-300
                                      flex items-center justify-center flex-shrink-0">
                          <FaClock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-200 mb-3">Hours</h3>
                          <p className="text-brand-400/90">
                            Open daily<br />
                            5:00 AM - 12:00 AM<br />
                            Delivery: 8:00 AM - 10:00 PM
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-800/50 border border-brand-700/50">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-700/50 text-brand-300
                                      flex items-center justify-center flex-shrink-0">
                          <FaPhone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-200 mb-3">Contact</h3>
                          <p className="text-brand-400/90">
                            Mobile: +63 960 508 8715<br />
                            Landline: (046) 890-9060<br />
                            <Link 
                              href="mailto:marquezjohnnathanieljade@gmail.com"
                              className="text-brand-300 hover:text-brand-200 transition-colors"
                            >
                              marquezjohnnathanieljade@gmail.com
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  variants={item}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                >
                  <Image
                    src="/images/about/2024.jpg"
                    alt="Our Location"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
