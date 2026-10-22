"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";

type AdminOrder = {
  _id: string;
  subtotal: number;
  orderStatus: string;
  payment?: string;
  user?: { email?: string };
  products?: Array<{ quantity: number; productId?: { name?: string } }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ orders?: AdminOrder[] }>("/api/orders")
      .then((data) => setOrders(data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-black text-brand-dark">Orders</h1>
        <p className="text-sm text-gray-500">All customer orders from the storefront</p>
      </div>
      <div className="overflow-x-auto px-4 py-6 md:px-6">
        <table className="min-w-full overflow-hidden rounded-xl border">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3 font-mono text-xs">{order._id.slice(-8)}</td>
                <td className="p-3 text-sm">{order.user?.email || "Guest"}</td>
                <td className="p-3 text-sm">
                  {order.products
                    ?.map((p) => `${p.productId?.name || "Item"} x${p.quantity}`)
                    .join(", ") || "-"}
                </td>
                <td className="p-3 font-bold">₹{Number(order.subtotal || 0).toLocaleString()}</td>
                <td className="p-3">
                  <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-xs font-bold uppercase">
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-3 text-sm">{order.payment || "Razorpay"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
