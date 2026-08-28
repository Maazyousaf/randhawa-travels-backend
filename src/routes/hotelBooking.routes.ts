import { Router } from "express";

import {
  createHotelBooking,
  getMyHotelBookings,
  getHotelBookingById,
  sendHotelBookingEmail,
  deleteHotelBooking,
  cancelHotelBooking,
  updateHotelBooking,
} from "../controllers/hotelBooking.controller.js";

import { protect, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// CREATE HOTEL BOOKING
// POST /api/hotel-bookings
// GUEST BOOKING ALLOWED - Optional authentication
// If user is logged in, booking will be associated with their account
// =====================================================

router.post("/", optionalAuth, createHotelBooking);

// =====================================================
// SEND BOOKING CONFIRMATION EMAIL
// POST /api/hotel-bookings/send-email
// GUEST BOOKING ALLOWED - No authentication required
// =====================================================

router.post("/send-email", sendHotelBookingEmail);

// =====================================================
// GET MY HOTEL BOOKINGS
// GET /api/hotel-bookings/my
// =====================================================

router.get("/my", protect, getMyHotelBookings);

// =====================================================
// CANCEL HOTEL BOOKING
// PATCH /api/hotel-bookings/:id/cancel
// =====================================================

router.patch("/:id/cancel", protect, cancelHotelBooking);

// =====================================================
// UPDATE HOTEL BOOKING (within 4-hour window)
// PATCH /api/hotel-bookings/:id
// GUEST BOOKING ALLOWED - Optional authentication for payment updates
// =====================================================

router.patch("/:id", optionalAuth, updateHotelBooking);

// =====================================================
// DELETE HOTEL BOOKING (within 4-hour window)
// DELETE /api/hotel-bookings/:id
// =====================================================

router.delete("/:id", protect, deleteHotelBooking);

// =====================================================
// GET SINGLE HOTEL BOOKING
// GET /api/hotel-bookings/:id
// =====================================================

router.get("/:id", protect, getHotelBookingById);

export default router;
