/**
 * Shared security helpers for the admin app (CORS, CSRF, headers).
 */

const DEV_ORIGINS = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

export function allowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  const list = [...fromEnv];
  if (appUrl) list.push(appUrl.replace(/\/$/, ""));
  if (process.env.NODE_ENV !== "production") list.push(...DEV_ORIGINS);
  return Array.from(new Set(list));
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return allowedOrigins().includes(origin);
}

export function hasTrustedBrowserOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (origin && isAllowedOrigin(origin)) return true;

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      if (isAllowedOrigin(new URL(referer).origin)) return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function isMutatingMethod(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export function securityHeaders(isProd: boolean): Record<string, string> {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  return {
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "X-DNS-Prefetch-Control": "off",
    ...(isProd
      ? { "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload" }
      : {}),
  };
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && isAllowedOrigin(origin) ? origin : null;
  if (!allowed) {
    return { "Access-Control-Allow-Origin": "null", Vary: "Origin" };
  }
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, X-Requested-With, X-CSRF-Token, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function sessionCookieOptions(maxAgeSec = 24 * 60 * 60) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function clearCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}
