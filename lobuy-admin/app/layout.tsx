import type { Metadata } from "next";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "LoBuy Admin",
  description: "Admin dashboard for LoBuy gadget store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-gray-900 antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
