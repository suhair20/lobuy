"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ categories?: Category[] }>("/api/categories")
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const next = [...images];
    next[index] = file;
    setImages(next);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !stock || !category || !description) {
      toast.error("All fields are required");
      return;
    }
    if (images.filter(Boolean).length === 0) {
      toast.error("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (mrp) formData.append("mrp", mrp);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    setIsLoading(true);
    try {
      const res = await apiFetch<{ success?: boolean }>("/api/products", {
        method: "POST",
        body: formData,
      });
      if (res.success) {
        toast.success("Product added");
        router.push("/products");
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Package className="h-7 w-7 rounded-md bg-brand-dark p-1 text-brand-cyan" />
        <h2 className="text-xl font-semibold">Add Product</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="w-full rounded-md border p-3" />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Selling price" className="w-full rounded-md border p-3" />
          <input type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="MRP (optional, shows discount)" className="w-full rounded-md border p-3" />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" className="w-full rounded-md border p-3" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border p-3">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full rounded-md border p-3 md:col-span-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <label key={idx} className="relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
              {img ? (
                <img src={URL.createObjectURL(img)} alt="" className="h-full w-full rounded-md object-cover" />
              ) : (
                <>
                  <Upload className="mb-2 h-6 w-6 text-gray-500" />
                  <p className="text-xs text-gray-600">Image {idx + 1}</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, idx)} />
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleAddProduct} disabled={isLoading} className="mt-6 rounded-md bg-brand-accent px-12 py-3 font-medium text-white">
        {isLoading ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
