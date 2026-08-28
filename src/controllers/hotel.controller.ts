import { Request, Response } from "express";
import {
  searchHotels,
  getHotelDetails,
  getAllCities,
} from "../services/hotel.service.js";

export const searchHotelsController = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;

    const hotels = await searchHotels({
      city: city ? String(city) : undefined,
    });

    if (hotels.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        hotels: [],
        message: "No hotels found for the selected city.",
      });
    }

    return res.status(200).json({
      success: true,
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error("❌ Hotel search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search hotels",
    });
  }
};

export const getHotelDetailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required",
      });
    }

    const hotel = await getHotelDetails(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      hotel,
    });
  } catch (error) {
    console.error("❌ Get hotel details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get hotel details",
    });
  }
};

export const getAllCitiesController = async (req: Request, res: Response) => {
  try {
    const cities = await getAllCities();

    return res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    console.error("❌ Get cities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get cities",
    });
  }
};
