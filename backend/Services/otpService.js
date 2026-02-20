import nodemailer from 'nodemailer';
import crypto from 'crypto';
import redis from './redisClient.js';

export const otpService = {
  async generateOtp(email) {
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in Redis with 5 min expiry (300 seconds)
    await redis.set(email, otp, { ex: 300 });

    return otp;
  },

  async sendOtp(email) {
    const otp = await this.generateOtp(email);
console.log("elocme",email);

    const transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return otp;
  },

  async verifyOtp(email, enteredOtp) {
    console.log("helooo");
    
    const storedOtp = await redis.get(email);
    console.log("hiii");
    
    console.log({ email, storedOtp, enteredOtp });
    if (!storedOtp) return false; // OTP expired or not found
    return storedOtp.toString() === enteredOtp.toString();
  },
};

