import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="overflow-x-clip bg-obsidian">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} ${poppins.variable} flex min-h-screen flex-col overflow-x-clip font-sans antialiased text-titanium`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
