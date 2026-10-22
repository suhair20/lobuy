"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Package, Truck, Home, XCircle, AlertTriangle, ArrowLeft, Phone, Calendar, CreditCard } from "lucide-react";
import Protected from "@/components/Protected";
import { apiFetch, type ApiError } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrderDetailsPage() {
  return (
    <Protected>
      <OrderDetailsView />
    </Protected>
  );
}

function OrderDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = () => {
    if (!id) return;
    apiFetch<Order>(`/api/user/orders/${id}`)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gold" /></div>;
  if (error || !order) return <div className="mt-20 text-center font-bold text-red-500">Order not found or an error occurred.</div>;

  const statusMap: Record<string, number> = { pending: 0, placed: 0, shipped: 1, "out-for-delivery": 2, delivered: 3 };
  const currentStep = statusMap[order.orderStatus.toLowerCase()] ?? 0;
  const isCancelled = order.orderStatus.toLowerCase() === "cancelled";

  const handleConfirmCancel = async () => {
    try {
      setIsCancelling(true);
      await apiFetch(`/api/user/orders/${id}`, { method: "PUT" });
      setShowCancelModal(false);
      load();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <button onClick={() => router.push("/orders")} className="mb-6 flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={20} /> Back to My Orders
        </button>
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-surface p-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-800 sm:text-2xl">Order Details</h1>
            <p className="mt-1 text-sm text-slate-500">ID: <span className="rounded bg-blue-50 px-2 py-0.5 font-mono font-bold text-gold">#{order._id}</span></p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Calendar className="text-slate-400" size={20} />
            <p className="text-sm font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {!isCancelled ? (
          <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-100 bg-surface p-6 sm:p-10">
            <div className="flex min-w-[500px] items-center justify-between px-4">
              {["Placed", "Shipped", "On Way", "Delivered"].map((label, i) => (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${i <= currentStep ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {i <= currentStep ? <CheckCircle size={22} /> : i === 1 ? <Package size={22} /> : <Truck size={22} />}
                    </div>
                    <p className={`mt-3 text-[10px] font-black uppercase tracking-widest ${i <= currentStep ? "text-gold" : "text-slate-400"}`}>{label}</p>
                  </div>
                  {i < 3 && <div className={`mx-2 h-1 flex-1 ${i < currentStep ? "bg-blue-600" : "bg-slate-100"}`} />}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border-2 border-red-100 bg-red-50 p-6">
            <XCircle size={32} className="text-red-600" />
            <div>
              <h3 className="text-lg font-black uppercase text-red-800">This Order was Cancelled</h3>
              <p className="text-sm font-medium text-red-600">Refund will be processed within 5-7 business days.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
              {order.products.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-6 border-b border-slate-50 p-6 sm:flex-row">
                  <img src={item.productId?.images?.[0]?.url} className="h-28 w-28 rounded-2xl border border-slate-100 object-contain" alt="" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-lg font-bold text-slate-800">{item.productId?.name}</h4>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">Qty: {item.quantity}</p>
                    <p className="mt-3 text-2xl font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            {!isCancelled && (order.orderStatus === "placed" || order.orderStatus === "pending") && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-surface p-6 sm:flex-row">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <p className="text-sm font-medium text-slate-500">Changed your mind? You can still cancel this order.</p>
                </div>
                <button onClick={() => setShowCancelModal(true)} className="rounded-xl bg-red-50 px-8 py-3 text-xs font-black uppercase tracking-widest text-red-600">Cancel Order</button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white">
              <Home className="absolute right-4 top-0 opacity-10" size={80} />
              <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Shipping Address</h3>
              <p className="mb-2 text-xl font-black">{order.delivery_address.fullName}</p>
              <p className="text-sm text-slate-300">{order.delivery_address.addressLine}</p>
              <p className="text-sm text-slate-300">{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-4">
                <Phone size={16} className="text-blue-400" />
                <span className="text-sm font-bold tracking-widest">{order.delivery_address.phone}</span>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-surface p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-bold text-slate-500"><CreditCard size={16} /> Payment</span>
                <span className="font-black text-slate-800">{order.payment}</span>
              </div>
              <div className="mt-6 flex items-end justify-between border-t pt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grand Total</span>
                <span className="text-3xl font-black tracking-tighter text-gold">₹{order.subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowCancelModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-[2.5rem] bg-surface p-8 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Cancel Order?</h2>
            <p className="mt-3 font-medium text-slate-500">Are you sure you want to stop the delivery of these items?</p>
            <div className="mt-8 flex flex-col gap-3">
              <button onClick={handleConfirmCancel} disabled={isCancelling} className="rounded-2xl bg-red-600 py-4 text-xs font-black uppercase tracking-widest text-white">{isCancelling ? "Processing..." : "Yes, Cancel Order"}</button>
              <button onClick={() => setShowCancelModal(false)} className="rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-600">No, Keep it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
