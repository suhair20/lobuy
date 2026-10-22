import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Cart from "@/lib/models/cartModel.js";
import Product from "@/lib/models/product.Model.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token);
    const cart = await Cart.findOne({ user: decoded.id }).populate("products.productId", "name price images");

    if (!cart) return NextResponse.json({ message: "Cart is empty" }, { status: 404 });
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token);
    const { productId, quantity = 1 } = await req.json();

    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const price = product.price;
    const totalPrice = price * quantity;

    let cart = await Cart.findOne({ user: decoded.id });
    if (!cart) {
      cart = new Cart({ user: decoded.id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex((p: any) => p.productId.toString() === productId);
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
      cart.products[existingProductIndex].totalPrice = cart.products[existingProductIndex].quantity * price;
    } else {
      cart.products.push({ productId, quantity, price, totalPrice });
    }

    cart.cartTotal = cart.products.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
