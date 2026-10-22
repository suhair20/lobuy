"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiFetch<{ success?: boolean }>("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      if (res.success) {
        toast.success("Category added");
        router.push("/category");
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Package className="h-7 w-7 rounded-md bg-brand-dark p-1 text-brand-cyan" />
        <h2 className="text-xl font-semibold">Add Category</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full rounded-md border p-3"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
          rows={4}
          className="w-full rounded-md border p-3"
        />
        <button
          disabled={isLoading}
          className="rounded-md bg-brand-accent px-6 py-3 font-medium text-white"
        >
          {isLoading ? "Saving..." : "Save Category"}
        </button>
      </form>
    </div>
  );
}
