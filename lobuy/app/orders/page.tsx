"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Package, ChevronRight, XCircle, Clock } from "lucide-react";
import Protected from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  return (
    <Protected>
      <OrdersView />
    </Protected>
  );
}

function getStatusDetails(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={16} /> };
    case "cancelled":
    case "returned or cancelled":
      return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={16} /> };
    case "shipped":
    case "out-for-delivery":
      return { color: "text-gold", bg: "bg-blue-50", icon: <Package size={16} /> };
    default:
      return { color: "text-amber-600", bg: "bg-amber-50", icon: <Clock size={16} /> };
  }
}

function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<Order[]>("/api/user/orders")
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <XCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-bold">Failed to load orders</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl p-4 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">
            My <span className="text-gold">Orders.</span>
          </h1>
          <p className="font-medium text-slate-500">Manage and track your recent purchases</p>
        </header>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((item) => {
              const statusInfo = getStatusDetails(item.orderStatus);
              const isCancelled = item.orderStatus.toLowerCase().includes("cancel");
              return (
                <Link key={item._id} href={`/orders/${item._id}`} className="block group">
                  <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-surface p-5 transition-all hover:shadow-xl md:flex-row">
                    <div className="flex h-28 w-full items-center justify-center rounded-xl border border-slate-50 bg-slate-50 p-2 md:w-28">
                      <img src={item.products[0]?.productId?.images?.[0]?.url} alt="" className={`h-full w-full object-contain ${isCancelled ? "grayscale opacity-50" : ""}`} />
                    </div>
                    <div className="w-full flex-1 space-y-2">
                      <p className={`line-clamp-1 text-lg font-bold ${isCancelled ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {item.products[0]?.productId?.name}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Order ID: #{item._id.slice(-8)}</p>
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {item.orderStatus}
                      </div>
                    </div>
                    <div className="hidden flex-col items-end gap-2 md:flex">
                      <div className="text-2xl font-black tracking-tighter text-slate-900">₹{item.subtotal}</div>
                      <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold">
                        Details <ChevronRight size={14} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-surface py-20 text-center">
              <Package size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="font-bold uppercase tracking-widest text-slate-500">No orders found yet</p>
              <Link href="/" className="mt-4 inline-block text-sm font-bold text-gold hover:underline">Start Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
