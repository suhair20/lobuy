import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
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

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const category = await CategoryModel.findById(params.id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    category.is_list = !category.is_list;
    await category.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
