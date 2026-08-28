import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getUserResponse = (user: any) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

// ========================================
// Register User
// ========================================

export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  password: string,
) => {
  email = email.toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOtp();

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,

    isVerified: false,

    emailOtp: otp,
    emailOtpExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmail(
    email,
    "Email Verification OTP",
    `Your OTP is ${otp}. It will expire in 10 minutes.`,
  );

  return {
    success: true,
    message: "Account created successfully. Please verify your email.",
    userId: user._id.toString(),
  };
};

// ========================================
// Login User
// ========================================

export const loginUser = async (email: string, password: string) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before login.");
  }

  const token = generateToken(user._id.toString());

  return {
    success: true,
    message: "Login successful",
    token,
    user: getUserResponse(user),
  };
};

// ========================================
// Verify Email OTP
// ========================================

export const verifyOtp = async (email: string, otp: string) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    return {
      success: true,
      message: "Email already verified",
    };
  }

  if (!user.emailOtp || user.emailOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (!user.emailOtpExpire || user.emailOtpExpire < new Date()) {
    throw new Error("OTP has expired");
  }

  user.isVerified = true;
  user.emailOtp = null as any;
  user.emailOtpExpire = null as any;

  await user.save();

  const token = generateToken(user._id.toString());

  return {
    success: true,
    message: "Email verified successfully",
    token,
    user: getUserResponse(user),
  };
};

// ========================================
// Forgot Password
// ========================================

export const forgotPassword = async (email: string) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();

  user.resetPasswordOtp = otp;

  user.resetPasswordOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendEmail(
    user.email,
    "Reset Password OTP",
    `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
  );

  return {
    success: true,
    message: "Password reset OTP sent successfully.",
  };
};

// ========================================
// Reset Password
// ========================================

export const resetPassword = async (
  email: string,
  otp: string,
  password: string,
) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    !user.resetPasswordOtpExpire ||
    user.resetPasswordOtpExpire < new Date()
  ) {
    throw new Error("OTP has expired");
  }

  user.password = await bcrypt.hash(password, 10);

  user.resetPasswordOtp = null as any;
  user.resetPasswordOtpExpire = null as any;

  await user.save();

  return {
    success: true,
    message: "Password changed successfully.",
  };
};

// ========================================
// Resend Verification OTP
// ========================================

export const resendOtp = async (email: string) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  const otp = generateOtp();

  user.emailOtp = otp;

  user.emailOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendEmail(
    user.email,
    "Email Verification OTP",
    `Your new verification OTP is ${otp}. It will expire in 10 minutes.`,
  );

  return {
    success: true,
    message: "OTP sent successfully.",
  };
};
