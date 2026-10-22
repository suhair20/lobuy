import { NextResponse } from "next/server";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!params.id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
