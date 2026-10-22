"use client";

import { LogOut, X } from "lucide-react";

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <LogOut className="text-red-500" size={30} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Wait! Logging out?</h3>
          <p className="mt-2 text-gray-500">Are you sure you want to log out of your Lobuy account?</p>
          <div className="mt-8 grid w-full grid-cols-2 gap-3">
            <button onClick={onClose} disabled={isLoading} className="rounded-xl bg-gray-100 py-3 font-semibold text-gray-700">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading} className="rounded-xl bg-red-500 py-3 font-semibold text-white">
              {isLoading ? "Leaving..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
