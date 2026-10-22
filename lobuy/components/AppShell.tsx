"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroPage from "@/components/IntroPage";
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);
  const hideChrome =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/checkout" ||
    pathname.startsWith("/order-success");

  useEffect(() => {
    const seen = sessionStorage.getItem("lobuy_intro_seen");
    if (seen) return;
    setShowIntro(true);
    const timer = setTimeout(() => {
      sessionStorage.setItem("lobuy_intro_seen", "1");
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return <IntroPage />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="bottom-center" />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        {!hideChrome && <Header minimal={pathname === "/checkout"} />}
        <main className="min-w-0 flex-grow">{children}</main>
        {!hideChrome && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}
