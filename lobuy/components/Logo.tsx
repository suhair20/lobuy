import { useId } from "react";
import Link from "next/link";

/** Lobuy mark: a plum L with an orange shopping bag resting on its corner. */
export function LobuyIcon({ className = "h-10 w-10" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const blue = `lb-blue-${id}`;
  const orange = `lb-orange-${id}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={blue} x1="8" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C77FA2" />
          <stop offset="1" stopColor="#7A2552" />
        </linearGradient>
        <linearGradient id={orange} x1="26" y1="12" x2="56" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>

      <path
        d="M10 12C10 8.68629 12.6863 6 16 6H24C26.2091 6 28 7.79086 28 10V36C28 37.1046 28.8954 38 30 38H48C50.2091 38 52 39.7909 52 42V48C52 51.3137 49.3137 54 46 54H16C12.6863 54 10 51.3137 10 48V12Z"
        fill={`url(#${blue})`}
      />

      <rect x="28" y="18" width="26" height="28" rx="6" fill={`url(#${orange})`} />
      <path
        d="M35 19V14C35 10.6863 37.6863 8 41 8C44.3137 8 47 10.6863 47 14V19"
        stroke="#F97316"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="41" cy="32" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

export default function Logo({
  href = "/",
  compact = false,
  showTagline = false,
}: {
  href?: string;
  compact?: boolean;
  showTagline?: boolean;
}) {
  const content = (
    <span className="flex items-center gap-2">
      <LobuyIcon className="h-8 w-8 sm:h-9 sm:w-9" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-['Times_New_Roman',Times,serif] text-[18px] font-bold uppercase tracking-[0.24em]">Lobuy</span>
          {showTagline && (
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider opacity-60">
              Gadgets marketplace
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Lobuy home" className="shrink-0">
      {content}
    </Link>
  );
}
