import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface AdminAuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const adminProtect = async (
  req: AdminAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Authentication required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Authentication token is missing",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not defined");

      return res.status(500).json({
        ok: false,
        message: "Server authentication configuration error",
      });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({
        ok: false,
        message: "Invalid authentication token",
      });
    }

    // Verify user exists and is admin
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        ok: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error);

    return res.status(401).json({
      ok: false,
      message: "Invalid or expired authentication token",
    });
  }
};
