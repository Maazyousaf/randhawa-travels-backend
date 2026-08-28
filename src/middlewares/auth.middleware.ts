import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
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

    // generateToken.ts creates { id: userId }
    if (!decoded.id) {
      return res.status(401).json({
        ok: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      ok: false,
      message: "Invalid or expired authentication token",
    });
  }
};

// =====================================================
// OPTIONAL AUTH MIDDLEWARE
// =====================================================
// Sets req.user if valid token exists, but doesn't reject request if no token
// Useful for endpoints that work for both authenticated and guest users
// =====================================================

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // No token? That's fine, continue without user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return next();
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (decoded.id) {
      req.user = {
        id: decoded.id,
      };
    }

    next();
  } catch (error) {
    // Invalid token? Just continue without user (don't reject)
    next();
  }
};
