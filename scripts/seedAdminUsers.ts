import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const seedAdminUsers = async () => {
  try {
    // Connect to MongoDB
    const dbUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/wanderluxe";
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB");

    const admins = [
      {
        name: "Musharaf",
        email: "musharaf@randhawa.com",
        phone: "+92-300-0000001",
        password: "password123",
      },
      {
        name: "Javed",
        email: "javed@randhawa.com",
        phone: "+92-300-0000002",
        password: "password123",
      },
      {
        name: "Maaz",
        email: "maaz@randhawa.com",
        phone: "+92-301-2328025",
        password: "password123",
      },
    ];

    for (const adminData of admins) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log(`⚠️  Admin with email ${adminData.email} already exists`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create admin user
      const newAdmin = new User({
        ...adminData,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      await newAdmin.save();
      console.log(
        `✅ Admin user created: ${adminData.name} (${adminData.email})`,
      );
    }

    console.log("✅ Admin users seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin users:", error);
    process.exit(1);
  }
};

seedAdminUsers();
