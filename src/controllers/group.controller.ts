import { Request, Response } from "express";
import Group, {
  IGroupFlight,
  IGroupPackage,
  IGroupRoute,
  GroupType,
} from "../models/group.model.js";

// =====================================================
// GET ALL ACTIVE GROUPS
// GET /api/groups
// =====================================================

export const getGroups = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const groups = await Group.find({
      active: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("❌ Get Groups Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};

// =====================================================
// GET SINGLE GROUP BY ID
// GET /api/groups/:id
// =====================================================

export const getGroupById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      id,
      active: true,
    });

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Group not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("❌ Get Group By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch group",
    });
  }
};

// =====================================================
// GET GROUPS BY TYPE
// GET /api/groups/type/fixed
// GET /api/groups/type/custom
// =====================================================

export const getGroupsByType = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type } = req.params;

    if (type !== "fixed" && type !== "customized") {
      res.status(400).json({
        success: false,
        message: "Invalid group type. Use fixed or customized",
      });
      return;
    }

    const groupType: GroupType = type as GroupType;

    const groups = await Group.find({
      type: groupType,
      active: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      type: groupType,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("❌ Get Groups By Type Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch groups by type",
    });
  }
};

// =====================================================
// GET GROUP ROUTES
// Mainly used by CUSTOM GROUPS
//
// GET /api/groups/:id/routes
// =====================================================

export const getGroupRoutes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      id,
      type: "customized",
      active: true,
    }).select("id name label country type routes");

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Custom group not found",
      });
      return;
    }

    const activeRoutes: IGroupRoute[] = group.routes.filter(
      (route: IGroupRoute) => route.active === true,
    );

    res.status(200).json({
      success: true,
      groupId: group.id,
      groupName: group.name,
      routes: activeRoutes,
    });
  } catch (error) {
    console.error("❌ Get Group Routes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch group routes",
    });
  }
};

// =====================================================
// GET FLIGHTS OF A CUSTOM ROUTE
//
// GET /api/groups/:id/routes/:routeId/flights
// =====================================================

export const getRouteFlights = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, routeId } = req.params;

    const group = await Group.findOne({
      id,
      type: "customized",
      active: true,
    });

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Custom group not found",
      });
      return;
    }

    const route: IGroupRoute | undefined = group.routes.find(
      (item: IGroupRoute) => item.id === routeId && item.active === true,
    );

    if (!route) {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
      return;
    }

    const activeFlights: IGroupFlight[] = route.flights.filter(
      (flight: IGroupFlight) => flight.active === true,
    );

    res.status(200).json({
      success: true,
      groupId: group.id,
      routeId: route.id,
      route: {
        id: route.id,
        label: route.label,
        from: route.from,
        fromCity: route.fromCity,
        to: route.to,
        toCity: route.toCity,
      },
      count: activeFlights.length,
      flights: activeFlights,
    });
  } catch (error) {
    console.error("❌ Get Route Flights Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch route flights",
    });
  }
};

// =====================================================
// GET FIXED GROUP PACKAGES
//
// GET /api/groups/:id/packages
// =====================================================

export const getGroupPackages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      id,
      type: "fixed",
      active: true,
    }).select("id name label country type image description packages");

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Fixed group not found",
      });
      return;
    }

    const activePackages: IGroupPackage[] = group.packages.filter(
      (pkg: IGroupPackage) => pkg.active === true && pkg.availableSeats > 0,
    );

    res.status(200).json({
      success: true,
      groupId: group.id,
      groupName: group.name,
      count: activePackages.length,
      packages: activePackages,
    });
  } catch (error) {
    console.error("❌ Get Group Packages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch group packages",
    });
  }
};

// =====================================================
// GET SINGLE FIXED PACKAGE
//
// GET /api/groups/:id/packages/:packageId
// =====================================================

export const getGroupPackageById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, packageId } = req.params;

    const group = await Group.findOne({
      id,
      type: "fixed",
      active: true,
    });

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Fixed group not found",
      });
      return;
    }

    const selectedPackage: IGroupPackage | undefined = group.packages.find(
      (pkg: IGroupPackage) => pkg.id === packageId && pkg.active === true,
    );

    if (!selectedPackage) {
      res.status(404).json({
        success: false,
        message: "Package not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      groupId: group.id,
      groupName: group.name,
      package: selectedPackage,
    });
  } catch (error) {
    console.error("❌ Get Group Package Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch package",
    });
  }
};

// =====================================================
// SEARCH GROUPS
//
// GET /api/groups/search?search=Umrah
//
// Searches:
// - name
// - label
// - country
// - description
// =====================================================

export const searchGroups = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search = String(req.query.search || "").trim();

    if (!search) {
      res.status(400).json({
        success: false,
        message: "Search term is required",
      });
      return;
    }

    const regex = new RegExp(search, "i");

    const groups = await Group.find({
      active: true,
      $or: [
        { name: regex },
        { label: regex },
        { country: regex },
        { description: regex },
      ],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("❌ Search Groups Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search groups",
    });
  }
};
