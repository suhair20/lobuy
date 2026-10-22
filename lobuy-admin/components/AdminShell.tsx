"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname === "/login";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLogin && !loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLogin, loading, router]);

  if (isLogin) return <>{children}</>;

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Checking admin session...
      </div>
    );
  }

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-h-screen bg-[#fafafa] pt-14 sm:pt-16 lg:pl-64">
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">{children}</div>
      </main>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ToastContainer position="top-right" autoClose={2500} />
      <ShellInner>{children}</ShellInner>
    </AdminAuthProvider>
  );
}
