import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#1E0C16",
          raised: "#2A1520",
        },
        // Brand plum on a dark theme. Components keep `blue-*` class names; 50–200 are dark plum fills.
        blue: {
          50: "#2A0F1E",
          100: "#3A1529",
          200: "#4E1C37",
          300: "#B5628A",
          400: "#C77FA2",
          500: "#8A2E5C",
          600: "#7A2552",
          700: "#8A2E5C",
          800: "#400D29",
          900: "#2E081D",
          950: "#1A0412",
        },
        // Inverted so existing "dark text / light fill" classes read correctly on dark backgrounds.
        neutral: {
          50: "#1F0D17",
          100: "#2A1621",
          200: "#3A2530",
          300: "#55424C",
          400: "#8C7D85",
          500: "#A39AA0",
          600: "#C9C0C5",
          700: "#DDD6DA",
          800: "#EDE8EB",
          900: "#F7F3F5",
          950: "#FFFFFF",
        },
        slate: {
          50: "#1F0D17",
          100: "#2A1621",
          200: "#3A2530",
          300: "#55424C",
          400: "#8C7D85",
          500: "#A39AA0",
          600: "#C9C0C5",
          700: "#DDD6DA",
          800: "#EDE8EB",
          900: "#F7F3F5",
          950: "#FFFFFF",
        },
        gray: {
          50: "#1F0D17",
          100: "#2A1621",
          200: "#3A2530",
          300: "#55424C",
          400: "#8C7D85",
          500: "#A39AA0",
          600: "#C9C0C5",
          700: "#DDD6DA",
          800: "#EDE8EB",
          900: "#F7F3F5",
          950: "#FFFFFF",
        },
        // Dark-friendly status fills
        red: { 50: "#2E1015", 100: "#45161D" },
        green: { 50: "#0F2418", 100: "#14331F", 700: "#86EFAC" },
        orange: { 50: "#2E1C0E" },
        amber: {
          50: "#2E2210",
          electric: "#D9B98A",
        },
        obsidian: "#12050C",
        charcoal: "#1E0C16",
        espresso: "#1E0C16",
        // Champagne accent for text and highlights
        gold: {
          DEFAULT: "#D9B98A",
          soft: "#E8D3B0",
          deep: "#B8955E",
        },
        copper: {
          DEFAULT: "#7A2552",
          light: "#D9B98A",
          dark: "#400D29",
          ember: "#D9B98A",
        },
        titanium: {
          DEFAULT: "#F2ECEF",
          muted: "#A39AA0",
          dark: "#3A2530",
        },
        emerald: {
          abyss: "#2A0F1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins, system-ui)", "var(--font-inter, system-ui)", "sans-serif"],
        display: ["var(--font-poppins, system-ui)", "var(--font-inter, system-ui)", "sans-serif"],
        body: ["var(--font-poppins, system-ui)", "var(--font-inter, system-ui)", "sans-serif"],
        serif: ["var(--font-playfair, Georgia)", "serif"],
        grotesk: ["var(--font-space-grotesk, system-ui)", "sans-serif"],
        poppins: ["var(--font-poppins, system-ui)", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.18em",
      },
      // Full 1% opacity scale so any /NN modifier resolves
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, (i / 100).toString()])
      ),
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glow-gold": "0 0 24px -4px rgba(176, 141, 87, 0.45)",
        "glow-amber": "0 0 32px -6px rgba(176, 141, 87, 0.35)",
        elevate: "0 24px 60px -24px rgba(0, 0, 0, 0.25)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        liquid: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "spin-y": {
          "0%": { transform: "perspective(900px) rotateY(0deg) scale(1)" },
          "50%": { transform: "perspective(900px) rotateY(180deg) scale(1.06) translateY(-6px)" },
          "100%": { transform: "perspective(900px) rotateY(360deg) scale(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        levitate: {
          "0%, 100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(8px)" },
        },
        sheen: {
          "0%": { transform: "translateX(-140%) skewX(-18deg)" },
          "100%": { transform: "translateX(280%) skewX(-18deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.5" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        "drift-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(1.12)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.4)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        "spin-y": "spin-y 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        slide: "slide 20s linear infinite",
        levitate: "levitate 6s ease-in-out infinite",
        sheen: "sheen 1.1s ease-out",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "drift-glow": "drift-glow 8s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "spin-reverse": "spin-reverse 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
