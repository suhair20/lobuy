import { NextResponse } from "next/server";
import User from "@/lib/models/userModel.js";
import { otpService } from "@/lib/services/otpService.js";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/services/rateLimit";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const wait =
      (await rateLimit(`otp-send:ip:${clientIp()}`, 10, 15 * 60)) ||
      (await rateLimit(`otp-send:${email}`, 3, 10 * 60));
    if (wait) return tooManyRequests(wait);

    await dbConnect();
    const user = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean<any>();
    if (user?.is_blocked) {
      return NextResponse.json(
        { success: false, message: "This account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    await otpService.sendOtp(email);
    return NextResponse.json({ success: true, isNewUser: !user });
  } catch (error) {
    console.error("[auth:request-otp]", error);
    return NextResponse.json({ success: false, message: "Could not send the code. Try again." }, { status: 500 });
  }
}
