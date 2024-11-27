"use client";

import { OrderStats } from "@/components/admin/OrderStats";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { motion } from "framer-motion";

export default function AdminDashboard() {
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="space-y-8 p-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your admin dashboard. Monitor your business metrics and manage your store.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <OrderStats />
      </motion.div>

      <motion.div variants={item}>
        <RecentOrders />
      </motion.div>
    </motion.div>
  );
}
