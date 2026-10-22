"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";
import DeleteModal from "@/components/DeleteModal";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await apiFetch<{ products?: Product[] }>("/api/products");
    setProducts(data.products || []);
  };

  useEffect(() => {
    void load().catch(() => toast.error("Failed to load products"));
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      setLoading(true);
      await apiFetch(`/api/products/${selectedId}`, { method: "DELETE" });
      toast.success("Product deleted");
      setOpenDelete(false);
      await load();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-black text-brand-dark">Products</h1>
        <button
          onClick={() => router.push("/products/add")}
          className="rounded-lg bg-brand-accent px-5 py-2 font-bold text-white"
        >
          + Add Product
        </button>
      </div>
      <div className="overflow-x-auto px-6 py-6">
        <table className="min-w-full overflow-hidden rounded-xl border">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-3">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name}
                </td>
                <td className="p-3 font-semibold">₹{product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/products/edit/${product._id}`)}
                      className="rounded bg-brand-dark px-3 py-1 text-sm text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(product._id);
                        setOpenDelete(true);
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
