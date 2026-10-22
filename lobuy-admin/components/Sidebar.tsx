"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Tags,
  ShoppingBag,
  LogOut,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/homepage", label: "Homepage", icon: LayoutTemplate },
  { href: "/category", label: "Categories", icon: Tags },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
];

export default function Sidebar({
  isOpen,
  onNavigate,
}: {
  isOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/10 bg-brand-dark text-white transition-transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <p className="text-lg font-black tracking-wide text-brand-cyan">LOBUY</p>
          <p className="text-[10px] uppercase tracking-widest text-brand-accent">Admin Panel</p>
        </div>
        <button className="lg:hidden" onClick={onNavigate}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-brand-accent/20 text-brand-cyan"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
        className="m-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-red-600 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
