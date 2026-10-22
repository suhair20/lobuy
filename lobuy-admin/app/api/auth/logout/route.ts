import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearCookieOptions } from "@/lib/security";

export async function POST() {
  cookies().set("adminToken", "", clearCookieOptions());
  return NextResponse.json({ success: true, message: "Logged out" });
}
