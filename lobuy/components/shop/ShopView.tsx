"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Home, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";

export default function ShopView() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!categoryId) return;
    setIsLoading(true);
    apiFetch<Product[]>(`/api/user/productbycategory/${categoryId}`)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [categoryId]);

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

  const title =
    products[0]?.category && typeof products[0].category !== "string"
      ? products[0].category.name
      : "Collection";

  return (
    <div className="grain relative min-h-screen bg-obsidian">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,0,0,0.14),transparent_70%)]" />

      <main className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:py-14">
        <nav className="mb-8 flex items-center gap-2.5 text-titanium-muted">
          <Link href="/" className="transition-colors hover:text-gold">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link href="/shop" className="text-xs transition-colors hover:text-gold">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="text-[10px] uppercase tracking-luxe text-gold">
            Collection
          </span>
        </nav>

        <Reveal className="mb-12">
          <span className="text-[10px] uppercase tracking-luxe text-gold">
            Curated Selection
          </span>
          {isLoading ? (
            <div className="mt-4 h-10 w-64 animate-pulse rounded-lg bg-neutral-200" />
          ) : (
            <h1 className="mt-4 font-display text-4xl font-bold capitalize text-titanium sm:text-5xl">
              {title}
            </h1>
          )}
          {!isLoading && (
            <p className="mt-3 font-body text-sm text-titanium-muted">
              {products.length} device{products.length === 1 ? "" : "s"} available
            </p>
          )}
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass h-[380px] animate-pulse rounded-3xl"
                />
              ))
            : products.map((product, i) => (
                <Reveal key={product._id} delay={(i % 4) * 70}>
                  <ProductCard
                    product={product}
                    adding={addingId === product._id}
                    onAdd={handleAddToCart}
                  />
                </Reveal>
              ))}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="glass hairline rounded-3xl px-8 py-20 text-center">
            <p className="font-display text-lg text-titanium">
              Nothing in this collection yet
            </p>
            <p className="mt-2 font-body text-sm text-titanium-muted">
              Explore the full catalogue instead.
            </p>
            <Link
              href="/shop"
              className="btn-metal mt-8 inline-flex h-12 items-center rounded-xl px-7 text-[12px] font-bold uppercase tracking-[0.12em]"
            >
              Browse all devices
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
