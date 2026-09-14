import { Request, Response } from "express";
import crypto from "crypto";
import TransportVehicle from "../models/transportVehicle.model.js";

// =====================================================
// GET ALL TRANSPORT VEHICLES (PUBLIC)
// GET /api/custom-umrah/transport-vehicles
// =====================================================

export const getTransportVehicles = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { passengers } = req.query;

    let vehicles;

    if (passengers) {
      const paxCount = Number(passengers);
      if (!isNaN(paxCount) && paxCount > 0) {
        // Return only vehicles whose passenger range covers this count
        // vehicleType "none" (No Transport) is excluded — transport is required
        vehicles = await TransportVehicle.find({
          status: "active",
          vehicleType: { $ne: "none" },
          minPassengers: { $lte: paxCount },
          maxPassengers: { $gte: paxCount },
        }).sort({ displayOrder: 1, createdAt: 1 });
      } else {
        vehicles = await TransportVehicle.find({
          status: "active",
          vehicleType: { $ne: "none" },
        }).sort({ displayOrder: 1, createdAt: 1 });
      }
    } else {
      // No passengers param — return all active non-"none" vehicles
      vehicles = await TransportVehicle.find({
        status: "active",
        vehicleType: { $ne: "none" },
      }).sort({ displayOrder: 1, createdAt: 1 });
    }

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
      // Also expose as "services" for backward compat with frontend
      services: vehicles.map(vehicleToService),
    });
  } catch (error) {
    console.error("❌ Get Transport Vehicles Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transport vehicles",
    });
  }
};

// =====================================================
// CREATE TRANSPORT VEHICLE (ADMIN)
// POST /api/admin/transport-vehicles
// =====================================================

export const createTransportVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      description,
      vehicleType,
      minPassengers,
      maxPassengers,
      pricePerPerson,
      pricePerPackage,
      currency,
      inclusions,
      status,
      displayOrder,
    } = req.body;

    if (!name || vehicleType === undefined || minPassengers === undefined || maxPassengers === undefined) {
      res.status(400).json({
        success: false,
        message: "name, vehicleType, minPassengers, maxPassengers are required",
      });
      return;
    }

    const id = `transport-${vehicleType}-${crypto.randomBytes(4).toString("hex")}`;

    const vehicle = await TransportVehicle.create({
      id,
      name: String(name).trim(),
      description: String(description || "").trim(),
      vehicleType,
      minPassengers: Number(minPassengers),
      maxPassengers: Number(maxPassengers),
      pricePerPerson: Number(pricePerPerson || 0),
      pricePerPackage: Number(pricePerPackage || 0),
      currency: String(currency || "SAR").toUpperCase(),
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      status: status || "active",
      displayOrder: Number(displayOrder || 0),
    });

    res.status(201).json({
      success: true,
      message: "Transport vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error("❌ Create Transport Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create transport vehicle",
    });
  }
};

// =====================================================
// UPDATE TRANSPORT VEHICLE (ADMIN)
// PATCH /api/admin/transport-vehicles/:id
// =====================================================

export const updateTransportVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "description",
      "vehicleType",
      "minPassengers",
      "maxPassengers",
      "pricePerPerson",
      "pricePerPackage",
      "currency",
      "inclusions",
      "status",
      "displayOrder",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const vehicle = await TransportVehicle.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Transport vehicle not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Transport vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("❌ Update Transport Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update transport vehicle",
    });
  }
};

// =====================================================
// DELETE TRANSPORT VEHICLE (ADMIN)
// DELETE /api/admin/transport-vehicles/:id
// =====================================================

export const deleteTransportVehicle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const vehicle = await TransportVehicle.findOneAndDelete({ id });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Transport vehicle not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Transport vehicle deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Transport Vehicle Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete transport vehicle",
    });
  }
};

// =====================================================
// HELPER: Map DB vehicle → service shape (frontend compat)
// =====================================================

export function vehicleToService(v: any) {
  return {
    id: v.id,
    name: v.name,
    description: v.description,
    pricePerPerson: v.pricePerPerson ?? 0,
    pricePerPackage: v.pricePerPackage ?? 0,
    currency: v.currency || "SAR",
    category: "standard",
    vehicleType: v.vehicleType,
    minPassengers: v.minPassengers,
    maxPassengers: v.maxPassengers,
    inclusions: v.inclusions || [],
    status: v.status,
    displayOrder: v.displayOrder,
  };
}
