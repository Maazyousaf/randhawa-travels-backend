import { Router } from "express";
import {
  searchHotelsController,
  getHotelDetailsController,
  getAllCitiesController,
} from "../controllers/hotel.controller.js";

const router = Router();

// ======================================
// Get All Cities
// ======================================

router.get("/cities", getAllCitiesController);

// ======================================
// Hotel Search
// ======================================

router.get("/search", searchHotelsController);

// ======================================
// Get Hotel Details
// ======================================

router.get("/:id", getHotelDetailsController);

export default router;
