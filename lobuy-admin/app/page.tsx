"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tags, Users, ShoppingBag, IndianRupee } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/types";

type Stats = {
  products: number;
  categories: number;
  users: number;
  orders: number;
  sales: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ stats: Stats; recentProducts: Product[] }>("/api/stats")
      .then((data) => {
        setStats(data.stats);
        setRecentProducts(data.recentProducts || []);
      })
      .catch(() => setStats({ products: 0, categories: 0, users: 0, orders: 0, sales: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Orders", value: stats?.orders ?? 0, icon: ShoppingBag, href: "/orders" },
    { title: "Sales", value: `₹${(stats?.sales ?? 0).toLocaleString()}`, icon: IndianRupee, href: "/orders" },
    { title: "Users", value: stats?.users ?? 0, icon: Users, href: "/" },
    { title: "Products", value: stats?.products ?? 0, icon: Package, href: "/products" },
    { title: "Categories", value: stats?.categories ?? 0, icon: Tags, href: "/category" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-brand-dark">Dashboard</h1>
          <p className="text-sm text-gray-500">Separate admin app for LoBuy store management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products/add" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-white">
            + Add Product
          </Link>
          <Link href="/category/add" className="rounded-lg border border-brand-dark px-4 py-2 text-sm font-bold text-brand-dark">
            + Add Category
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-dark/5 text-brand-accent">
              <card.icon className="h-5 w-5" />
            </div>
            <h4 className="text-sm text-gray-500">{card.title}</h4>
            <p className="mt-1 text-2xl font-black text-brand-dark">{loading ? "..." : card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Products</h3>
          <Link href="/products" className="text-sm font-bold text-brand-accent">View all</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600">
                <th className="border-b p-3">Product</th>
                <th className="border-b p-3">Category</th>
                <th className="border-b p-3">Price</th>
                <th className="border-b p-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!loading && recentProducts.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-gray-500">No products yet</td></tr>
              )}
              {recentProducts.map((p) => (
                <tr key={p._id}>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-600">{typeof p.category === "string" ? p.category : p.category?.name || "-"}</td>
                  <td className="p-3 font-semibold">₹{Number(p.price).toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
