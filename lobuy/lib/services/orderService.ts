import crypto from "crypto";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Order from "@/lib/models/orderModel.js";
import Cart from "@/lib/models/cartModel.js";
import Product from "@/lib/models/product.Model.js";
import Address from "@/lib/models/Address.js";

export const MAX_QTY_PER_ITEM = 10;

export class OrderError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Returns the logged-in user's id, or null when there is no valid session. */
export function currentUserId(): string | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  try {
    const decoded = Jwt.verifyToken(token) as unknown as { id?: string };
    return decoded?.id ? String(decoded.id) : null;
  } catch {
    return null;
  }
}

export type AddressInput = {
  fullName?: string;
  phone?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  addressLine?: string;
  landmark?: string;
};

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateAddress(input: AddressInput) {
  const address = {
    fullName: clean(input.fullName),
    phone: clean(input.phone).replace(/\s|-/g, "").replace(/^\+?91/, ""),
    state: clean(input.state) || "Kerala",
    district: clean(input.district),
    city: clean(input.city),
    pincode: clean(input.pincode),
    addressLine: clean(input.addressLine),
    landmark: clean(input.landmark),
  };

  if (address.fullName.length < 2) throw new OrderError("Enter the full name");
  if (!/^[6-9]\d{9}$/.test(address.phone)) throw new OrderError("Enter a valid 10-digit mobile number");
  if (!/^\d{6}$/.test(address.pincode)) throw new OrderError("Enter a valid 6-digit pincode");
  if (address.addressLine.length < 5) throw new OrderError("Enter the full address");
  if (!address.city) throw new OrderError("Enter the city");
  if (!address.district) throw new OrderError("Enter the district");

  return address;
}

/** Resolves the delivery address from a saved address id (owned by the user) or a new address. */
export async function resolveAddress(
  userId: string,
  body: { addressId?: string; address?: AddressInput }
) {
  if (body.addressId) {
    const saved = await Address.findOne({ _id: body.addressId, userId }).lean();
    if (!saved) throw new OrderError("Address not found", 404);
    const { _id, userId: _u, __v, ...rest } = saved as any;
    return validateAddress(rest);
  }
  if (body.address) {
    const address = validateAddress(body.address);
    await Address.create({ ...address, userId });
    return address;
  }
  throw new OrderError("Choose a delivery address");
}

export const DELIVERY_FEE = 0;

/** Builds order lines from the user's cart using current database prices and stock. */
export async function buildOrderFromCart(userId: string) {
  const cart = await Cart.findOne({ user: userId }).lean();
  const lines = (cart as any)?.products ?? [];
  if (!lines.length) throw new OrderError("Your bag is empty");

  const ids = lines.map((l: any) => l.productId);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((p: any) => [String(p._id), p]));

  const items = lines.map((line: any) => {
    const product: any = byId.get(String(line.productId));
    const quantity = Number(line.quantity);
    if (!product || product.is_active === false) {
      throw new OrderError("An item in your bag is no longer available. Please remove it and try again.");
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_ITEM) {
      throw new OrderError(`Invalid quantity for ${product.name}`);
    }
    if (product.stock < quantity) {
      throw new OrderError(
        product.stock > 0
          ? `Only ${product.stock} left of ${product.name}. Please update your bag.`
          : `${product.name} is out of stock. Please remove it from your bag.`
      );
    }
    return {
      productId: product._id,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity,
      productStatus: "pending",
    };
  });

  const subtotal = items.reduce((sum: number, i: any) => sum + i.totalPrice, 0);
  return { items, subtotal, deliveryFee: DELIVERY_FEE, totalAmount: subtotal + DELIVERY_FEE };
}

export function signaturesMatch(expectedHex: string, receivedHex: string) {
  const a = Buffer.from(expectedHex, "utf8");
  const b = Buffer.from(String(receivedHex || ""), "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function hmacHex(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Marks a pending order as paid exactly once, then decrements stock and removes the
 * purchased items from the cart. Safe to call repeatedly (verify + webhook).
 */
export async function finalizePaidOrder(razorpayOrderId: string, razorpayPaymentId: string) {
  const order: any = await Order.findOneAndUpdate(
    { razorpayOrderId, paymentStatus: { $ne: "paid" }, orderStatus: { $in: ["pending", "payment_failed"] } },
    {
      $set: {
        paymentStatus: "paid",
        orderStatus: "placed",
        razorpayPaymentId,
        "products.$[].productStatus": "placed",
      },
      $push: { statusHistory: { status: "placed", note: "Payment received" } },
    },
    { new: true }
  );

  if (!order) {
    return Order.findOne({ razorpayOrderId });
  }

  for (const item of order.products) {
    const res = await Product.updateOne(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (res.modifiedCount === 0) {
      await Product.updateOne({ _id: item.productId }, { $set: { stock: 0 } });
      console.warn(`[orders] Stock ran out for ${item.productId} on paid order ${order._id}`);
    }
  }

  const purchased = order.products.map((p: any) => p.productId);
  const cart: any = await Cart.findOne({ user: order.user });
  if (cart) {
    cart.products = cart.products.filter(
      (line: any) => !purchased.some((id: any) => String(id) === String(line.productId))
    );
    cart.cartTotal = cart.products.reduce((s: number, l: any) => s + (l.totalPrice || 0), 0);
    if (cart.products.length) await cart.save();
    else await Cart.deleteOne({ _id: cart._id });
  }

  return order;
}

export async function markPaymentFailed(razorpayOrderId: string, reason?: string) {
  await Order.updateOne(
    { razorpayOrderId, paymentStatus: "pending" },
    {
      $set: { paymentStatus: "failed", orderStatus: "payment_failed" },
      $push: { statusHistory: { status: "payment_failed", note: reason } },
    }
  );
}

export async function restockOrder(order: any) {
  for (const item of order.products) {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
  }
}
