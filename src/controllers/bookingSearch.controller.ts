import { Request, Response } from "express";
import FlightBooking from "../models/flightBooking.model.js";
import GroupBooking from "../models/groupBooking.model.js";
import HotelBooking from "../models/hotelBooking.model.js";

// =====================================================
// SEARCH BOOKINGS
// GET /api/bookings/search?type=reference&value=...
// GET /api/bookings/search?type=email&value=...
// =====================================================

export const searchBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type, value } = req.query;

    if (!type || !value) {
      res.status(400).json({
        success: false,
        message: "Please provide search type and value",
      });
      return;
    }

    const searchType = String(type).toLowerCase();
    const searchValue = String(value).trim();

    if (!["reference", "email"].includes(searchType)) {
      res.status(400).json({
        success: false,
        message: "Invalid search type. Use 'reference' or 'email'",
      });
      return;
    }

    if (searchValue.length < 3) {
      res.status(400).json({
        success: false,
        message: "Search value must be at least 3 characters",
      });
      return;
    }

    let bookings: any[] = [];

    // Search by booking reference
    if (searchType === "reference") {
      const escapeRegex = (value: string) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const referenceQuery = {
        $or: [
          { bookingReference: searchValue },
          { requestId: searchValue },
          {
            bookingReference: {
              $regex: `^${escapeRegex(searchValue)}$`,
              $options: "i",
            },
          },
          {
            requestId: {
              $regex: `^${escapeRegex(searchValue)}$`,
              $options: "i",
            },
          },
          {
            bookingReference: {
              $regex: escapeRegex(searchValue),
              $options: "i",
            },
          },
          { requestId: { $regex: escapeRegex(searchValue), $options: "i" } },
        ],
      };

      const flightBookings = await FlightBooking.find(referenceQuery)
        .populate("flightId", "airline flightNumber departure arrival")
        .select("-__v");

      const groupBookings = await GroupBooking.find(referenceQuery)
        .populate("groupId", "name")
        .select("-__v");

      const hotelBookings = await HotelBooking.find(referenceQuery)
        .populate("hotelId", "name")
        .select("-__v");

      bookings = [
        ...flightBookings.map((b: any) => ({
          ...b.toObject(),
          type: "flight",
        })),
        ...groupBookings.map((b: any) => ({
          ...b.toObject(),
          type: "group",
        })),
        ...hotelBookings.map((b: any) => ({
          ...b.toObject(),
          type: "hotel",
        })),
      ];
    }

    // Search by email
    else if (searchType === "email") {
      const query = { customerEmail: { $regex: searchValue, $options: "i" } };

      const flightBookings = await FlightBooking.find(query)
        .populate("flightId", "airline flightNumber departure arrival")
        .select("-__v");

      const groupBookings = await GroupBooking.find(query)
        .populate("groupId", "name")
        .select("-__v");

      const hotelBookings = await HotelBooking.find(query)
        .populate("hotelId", "name")
        .select("-__v");

      bookings = [
        ...flightBookings.map((b: any) => ({
          ...b.toObject(),
          type: "flight",
        })),
        ...groupBookings.map((b: any) => ({
          ...b.toObject(),
          type: "group",
        })),
        ...hotelBookings.map((b: any) => ({
          ...b.toObject(),
          type: "hotel",
        })),
      ];
    }

    // Format response
    const formattedBookings = bookings.map((booking) => {
      const baseInfo = {
        id: booking._id,
        _id: booking._id,
        bookingReference: booking.bookingReference,
        type: booking.type,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone || booking.contact?.phone,
        totalPrice: booking.totalAmount || booking.totalPrice || 0,
        status: booking.status || "pending",
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        passengers: booking.passengers || booking.guests || [],
      };

      // Add type-specific details
      if (booking.type === "flight" && booking.flightId) {
        return {
          ...baseInfo,
          flightDetails: {
            airline: booking.flightId.airline,
            flightNumber: booking.flightId.flightNumber,
            departure: booking.flightId.departure,
            arrival: booking.flightId.arrival,
          },
        };
      }

      if (booking.type === "group" && booking.groupId) {
        return {
          ...baseInfo,
          groupDetails: {
            groupName: booking.groupId.name,
          },
        };
      }

      if (booking.type === "hotel" && booking.hotelId) {
        return {
          ...baseInfo,
          hotelDetails: {
            hotelName: booking.hotelId.name,
          },
        };
      }

      return baseInfo;
    });

    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("❌ Search Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search bookings",
    });
  }
};

// =====================================================
// GET BOOKING BY ID
// GET /api/bookings/:id
// =====================================================

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Try to find in all booking types
    let booking: any = null;
    let type: string = "";

    booking = await FlightBooking.findById(id).populate(
      "flightId",
      "airline flightNumber departure arrival",
    );
    if (booking) {
      type = "flight";
    }

    if (!booking) {
      booking = await GroupBooking.findById(id).populate("groupId", "name");
      if (booking) {
        type = "group";
      }
    }

    if (!booking) {
      booking = await HotelBooking.findById(id).populate("hotelId", "name");
      if (booking) {
        type = "hotel";
      }
    }

    if (!booking) {
      booking = await FlightBooking.findOne({
        $or: [{ bookingReference: id }, { requestId: id }],
      }).populate("flightId", "airline flightNumber departure arrival");
      if (booking) {
        type = "flight";
      }
    }

    if (!booking) {
      booking = await GroupBooking.findOne({
        $or: [{ bookingReference: id }, { requestId: id }],
      }).populate("groupId", "name");
      if (booking) {
        type = "group";
      }
    }

    if (!booking) {
      booking = await HotelBooking.findOne({
        $or: [{ bookingReference: id }, { requestId: id }],
      }).populate("hotelId", "name");
      if (booking) {
        type = "hotel";
      }
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    const bookingData = booking.toObject();
    res.status(200).json({
      success: true,
      booking: {
        ...bookingData,
        type,
      },
    });
  } catch (error) {
    console.error("❌ Get Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
    });
  }
};
