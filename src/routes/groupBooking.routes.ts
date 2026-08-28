import { Router } from "express";

import {
  createGroupBooking,
  sendGroupBookingEmail,
  getGroupBookingById,
  getGroupBookingByReference,
  getMyGroupBookings,
  getGroupBookings,
  updateGroupBookingStatus,
  updateGroupBookingPayment,
  updateGroupBookingRemarks,
  addClientRemark,
  addAdminReply,
  updateGroupBookingPassengers,
  cancelGroupBooking,
  deleteGroupBooking,
} from "../controllers/groupBooking.controller.js";

import { protect, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// CREATE GROUP BOOKING
// POST /api/group-bookings
// GUEST BOOKING ALLOWED - Optional authentication
// If user is logged in, booking will be associated with their account
// =====================================================

router.post("/", optionalAuth, createGroupBooking);

// =====================================================
// SEND GROUP BOOKING EMAIL
// POST /api/group-bookings/send-email
// =====================================================

router.post("/send-email", sendGroupBookingEmail);

// =====================================================
// GET MY BOOKINGS
// GET /api/group-bookings/my
// =====================================================

router.get("/my", protect, getMyGroupBookings);

// =====================================================
// GET BOOKING BY REFERENCE
// GET /api/group-bookings/reference/:reference
// =====================================================

router.get("/reference/:reference", getGroupBookingByReference);

// =====================================================
// GET ALL GROUP BOOKINGS
// GET /api/group-bookings
// =====================================================

router.get("/", getGroupBookings);

// =====================================================
// UPDATE PAYMENT INFO
// PATCH /api/group-bookings/:id/payment
// =====================================================

router.patch("/:id/payment", updateGroupBookingPayment);

// =====================================================
// UPDATE BOOKING STATUS
// PATCH /api/group-bookings/:id/status
// =====================================================

router.patch("/:id/status", updateGroupBookingStatus);

// =====================================================
// ADD CLIENT REMARK / MESSAGE (WITH OPTIONAL ATTACHMENT)
// POST /api/group-bookings/:id/client-remarks
// GUEST BOOKING ALLOWED - Optional authentication
// =====================================================

router.post("/:id/client-remarks", optionalAuth, addClientRemark);

// =====================================================
// ADD ADMIN REPLY TO CLIENT REMARK
// POST /api/group-bookings/:id/admin-reply
// PROTECTED - Admin only
// =====================================================

router.post("/:id/admin-reply", protect, addAdminReply);

// =====================================================
// UPDATE AGENT REMARKS
// PATCH /api/group-bookings/:id/remarks
// =====================================================

router.patch("/:id/remarks", updateGroupBookingRemarks);

// =====================================================
// UPDATE PASSENGERS
// PATCH /api/group-bookings/:id/passengers
// =====================================================

router.patch("/:id/passengers", protect, updateGroupBookingPassengers);

// =====================================================
// CANCEL BOOKING
// PATCH /api/group-bookings/:id/cancel
// =====================================================

router.patch("/:id/cancel", protect, cancelGroupBooking);

// =====================================================
// DELETE BOOKING (within 4-hour window)
// DELETE /api/group-bookings/:id
// =====================================================

router.delete("/:id", protect, deleteGroupBooking);

// =====================================================
// GET SINGLE BOOKING
// GET /api/group-bookings/:id
// =====================================================

router.get("/:id", getGroupBookingById);

export default router;
