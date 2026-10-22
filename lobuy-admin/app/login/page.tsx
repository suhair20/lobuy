"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Cpu } from "lucide-react";
import { apiFetch, type ApiError } from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { User } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAdmin } = useAdminAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, Password: password }),
      });
      setAdmin(data.user);
      router.push("/");
      router.refresh();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-accent/20 bg-white p-6 shadow-xl sm:p-8">
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark text-brand-cyan">
              <Cpu className="h-6 w-6" />
            </div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-brand-dark">
              LoBuy Admin
            </h1>
            <p className="text-gray-500">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  placeholder="admin@lobuy.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-brand-accent py-3 font-bold text-white hover:bg-[#c000cc] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
