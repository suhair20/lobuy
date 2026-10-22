"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Protected from "@/components/Protected";
import { apiFetch, type ApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { Address } from "@/lib/types";
import { MapPin, PlusCircle, ShieldCheck, Lock } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void;
    };
  }
}

export default function CheckoutPage() {
  return (
    <Protected>
      <CheckoutView />
    </Protected>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-surface px-4 py-3.5 font-body text-sm text-titanium placeholder-titanium-muted/60 outline-none transition-colors focus:border-gold/50";

function CheckoutView() {
  const router = useRouter();
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const cartItems = cart?.products || [];
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "creating" | "paying" | "verifying">("idle");
  const [error, setError] = useState<string | null>(null);
  const isCreating = status !== "idle";
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    landmark: "",
    city: "",
    district: "",
    state: "Kerala",
    pincode: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    apiFetch<{ addresses?: Address[] }>("/api/user/get-address")
      .then((data) => {
        const list = data.addresses || [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0]._id);
        else setUseSavedAddress(false);
      })
      .catch(() => setUseSavedAddress(false))
      .finally(() => setAddressLoading(false));
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price ?? item.price) * item.quantity,
    0
  );
  const mrpTotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Math.max(item.productId?.mrp ?? 0, item.productId?.price ?? item.price) * item.quantity,
    0
  );
  const savings = Math.max(0, mrpTotal - total);
  const itemCount = cartItems.reduce((n, item) => n + item.quantity, 0);

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setError(null);
    const finalAddress = useSavedAddress
      ? addresses.find((a) => a._id === selectedAddressId)
      : newAddress;

    if (useSavedAddress && !selectedAddressId) return setError("Please select a delivery address.");
    if (!useSavedAddress) {
      if (newAddress.fullName.trim().length < 2) return setError("Enter the full name.");
      if (!/^[6-9]\d{9}$/.test(newAddress.phone.replace(/\D/g, "").slice(-10)))
        return setError("Enter a valid 10-digit mobile number.");
      if (!/^\d{6}$/.test(newAddress.pincode.trim())) return setError("Enter a valid 6-digit pincode.");
      if (!newAddress.addressLine.trim() || !newAddress.city.trim() || !newAddress.district.trim())
        return setError("Fill in the address, city and district.");
    }
    if (!window.Razorpay) return setError("Payment is still loading. Please try again in a moment.");

    setStatus("creating");
    try {
      const orderResponse = await apiFetch<{
        amount: number;
        razorpayOrderId: string;
        orderId: string;
        keyId?: string;
      }>("/api/user/orders", {
        method: "POST",
        body: JSON.stringify(
          useSavedAddress ? { addressId: selectedAddressId } : { address: newAddress }
        ),
      });

      const rzp = new window.Razorpay({
        key: orderResponse.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderResponse.amount,
        currency: "INR",
        name: "LOBUY",
        description: "Order Payment",
        order_id: orderResponse.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setStatus("verifying");
          try {
            const result = await apiFetch<{ success?: boolean; orderId?: string }>(
              "/api/user/orders/verify",
              { method: "POST", body: JSON.stringify(response) }
            );
            await refreshCart();
            router.replace(`/order-success/${result.orderId || orderResponse.orderId}`);
          } catch (err) {
            const apiError = err as ApiError;
            setError(
              apiError.data?.message ||
                "We couldn't confirm your payment. If money was deducted, your order will be confirmed shortly."
            );
            setStatus("idle");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus((s) => (s === "verifying" ? s : "idle"));
            setError("Payment was cancelled. Your bag is saved, so you can try again.");
          },
        },
        prefill: {
          name: finalAddress?.fullName,
          contact: finalAddress?.phone,
        },
        theme: { color: "#7a2552" },
      });

      rzp.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed. Please try another method.");
        setStatus("idle");
      });

      setStatus("paying");
      rzp.open();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.data?.message || apiError.message || "Could not start checkout.");
      setStatus("idle");
    }
  };

  if (cartLoading || addressLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-obsidian">
        <span className="loader !h-8 !w-8" />
        <p className="font-body text-sm text-titanium-muted">
          Preparing your checkout…
        </p>
      </div>
    );
  }

  return (
    <div className="grain relative min-h-screen bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,0,0,0.12),transparent_70%)]" />
      <Header minimal />

      <div className="relative mx-auto max-w-[1300px] px-4 pb-20 sm:px-6">
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-luxe text-gold">
            Secure Checkout
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-titanium sm:text-5xl">
            Complete Your Order
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 font-display text-sm font-bold text-gold">
                1
              </span>
              <h2 className="font-display text-xl font-bold text-titanium">
                Delivery Address
              </h2>
            </div>

            {addresses.length > 0 && (
              <div
                className={`glass hairline rounded-3xl p-6 transition-all duration-500 ${
                  useSavedAddress ? "ring-1 ring-gold/30" : ""
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    className="h-4 w-4 accent-gold"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                  />
                  <span className="flex items-center gap-2 font-display text-sm font-semibold text-titanium">
                    <MapPin className="h-4 w-4 text-gold" />
                    Use a saved address
                  </span>
                </label>

                {useSavedAddress && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`rounded-2xl border p-5 text-left transition-all duration-500 ease-liquid ${
                          selectedAddressId === addr._id
                            ? "border-gold/50 bg-gold/[0.07] shadow-glow-gold"
                            : "border-slate-200 bg-surface hover:border-slate-300"
                        }`}
                      >
                        <p className="font-display text-sm font-semibold text-titanium">
                          {addr.fullName}
                        </p>
                        <p className="mt-1.5 font-body text-xs leading-relaxed text-titanium-muted">
                          {addr.addressLine}
                        </p>
                        <p className="font-body text-xs text-titanium-muted">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="mt-2.5 font-body text-xs font-medium text-titanium">
                          {addr.phone}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div
              className={`glass hairline rounded-3xl p-6 transition-all duration-500 ${
                !useSavedAddress ? "ring-1 ring-gold/30" : ""
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  className="h-4 w-4 accent-gold"
                  checked={!useSavedAddress}
                  onChange={() => setUseSavedAddress(false)}
                />
                <span className="flex items-center gap-2 font-display text-sm font-semibold text-titanium">
                  <PlusCircle className="h-4 w-4 text-gold" />
                  Add a new address
                </span>
              </label>

              {!useSavedAddress && (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleNewAddressChange}
                    placeholder="Full name"
                    className={inputClass}
                  />
                  <input
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                  <input
                    name="addressLine"
                    value={newAddress.addressLine}
                    onChange={handleNewAddressChange}
                    placeholder="Address (area and street)"
                    className={`${inputClass} md:col-span-2`}
                  />
                  <input
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleNewAddressChange}
                    placeholder="Landmark (optional)"
                    className={`${inputClass} md:col-span-2`}
                  />
                  <input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="City / town"
                    className={inputClass}
                  />
                  <input
                    name="district"
                    value={newAddress.district}
                    onChange={handleNewAddressChange}
                    placeholder="District"
                    className={inputClass}
                  />
                  <input
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Pincode"
                    className={inputClass}
                  />
                  <input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    placeholder="State"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="glass-strong hairline sticky top-28 rounded-3xl p-7">
              <h2 className="font-display text-lg font-bold text-titanium">
                Order Summary
              </h2>
              <p className="mt-1 font-body text-xs text-titanium-muted">
                {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
              </p>

              <div className="hide-scrollbar mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-surface">
                      {item.productId?.images?.[0]?.url ? (
                        <Image
                          src={item.productId.images[0].url}
                          alt={item.productId?.name || "Product"}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[13px] font-semibold text-titanium line-clamp-1">
                        {item.productId?.name}
                      </p>
                      <p className="mt-1 font-body text-[11px] text-titanium-muted">
                        Qty {item.quantity}
                      </p>
                      <p className="mt-1 font-display text-sm font-bold text-titanium">
                        ₹{((item.productId?.price ?? item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <dl className="mt-6 space-y-3 border-t border-slate-200 pt-6 font-body text-sm">
                <div className="flex justify-between">
                  <dt className="text-titanium-muted">
                    Price ({itemCount} item{itemCount === 1 ? "" : "s"})
                  </dt>
                  <dd className="text-titanium">₹{mrpTotal.toLocaleString()}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-titanium-muted">Discount</dt>
                    <dd className="text-green-500">−₹{savings.toLocaleString()}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-titanium-muted">Delivery charges</dt>
                  <dd className="text-green-500">Free</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4">
                  <dt className="text-[10px] uppercase tracking-luxe text-titanium-muted">
                    Total amount
                  </dt>
                  <dd className="font-display text-3xl font-bold text-titanium">
                    ₹{total.toLocaleString()}
                  </dd>
                </div>
                {savings > 0 && (
                  <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-500">
                    You will save ₹{savings.toLocaleString()} on this order
                  </p>
                )}
              </dl>

              {error && (
                <p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                onClick={handlePayment}
                disabled={isCreating || cartItems.length === 0}
                className="btn-metal mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <span className="loader !h-4 !w-4 !border-2 !border-black/30 !border-t-black" />
                    {status === "verifying" ? "Confirming payment…" : status === "paying" ? "Waiting for payment…" : "Processing…"}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ₹{total.toLocaleString()} securely
                  </>
                )}
              </button>

              <p className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-luxe text-titanium-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                256-bit encrypted payment
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
