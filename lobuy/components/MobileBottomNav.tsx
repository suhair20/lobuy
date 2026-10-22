"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Package, ShoppingCart, User, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/lib/types";
import { categoryIcon } from "@/components/Header";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!sheetOpen || categories.length) return;
    apiFetch<Category[]>("/api/user/categories")
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, [sheetOpen, categories.length]);

  useEffect(() => setSheetOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const items = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    { href: "/orders", label: "Orders", icon: Package, active: pathname.startsWith("/orders") },
    { href: "/cart", label: "Cart", icon: ShoppingCart, active: pathname === "/cart", badge: count },
    {
      href: isAuthenticated ? "/profile" : "/login",
      label: "Account",
      icon: User,
      active: pathname === "/profile" || pathname === "/login",
    },
  ];

  const itemClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
      active ? "text-gold" : "text-slate-500"
    }`;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Main"
      >
        <div className="flex h-16">
          <Link href={items[0].href} className={itemClass(items[0].active)}>
            <Home className="h-6 w-6" />
            Home
          </Link>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={itemClass(sheetOpen || pathname.startsWith("/shop"))}
          >
            <LayoutGrid className="h-6 w-6" />
            Categories
          </button>

          {items.slice(1).map(({ href, label, icon: Icon, active, badge }) => (
            <Link key={label} href={href} className={itemClass(active)}>
              <span className="relative">
                <Icon className="h-6 w-6" />
                {badge ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Categories bottom sheet */}
      <div className={`fixed inset-0 z-[60] md:hidden ${sheetOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setSheetOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            sheetOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[75vh] overflow-hidden rounded-t-3xl bg-surface transition-transform duration-300 ${
            sheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">Shop by category</h2>
            <button
              onClick={() => setSheetOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(75vh-64px)] overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link
              href="/shop"
              className="mb-3 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white"
            >
              Shop all products
              <ChevronRight className="h-4 w-4" />
            </Link>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = categoryIcon(cat.name);
                return (
                  <Link
                    key={cat._id}
                    href={`/shop/${cat._id}`}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 text-center"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="line-clamp-2 text-xs font-medium text-slate-800">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
