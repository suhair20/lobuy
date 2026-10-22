"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    const data = await apiFetch<{ categories?: Category[] }>("/api/categories");
    setCategories(data.categories || []);
  };

  useEffect(() => {
    void load().catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await apiFetch(`/api/categories/${id}`, { method: "PATCH" });
      toast.success("Category status updated");
      await load();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to update category");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-black text-brand-dark">Categories</h1>
        <button
          onClick={() => router.push("/category/add")}
          className="rounded-lg bg-brand-accent px-5 py-2 font-bold text-white"
        >
          + Add Category
        </button>
      </div>
      <div className="overflow-x-auto px-6 py-6">
        <table className="min-w-full overflow-hidden rounded-xl border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="p-4 font-bold">{cat.name}</td>
                <td className="p-4 text-gray-600">{cat.description}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      cat.is_list ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cat.is_list ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggle(cat._id)}
                    className="rounded-md bg-brand-dark px-3 py-1 text-sm text-white"
                  >
                    {cat.is_list ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
