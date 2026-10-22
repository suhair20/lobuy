import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/lib/models/orderModel.js";
import { razorpay } from "@/lib/config/razorpay.js";
import dbConnect from "@/lib/db";
import { currentUserId, restockOrder } from "@/lib/services/orderService";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const order = await Order.findOne({ _id: params.id, user: userId }).populate("products.productId");
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[orders:get]", error);
    return NextResponse.json({ message: "Error fetching order details" }, { status: 500 });
  }
}

const CANCELLABLE = ["pending", "placed", "payment_failed"];

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = currentUserId();
    if (!userId) return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const previous: any = await Order.findOneAndUpdate(
      { _id: params.id, user: userId, orderStatus: { $in: CANCELLABLE } },
      {
        $set: { orderStatus: "cancelled", "products.$[].productStatus": "cancelled" },
        $push: { statusHistory: { status: "cancelled", note: "Cancelled by customer" } },
      }
    );

    if (!previous) {
      const existing: any = await Order.findOne({ _id: params.id, user: userId }).select("orderStatus");
      if (!existing) return NextResponse.json({ message: "Order not found" }, { status: 404 });
      return NextResponse.json(
        { message: `This order can't be cancelled because it is ${existing.orderStatus}.` },
        { status: 400 }
      );
    }

    const wasPaid = previous.paymentStatus === "paid";
    if (wasPaid) {
      await restockOrder(previous);

      if (previous.razorpayPaymentId) {
        try {
          const refund: any = await razorpay.payments.refund(previous.razorpayPaymentId, {
            amount: Math.round((previous.totalAmount ?? previous.subtotal) * 100),
            notes: { orderId: String(previous._id) },
          });
          await Order.updateOne(
            { _id: previous._id },
            {
              $set: { paymentStatus: "refunded", razorpayRefundId: refund.id },
              $push: { statusHistory: { status: "refunded", note: `Refund ${refund.id}` } },
            }
          );
        } catch (refundError) {
          console.error("[orders:refund]", refundError);
          await Order.updateOne({ _id: previous._id }, { $set: { paymentStatus: "refund_failed" } });
        }
      }
    }

    const order = await Order.findById(previous._id);
    return NextResponse.json({
      success: true,
      message: wasPaid
        ? "Order cancelled. Your refund has been started and usually reaches you in 5–7 business days."
        : "Order cancelled.",
      order,
    });
  } catch (error) {
    console.error("[orders:cancel]", error);
    return NextResponse.json({ message: "Could not cancel the order" }, { status: 500 });
  }
}
