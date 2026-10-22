import { NextResponse } from "next/server";
import Order from "@/lib/models/orderModel.js";
import { razorpay } from "@/lib/config/razorpay.js";
import dbConnect from "@/lib/db";
import {
  currentUserId,
  finalizePaidOrder,
  hmacHex,
  markPaymentFailed,
  signaturesMatch,
} from "@/lib/services/orderService";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req
      .json()
      .catch(() => ({}));
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing payment details" }, { status: 400 });
    }

    const order: any = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: userId });
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ success: true, orderId: order._id });
    }

    const expected = hmacHex(
      process.env.RAZORPAY_KEY_SECRET as string,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );
    if (!signaturesMatch(expected, razorpay_signature)) {
      return NextResponse.json({ message: "Payment could not be verified" }, { status: 400 });
    }

    const expectedPaise = Math.round((order.totalAmount ?? order.subtotal) * 100);
    let payment: any = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.order_id !== razorpay_order_id || Number(payment.amount) !== expectedPaise) {
      await markPaymentFailed(razorpay_order_id, "Payment amount mismatch");
      return NextResponse.json({ message: "Payment amount does not match the order" }, { status: 400 });
    }

    if (payment.status === "authorized") {
      payment = await razorpay.payments.capture(razorpay_payment_id, expectedPaise, "INR");
    }
    if (payment.status !== "captured") {
      return NextResponse.json({ message: `Payment is ${payment.status}` }, { status: 402 });
    }

    const paid = await finalizePaidOrder(razorpay_order_id, razorpay_payment_id);
    return NextResponse.json({ success: true, orderId: paid?._id ?? order._id });
  } catch (error) {
    console.error("[orders:verify]", error);
    return NextResponse.json({ message: "Verification failed. If money was deducted it will be confirmed automatically." }, { status: 500 });
  }
}
