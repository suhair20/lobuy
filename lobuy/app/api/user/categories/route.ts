import { NextResponse } from "next/server";
import Category from "@/lib/models/CategoryModel.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    // Show active categories; if none are marked active, fall back to all
    let categories = await Category.find({ is_list: true }).sort({ createdAt: -1 });
    if (!categories.length) {
      categories = await Category.find().sort({ createdAt: -1 });
    }
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
