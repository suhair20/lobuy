"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}
