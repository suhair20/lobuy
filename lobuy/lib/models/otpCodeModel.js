import mongoose from "mongoose";

const OtpCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { versionKey: false }
);

export default mongoose.models.OtpCode || mongoose.model("OtpCode", OtpCodeSchema);
