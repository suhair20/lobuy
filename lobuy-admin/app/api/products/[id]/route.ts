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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const product = await Product.findById(params.id).populate("category");
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const formData = await req.formData();
    product.name = (formData.get("name") as string) ?? product.name;
    product.description = (formData.get("description") as string) ?? product.description;
    const priceStr = formData.get("price") as string;
    if (priceStr) product.price = Number(priceStr);
    if (formData.has("mrp")) {
      const mrpStr = formData.get("mrp") as string;
      product.mrp = mrpStr ? Number(mrpStr) : undefined;
    }
    const stockStr = formData.get("stock") as string;
    if (stockStr) product.stock = Number(stockStr);
    const categoryStr = formData.get("category") as string;
    if (categoryStr) product.category = categoryStr as any;

    const files = formData.getAll("images") as File[];
    const imageIndexes = formData.getAll("imageIndexes") as string[];

    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const index = Number(imageIndexes[i]);
        if (product.images[index]?.public_id) {
          await cloudinary.uploader.destroy(product.images[index].public_id);
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await cloudinary.uploader.upload(
          `data:${file.type};base64,${buffer.toString("base64")}`,
          { folder: "products" }
        );
        (product.images as any)[index] = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
    }

    await product.save();
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

const SECTIONS = ["hero", "collection", "spotlight", "deals", "new_arrivals"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (Array.isArray(body.homeSections)) {
      update.homeSections = Array.from(
        new Set(body.homeSections.filter((s: unknown) => SECTIONS.includes(String(s))))
      );
    }
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;
    if (!Object.keys(update).length) {
      return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(params.id, { $set: update }, { new: true });
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!requireAdmin()) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    for (const img of product.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
    await product.deleteOne();
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
