"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingCart, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import Reveal from "@/components/ui/Reveal";

type Props = {
  products: Product[];
  addingId: string | null;
  onAdd: (product: Product) => void;
};

const img = (p?: Product) => p?.images?.[0]?.url;
const price = (p: Product) => `₹${p.price?.toLocaleString()}`;

function FeatureTile({ product, addingId, onAdd }: { product: Product } & Omit<Props, "products">) {
  const soldOut = product.stock === 0;
  return (
    <div className="group relative isolate flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] bg-[radial-gradient(120%_90%_at_70%_30%,#5A1A3C_0%,#2A0F1E_55%,#16060F_100%)] p-6 ring-1 ring-gold/20 sm:col-span-2 sm:p-8 lg:col-span-2 lg:row-span-2 lg:min-h-0">
      <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 animate-drift-glow rounded-full bg-[#B5628A]/25 blur-3xl" />
      <span className="absolute -right-2 -top-8 -z-10 select-none font-['Times_New_Roman',Times,serif] text-[9rem] font-bold leading-none text-white/[0.04] sm:text-[12rem]">
        01
      </span>

      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
        <Sparkles className="h-3 w-3" /> Product of the week
      </p>

      <Link
        href={`/product/${product._id}`}
        className="relative mx-auto my-4 block aspect-square w-[78%] max-w-[360px] flex-1"
      >
        <div className="absolute inset-x-[22%] bottom-[6%] h-6 rounded-[50%] bg-black/50 blur-xl" />
        {img(product) && (
          <Image
            src={img(product)!}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 80vw, 420px"
            quality={95}
            className="animate-levitate object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-['Times_New_Roman',Times,serif] text-3xl font-bold capitalize text-white sm:text-4xl">
            {product.name}
          </h3>
          <p className="mt-1 text-xl font-bold text-gold">{price(product)}</p>
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={soldOut || addingId === product._id}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#12050C] transition-colors hover:bg-gold-soft disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {addingId === product._id ? "Adding…" : soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function WideTile({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative flex min-h-[200px] items-center gap-4 overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-white/5 transition-colors hover:bg-surface-raised sm:col-span-2"
    >
      <div className="relative z-10 min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
          {String(index).padStart(2, "0")} · Trending
        </p>
        <h3 className="mt-2 line-clamp-2 text-xl font-bold capitalize text-neutral-900 sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gold">
          {price(product)}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </p>
      </div>
      <div className="relative aspect-square w-[42%] max-w-[180px] shrink-0">
        <div className="absolute inset-[12%] rounded-full bg-[#7A2552]/30 blur-2xl transition-opacity group-hover:opacity-100" />
        {img(product) && (
          <Image
            src={img(product)!}
            alt={product.name}
            fill
            sizes="200px"
            className="object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
          />
        )}
      </div>
    </Link>
  );
}

function SmallTile({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-[2rem] bg-surface p-5 ring-1 ring-white/5 transition-colors hover:bg-surface-raised"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {String(index).padStart(2, "0")}
      </p>
      <div className="relative mx-auto my-2 min-h-0 w-[70%] flex-1">
        {img(product) && (
          <Image
            src={img(product)!}
            alt={product.name}
            fill
            sizes="180px"
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <p className="line-clamp-1 text-sm font-semibold capitalize text-neutral-900">{product.name}</p>
      <p className="text-sm font-bold text-gold">{price(product)}</p>
    </Link>
  );
}

function ExploreTile() {
  return (
    <Link
      href="/shop"
      className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#E8D3B0_0%,#D9B98A_55%,#B8955E_100%)] p-5 text-[#12050C]"
    >
      <span className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-[18px] border-[#12050C]/10 transition-transform duration-700 group-hover:scale-125" />
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#12050C]/60">The full store</p>
      <div>
        <p className="font-['Times_New_Roman',Times,serif] text-2xl font-bold leading-[0.95] sm:text-3xl">
          Explore
          <br />
          everything
        </p>
        <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#12050C] text-gold transition-transform group-hover:rotate-45">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}

export default function SpotlightBento({ products, addingId, onAdd }: Props) {
  if (products.length === 0) return null;
  const [feature, wide, small] = products;

  return (
    <section id="spotlight" className="scroll-mt-28">
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-[11px]">
          Handpicked for you
        </p>
        <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          The Spotlight
        </h2>
      </div>

      <Reveal className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2">
        <FeatureTile product={feature} addingId={addingId} onAdd={onAdd} />
        {wide && <WideTile product={wide} index={2} />}
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:gap-4 lg:col-span-2">
          {small ? <SmallTile product={small} index={3} /> : <div />}
          <ExploreTile />
        </div>
      </Reveal>
    </section>
  );
}
