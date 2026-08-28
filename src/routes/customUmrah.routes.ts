import { Router } from "express";

import {
  getMakkahHotels,
  getMadinahHotels,
  getServices,
  calculatePrice,
  createCustomUmrahBooking,
  getCustomUmrahBooking,
  updateCustomUmrahPayment,
  updateCustomUmrahAgentRemarks,
  sendCustomUmrahBookingEmail,
  addClientRemarkCustomUmrah,
  addAdminReplyCustomUmrah,
} from "../controllers/customUmrah.controller.js";

import { optionalAuth, protect } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// GET MAKKAH HOTELS
// GET /api/custom-umrah/hotels/makkah
// =====================================================

router.get("/hotels/makkah", getMakkahHotels);

// =====================================================
// GET MADINAH HOTELS
// GET /api/custom-umrah/hotels/madinah
// =====================================================

router.get("/hotels/madinah", getMadinahHotels);

// =====================================================
// GET SERVICES (VISA, TRANSPORT, ZIYARAT)
// GET /api/custom-umrah/services
// =====================================================

router.get("/services", getServices);

// =====================================================
// CALCULATE PRICE
// POST /api/custom-umrah/calculate-price
// =====================================================

router.post("/calculate-price", calculatePrice);

// =====================================================
// CREATE CUSTOM UMRAH BOOKING
// POST /api/custom-umrah/bookings
// =====================================================

router.post("/bookings", optionalAuth, createCustomUmrahBooking);

// =====================================================
// GET CUSTOM UMRAH BOOKING BY REFERENCE
// GET /api/custom-umrah/bookings/:reference
// =====================================================

router.get("/bookings/:reference", getCustomUmrahBooking);

// =====================================================
// UPDATE CUSTOM UMRAH PAYMENT
// PATCH /api/custom-umrah/bookings/:reference/payment
// =====================================================

router.patch("/bookings/:reference/payment", updateCustomUmrahPayment);

// =====================================================
// UPDATE CUSTOM UMRAH AGENT REMARKS
// PATCH /api/custom-umrah/bookings/:id
// =====================================================

router.patch("/bookings/:id", updateCustomUmrahAgentRemarks);

// =====================================================
// SEND CUSTOM UMRAH BOOKING EMAIL
// POST /api/custom-umrah/bookings/:reference/send-email
// =====================================================

router.post("/bookings/:reference/send-email", sendCustomUmrahBookingEmail);

// =====================================================
// ADD CLIENT REMARK / MESSAGE (WITH OPTIONAL ATTACHMENT)
// POST /api/custom-umrah/bookings/:id/client-remarks
// GUEST BOOKING ALLOWED - Optional authentication
// =====================================================

router.post("/:id/client-remarks", optionalAuth, addClientRemarkCustomUmrah);

// =====================================================
// ADD ADMIN REPLY TO CLIENT REMARK
// POST /api/custom-umrah/bookings/:id/admin-reply
// PROTECTED - Admin only
// =====================================================

router.post("/:id/admin-reply", protect, addAdminReplyCustomUmrah);

export default router;
