"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
        <div className="pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="inline-block w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-600 dark:text-brand-400 animate-pulse">Loading customer data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4"
            >
              Customer Management
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-brand-100"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 dark:text-brand-500" />
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-brand-800 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-200 dark:divide-brand-700">
                <thead className="bg-brand-50 dark:bg-brand-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-brand-800 divide-y divide-brand-200 dark:divide-brand-700">
                  <AnimatePresence>
                    {filteredCustomers.map((customer: any) => (
                      <motion.tr
                        key={customer._id}
                        variants={item}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-brand-900 dark:text-brand-100">{customer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-brand-500 dark:text-brand-400">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-brand-500 dark:text-brand-400">{customer.orderCount || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-500 dark:text-brand-400">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
