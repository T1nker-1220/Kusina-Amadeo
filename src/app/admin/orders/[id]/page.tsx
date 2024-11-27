import { getOrderById } from "@/lib/db/orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Order as PrismaOrder, OrderItem as PrismaOrderItem } from "@prisma/client";

interface OrderWithItems extends PrismaOrder {
  orderItems: (PrismaOrderItem & {
    product: {
      name: string;
      price: number;
      image?: string;
    };
  })[];
}

const statusColors: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let order: OrderWithItems;
  
  try {
    const result = await getOrderById(params.id);
    if (!result) {
      notFound();
    }
    order = result as OrderWithItems;
  } catch (error) {
    console.error("Error fetching order:", error);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(-6)}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.orderStatus]}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Order Information</h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="capitalize">{order.paymentStatus || 'N/A'}</span>
            </p>
            <p className="flex justify-between font-medium">
              <span className="text-gray-600">Total Amount:</span>
              <span>{formatPrice(order.total)}</span>
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{order.name || 'Guest'}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{order.email || 'No email provided'}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{order.phone || 'No phone provided'}</span>
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="divide-y">
          {order.orderItems.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × {formatPrice(item.product.price)}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {formatPrice(item.quantity * item.product.price)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
