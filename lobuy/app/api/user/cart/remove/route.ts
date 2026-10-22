import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Cart from "@/lib/models/cartModel.js";
import dbConnect from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { productId?: string } }) {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token);
    
    // We get productId from query string since it's a DELETE request and we might not have it in params
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    const cart = await Cart.findOne({ user: decoded.id });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    (cart.products as any) = cart.products.filter((p: any) => p.productId.toString() !== productId);
    cart.cartTotal = cart.products.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
