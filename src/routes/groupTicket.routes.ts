import { Router } from "express";
import {
  createGroupTicketBooking,
  getGroupTickets,
  updateGroupTicketPayment,
  getMyGroupTicketBookings,
  getGroupTicketBookingById,
  updateGroupTicketRemarks,
} from "../controllers/groupTicket.controller.js";
import { protect, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getGroupTickets);
router.get("/bookings/my", protect, getMyGroupTicketBookings);
router.get("/bookings/:id", optionalAuth, getGroupTicketBookingById);
router.patch("/bookings/:id/remarks", updateGroupTicketRemarks);
router.post("/bookings", optionalAuth, createGroupTicketBooking);
router.patch("/bookings/:reference/payment", updateGroupTicketPayment);

export default router;
