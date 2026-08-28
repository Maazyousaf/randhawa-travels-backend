import { Router } from "express";
import { searchFlightsController } from "../controllers/flight.controller.js";

const router = Router();

// ======================================
// Flight Search
// ======================================

router.get("/search", searchFlightsController);

export default router;
