"use client";

import { Menu, Package } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { admin } = useAdminAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:h-16 sm:px-6 lg:pl-72">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 p-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-brand-dark p-2">
            <Package className="h-5 w-5 text-brand-cyan" />
          </div>
          <div>
            <p className="text-sm font-black text-brand-dark sm:text-base">LoBuy Admin</p>
            <p className="hidden text-xs text-gray-500 sm:block">Manage your gadget store</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-brand-dark">{admin?.email || "Admin"}</p>
        <p className="text-xs text-brand-accent">Administrator</p>
      </div>
    </header>
  );
}
