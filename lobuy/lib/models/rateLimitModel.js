import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema(
  {
    _id: { type: String },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { versionKey: false }
);

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
