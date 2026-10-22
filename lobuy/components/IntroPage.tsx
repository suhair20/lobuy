"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

export default function IntroPage() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grain relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-obsidian">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(212,175,55,0.18),transparent_70%)]" />
      <h1
        className={`lobuy-pop absolute font-display text-2xl font-bold text-titanium md:text-7xl ${
          showText ? "lobuy-pop-show" : ""
        }`}
      >
        <Logo href="" />
      </h1>
    </div>
  );
}
