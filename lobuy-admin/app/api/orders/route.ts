import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Order from "@/lib/models/orderModel.js";
import dbConnect from "@/lib/db";

function requireAdmin() {
  const token = cookies().get("adminToken")?.value;
  if (!token) return null;
  try {
    const decoded = Jwt.verifyToken(token) as unknown as { id: string; isAdmin?: boolean };
    return decoded.isAdmin ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const orders = await Order.find()
      .populate("user", "email")
      .populate("products.productId", "name images price")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
