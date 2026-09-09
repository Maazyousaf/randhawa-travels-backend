import { Request, Response } from "express";
import { searchFlights } from "../services/flight.service.js";

export const searchFlightsController = async (req: Request, res: Response) => {
  try {
    const {
      from,
      to,
      departDate,
      cabin,
      adults,
      children,
      infants,
      tripType,
      legs,
    } = req.query;

    let multiCityLegs;
    if (tripType === "multicity" && legs) {
      try {
        multiCityLegs = JSON.parse(String(legs));
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid multi-city legs",
        });
      }
      if (!Array.isArray(multiCityLegs) || multiCityLegs.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least two multi-city legs are required",
        });
      }
    }

    // ----------------------------------
    // Required fields
    // ----------------------------------

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To locations are required",
      });
    }

    // ----------------------------------
    // Search flights
    // ----------------------------------

    const flights = await searchFlights({
      from: String(from),
      to: String(to),

      departDate: departDate ? String(departDate) : undefined,

      cabin: cabin ? String(cabin) : undefined,

      adults: adults ? Number(adults) : 1,

      children: children ? Number(children) : 0,

      infants: infants ? Number(infants) : 0,
      tripType: tripType
        ? (String(tripType) as "oneway" | "roundtrip" | "multicity")
        : undefined,
      multiCityLegs,
    });

    // ----------------------------------
    // No flights
    // ----------------------------------

    if (flights.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        flights: [],
        message: "No flights found for the selected search.",
      });
    }

    // ----------------------------------
    // Success
    // ----------------------------------

    return res.status(200).json({
      success: true,
      count: flights.length,
      flights,
    });
  } catch (error) {
    console.error("❌ Flight search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search flights",
    });
  }
};
