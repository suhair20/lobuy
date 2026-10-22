import { NextResponse } from "next/server";
import Category from "@/lib/models/CategoryModel.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find();

    if (!categories) return NextResponse.json({ message: "Categories not found" }, { status: 404 });

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
