import Group from "../models/group.model.js";

// =====================================================
// GET ALL ACTIVE GROUPS
// =====================================================

export const getAllGroups = async () => {
  return await Group.find({
    active: true,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET GROUP BY ID
// =====================================================

export const getGroup = async (id: string) => {
  return await Group.findOne({
    id,
    active: true,
  });
};

// =====================================================
// GET GROUPS BY TYPE
// fixed / custom
// =====================================================

export const getGroupsByType = async (type: "fixed" | "customized") => {
  return await Group.find({
    type,
    active: true,
  }).sort({
    createdAt: -1,
  });
};

// =====================================================
// GET CUSTOMIZED GROUP ROUTES
// =====================================================

export const getCustomGroupRoutes = async (groupId: string) => {
  const group = await Group.findOne({
    id: groupId,
    type: "customized",
    active: true,
  });

  if (!group) {
    return null;
  }

  return group.routes.filter((route) => route.active === true);
};

// =====================================================
// GET FLIGHTS FOR CUSTOMIZED ROUTE
// =====================================================

export const getCustomRouteFlights = async (
  groupId: string,
  routeId: string,
) => {
  const group = await Group.findOne({
    id: groupId,
    type: "customized",
    active: true,
  });

  if (!group) {
    return null;
  }

  const route = group.routes.find(
    (item) => item.id === routeId && item.active === true,
  );

  if (!route) {
    return null;
  }

  return route.flights.filter((flight) => flight.active === true);
};

// =====================================================
// GET FIXED GROUP PACKAGES
// =====================================================

export const getFixedGroupPackages = async (groupId: string) => {
  const group = await Group.findOne({
    id: groupId,
    type: "fixed",
    active: true,
  });

  if (!group) {
    return null;
  }

  return group.packages.filter(
    (pkg) => pkg.active === true && pkg.availableSeats > 0,
  );
};

// =====================================================
// GET SINGLE FIXED PACKAGE
// =====================================================

export const getFixedPackage = async (groupId: string, packageId: string) => {
  const group = await Group.findOne({
    id: groupId,
    type: "fixed",
    active: true,
  });

  if (!group) {
    return null;
  }

  const selectedPackage = group.packages.find(
    (pkg) => pkg.id === packageId && pkg.active === true,
  );

  return selectedPackage || null;
};

// =====================================================
// SEARCH GROUPS
// =====================================================

export const searchGroups = async (search: string) => {
  const searchTerm = search.trim();

  if (!searchTerm) {
    return [];
  }

  const regex = new RegExp(searchTerm, "i");

  return await Group.find({
    active: true,

    $or: [
      {
        name: regex,
      },
      {
        label: regex,
      },
      {
        country: regex,
      },
      {
        description: regex,
      },
    ],
  }).sort({
    createdAt: -1,
  });
};
