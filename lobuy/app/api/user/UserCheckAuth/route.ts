import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import User from "@/lib/models/userModel.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const decoded = Jwt.verifyToken(token);
    const user = await User.findById(decoded.id).select("-Password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
