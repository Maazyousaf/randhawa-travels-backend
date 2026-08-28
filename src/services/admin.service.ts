import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

// ========================================
// Admin Login
// ========================================
export const adminLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user || user.role !== "admin") {
    throw new Error("Invalid admin credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid admin credentials");
  }

  const token = generateToken(user._id.toString());

  return {
    success: true,
    message: "Admin login successful",
    token,
    admin: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// ========================================
// Get All Users
// ========================================
export const getAllUsers = async () => {
  const users = await User.find({ role: "user" })
    .select("-password -emailOtp -emailOtpExpire -resetPasswordOtp -resetPasswordOtpExpire")
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: users.length,
    users,
  };
};

// ========================================
// Get All Admins
// ========================================
export const getAllAdmins = async () => {
  const admins = await User.find({ role: "admin" })
    .select("-password -emailOtp -emailOtpExpire -resetPasswordOtp -resetPasswordOtpExpire")
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: admins.length,
    users: admins, // Return as "users" for compatibility with frontend
  };
};

// ========================================
// Get User By ID
// ========================================
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -emailOtp -emailOtpExpire -resetPasswordOtp -resetPasswordOtpExpire"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user,
  };
};

// ========================================
// Update User
// ========================================
export const updateUser = async (
  userId: string,
  updates: { name?: string; email?: string; phone?: string; password?: string }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email.toLowerCase();
  if (updates.phone) user.phone = updates.phone;
  
  // Update password if provided
  if (updates.password && updates.password.trim().length > 0) {
    user.password = await bcrypt.hash(updates.password, 10);
  }

  await user.save();

  return {
    success: true,
    message: "User updated successfully",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

// ========================================
// Delete User
// ========================================
export const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(userId);

  return {
    success: true,
    message: "User deleted successfully",
  };
};

// ========================================
// Get Dashboard Stats
// ========================================
export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalFlightBookings,
    totalGroupBookings,
    totalHotelBookings,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    (await import("../models/flightBooking.model.js")).default.countDocuments(),
    (await import("../models/groupBooking.model.js")).default.countDocuments(),
    (await import("../models/hotelBooking.model.js")).default.countDocuments(),
  ]);

  return {
    success: true,
    stats: {
      totalUsers,
      totalFlightBookings,
      totalGroupBookings,
      totalHotelBookings,
    },
  };
};
