import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email.js";

// ---------------- Forgot Password ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP with 5 min expiry
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // send email
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Reset Password ----------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // clear otp fields
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};