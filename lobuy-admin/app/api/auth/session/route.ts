import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import User from "@/lib/models/userModel.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("adminToken")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token) as unknown as { id: string; isAdmin?: boolean };
    if (!decoded.isAdmin) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const admin = await User.findById(decoded.id).select("-Password");
    if (!admin) return NextResponse.json({ message: "Admin not found" }, { status: 401 });

    return NextResponse.json({ success: true, user: admin });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
