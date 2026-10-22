import { NextResponse } from "next/server";
import Order from "@/lib/models/orderModel.js";
import dbConnect from "@/lib/db";
import {
  finalizePaidOrder,
  hmacHex,
  markPaymentFailed,
  signaturesMatch,
} from "@/lib/services/orderService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  if (!signaturesMatch(hmacHex(secret, raw), signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  try {
    await dbConnect();
    const event = JSON.parse(raw);
    const payment = event?.payload?.payment?.entity;
    if (!payment?.order_id) return NextResponse.json({ ok: true });

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const order: any = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (!order) return NextResponse.json({ ok: true });

      const expectedPaise = Math.round((order.totalAmount ?? order.subtotal) * 100);
      if (Number(payment.amount) !== expectedPaise) {
        await markPaymentFailed(payment.order_id, "Webhook amount mismatch");
        return NextResponse.json({ ok: true });
      }
      await finalizePaidOrder(payment.order_id, payment.id);
    } else if (event.event === "payment.failed") {
      await markPaymentFailed(payment.order_id, payment.error_description);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[razorpay:webhook]", error);
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
}
