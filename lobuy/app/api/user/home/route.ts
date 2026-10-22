import { NextResponse } from "next/server";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

const LIMITS = { hero: 5, collection: 8, spotlight: 3, deals: 10, new_arrivals: 10 } as const;
type Section = keyof typeof LIMITS;

const discount = (p: any) => (p.mrp && p.mrp > p.price ? (p.mrp - p.price) / p.mrp : 0);

export async function GET() {
  try {
    await dbConnect();
    const products: any[] = await Product.find({ is_active: { $ne: false } })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const picked = (section: Section) =>
      products.filter((p) => p.homeSections?.includes(section)).slice(0, LIMITS[section]);

    const pick = (section: Section, fallback: () => any[]) => {
      const chosen = picked(section);
      return chosen.length ? chosen : fallback().slice(0, LIMITS[section]);
    };

    return NextResponse.json({
      hero: pick("hero", () => products),
      collection: pick("collection", () => products),
      spotlight: pick("spotlight", () =>
        products.filter((p) => p.stock !== 0).sort((a, b) => b.price - a.price)
      ),
      deals: pick("deals", () =>
        products
          .filter((p) => discount(p) > 0 && p.stock !== 0)
          .sort((a, b) => discount(b) - discount(a))
      ),
      newArrivals: pick("new_arrivals", () => products),
    });
  } catch (error) {
    console.error("[home]", error);
    return NextResponse.json({ message: "Could not load homepage" }, { status: 500 });
  }
}
