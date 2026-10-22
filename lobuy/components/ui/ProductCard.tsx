"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";

export function discountPercent(product: Product) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

export default function ProductCard({
  product,
  adding = false,
  onAdd,
}: {
  product: Product;
  adding?: boolean;
  onAdd?: (product: Product) => void;
}) {
  const image = product.images?.[0]?.url;
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock > 0 && product.stock <= 5;
  const discount = discountPercent(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-26px_rgba(0,0,0,0.35)]">
      <Link
        href={`/product/${product._id}`}
        className="tile-sunset relative block aspect-square overflow-hidden rounded-[1.25rem]"
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}

        {discount > 0 && !soldOut && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-green-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {discount}% OFF
          </span>
        )}
        {soldOut && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <Link href={`/product/${product._id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-slate-800 hover:text-gold">
            {product.name}
          </h3>
        </Link>

        {product.rating ? (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 font-semibold text-white">
              {product.rating.toFixed(1)}
              <Star className="h-3 w-3 fill-current" />
            </span>
            {product.numReviews ? (
              <span className="text-slate-500">
                ({product.numReviews.toLocaleString()})
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-bold text-slate-900 sm:text-lg">
            ₹{product.price?.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-slate-400 line-through">
                ₹{product.mrp?.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {lowStock && (
          <p className="mt-1 text-xs font-medium text-orange-600">
            Only {product.stock} left
          </p>
        )}

        {onAdd && (
          <div className="mt-auto pt-3">
            <button
              onClick={() => onAdd(product)}
              disabled={adding || soldOut}
              className="btn-metal flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] sm:h-10 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {adding ? "Adding…" : soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
