"use client";

import React from "react";
import { FiShoppingBag, FiClock, FiCheck, FiX, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
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

export function OrderStats() {
  const [stats, setStats] = React.useState<OrderStats>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/orders/stats");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load stats";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: FiShoppingBag,
      title: "Total Orders",
      value: stats.total,
      gradient: "from-blue-500/20 to-blue-600/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: FiClock,
      title: "Pending Orders",
      value: stats.pending,
      gradient: "from-yellow-500/20 to-yellow-600/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: FiCheck,
      title: "Completed Orders",
      value: stats.completed,
      gradient: "from-green-500/20 to-green-600/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: FiX,
      title: "Cancelled Orders",
      value: stats.cancelled,
      gradient: "from-red-500/20 to-red-600/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      icon: FiDollarSign,
      title: "Total Revenue",
      value: formatPrice(stats.totalAmount),
      gradient: "from-purple-500/20 to-purple-600/20",
      textColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  if (loading) {
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            variants={item}
            className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {statCards.map((stat, index) => (
        <motion.div key={stat.title} variants={item}>
          <Card className="p-6 bg-[#FBF7F4] dark:bg-[#1F1B1A] border border-[#E8DED5] dark:border-[#2D2826] hover:border-[#D4C5B9] dark:hover:border-[#3D3633] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-gradient-to-br", stat.gradient)}>
                <stat.icon className={cn("w-6 h-6", stat.textColor)} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[#1F1B1A]/70 dark:text-white/70">
              {stat.title}
            </h3>
            {loading ? (
              <div className="h-7 w-24 bg-[#E8DED5] dark:bg-[#2D2826] rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-semibold text-[#1F1B1A] dark:text-white mt-1">
                {stat.value}
              </p>
            )}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
