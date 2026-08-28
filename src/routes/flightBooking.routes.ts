import { Router } from "express";

import {
  createFlightBooking,
  getMyFlightBookings,
  getFlightBookingById,
  sendBookingEmail,
  deleteFlightBooking,
  cancelFlightBooking,
  updateFlightBooking,
} from "../controllers/flightBooking.controller.js";

import { protect, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// CREATE FLIGHT BOOKING
// POST /api/flight-bookings
// GUEST BOOKING ALLOWED - Optional authentication
// If user is logged in, booking will be associated with their account
// =====================================================

router.post("/", optionalAuth, createFlightBooking);

// =====================================================
// SEND BOOKING CONFIRMATION EMAIL
// POST /api/flight-bookings/send-email
// GUEST BOOKING ALLOWED - No authentication required
// =====================================================

router.post("/send-email", sendBookingEmail);

// =====================================================
// GET MY FLIGHT BOOKINGS
// GET /api/flight-bookings/my
// =====================================================

router.get("/my", protect, getMyFlightBookings);

// =====================================================
// CANCEL FLIGHT BOOKING
// PATCH /api/flight-bookings/:id/cancel
// =====================================================

router.patch("/:id/cancel", protect, cancelFlightBooking);

// =====================================================
// UPDATE FLIGHT BOOKING (within 4-hour window)
// PATCH /api/flight-bookings/:id
// =====================================================

router.patch("/:id", protect, updateFlightBooking);

// =====================================================
// DELETE FLIGHT BOOKING (within 4-hour window)
// DELETE /api/flight-bookings/:id
// =====================================================

router.delete("/:id", protect, deleteFlightBooking);

// =====================================================
// GET SINGLE FLIGHT BOOKING
// GET /api/flight-bookings/:id
// =====================================================

router.get("/:id", protect, getFlightBookingById);

export default router;
