"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { categoryIcon } from "@/components/Header";

export default function CategoryBrowser({ categories }: { categories: Category[] }) {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [catProducts, setCatProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    if (!activeCat && categories[0]) setActiveCat(categories[0]._id);
  }, [categories, activeCat]);

  useEffect(() => {
    if (!activeCat || catProducts[activeCat]) return;
    apiFetch<Product[]>(`/api/user/productbycategory/${activeCat}`)
      .then((data) =>
        setCatProducts((prev) => ({
          ...prev,
          [activeCat]: Array.isArray(data) ? data.slice(0, 4) : [],
        }))
      )
      .catch(() => setCatProducts((prev) => ({ ...prev, [activeCat]: [] })));
  }, [activeCat, catProducts]);

  if (categories.length === 0) return null;

  const activeCategory = categories.find((c) => c._id === activeCat);
  const previewProducts = activeCat ? catProducts[activeCat] : undefined;

  return (
    <section>
      <div className="mb-10 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          <LayoutGrid className="h-5 w-5" />
          Shop by category
        </h2>
        <Link
          href="/shop"
          className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
        >
          Shop all →
        </Link>
      </div>

      <div className="grid gap-5 rounded-[1.75rem] bg-surface p-4 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] sm:p-5 md:grid-cols-[260px_1fr] md:gap-6 md:rounded-[2rem] md:p-6">
        {/* Phone: category tabs */}
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto border-b border-neutral-100 px-4 pb-4 sm:-mx-5 sm:px-5 md:hidden">
          {categories.map((cat) => {
            const Icon = categoryIcon(cat.name);
            const active = cat._id === activeCat;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setActiveCat(cat._id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-blue-600 font-semibold text-white"
                    : "bg-neutral-100 text-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Desktop: category list */}
        <ul className="hidden space-y-0.5 border-r border-neutral-100 pr-4 md:block">
          {categories.map((cat) => {
            const Icon = categoryIcon(cat.name);
            const active = cat._id === activeCat;
            return (
              <li key={cat._id}>
                <Link
                  href={`/shop/${cat._id}`}
                  onMouseEnter={() => setActiveCat(cat._id)}
                  onFocus={() => setActiveCat(cat._id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-blue-50 font-semibold text-gold-soft"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{activeCategory?.name}</h3>
            {activeCategory && (
              <Link
                href={`/shop/${activeCategory._id}`}
                className="text-sm font-semibold text-gold hover:text-gold-soft"
              >
                View all →
              </Link>
            )}
          </div>

          {!previewProducts ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : previewProducts.length === 0 ? (
            <p className="py-10 text-sm text-slate-500">No products in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {previewProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  className="group rounded-2xl bg-surface-raised p-2.5 transition-shadow hover:shadow-[0_16px_30px_-22px_rgba(0,0,0,0.4)]"
                >
                  <div className="tile-sunset relative aspect-square overflow-hidden rounded-xl">
                    {p.images?.[0]?.url && (
                      <Image
                        src={p.images[0].url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 45vw, 200px"
                        className="object-contain p-3 transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-800">{p.name}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    ₹{p.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
