import { NextResponse } from "next/server";
import Cart from "@/lib/models/cartModel.js";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";
import { currentUserId, MAX_QTY_PER_ITEM } from "@/lib/services/orderService";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const productId = String(body.productId ?? "");
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ message: "Invalid quantity" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const line = cart.products.find((p: any) => p.productId.toString() === productId);
    if (!line) return NextResponse.json({ message: "Product not in cart" }, { status: 404 });

    const product = await Product.findById(productId);
    if (!product || product.is_active === false) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const cap = Math.min(MAX_QTY_PER_ITEM, product.stock);
    if (quantity > cap) {
      return NextResponse.json(
        { message: cap < 1 ? "This item is out of stock" : `Only ${cap} available for this item.` },
        { status: 400 }
      );
    }

    line.quantity = quantity;
    line.price = product.price;
    line.totalPrice = quantity * product.price;
    cart.cartTotal = cart.products.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[cart:update]", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
