import { NextResponse, type NextRequest } from "next/server";
import {
  corsHeaders,
  hasTrustedBrowserOrigin,
  isAllowedOrigin,
  isCsrfExempt,
  isMutatingMethod,
  securityHeaders,
} from "@/lib/security";

const isProd = process.env.NODE_ENV === "production";

function applyHeaders(res: NextResponse, req: NextRequest) {
  const headers = {
    ...securityHeaders(isProd),
    ...(req.nextUrl.pathname.startsWith("/api")
      ? corsHeaders(req.headers.get("origin"))
      : {}),
  };
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();
  const isApi = pathname.startsWith("/api");
  const origin = req.headers.get("origin");

  if (isApi && method === "OPTIONS") {
    if (origin && !isAllowedOrigin(origin)) {
      return applyHeaders(
        NextResponse.json({ message: "CORS: origin not allowed" }, { status: 403 }),
        req
      );
    }
    const res = new NextResponse(null, { status: 204 });
    return applyHeaders(res, req);
  }

  // Block unknown cross-origin callers from reading or writing the API
  if (isApi && origin && !isAllowedOrigin(origin)) {
    return applyHeaders(
      NextResponse.json({ success: false, message: "CORS: origin not allowed" }, { status: 403 }),
      req
    );
  }

  // CSRF: cookie-auth mutations must come from our own site
  // (Razorpay webhook is exempt — it uses HMAC signature verification)
  if (isApi && isMutatingMethod(method) && !isCsrfExempt(pathname)) {
    if (!hasTrustedBrowserOrigin(req)) {
      return applyHeaders(
        NextResponse.json(
          { success: false, message: "Forbidden: untrusted origin" },
          { status: 403 }
        ),
        req
      );
    }
  }

  return applyHeaders(NextResponse.next(), req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
