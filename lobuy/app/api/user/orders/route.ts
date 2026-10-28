import { NextResponse } from "next/server";
import Order from "@/lib/models/orderModel.js";
import { razorpay } from "@/lib/config/razorpay.js";
import dbConnect from "@/lib/db";
import {
  OrderError,
  buildOrderFromCart,
  currentUserId,
  resolveAddress,
} from "@/lib/services/orderService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const orders = await Order.find({
      user: userId,
      orderStatus: { $nin: ["pending", "payment_failed"] },
    })
      .populate({ path: "products.productId" })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[orders:list]", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Please sign in to check out" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const deliveryAddress = await resolveAddress(userId, body);
    const { items, subtotal, deliveryFee, totalAmount } = await buildOrderFromCart(userId);

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `lobuy_${Date.now()}`,
      notes: { userId },
    });

    const order = await Order.create({
      user: userId,
      delivery_address: deliveryAddress,
      payment: "Razorpay",
      razorpayOrderId: rzpOrder.id,
      products: items,
      subtotal,
      deliveryFee,
      totalAmount,
      orderDate: new Date(),
      orderStatus: "pending",
      paymentStatus: "pending",
      statusHistory: [{ status: "pending", note: "Awaiting payment" }],
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order._id,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[orders:create]", error);
    return NextResponse.json({ message: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
