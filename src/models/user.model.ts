import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;

  role: "user" | "admin";

  // Email Verification
  isVerified: boolean;
  emailOtp?: string;
  emailOtpExpire?: Date;

  // Forgot Password
  resetPasswordOtp?: string;
  resetPasswordOtpExpire?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =========================
    // Email Verification
    // =========================
    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
      default: null,
    },

    emailOtpExpire: {
      type: Date,
      default: null,
    },

    // =========================
    // Forgot Password
    // =========================
    resetPasswordOtp: {
      type: String,
      default: null,
    },

    resetPasswordOtpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("User", userSchema);
