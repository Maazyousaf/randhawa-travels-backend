import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  verifyOtp as verifyOtpService,
  resetPassword as resetPasswordService,
  resendOtp as resendOtpService,
} from "../services/auth.service.js";

// ==============================
// Register
// ==============================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    const result = await registerUser(name, email, phone, password);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Login
// ==============================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Forgot Password
// ==============================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Verify Email OTP
// ==============================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Resend Email OTP
// ==============================
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await resendOtpService(email);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Reset Password
// ==============================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;

    const result = await resetPasswordService(email, otp, password);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
