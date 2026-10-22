"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";
import { HOME_SECTIONS, type HomeSection, type Product } from "@/lib/types";

export default function HomepageManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiFetch<{ products?: Product[] }>("/api/products")
      .then((data) => setProducts(data.products || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of products) {
      if (p.is_active === false) continue;
      for (const s of p.homeSections || []) c[s] = (c[s] || 0) + 1;
    }
    return c;
  }, [products]);

  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const patch = async (product: Product, body: Partial<Pick<Product, "homeSections" | "is_active">>) => {
    const key = product._id;
    setSaving(key);
    const before = products;
    setProducts((list) => list.map((p) => (p._id === key ? { ...p, ...body } : p)));
    try {
      await apiFetch(`/api/products/${key}`, { method: "PATCH", body: JSON.stringify(body) });
    } catch (err) {
      setProducts(before);
      toast.error((err as ApiError).data?.message || "Could not save");
    } finally {
      setSaving(null);
    }
  };

  const toggleSection = (product: Product, section: HomeSection) => {
    const current = product.homeSections || [];
    const on = current.includes(section);
    const limit = HOME_SECTIONS.find((s) => s.id === section)!.limit;
    if (!on && (counts[section] || 0) >= limit) {
      toast.info(`Only the first ${limit} will show on the homepage. Untick one to make room.`);
    }
    void patch(product, {
      homeSections: on ? current.filter((s) => s !== section) : [...current, section],
    });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-dark">Homepage</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tick where each product appears on the store homepage. Changes save instantly. A section with
            nothing ticked fills itself automatically (newest products, or biggest discounts for Top deals).
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-lg border px-3 py-2 text-sm md:w-64"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 border-b px-6 py-4 md:grid-cols-3 xl:grid-cols-5">
        {HOME_SECTIONS.map((s) => {
          const n = counts[s.id] || 0;
          return (
            <div key={s.id} className="rounded-xl border bg-gray-50 px-4 py-3">
              <p className="text-sm font-bold text-brand-dark">{s.label}</p>
              <p className="text-xs text-gray-500">{s.hint}</p>
              <p className={`mt-1 text-xs font-semibold ${n > s.limit ? "text-amber-600" : "text-gray-700"}`}>
                {n === 0 ? "Automatic" : `${n} selected`}
                {n > s.limit && ` · only ${s.limit} shown`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto px-6 py-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <table className="min-w-full overflow-hidden rounded-xl border text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">In store</th>
                {HOME_SECTIONS.map((s) => (
                  <th key={s.id} className="p-3 text-center">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const active = product.is_active !== false;
                return (
                  <tr key={product._id} className={`border-t ${saving === product._id ? "opacity-60" : ""}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded bg-gray-100 object-contain"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{product.price} · stock {product.stock}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => void patch(product, { is_active: !active })}
                        className="h-4 w-4 accent-green-600"
                        aria-label={`Show ${product.name} in store`}
                      />
                    </td>
                    {HOME_SECTIONS.map((s) => (
                      <td key={s.id} className="p-3 text-center">
                        <input
                          type="checkbox"
                          disabled={!active}
                          checked={(product.homeSections || []).includes(s.id)}
                          onChange={() => toggleSection(product, s.id)}
                          className="h-4 w-4 accent-brand-accent disabled:opacity-30"
                          aria-label={`${s.label}: ${product.name}`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={2 + HOME_SECTIONS.length} className="p-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
