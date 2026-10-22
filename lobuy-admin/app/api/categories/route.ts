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

export async function GET() {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const exists = await CategoryModel.findOne({ name });
    if (exists) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 });
    }

    const category = await CategoryModel.create({ name, description });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
