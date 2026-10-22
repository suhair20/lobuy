"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight, ShieldCheck, ShoppingCart, PackageSearch, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Product, Category } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import CategoryBrowser from "@/components/home/CategoryBrowser";
import HeroSlider from "@/components/home/HeroSlider";
import CollectionCarousel from "@/components/home/CollectionCarousel";
import SpotlightBento from "@/components/home/SpotlightBento";

const TRUST = [
  { icon: Lock, title: "Secure payments", text: "Pay safely with Razorpay" },
  { icon: ShoppingCart, title: "Shop without signing up", text: "Sign in only at checkout" },
  { icon: PackageSearch, title: "Track every order", text: "Live status in My orders" },
  { icon: ShieldCheck, title: "Checked before dispatch", text: "Every item is inspected" },
];

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>}
      {href && (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

type HomeSections = {
  hero: Product[];
  collection: Product[];
  spotlight: Product[];
  deals: Product[];
  newArrivals: Product[];
};

const EMPTY_HOME: HomeSections = { hero: [], collection: [], spotlight: [], deals: [], newArrivals: [] };

/** Swipeable row on phones, grid from `sm` up. */
function ProductRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:p-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

const railItem = "w-[46%] shrink-0 snap-start sm:w-auto";

function ProductGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ProductRail>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${railItem} overflow-hidden rounded-3xl bg-surface p-2`}>
          <div className="aspect-square animate-pulse rounded-xl bg-slate-100" />
          <div className="space-y-2 p-4">
            <div className="h-4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </ProductRail>
  );
}

export default function HomeView() {
  const [home, setHome] = useState<HomeSections>(EMPTY_HOME);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([
      apiFetch<HomeSections>("/api/user/home"),
      apiFetch<Category[]>("/api/user/categories"),
    ])
      .then(([homeData, categoriesData]) => {
        setHome({ ...EMPTY_HOME, ...homeData });
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch((err) => console.error("Failed to fetch data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const { hero, collection, spotlight, deals, newArrivals } = home;
  return (
    <div>
      <HeroSlider
        products={hero}
        loading={loading}
        addingId={addingId}
        onAdd={handleAddToCart}
      />

      <div className="mx-auto max-w-7xl space-y-14 px-5 pb-10 pt-4 sm:space-y-28 sm:px-8 sm:pt-16">
        <CollectionCarousel products={collection} />

        {/* Categories */}
        <CategoryBrowser categories={categories} />

        <SpotlightBento products={spotlight} addingId={addingId} onAdd={handleAddToCart} />

        {/* Deals */}
        {deals.length > 0 && (
          <section id="deals" className="scroll-mt-40">
            <SectionHeader title="Top deals" subtitle="Biggest discounts in the store." href="/shop" />
            <ProductRail>
              {deals.map((product) => (
                <div key={product._id} className={railItem}>
                  <ProductCard
                    product={product}
                    adding={addingId === product._id}
                    onAdd={handleAddToCart}
                  />
                </div>
              ))}
            </ProductRail>
          </section>
        )}

        {/* New arrivals */}
        <section id="new-arrivals" className="scroll-mt-28">
          <SectionHeader title="New arrivals" subtitle="The latest additions to the store." href="/shop" />
          {loading ? (
            <ProductGridSkeleton />
          ) : newArrivals.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-surface p-12 text-center text-sm text-slate-500">
              No products yet. Add some from the admin panel.
            </div>
          ) : (
            <ProductRail>
              {newArrivals.map((product) => (
                <div key={product._id} className={railItem}>
                  <ProductCard
                    product={product}
                    adding={addingId === product._id}
                    onAdd={handleAddToCart}
                  />
                </div>
              ))}
            </ProductRail>
          )}
        </section>

        {/* Trust strip */}
        <section>
          <SectionHeader title="Why Lobuy" subtitle="Shopping, the simple way." />
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="edge-glow flex items-center gap-4 rounded-2xl bg-surface p-4 sm:rounded-3xl lg:flex-col lg:px-4 lg:py-8 lg:text-center"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-gold lg:h-14 lg:w-14 lg:rounded-2xl">
                  <Icon className="h-5 w-5 lg:h-7 lg:w-7" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
