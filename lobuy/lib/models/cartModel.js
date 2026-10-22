import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "productModel",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
      },
    ],
    couponDiscount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
      default: null,
    },
    cartTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.cartModel || mongoose.model("cartModel", cartSchema);
