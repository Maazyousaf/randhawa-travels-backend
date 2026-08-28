import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { adminProtect } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// ==============================
// Public Routes
// ==============================

// Admin Login
router.post("/login", adminController.login);

// ==============================
// Protected Admin Routes
// ==============================

// Dashboard Stats
router.get("/stats", adminProtect, adminController.getStats);

// Users Management
router.get("/users", adminProtect, adminController.getUsers);
router.get("/admins", adminProtect, adminController.getAdmins);
router.get("/users/:id", adminProtect, adminController.getUser);
router.put("/users/:id", adminProtect, adminController.updateUserById);
router.delete("/users/:id", adminProtect, adminController.deleteUserById);

// Flight Bookings Management
router.get("/flight-bookings", adminProtect, adminController.getFlightBookings);
router.get("/flight-bookings/:id", adminProtect, adminController.getFlightBooking);
router.put("/flight-bookings/:id", adminProtect, adminController.updateFlightBooking);
router.delete("/flight-bookings/:id", adminProtect, adminController.deleteFlightBooking);

// Group Bookings Management
router.get("/group-bookings", adminProtect, adminController.getGroupBookings);
router.get("/group-bookings/:id", adminProtect, adminController.getGroupBooking);
router.put("/group-bookings/:id", adminProtect, adminController.updateGroupBooking);
router.delete("/group-bookings/:id", adminProtect, adminController.deleteGroupBooking);
router.post("/group-bookings/:id/admin-reply", adminProtect, adminController.sendAdminReplyToGroupBooking);

// Hotel Bookings Management
router.get("/hotel-bookings", adminProtect, adminController.getHotelBookings);
router.get("/hotel-bookings/:id", adminProtect, adminController.getHotelBooking);
router.put("/hotel-bookings/:id", adminProtect, adminController.updateHotelBooking);
router.delete("/hotel-bookings/:id", adminProtect, adminController.deleteHotelBooking);

export default router;
