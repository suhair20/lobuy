import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Cart from "@/lib/models/cartModel.js";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";
import { currentUserId, MAX_QTY_PER_ITEM } from "@/lib/services/orderService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const productId = String(body.productId ?? "");
    const quantity = Number(body.quantity ?? 1);
    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ message: "Invalid product or quantity" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product || product.is_active === false) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, products: [] });

    const line = cart.products.find((p: any) => p.productId.toString() === productId);
    const nextQty = (line?.quantity ?? 0) + quantity;
    const cap = Math.min(MAX_QTY_PER_ITEM, product.stock);
    if (cap < 1) return NextResponse.json({ message: "This item is out of stock" }, { status: 400 });
    if (nextQty > cap) {
      return NextResponse.json(
        { message: `You can add up to ${cap} of this item.` },
        { status: 400 }
      );
    }

    if (line) {
      line.quantity = nextQty;
      line.price = product.price;
      line.totalPrice = nextQty * product.price;
    } else {
      cart.products.push({ productId, quantity, price: product.price, totalPrice: quantity * product.price });
    }

    cart.cartTotal = cart.products.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[cart:add]", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
