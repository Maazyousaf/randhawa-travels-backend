import { Router } from "express";

import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// ==============================
// Authentication
// ==============================

// Register Account
router.post("/register", register);

// Login
router.post("/login", login);

// Verify Email OTP
router.post("/verify-otp", verifyOtp);

// Resend Email Verification OTP
router.post("/resend-otp", resendOtp);

// Forgot Password (Send Reset OTP)
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;
