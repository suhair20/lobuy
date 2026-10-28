import Razorpay from "razorpay";

/** @type {import('razorpay') | null} */
let client = null;

/** Lazily create the client so `next build` does not crash without env keys. */
export function getRazorpay() {
  if (client) return client;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
  }
  client = new Razorpay({ key_id, key_secret });
  return client;
}

export const razorpay = {
  get orders() {
    return getRazorpay().orders;
  },
  get payments() {
    return getRazorpay().payments;
  },
  get customers() {
    return getRazorpay().customers;
  },
};
