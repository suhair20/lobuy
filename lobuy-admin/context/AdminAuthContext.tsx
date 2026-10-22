"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

type AdminAuthContextValue = {
  admin: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAdmin: (admin: User | null) => void;
  refreshAdmin: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    try {
      const data = await apiFetch<{ user?: User }>("/api/auth/session");
      const next = data.user ?? null;
      setAdmin(next);
      return next;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAdmin();
  }, [refreshAdmin]);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      isAuthenticated: Boolean(admin),
      setAdmin,
      refreshAdmin,
      logout,
    }),
    [admin, loading, refreshAdmin, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}
