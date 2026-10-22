import { headers } from "next/headers";
import RateLimit from "@/lib/models/rateLimitModel.js";
import dbConnect from "@/lib/db";

export function clientIp() {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Fixed-window counter stored in MongoDB (expired windows are removed by a TTL
 * index). Returns the seconds to wait when the limit is exceeded, or 0 when the
 * request may proceed. Fails open so a database hiccup doesn't lock everyone out.
 */
export async function rateLimit(key: string, limit: number, windowSec: number) {
  try {
    await dbConnect();
    const now = new Date();
    const fresh = new Date(now.getTime() + windowSec * 1000);
    const live = { $gt: ["$expiresAt", now] };

    const res: any = await RateLimit.collection.findOneAndUpdate(
      { _id: key as any },
      [
        {
          $set: {
            count: { $cond: [live, { $add: ["$count", 1] }, 1] },
            expiresAt: { $cond: [live, "$expiresAt", fresh] },
          },
        },
      ],
      { upsert: true, returnDocument: "after" }
    );
    const doc = res && "value" in res && "ok" in res ? res.value : res;
    if (!doc || doc.count <= limit) return 0;
    return Math.max(1, Math.ceil((new Date(doc.expiresAt).getTime() - now.getTime()) / 1000));
  } catch (error) {
    console.error("[rateLimit]", error);
    return 0;
  }
}

export async function resetRateLimit(key: string) {
  try {
    await dbConnect();
    await RateLimit.deleteOne({ _id: key });
  } catch {
    // best effort
  }
}

export function tooManyRequests(retryAfter: number) {
  const minutes = Math.ceil(retryAfter / 60);
  return Response.json(
    {
      success: false,
      message: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
