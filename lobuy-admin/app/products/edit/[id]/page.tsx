"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch, type ApiError } from "@/lib/api";
import type { Category, Product, ProductImage } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiFetch<{ product: Product }>(`/api/products/${id}`),
      apiFetch<{ categories?: Category[] }>("/api/categories"),
    ])
      .then(([productData, catData]) => {
        const p = productData.product;
        setName(p.name);
        setPrice(String(p.price));
        setMrp(p.mrp ? String(p.mrp) : "");
        setStock(String(p.stock));
        setCategory(typeof p.category === "string" ? p.category : p.category?._id || "");
        setDescription(p.description || "");
        setExistingImages(p.images || []);
        setCategories(catData.categories || []);
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const next = [...images];
    next[index] = file;
    setImages(next);
  };

  const handleUpdateProduct = async () => {
    if (!name || !price || !stock || !category) {
      toast.error("Required fields missing");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);
    images.forEach((img, idx) => {
      if (img) {
        formData.append("images", img);
        formData.append("imageIndexes", String(idx));
      }
    });
    setUpdating(true);
    try {
      const res = await apiFetch<{ success?: boolean }>(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.success) {
        toast.success("Product updated");
        router.push("/products");
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
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
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description" className="w-full rounded-md border p-3 md:col-span-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((idx) => (
            <label key={idx} className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed">
              {images[idx] ? (
                <img src={URL.createObjectURL(images[idx] as File)} className="h-full w-full object-cover" alt="" />
              ) : existingImages[idx]?.url ? (
                <img src={existingImages[idx].url} className="h-full w-full object-cover" alt="" />
              ) : (
                <Upload className="text-gray-400" />
              )}
              <input type="file" accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => handleImageChange(e, idx)} />
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleUpdateProduct} disabled={updating} className="mt-6 rounded-md bg-brand-accent px-6 py-3 text-white font-bold">
        {updating ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
}
