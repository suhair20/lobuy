import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  offer: { type: ObjectId, ref: "offerModel" },
  discountedPrice: Number,
  description: { type: String, required: true },
  is_list: { type: Boolean, default: true },
});

export default mongoose.models.CategoryModel ||
  mongoose.model("CategoryModel", CategorySchema);
