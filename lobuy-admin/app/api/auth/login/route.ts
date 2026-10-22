import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import User from "@/lib/models/userModel.js";
import Jwt from "@/lib/services/jwt.js";
import { clientIp, rateLimit, resetRateLimit, tooManyRequests } from "@/lib/services/rateLimit";
import { sessionCookieOptions } from "@/lib/security";
import dbConnect from "@/lib/db";

const INVALID = { message: "Invalid email or password" };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const pass = String(body.Password ?? body.password ?? "");
    if (!email || !pass) return NextResponse.json(INVALID, { status: 400 });

    const wait =
      (await rateLimit(`admin-login:ip:${clientIp()}`, 10, 15 * 60)) ||
      (await rateLimit(`admin-login:email:${email}`, 5, 15 * 60));
    if (wait) return tooManyRequests(wait);

    await dbConnect();
    const admin = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
    const isMatch = admin ? await bcrypt.compare(pass, admin.Password) : false;
    if (!admin || !isMatch || !admin.isAdmin || admin.is_blocked) {
      return NextResponse.json(INVALID, { status: 401 });
    }

    await resetRateLimit(`admin-login:email:${email}`);

    const token = Jwt.genrateToken({ id: admin._id, isAdmin: Boolean(admin.isAdmin) });
    cookies().set("adminToken", token, sessionCookieOptions(24 * 60 * 60));

    return NextResponse.json({
      message: "Admin login success",
      user: { _id: admin._id, email: admin.email, isAdmin: Boolean(admin.isAdmin) },
    });
  } catch (error) {
    console.error("[admin-login]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
