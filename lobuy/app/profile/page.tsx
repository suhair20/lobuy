"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Heart, Ticket, HelpCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";
import PersonalInformation from "@/components/account/PersonalInformation";
import ManageAddress from "@/components/account/ManageAddress";
import LogoutModal from "@/components/account/LogoutModal";

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileView />
    </Protected>
  );
}

function ProfileView() {
  const { logout } = useAuth();
  const router = useRouter();
  const [mobilePage, setMobilePage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (window.innerWidth < 768) setMobilePage(menu);
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-16">
        <div className="mb-10 grid grid-cols-2 gap-4 md:flex md:justify-center md:gap-8">
          <Link href="/orders" className="w-full md:w-auto">
            <button className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-surface p-6 shadow-sm hover:border-blue-500 hover:bg-blue-50 md:flex-row md:p-8">
              <ShoppingBag className="h-6 w-6 text-gold" />
              <span className="text-sm font-bold uppercase text-slate-700">Orders</span>
            </button>
          </Link>
          <button className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-surface p-6 shadow-sm md:w-auto md:flex-row md:p-8">
            <Heart className="h-6 w-6 text-pink-600" />
            <span className="text-sm font-bold uppercase text-slate-700">Wishlist</span>
          </button>
          <button className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-surface p-6 shadow-sm md:w-auto md:flex-row md:p-8">
            <Ticket className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-bold uppercase text-slate-700">Coupons</span>
          </button>
          <button className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-surface p-6 shadow-sm md:w-auto md:flex-row md:p-8">
            <HelpCircle className="h-6 w-6 text-green-600" />
            <span className="text-sm font-bold uppercase text-slate-700">Help Center</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-surface shadow-xl">
          <div className="md:hidden">
            {!mobilePage && (
              <div className="space-y-6 p-6">
                <div className="mb-4 flex items-center gap-2 text-gold">
                  <User size={18} strokeWidth={3} />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Account Settings</p>
                </div>
                <div onClick={() => handleMenuClick("profile")} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 font-bold text-slate-700">
                  Profile Information <ChevronRight size={16} />
                </div>
                <div onClick={() => handleMenuClick("address")} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 font-bold text-slate-700">
                  Manage Address <ChevronRight size={16} />
                </div>
                <div onClick={() => setIsModalOpen(true)} className="flex cursor-pointer items-center gap-2 border-t pt-6 text-xs font-black uppercase tracking-widest text-red-500">
                  <LogOut size={18} /> Logout
                </div>
              </div>
            )}
            {mobilePage === "profile" && (
              <div>
                <button className="flex items-center gap-2 p-6 font-bold text-gold" onClick={() => setMobilePage(null)}>
                  <ChevronLeft size={20} /> Back
                </button>
                <div className="p-6 pt-0"><PersonalInformation /></div>
              </div>
            )}
            {mobilePage === "address" && (
              <div>
                <button className="flex items-center gap-2 p-6 font-bold text-gold" onClick={() => setMobilePage(null)}>
                  <ChevronLeft size={20} /> Back
                </button>
                <div className="p-6 pt-0"><ManageAddress /></div>
              </div>
            )}
          </div>

          <div className="hidden min-h-[600px] md:flex">
            <div className="w-80 border-r border-slate-100 bg-slate-50/50 p-8">
              <div className="mb-6 flex items-center gap-2 text-gold">
                <User size={18} strokeWidth={3} />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Account Settings</p>
              </div>
              <div className="mb-8 space-y-2">
                <button onClick={() => handleMenuClick("profile")} className={`w-full rounded-xl px-4 py-3 text-left font-bold ${activeMenu === "profile" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-surface"}`}>
                  Profile Information
                </button>
                <button onClick={() => handleMenuClick("address")} className={`w-full rounded-xl px-4 py-3 text-left font-bold ${activeMenu === "address" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-surface"}`}>
                  Manage Address
                </button>
              </div>
              <div onClick={() => setIsModalOpen(true)} className="flex cursor-pointer items-center gap-2 border-t pt-6 text-xs font-black uppercase tracking-widest text-red-500">
                <LogOut size={18} /> Logout
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10">
              {activeMenu === "profile" && <PersonalInformation />}
              {activeMenu === "address" && <ManageAddress />}
            </div>
          </div>
        </div>
      </div>
      <LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmLogout} isLoading={isLoading} />
    </div>
  );
}
