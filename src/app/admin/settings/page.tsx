"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({
    storeName: "Kusina De Amadeo",
    storeEmail: "kusinadeamadeo@gmail.com",
    storePhone: "",
    storeAddress: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Store Settings
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Store Information</h2>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                id="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Email
              </label>
              <input
                type="email"
                name="storeEmail"
                id="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Phone
              </label>
              <input
                type="tel"
                name="storePhone"
                id="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Address
              </label>
              <input
                type="text"
                name="storeAddress"
                id="storeAddress"
                value={settings.storeAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
