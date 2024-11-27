'use client';

import OrderList from "@/components/admin/OrderList";

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Real-time updates active
          </div>
        </div>
      </div>
      <OrderList />
    </div>
  );
}
