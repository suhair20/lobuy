import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/lib/models/CategoryModel.js";
import Product from "@/lib/models/product.Model.js";

/**
 * Dev helper: seeds sample categories/products if the DB is empty.
 * GET /api/user/seed
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  try {
    await dbConnect();

    let categories = await Category.find();
    if (!categories.length) {
      categories = await Category.insertMany([
        {
          name: "Smartphones",
          description: "Latest mobile phones",
          is_list: true,
        },
        {
          name: "Audio",
          description: "Earbuds and headphones",
          is_list: true,
        },
        {
          name: "Wearables",
          description: "Smartwatches and bands",
          is_list: true,
        },
      ]);
    } else {
      // Ensure existing categories are visible on storefront
      await Category.updateMany({}, { $set: { is_list: true } });
      categories = await Category.find();
    }

    let products = await Product.find();
    if (!products.length) {
      const samples = [
        {
          name: "Wireless Earbuds Pro",
          description: "Noise-cancelling wireless earbuds with deep bass.",
          price: 2499,
          stock: 50,
          category: categories[1]?._id || categories[0]._id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
              public_id: "seed/earbuds",
            },
          ],
          is_active: true,
        },
        {
          name: "Smart Watch X",
          description: "Fitness tracking smartwatch with AMOLED display.",
          price: 4999,
          stock: 30,
          category: categories[2]?._id || categories[0]._id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
              public_id: "seed/watch",
            },
          ],
          is_active: true,
        },
        {
          name: "Phone Case Shield",
          description: "Premium shockproof case for modern smartphones.",
          price: 799,
          stock: 100,
          category: categories[0]._id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
              public_id: "seed/case",
            },
          ],
          is_active: true,
        },
        {
          name: "Gaming Headset Neon",
          description: "RGB gaming headset with surround sound.",
          price: 3499,
          stock: 25,
          category: categories[1]?._id || categories[0]._id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1546435770-a3e426bf4723?auto=format&fit=crop&w=600&q=80",
              public_id: "seed/headset",
            },
          ],
          is_active: true,
        },
      ];

      products = await Product.insertMany(samples);
    } else {
      await Product.updateMany({}, { $set: { is_active: true } });
      products = await Product.find();
    }

    return NextResponse.json({
      success: true,
      message: "Store data ready",
      categories: categories.length,
      products: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
