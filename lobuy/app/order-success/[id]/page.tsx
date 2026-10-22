"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import { apiFetch } from "@/lib/api";

type PlacedOrder = {
  _id: string;
  orderStatus: string;
  paymentStatus?: string;
  totalAmount?: number;
  subtotal: number;
  delivery_address?: { fullName?: string; city?: string; pincode?: string };
  products: { quantity: number }[];
};

export default function OrderSuccessPage() {
  return (
    <Protected>
      <OrderSuccessView />
    </Protected>
  );
}

function OrderSuccessView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!id) return;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    const load = () =>
      apiFetch<PlacedOrder>(`/api/user/orders/${id}`)
        .then((data) => {
          setOrder(data);
          if (data.paymentStatus === "pending" && attempts++ < 5) {
            timer = setTimeout(load, 2000);
          } else {
            setState("ready");
          }
        })
        .catch(() => setState("missing"));
    load();
    return () => clearTimeout(timer);
  }, [id]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <span className="loader !h-8 !w-8" />
        <p className="text-sm text-neutral-500">Confirming your order…</p>
      </div>
    );
  }

  if (state === "missing" || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Order not found</h1>
        <Link href="/orders" className="text-sm font-semibold text-gold">
          Go to my orders
        </Link>
      </div>
    );
  }

  const paid = order.paymentStatus === "paid" || order.orderStatus === "placed";
  const items = order.products.reduce((n, p) => n + p.quantity, 0);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface p-8 text-center shadow-xl">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            paid ? "bg-green-100" : "bg-amber-50"
          }`}
        >
          {paid ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="loader !h-8 !w-8" />
          )}
        </div>
        <h1 className="mb-2 text-3xl font-black text-neutral-900">
          {paid ? "Order placed!" : "Payment processing"}
        </h1>
        <p className="mb-6 text-neutral-500">
          {paid
            ? `Thank you${order.delivery_address?.fullName ? `, ${order.delivery_address.fullName}` : ""}. We've received your order and will start packing it soon.`
            : "We're waiting for the bank to confirm your payment. This page will update in My orders once it's confirmed."}
        </p>
        <dl className="mb-8 space-y-2 rounded-2xl border border-white/10 bg-neutral-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Order ID</dt>
            <dd className="break-all font-mono text-xs font-bold text-neutral-900">#{order._id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Items</dt>
            <dd className="text-neutral-900">{items}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Amount paid</dt>
            <dd className="font-bold text-neutral-900">
              ₹{(order.totalAmount ?? order.subtotal).toLocaleString()}
            </dd>
          </div>
          {order.delivery_address?.city && (
            <div className="flex justify-between">
              <dt className="text-neutral-500">Deliver to</dt>
              <dd className="text-neutral-900">
                {order.delivery_address.city} {order.delivery_address.pincode}
              </dd>
            </div>
          )}
        </dl>
        <button
          onClick={() => router.push(`/orders/${order._id}`)}
          className="btn-metal w-full rounded-xl py-4 text-sm font-bold uppercase tracking-[0.14em]"
        >
          Track order
        </button>
        <Link href="/" className="mt-3 block w-full py-4 text-sm font-bold text-gold">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
