"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/types";
import toast from "react-hot-toast";
import Reveal from "@/components/ui/Reveal";
import { discountPercent } from "@/components/ui/ProductCard";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Home,
  Minus,
  Plus,
  Cpu,
  Sparkles,
} from "lucide-react";

export default function ProductView({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    apiFetch<Product>(`/api/user/productbyId/${productId}`)
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async (goToCart = false) => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      toast.success("Added to bag");
      if (goToCart) router.push("/cart");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      router.push(isAuthenticated ? "/checkout" : "/login?redirect=/checkout");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-obsidian">
        <span className="loader !h-8 !w-8" />
        <p className="font-body text-sm text-titanium-muted">
          Loading device…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-obsidian px-4 text-center">
        <h2 className="font-display text-2xl font-bold text-titanium">
          Device not found
        </h2>
        <Link
          href="/shop"
          className="btn-metal mt-8 inline-flex h-12 items-center rounded-xl px-7 text-[12px] font-bold uppercase tracking-[0.12em]"
        >
          Back to catalogue
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const soldOut = product.stock === 0;
  const discount = discountPercent(product);

  return (
    <div className="grain relative min-h-screen bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,0,0,0.14),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-10 flex items-center gap-2.5 text-titanium-muted">
          <Link href="/" className="transition-colors hover:text-gold">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link href="/shop" className="text-xs transition-colors hover:text-gold">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="max-w-[180px] truncate text-xs text-titanium sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <Reveal>
            <div className="mx-auto w-full max-w-[480px] lg:sticky lg:top-28 lg:mx-0 lg:ml-auto">
              <div className="glass hairline group relative aspect-square overflow-hidden rounded-[32px]">
                <div className="pointer-events-none absolute inset-x-10 top-6 h-40 rounded-full bg-gold/12 blur-3xl" />
                {images[activeImage]?.url ? (
                  <Image
                    src={images[activeImage].url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 80vw, 480px"
                    priority
                    quality={95}
                    className="object-contain p-[18%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-liquid group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-luxe text-titanium-muted">
                    No image available
                  </div>
                )}
                {soldOut && (
                  <span className="absolute left-6 top-6 rounded-xl bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-luxe text-titanium-muted backdrop-blur-sm">
                    Sold out
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-surface transition-all duration-500 ease-spring ${
                        activeImage === idx
                          ? "border-gold/60 shadow-glow-gold"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-2.5"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal delay={80}>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-luxe text-titanium-muted">
                <Sparkles className="h-3 w-3 text-gold" />
                {soldOut ? "Restocking soon" : `${product.stock} in stock`}
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-titanium sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 font-body text-sm text-titanium-muted">
                {product.rating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                      {product.rating.toFixed(1)}
                      <Star className="h-3 w-3 fill-current" />
                    </span>
                    {product.numReviews ? (
                      <span>{product.numReviews.toLocaleString()} reviews</span>
                    ) : null}
                  </span>
                ) : null}
                {product.sku && (
                  <>
                    <span className="opacity-40">|</span>
                    <span className="text-xs uppercase tracking-wider">
                      SKU {product.sku}
                    </span>
                  </>
                )}
              </div>
            </Reveal>

            {/* Price */}
            <Reveal delay={160}>
              <div className="mt-8 border-y border-slate-200 py-7">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-display text-4xl font-bold text-titanium sm:text-5xl">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="font-body text-lg text-titanium-muted line-through">
                        ₹{product.mrp?.toLocaleString()}
                      </span>
                      <span className="rounded-md bg-orange-500 px-2 py-0.5 text-sm font-bold text-white">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-3 font-body text-xs text-titanium-muted">
                  Inclusive of all taxes
                </p>
              </div>
            </Reveal>

            {/* Purchase */}
            <Reveal delay={240}>
              <div className="glass hairline mt-8 rounded-3xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-luxe text-titanium-muted">
                    Quantity
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-surface">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-11 w-11 items-center justify-center text-titanium-muted transition-colors hover:text-gold"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-display text-sm font-semibold text-titanium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock || 1, quantity + 1))
                      }
                      className="flex h-11 w-11 items-center justify-center text-titanium-muted transition-colors hover:text-gold"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={adding || soldOut}
                    className="btn-ghost flex h-14 items-center justify-center rounded-xl text-[12px] font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {adding ? "Adding…" : "Add to Bag"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={adding || soldOut}
                    className="btn-metal flex h-14 items-center justify-center rounded-xl text-[12px] font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Assurances */}
            <Reveal delay={320}>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Buyer Protection" },
                  { icon: Truck, label: "Free Insured Shipping" },
                  { icon: RotateCcw, label: "14-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-gold" />
                    <span className="font-body text-[11px] uppercase tracking-wider text-titanium-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Description */}
            {product.description && (
              <Reveal delay={400}>
                <div className="mt-10">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-titanium">
                    <Cpu className="h-4 w-4 text-gold" />
                    The Details
                  </h2>
                  <p className="mt-4 whitespace-pre-wrap font-body text-sm leading-relaxed text-titanium-muted">
                    {product.description}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
