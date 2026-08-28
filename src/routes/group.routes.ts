import { Router } from "express";

import {
  getGroups,
  getGroupById,
  getGroupsByType,
  getGroupRoutes,
  getRouteFlights,
  getGroupPackages,
  getGroupPackageById,
  searchGroups,
} from "../controllers/group.controller.js";

const router = Router();

// =====================================================
// SEARCH GROUPS
// GET /api/groups/search?search=Umrah
// =====================================================

router.get("/search", searchGroups);

// =====================================================
// GET ALL GROUPS
// GET /api/groups
// =====================================================

router.get("/", getGroups);

// =====================================================
// GET GROUPS BY TYPE
// GET /api/groups/type/fixed
// GET /api/groups/type/custom
// =====================================================

router.get("/type/:type", getGroupsByType);

// =====================================================
// GET GROUP ROUTES
// GET /api/groups/:id/routes
// =====================================================

router.get("/:id/routes", getGroupRoutes);

// =====================================================
// GET FLIGHTS OF ROUTE
// GET /api/groups/:id/routes/:routeId/flights
// =====================================================

router.get("/:id/routes/:routeId/flights", getRouteFlights);

// =====================================================
// GET FIXED GROUP PACKAGES
// GET /api/groups/:id/packages
// =====================================================

router.get("/:id/packages", getGroupPackages);

// =====================================================
// GET SINGLE PACKAGE
// GET /api/groups/:id/packages/:packageId
// =====================================================

router.get("/:id/packages/:packageId", getGroupPackageById);

// =====================================================
// GET SINGLE GROUP
// GET /api/groups/:id
// =====================================================

router.get("/:id", getGroupById);

export default router;
