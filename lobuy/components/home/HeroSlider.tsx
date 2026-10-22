"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/components/ui/ProductCard";

const AUTOPLAY_MS = 3000;

/** Crop transparent padding so every product's base lands on the pedestal surface. */
function trimTransparentEdges(url: string) {
  if (!url.includes("res.cloudinary.com") || url.includes("e_trim")) return url;
  return url.replace("/upload/", "/upload/e_trim/");
}

function Pedestal() {
  return (
    <div className="relative mx-auto h-[110px] w-full sm:h-[140px]" aria-hidden="true">
      <div className="absolute inset-x-0 top-[22px] bottom-0 rounded-b-[50%_28px] bg-[linear-gradient(90deg,#2E081D_0%,#6B1F47_35%,#4E1C37_65%,#24061A_100%)] shadow-[0_40px_70px_-24px_rgba(138,46,92,0.55)] sm:top-[28px]" />
      <div className="absolute inset-x-0 top-0 h-11 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_35%,#B5628A_0%,#7A2552_50%,#4E1C37_100%)] shadow-[inset_0_-6px_12px_rgba(0,0,0,0.3)] ring-1 ring-white/15 sm:h-14" />
    </div>
  );
}

export default function HeroSlider({
  products,
  loading,
  addingId,
  onAdd,
}: {
  products: Product[];
  loading: boolean;
  addingId: string | null;
  onAdd: (product: Product) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const startSpin = useCallback(() => setSpinning(true), []);
  const total = products.length;

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (paused || total < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    setSpinning(false);
  }, [index]);

  const active = products[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="New arrivals"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_45%_42%_at_50%_45%,rgba(138,46,92,0.45)_0%,rgba(138,46,92,0)_70%)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      {/* Silk sheen */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-[420px] w-[720px] -rotate-12 rounded-full bg-[#7A2552]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 -z-10 h-[360px] w-[620px] rotate-12 rounded-full bg-[#D9B98A]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 pt-2 sm:px-8 md:pt-0">
        {/* Wordmark */}
        <h1 className="select-none text-center font-['Times_New_Roman',Times,serif] text-[clamp(3.6rem,min(19vw,22vh),15.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.02em] text-[rgba(255,255,255,0.07)]">
          Lobuy
        </h1>
        {/* Product on pedestal */}
        <div className="relative mx-auto -mt-[min(9vw,7vh)] w-[min(88%,52vh)] max-w-[400px] sm:max-w-[480px] md:-mt-[min(7rem,9vh)] md:w-[min(48%,58vh)] md:max-w-[600px]">
          <div className="relative z-10 mx-auto aspect-square w-[78%]">
            {/* Contact shadow where the product meets the pedestal surface */}
            <div className="pointer-events-none absolute -bottom-1 left-1/2 h-4 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-md" />
            <div className="pointer-events-none absolute -bottom-0.5 left-1/2 h-2 w-[45%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-[3px]" />
            {loading ? (
              <div className="absolute inset-[18%] animate-pulse rounded-full bg-neutral-200" />
            ) : (
              products.map((p, i) => {
                const image = p.images?.[0]?.url;
                const isActive = i === index;
                return (
                  <div
                    key={p._id}
                    aria-hidden={!isActive}
                    onMouseEnter={isActive ? startSpin : undefined}
                    onPointerDown={isActive ? startSpin : undefined}
                    className={`absolute inset-0 cursor-pointer select-none transition-[opacity,transform] duration-500 ease-out ${
                      isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    {image && (
                      <div
                        onAnimationEnd={() => setSpinning(false)}
                        className={`absolute inset-0 ${
                          isActive && spinning ? "hero-spin" : ""
                        }`}
                      >
                        <Image
                          src={trimTransparentEdges(image)}
                          alt={p.name}
                          fill
                          draggable={false}
                          sizes="(max-width: 768px) 90vw, 640px"
                          quality={95}
                          priority={i === 0}
                          loading={i === 0 ? undefined : "eager"}
                          className="object-contain object-bottom drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)]"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="relative mx-auto -mt-[22px] w-[80%] sm:-mt-[28px]">
            <Pedestal />
          </div>
        </div>

        {/* Bottom row */}
        <div className="pointer-events-none relative mt-2 grid grid-cols-[1fr_auto] items-end gap-4 pb-8 md:-mt-28 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:pb-10">
          <div className="pointer-events-auto min-h-[124px] min-w-0 max-w-xs text-left">
            {active && (
              <div key={active._id} className="animate-[fadeUp_0.6s_ease-out]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  New arrival
                </p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-900">
                  {active.name}
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-bold text-neutral-900">
                    ₹{active.price?.toLocaleString()}
                  </span>
                  {discountPercent(active) > 0 && (
                    <>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{active.mrp?.toLocaleString()}
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        {discountPercent(active)}% off
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onAdd(active)}
                    disabled={active.stock === 0 || addingId === active._id}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-blue-600 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_20px_-10px_rgba(64,13,41,0.8)] transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {active.stock === 0 ? "Sold out" : addingId === active._id ? "Adding…" : "Add to cart"}
                  </button>
                  <Link
                    href={`/product/${active._id}`}
                    className="inline-flex h-10 items-center gap-1 rounded-full border border-neutral-300 bg-surface px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-900 transition-colors hover:border-gold hover:text-gold"
                  >
                    View <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
            {!loading && total === 0 && (
              <p className="text-sm text-neutral-500">New arrivals are on the way.</p>
            )}
          </div>

          <a
            href="#home-next"
            aria-label="Scroll to content"
            className="pointer-events-auto mx-auto hidden h-7 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white/5 text-neutral-700 backdrop-blur transition-colors hover:border-neutral-900 md:flex"
          >
            <ChevronDown className="h-4 w-4" />
          </a>

          {total > 1 && (
            <div className="pointer-events-auto flex flex-col items-end gap-2 text-xs font-semibold tabular-nums text-neutral-600 md:flex-row md:items-center md:justify-end md:gap-3">
              {products.map((p, i) => (
                <button
                  key={p._id}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`flex items-center gap-3 transition-colors ${
                    i === index ? "text-gold" : "hover:text-neutral-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                  {i === index && <span className="h-0.5 w-5 rounded-full bg-gold md:w-10" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
