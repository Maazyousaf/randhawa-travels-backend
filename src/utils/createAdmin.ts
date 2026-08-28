import "dotenv/config";
import { connectDB } from "../config/database.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * Utility script to create an admin user
 *
 * Usage:
 * 1. Update the admin credentials below
 * 2. Run: npx tsx src/utils/createAdmin.ts
 */

const createAdmin = async () => {
  try {
    await connectDB();

    // Update these credentials
    const adminData = {
      name: "Admin User",
      email: "admin@wanderluxe.com",
      phone: "+923001234567",
      password: "admin123456", // Change this to a strong password
      role: "admin" as const,
      isVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      // Update existing user to admin if needed
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        existingAdmin.isVerified = true;
        await existingAdmin.save();
      }

      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = await User.create({
      ...adminData,
      password: hashedPassword,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
