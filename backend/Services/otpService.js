// otpService.js
import crypto from 'crypto';
import redis from './redisClient.js';
import {Resend} from 'resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const otpService = {
  // Generate OTP and save it in Redis (5 min expiry)
  async generateOtp(email) {
    const otp = crypto.randomInt(100000, 999999).toString();
    await redis.set(email, otp, { ex: 300 }); // 5 minutes expiry
    return otp;
  },

  // Send OTP via Resend API using pre-verified sender
  async sendOtp(email) {
    const otp = await this.generateOtp(email);
    console.log("Sending OTP to:", email);

    await resend.emails.send({
      from: "AutoApp <onboarding@resend.dev>", // pre-verified sender
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.4;">
          <h2>OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);
    return otp;
  },

  // Verify OTP entered by the user
  async verifyOtp(email, enteredOtp) {
    const storedOtp = await redis.get(email);
    if (!storedOtp) return false; // OTP expired or not found
    return storedOtp.toString() === enteredOtp.toString();
  },
};
