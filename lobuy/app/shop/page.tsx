"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Home, ChevronRight, SlidersHorizontal } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";

type SortKey = "latest" | "price-asc" | "price-desc";

const PRICE_BANDS = [
  {
    id: "all",
    label: "All prices",
    hint: "Full catalogue",
    min: 0,
    max: Infinity,
    tone: "from-[#2A1520] to-[#1A0A12] border-white/10 text-neutral-700",
    active: "from-[#3A1C2C] to-[#2A0F1E] border-gold/50 text-gold shadow-[0_0_24px_-8px_rgba(217,185,138,0.45)]",
  },
  {
    id: "under-1k",
    label: "Under ₹1,000",
    hint: "Everyday picks",
    min: 0,
    max: 999,
    tone: "from-[#1A2418] to-[#0F1812] border-emerald-500/25 text-emerald-200/80",
    active: "from-[#14331F] to-[#0F2418] border-emerald-400/60 text-emerald-300 shadow-[0_0_24px_-8px_rgba(52,211,153,0.4)]",
  },
  {
    id: "1k-2k",
    label: "₹1,000 – ₹1,999",
    hint: "Best value",
    min: 1000,
    max: 1999,
    tone: "from-[#1E2030] to-[#12141F] border-sky-500/25 text-sky-200/80",
    active: "from-[#1E2A44] to-[#152036] border-sky-400/60 text-sky-300 shadow-[0_0_24px_-8px_rgba(56,189,248,0.4)]",
  },
  {
    id: "2k-5k",
    label: "₹2,000 – ₹4,999",
    hint: "Premium mid",
    min: 2000,
    max: 4999,
    tone: "from-[#2A1C10] to-[#1A1008] border-amber-500/25 text-amber-200/80",
    active: "from-[#3A2810] to-[#2A1C0A] border-amber-400/60 text-amber-300 shadow-[0_0_24px_-8px_rgba(251,191,36,0.4)]",
  },
  {
    id: "5k-plus",
    label: "₹5,000 & above",
    hint: "Flagship",
    min: 5000,
    max: Infinity,
    tone: "from-[#2A0F1E] to-[#1A0412] border-[#C77FA2]/30 text-[#E8B8D0]/90",
    active: "from-[#400D29] to-[#2A0F1E] border-gold/55 text-gold shadow-[0_0_28px_-6px_rgba(199,127,162,0.5)]",
  },
] as const;

type PriceBandId = (typeof PRICE_BANDS)[number]["id"];

function AllProductsView() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const categoryFilter = searchParams.get("category") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("latest");
  const [priceBand, setPriceBand] = useState<PriceBandId>("all");
  const { addToCart } = useCart();

  useEffect(() => {
    apiFetch<Product[]>("/api/user/products?limit=50")
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const activeBand = PRICE_BANDS.find((b) => b.id === priceBand) ?? PRICE_BANDS[0];

  const visible = useMemo(() => {
    const filtered = products.filter((p) => {
      if (categoryFilter) {
        const catId = typeof p.category === "string" ? p.category : p.category?._id;
        if (catId !== categoryFilter) return false;
      }
      if (p.price < activeBand.min || p.price > activeBand.max) return false;
      if (!query) return true;
      return (
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, query, categoryFilter, sort, activeBand]);

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      toast.success("Added to bag");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "latest", label: "Latest" },
    { key: "price-asc", label: "Price ↑" },
    { key: "price-desc", label: "Price ↓" },
  ];

  return (
    <div className="grain relative min-h-screen bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,0,0,0.14),transparent_70%)]" />

      <main className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:py-14">
        <nav className="mb-8 flex items-center gap-2.5 text-titanium-muted">
          <Link href="/" className="transition-colors hover:text-gold">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="text-[10px] uppercase tracking-luxe text-gold">
            All Devices
          </span>
        </nav>

        {query && (
          <h1 className="mb-6 font-display text-2xl font-bold text-titanium sm:text-3xl">
            Results for <span className="text-champagne">&ldquo;{query}&rdquo;</span>
          </h1>
        )}

        {/* Shop by price */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                Filter
              </p>
              <h2 className="mt-1 text-lg font-bold uppercase tracking-tight text-neutral-900 sm:text-xl">
                Shop by price
              </h2>
            </div>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
            {PRICE_BANDS.map((band) => {
              const on = priceBand === band.id;
              return (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setPriceBand(band.id)}
                  aria-pressed={on}
                  className={`relative min-w-[148px] shrink-0 overflow-hidden rounded-2xl border bg-gradient-to-br px-4 py-3.5 text-left transition-all duration-300 sm:min-w-0 ${
                    on ? band.active : `${band.tone} hover:brightness-110`
                  }`}
                >
                  <span
                    className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl ${
                      on ? "bg-white/15" : "bg-white/5"
                    }`}
                  />
                  <span className="relative block text-[11px] font-bold uppercase tracking-[0.12em]">
                    {band.label}
                  </span>
                  <span className="relative mt-1 block text-[10px] opacity-70">{band.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sort bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <p className="mr-auto w-full font-body text-sm text-titanium-muted sm:w-auto">
            {isLoading
              ? "Loading devices…"
              : `${visible.length} device${visible.length === 1 ? "" : "s"}`}
          </p>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-luxe text-titanium-muted">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gold" />
            Sort
          </span>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSort(option.key)}
              className={`rounded-xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-500 ease-liquid ${
                sort === option.key
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-slate-200 bg-surface text-titanium-muted hover:border-slate-300 hover:text-copper-light"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass h-[380px] animate-pulse rounded-3xl"
                />
              ))
            : visible.map((product, i) => (
                <Reveal key={product._id} delay={(i % 4) * 70}>
                  <ProductCard
                    product={product}
                    adding={addingId === product._id}
                    onAdd={handleAddToCart}
                  />
                </Reveal>
              ))}
        </div>

        {!isLoading && visible.length === 0 && (
          <div className="glass hairline rounded-3xl px-8 py-20 text-center">
            <p className="font-display text-lg text-titanium">No devices found</p>
            <p className="mt-2 font-body text-sm text-titanium-muted">
              {query
                ? "Try a different search term."
                : "Publish products from the admin panel to see them here."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-obsidian">
          <span className="loader !h-8 !w-8" />
        </div>
      }
    >
      <AllProductsView />
    </Suspense>
  );
}
