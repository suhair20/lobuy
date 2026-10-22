import { NextResponse } from "next/server";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const products = await Product.find({ category: params.id }).populate(
      "category"
    );
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
