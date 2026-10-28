import crypto from "crypto";
import { Resend } from "resend";
import OtpCode from "@/lib/models/otpCodeModel.js";
import dbConnect from "@/lib/db";

const OTP_TTL_SEC = 300;
const MAX_ATTEMPTS = 5;
const normalize = (email) => String(email).trim().toLowerCase();
const hash = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");

/** Lazy so `next build` does not crash when RESEND_API_KEY is missing at import time. */
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set. Add it in Vercel → Environment Variables.");
  }
  return new Resend(key);
}

export const otpService = {
  async generateOtp(email) {
    await dbConnect();
    const otp = crypto.randomInt(100000, 1000000).toString();
    await OtpCode.findOneAndUpdate(
      { email: normalize(email) },
      {
        $set: {
          codeHash: hash(otp),
          attempts: 0,
          expiresAt: new Date(Date.now() + OTP_TTL_SEC * 1000),
        },
      },
      { upsert: true }
    );
    return otp;
  },

  async sendOtp(email) {
    const otp = await this.generateOtp(email);

    try {
      const { error } = await getResend().emails.send({
        from: process.env.EMAIL_FROM || "Lobuy <onboarding@resend.dev>",
        to: normalize(email),
        subject: "Your Lobuy verification code",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.4;">
            <h2>Verify your email</h2>
            <p>Your Lobuy verification code is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This code is valid for 5 minutes. If you didn't request it, you can ignore this email.</p>
          </div>
        `,
      });
      if (error) {
        console.error("[otp] email failed", error);
        if (process.env.NODE_ENV !== "production") {
          console.info(`[otp] dev code for ${email}: ${otp}`);
        }
      }
    } catch (err) {
      console.error("[otp] send error", err);
      if (process.env.NODE_ENV !== "production") {
        console.info(`[otp] dev code for ${email}: ${otp}`);
      }
      throw err;
    }
  },

  /** A code is single-use and is discarded after too many wrong guesses. */
  async verifyOtp(email, enteredOtp) {
    await dbConnect();
    const key = normalize(email);
    const record = await OtpCode.findOne({ email: key });
    if (!record || record.expiresAt.getTime() < Date.now()) return false;

    const expected = Buffer.from(record.codeHash, "hex");
    const received = Buffer.from(hash(String(enteredOtp ?? "").trim()), "hex");
    if (crypto.timingSafeEqual(expected, received)) {
      await OtpCode.deleteOne({ _id: record._id });
      return true;
    }

    const updated = await OtpCode.findOneAndUpdate(
      { _id: record._id },
      { $inc: { attempts: 1 } },
      { new: true }
    );
    if (!updated || updated.attempts >= MAX_ATTEMPTS) await OtpCode.deleteOne({ _id: record._id });
    return false;
  },
};
