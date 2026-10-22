"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Home, Briefcase, Phone, Navigation } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Address } from "@/lib/types";
import AddAddressForm from "@/components/account/AddAddressForm";

export default function ManageAddress() {
  const [mode, setMode] = useState<"list" | "add">("list");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ addresses?: Address[] }>("/api/user/get-address");
      setAddresses(data.addresses || []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "list") void load();
  }, [mode]);

  if (mode === "add") {
    return (
      <div>
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => setMode("list")} className="rounded-full p-2 hover:bg-slate-100">
            <Navigation className="-rotate-90 text-slate-400" size={20} />
          </button>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">
            New <span className="text-gold">Location.</span>
          </h2>
        </div>
        <AddAddressForm onSaved={() => setMode("list")} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold italic uppercase tracking-tighter text-slate-800 md:text-2xl">
            Saved <span className="text-blue-950">Addresses.</span>
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">Manage your delivery locations</p>
        </div>
        <button onClick={() => setMode("add")} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white">
          <Plus size={16} strokeWidth={3} /> Add New Address
        </button>
      </div>

      {isLoading && <p className="py-10 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Locating addresses...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-6 text-center font-bold text-red-600">Failed to load addresses.</p>}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="rounded-[2rem] border border-slate-100 bg-surface p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  {addr.type?.toLowerCase() === "home" ? <Home size={20} /> : <Briefcase size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{addr.type}</span>
                    <h4 className="font-black uppercase tracking-tight text-slate-800">{addr.fullName}</h4>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {addr.addressLine}, {addr.city}, {addr.state} - <span className="font-bold text-slate-900">{addr.pincode}</span>
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-slate-400">
                    <Phone size={14} />
                    <span className="text-xs font-bold tracking-widest">{addr.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading && (
        <div className="rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">No saved addresses found.</p>
        </div>
      )}
    </div>
  );
}
