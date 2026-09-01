import { Router } from "express";
import { searchBookings, getBookingById } from "../controllers/bookingSearch.controller.js";

const router = Router();

// =====================================================
// SEARCH BOOKINGS
// GET /api/bookings/search?type=reference&value=...
// GET /api/bookings/search?type=email&value=...
// =====================================================

router.get("/search", searchBookings);

// =====================================================
// GET BOOKING BY ID
// GET /api/bookings/:id
// =====================================================

router.get("/:id", getBookingById);

export default router;
