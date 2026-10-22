import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    stock: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    homeSections: {
      type: [{ type: String, enum: ["hero", "collection", "spotlight", "deals", "new_arrivals"] }],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.productModel ||
  mongoose.model("productModel", ProductSchema);
