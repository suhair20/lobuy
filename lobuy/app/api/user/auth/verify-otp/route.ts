import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/lib/models/userModel.js";
import Jwt from "@/lib/services/jwt.js";
import { otpService } from "@/lib/services/otpService.js";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/services/rateLimit";
import { sessionCookieOptions } from "@/lib/security";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const otp = String(body.otp ?? "").trim();
    if (!email || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, message: "Enter the 6-digit code" }, { status: 400 });
    }

    const wait = await rateLimit(`otp-verify:ip:${clientIp()}`, 30, 15 * 60);
    if (wait) return tooManyRequests(wait);

    if (!(await otpService.verifyOtp(email, otp))) {
      return NextResponse.json(
        { success: false, message: "That code is wrong or has expired. Try again or resend it." },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true }, $setOnInsert: { email } },
      { new: true, upsert: true, collation: { locale: "en", strength: 2 } }
    ).select("-Password");

    if (user.is_blocked) {
      return NextResponse.json(
        { success: false, message: "This account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    const token = Jwt.genrateToken({ id: user._id, email: user.email });
    cookies().set("token", token, sessionCookieOptions(7 * 24 * 60 * 60));

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[auth:verify-otp]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
