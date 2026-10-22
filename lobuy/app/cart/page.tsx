"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Minus, Plus, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Reveal from "@/components/ui/Reveal";

export default function CartPage() {
  const { cart, loading, updateQty, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const products = cart?.products || [];
  const total = products.reduce(
    (sum, item) => sum + (item.totalPrice || item.price * item.quantity),
    0
  );

  const goCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="grain relative min-h-screen bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,0,0,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
        {loading ? (
          <div className="glass hairline flex items-center justify-center gap-3 rounded-3xl py-24">
            <span className="loader !h-5 !w-5" />
            <span className="font-body text-sm text-titanium-muted">
              Loading your bag…
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="glass hairline rounded-3xl px-8 py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-surface">
              <ShoppingBag className="h-6 w-6 text-gold" />
            </div>
            <p className="font-display text-xl font-bold text-titanium">
              Your bag is empty
            </p>
            <p className="mt-2 font-body text-sm text-titanium-muted">
              Explore the collection and find your next flagship.
            </p>
            <Link
              href="/shop"
              className="btn-metal mt-8 inline-flex h-12 items-center gap-2 rounded-xl px-7 text-[12px] font-bold uppercase tracking-[0.12em]"
            >
              Browse devices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Line items */}
            <div className="space-y-4">
              {products.map((item, i) => {
                const productData = item.productId;
                const productId =
                  typeof productData === "string" ? productData : productData?._id;
                const name =
                  typeof productData === "object" ? productData?.name : "Product";
                const image =
                  typeof productData === "object"
                    ? productData?.images?.[0]?.url
                    : undefined;
                const href = productId ? `/product/${productId}` : "/shop";

                return (
                  <Reveal key={item._id || productId} delay={i * 60}>
                    <div className="glass hairline flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:items-center">
                      <Link
                        href={href}
                        className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-surface"
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={name || "Product"}
                            fill
                            sizes="112px"
                            className="object-contain p-3"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-luxe text-titanium-muted">
                            No image
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={href}
                          className="font-display text-base font-semibold text-titanium transition-colors hover:text-gold"
                        >
                          {name}
                        </Link>
                        <p className="mt-1 font-body text-xs text-titanium-muted">
                          ₹{item.price?.toLocaleString()} each
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex items-center rounded-xl border border-slate-200 bg-surface">
                            <button
                              onClick={() =>
                                productId &&
                                updateQty(productId, Math.max(1, item.quantity - 1))
                              }
                              className="flex h-9 w-9 items-center justify-center text-titanium-muted transition-colors hover:text-gold"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center font-display text-sm font-semibold text-titanium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                productId && updateQty(productId, item.quantity + 1)
                              }
                              className="flex h-9 w-9 items-center justify-center text-titanium-muted transition-colors hover:text-gold"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => productId && removeFromCart(productId)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-surface text-titanium-muted transition-all duration-300 hover:border-red-500/40 hover:text-red-400"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="font-display text-xl font-bold text-titanium sm:text-right">
                        ₹
                        {(
                          item.totalPrice || item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Summary */}
            <Reveal delay={120}>
              <div className="glass-strong hairline sticky top-28 rounded-3xl p-7">
                <h2 className="font-display text-lg font-bold text-titanium">
                  Order Summary
                </h2>

                <dl className="mt-6 space-y-3.5 font-body text-sm">
                  <div className="flex justify-between">
                    <dt className="text-titanium-muted">Subtotal</dt>
                    <dd className="text-titanium">₹{total.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-titanium-muted">Shipping</dt>
                    <dd className="text-gold">Complimentary</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-titanium-muted">Insurance</dt>
                    <dd className="text-gold">Included</dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-baseline justify-between border-t border-slate-200 pt-6">
                  <span className="text-[10px] uppercase tracking-luxe text-titanium-muted">
                    Total
                  </span>
                  <span className="font-display text-3xl font-bold text-titanium">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={goCheckout}
                  className="btn-metal mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-[0.14em]"
                >
                  {isAuthenticated ? "Proceed to Checkout" : "Sign in to Checkout"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-luxe text-titanium-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  Secure encrypted payment
                </p>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
