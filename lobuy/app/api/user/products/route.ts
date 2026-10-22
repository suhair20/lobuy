import { NextResponse } from "next/server";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit")) || 50;

    const products = await Product.find({ is_active: { $ne: false } })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
