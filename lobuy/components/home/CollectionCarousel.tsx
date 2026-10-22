"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";

function SideCard({
  product,
  side,
  onClick,
}: {
  product: Product;
  side: "left" | "right";
  onClick: () => void;
}) {
  const image = product.images?.[0]?.url;
  const isLeft = side === "left";
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Previous product" : "Next product"}
      className={`group absolute top-1/2 flex h-[58%] w-[24%] -translate-y-1/2 items-center rounded-[1.75rem] bg-surface ring-1 ring-white/5 transition-colors hover:bg-surface-raised md:h-[64%] md:w-[26%] md:rounded-[3rem] ${
        isLeft ? "-left-[4%] justify-end pr-[4%]" : "-right-[4%] justify-start pl-[4%]"
      }`}
    >
      {image && (
        <span className="relative block aspect-square w-[62%] opacity-70 transition-opacity group-hover:opacity-100">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="200px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </span>
      )}
    </button>
  );
}

export default function CollectionCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const total = products.length;
  if (total === 0) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const current = products[index];
  const prev = products[(index - 1 + total) % total];
  const next = products[(index + 1) % total];
  const image = current.images?.[0]?.url;
  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-800 transition-colors hover:border-gold hover:text-gold sm:h-11 sm:w-11";

  return (
    <section id="home-next" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-[11px]">
            Curated picks
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-4xl">
            Lobuy Collection
          </h2>
        </div>

        {total > 1 && (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="mr-1 hidden text-xs font-semibold tabular-nums text-neutral-500 sm:inline">
              <span className="text-neutral-900">{String(index + 1).padStart(2, "0")}</span>
              {" / "}
              {String(total).padStart(2, "0")}
            </span>
            <button onClick={() => go(index - 1)} aria-label="Previous product" className={arrowClass}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Next product" className={arrowClass}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative mx-auto mt-6 h-[280px] max-w-7xl sm:mt-8 sm:h-[380px] md:h-[420px]">
        {total > 1 && <SideCard product={prev} side="left" onClick={() => go(index - 1)} />}
        {total > 1 && <SideCard product={next} side="right" onClick={() => go(index + 1)} />}

        <Link
          key={current._id}
          href={`/product/${current._id}`}
          className="absolute left-1/2 top-1/2 aspect-square w-[52%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 animate-[fadeUp_0.5s_ease-out] md:w-[36%] md:max-w-[420px]"
          aria-label={current.name}
        >
          <div className="absolute inset-x-[20%] bottom-[4%] h-5 rounded-[50%] bg-black/40 blur-xl" />
          {image && (
            <Image
              src={image}
              alt={current.name}
              fill
              sizes="(max-width: 768px) 60vw, 440px"
              quality={95}
              className="object-contain p-[6%]"
            />
          )}
        </Link>
      </div>

      <div key={current._id} className="mt-4 animate-[fadeUp_0.5s_ease-out] text-center">
        <p className="line-clamp-1 text-base font-semibold capitalize text-neutral-900 sm:text-lg">
          {current.name}
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-4">
          <span className="text-lg font-bold text-neutral-900">
            ₹{current.price?.toLocaleString()}
          </span>
          <Link
            href={`/product/${current._id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline"
          >
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {total > 1 && (
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-1.5">
          {products.map((p, i) => (
            <button
              key={p._id}
              onClick={() => go(i)}
              aria-label={`Show product ${i + 1}`}
              aria-current={i === index}
              className="group flex h-6 flex-1 items-center"
            >
              <span
                className={`h-0.5 w-full rounded-full transition-colors ${
                  i === index ? "bg-gold" : "bg-white/15 group-hover:bg-white/35"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
