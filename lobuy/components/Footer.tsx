import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Github,
} from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/site";
import Logo from "@/components/Logo";

const LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop" },
      { label: "Best Sellers", href: "/shop?sort=trending" },
      { label: "Offers & Bundles", href: "/shop" },
      { label: "Trade-In Program", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Lobuy", href: "/contact" },
      { label: "Sustainability", href: "/contact" },
      { label: "Newsroom", href: "/contact" },
      { label: "Careers", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "Track Order", href: "/orders" },
      { label: "Returns & Exchanges", href: "/contact" },
      { label: "Shipping Info", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden rounded-t-[2.5rem] bg-[linear-gradient(180deg,#400D29_0%,#2E081D_55%,#1A0412_100%)] font-body text-white/70">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[#8A2E5C]/30 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
        {/* Brand + newsletter */}
        <div className="grid grid-cols-1 items-center gap-8 border-b border-white/10 pb-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex text-white">
              <Logo />
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Phones, headphones and gadgets. See the price, add to cart, and
              check out when you are ready.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="mb-3 text-sm font-semibold text-white">
              Get new arrivals in your inbox
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-12 w-full rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/40 sm:w-72"
              />
              <button className="h-12 rounded-full bg-gold px-7 text-[12px] font-bold uppercase tracking-[0.12em] text-[#12050C] transition-colors hover:bg-gold-soft">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D898B6]">
                {group.title}
              </h3>
              <ul className="space-y-3.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D898B6]">
              Contact
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#D898B6]" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{SUPPORT_EMAIL}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#D898B6]" />
                <span>{SUPPORT_PHONE}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-[#D898B6]" />
                <span>Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Lobuy Inc. All rights reserved.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-[#12050C]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
