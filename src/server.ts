import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { connectDB } from "./config/database.js";

import flightRoutes from "./routes/flight.routes.js";
import flightBookingRoutes from "./routes/flightBooking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import groupRoutes from "./routes/group.routes.js";
import groupBookingRoutes from "./routes/groupBooking.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import hotelBookingRoutes from "./routes/hotelBooking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customUmrahRoutes from "./routes/customUmrah.routes.js";
import bookingSearchRoutes from "./routes/bookingSearch.routes.js";

import { seedFlights } from "./utils/seedFlights.js";
import { seedGroups } from "./utils/seedGroups.js";
import { seedHotels } from "./utils/seedHotels.js";

const app = express();

// ======================================
// CORS
// ======================================

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:8080")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, normalizedOrigin || true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  }),
);

// ======================================
// BODY PARSERS
// ======================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "🚀 Randhawa Air Travels Int'l Backend Running...",
    version: "1.0.1",
  });
});

// ======================================
// API ROUTES
// ======================================

// Authentication
app.use("/api/auth", authRoutes);

// Flight Search
app.use("/api/flights", flightRoutes);

// Flight Booking
app.use("/api/flight-bookings", flightBookingRoutes);

// Image Upload
app.use("/api/uploads", uploadRoutes);

// Groups
app.use("/api/groups", groupRoutes);

// Group Bookings
app.use("/api/group-bookings", groupBookingRoutes);

// Hotels
app.use("/api/hotels", hotelRoutes);

// Hotel Bookings
app.use("/api/hotel-bookings", hotelBookingRoutes);

// Custom Umrah
app.use("/api/custom-umrah", customUmrahRoutes);

// Booking Search (Guest accessible)
app.use("/api/bookings", bookingSearchRoutes);

// Admin Panel
app.use("/api/admin", adminRoutes);

// ======================================
// 404 ROUTE
// ======================================

app.use((_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Global Error:", err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================================
// SERVER PORT
// ======================================

const PORT = Number(process.env.PORT) || 5000;

// ======================================
// START SERVER
// ======================================

const startServer = async () => {
  try {
    // ----------------------------------
    // Connect MongoDB
    // ----------------------------------

    await connectDB();

    // ----------------------------------
    // Seed Flights
    // ----------------------------------

    if (process.env.NODE_ENV !== "production") {
      await seedFlights();
    }

    // ----------------------------------
    // Seed Groups
    // ----------------------------------

    if (process.env.NODE_ENV !== "production") {
      await seedGroups();
    }

    // ----------------------------------
    // Seed Hotels
    // ----------------------------------

    if (process.env.NODE_ENV !== "production") {
      await seedHotels();
    }

    // ----------------------------------
    // Start Express Server
    // ----------------------------------

    app.listen(PORT, () => {
      console.log("===========================================");
      console.log("🚀 Randhawa Air Travels Int'l Backend Started Successfully");
      console.log(`🌐 Server : http://localhost:${PORT}`);
      console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log("===========================================");
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

// ======================================
// RUN SERVER ONLY FOR LOCAL DEVELOPMENT
// ======================================

if (process.env.VERCEL) {
  connectDB().catch((error) => {
    console.error("❌ Vercel MongoDB startup failed:", error);
  });
} else {
  startServer();
}

export default app;
