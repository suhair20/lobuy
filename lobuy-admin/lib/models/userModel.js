import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  Password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Number, default: 0 },
  is_blocked: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 },
  walletHistory: [
    {
      date: { type: Date },
      amount: { type: Number },
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", userSchema);
