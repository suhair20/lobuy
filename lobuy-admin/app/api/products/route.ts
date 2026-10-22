import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Product from "@/lib/models/product.Model.js";
import cloudinary from "@/lib/config/cloudinary.js";
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

    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const mrpStr = formData.get("mrp") as string | null;
    const mrp = mrpStr ? Number(mrpStr) : undefined;
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock"));
    const files = formData.getAll("images") as File[];

    if (!files?.length) {
      return NextResponse.json({ message: "Images are required" }, { status: 400 });
    }

    const images = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        { folder: "products" }
      );
      images.push({ url: result.secure_url, public_id: result.public_id });
    }

    const product = await Product.create({
      name,
      description,
      price,
      mrp,
      category,
      stock,
      images,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
