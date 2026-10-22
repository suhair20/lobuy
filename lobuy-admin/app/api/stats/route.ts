import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import User from "@/lib/models/userModel.js";
import Product from "@/lib/models/product.Model.js";
import Order from "@/lib/models/orderModel.js";
import CategoryModel from "@/lib/models/CategoryModel.js";
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

    const [products, categories, users, orders, recentProducts] = await Promise.all([
      Product.countDocuments(),
      CategoryModel.countDocuments(),
      User.countDocuments({ isAdmin: { $ne: true } }),
      Order.find().sort({ createdAt: -1 }).limit(200),
      Product.find().populate("category", "name").sort({ createdAt: -1 }).limit(8),
    ]);

    const sales = orders.reduce((sum: number, o: any) => sum + (o.subtotal || 0), 0);

    return NextResponse.json({
      success: true,
      stats: { products, categories, users, orders: orders.length, sales },
      recentProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
