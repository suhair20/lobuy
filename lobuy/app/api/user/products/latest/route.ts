import { NextResponse } from "next/server";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit")) || 5;

    // Prefer active products; fall back to all if none are active
    let products = await Product.find({ is_active: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!products.length) {
      products = await Product.find().sort({ createdAt: -1 }).limit(limit);
    }

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
