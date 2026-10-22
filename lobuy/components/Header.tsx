"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Logo from "@/components/Logo";
import {
  Search,
  User,
  ShoppingBag,
  Package,
  LogOut,
  ShieldCheck,
  Headphones,
  Smartphone,
  Watch,
  Laptop,
  Cable,
  Sparkles,
  X,
} from "lucide-react";

const ICON_RULES: [string, typeof Smartphone][] = [
  ["phone", Smartphone],
  ["mobile", Smartphone],
  ["audio", Headphones],
  ["headphone", Headphones],
  ["earbud", Headphones],
  ["earphone", Headphones],
  ["watch", Watch],
  ["wearable", Watch],
  ["laptop", Laptop],
  ["cable", Cable],
  ["charger", Cable],
  ["accessor", Cable],
];

export function categoryIcon(name: string) {
  const lower = name.toLowerCase();
  return ICON_RULES.find(([key]) => lower.includes(key))?.[1] ?? Sparkles;
}

export default function Header({ minimal = false }: { minimal?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setAccountOpen(false);
        setSearchOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  };

  const bar = `sticky top-0 z-50 w-full bg-[#14060E]/85 text-neutral-900 backdrop-blur-xl transition-shadow duration-300 ${
    scrolled || searchOpen
      ? "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] border-b border-white/5"
      : ""
  }`;

  if (minimal) {
    return (
      <header className={bar}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo showTagline={false} />
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Secure checkout
          </span>
        </div>
      </header>
    );
  }

  const firstName = user?.firstName || user?.email?.split("@")[0];
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/#new-arrivals", label: "New arrivals" },
    { href: "/#spotlight", label: "Spotlight" },
    { href: "/orders", label: "Track order" },
  ];
  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10";

  return (
    <header className={bar}>
          <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 md:h-20 md:grid-cols-[1fr_auto_1fr]">
            <Logo showTagline={false} />

            <nav className="hidden items-center gap-5 md:flex lg:gap-8" aria-label="Main">
              {navLinks.map((link) => {
                const active = link.href.includes("#")
                  ? false
                  : link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] transition-colors lg:text-[11px] lg:tracking-[0.2em] ${
                      active
                        ? "font-semibold text-gold"
                        : "text-neutral-600 hover:text-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={searchOpen ? "Close search" : "Search"}
                aria-expanded={searchOpen}
                className={iconBtn}
              >
                {searchOpen ? (
                  <X className="h-[18px] w-[18px]" />
                ) : (
                  <Search className="h-[18px] w-[18px]" />
                )}
              </button>

              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-label="Account menu"
                    className={iconBtn}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                      {firstName?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </button>
                ) : (
                  <Link href="/login" aria-label="Sign in" className={iconBtn}>
                    <User className="h-[18px] w-[18px]" />
                  </Link>
                )}

                {accountOpen && isAuthenticated && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-neutral-200 bg-surface p-1.5 text-neutral-800 shadow-xl">
                    <p className="truncate px-3 py-2 text-xs text-neutral-500">
                      {user?.email}
                    </p>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-neutral-100"
                    >
                      <User className="h-4 w-4" /> My profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-neutral-100"
                    >
                      <Package className="h-4 w-4" /> My orders
                    </Link>
                    <button
                      onClick={async () => {
                        setAccountOpen(false);
                        await logout();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                aria-label={`Cart, ${count} items`}
                className="ml-1 inline-flex h-9 items-center gap-2 rounded-full bg-blue-600 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_-10px_rgba(64,13,41,0.9)] transition-colors hover:bg-blue-700"
              >
                <ShoppingBag className="h-4 w-4" />
                {count > 0 ? (
                  count > 99 ? (
                    "99+"
                  ) : (
                    count
                  )
                ) : (
                  <span className="hidden sm:inline">Cart</span>
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <form
              onSubmit={submitSearch}
              className="mx-auto max-w-7xl px-5 pb-4 sm:px-8"
            >
              <div className="mx-auto flex h-11 max-w-lg items-center gap-2 rounded-full border border-neutral-300 bg-surface pl-4 pr-1 focus-within:border-gold focus-within:ring-4 focus-within:ring-blue-100">
                <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                <input
                  ref={searchRef}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search gadgets…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
                <button
                  type="submit"
                  className="h-9 rounded-full bg-blue-600 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>
          )}
    </header>
  );
}
