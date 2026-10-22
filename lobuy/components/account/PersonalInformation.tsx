"use client";

import { useState } from "react";
import { Edit3, Save, X, Mail, Phone, ShieldCheck } from "lucide-react";

export default function PersonalInformation() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold italic uppercase tracking-tighter text-slate-800 md:text-2xl">
            Personal <span className="text-blue-950">Details.</span>
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">Manage your identity and contact info</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold ${isEditing ? "bg-slate-100 text-slate-600" : "bg-blue-600 text-white"}`}
        >
          {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">First Name</label>
          <input disabled={!isEditing} className={`w-full rounded-2xl border p-4 font-bold ${isEditing ? "bg-surface border-blue-200" : "bg-slate-50 border-transparent text-slate-500"}`} defaultValue={formData.firstName} />
        </div>
        <div className="space-y-2">
          <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Name</label>
          <input disabled={!isEditing} className={`w-full rounded-2xl border p-4 font-bold ${isEditing ? "bg-surface border-blue-200" : "bg-slate-50 border-transparent text-slate-500"}`} defaultValue={formData.lastName} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="rounded-lg bg-blue-50 p-2 text-gold"><Mail size={18} /></div>
            <h3 className="font-bold uppercase tracking-tight">Email Address</h3>
          </div>
          <input disabled className="w-full cursor-not-allowed rounded-2xl border-transparent bg-slate-50 p-4 italic text-slate-400" value={formData.email} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="rounded-lg bg-green-50 p-2 text-green-600"><Phone size={18} /></div>
            <h3 className="font-bold uppercase tracking-tight">Phone Number</h3>
          </div>
          <input disabled={!isEditing} className={`w-full rounded-2xl border p-4 font-bold ${isEditing ? "bg-surface border-blue-200" : "bg-slate-50 border-transparent"}`} defaultValue={formData.phone} />
        </div>
      </div>

      {isEditing && (
        <button className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-black px-12 py-4 text-xs font-black uppercase tracking-[0.2em] text-white">
          <Save size={18} /> Save Changes
        </button>
      )}
    </div>
  );
}
