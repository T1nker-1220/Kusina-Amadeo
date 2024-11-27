"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueData {
  labels: string[];
  data: number[];
}

export function RevenueChart() {
  const [revenueData, setRevenueData] = React.useState<RevenueData>({
    labels: [],
    data: []
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRevenueData() {
      try {
        const response = await fetch('/api/admin/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        const data = await response.json();
        setRevenueData(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load revenue data';
        setError(message);
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenueData();
  }, []);

  const chartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.data,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `₱${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-[400px] animate-pulse"
      >
        <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
      >
        <p className="text-red-500">Error loading revenue data</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
      </div>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
