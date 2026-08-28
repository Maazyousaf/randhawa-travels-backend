import { Request, Response } from "express";
import crypto from "crypto";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import GroupBooking from "../models/groupBooking.model.js";
import Group from "../models/group.model.js";
import {
  CUSTOM_UMRAH_SERVICES,
  getServiceById,
  getActiveServices,
} from "../utils/customUmrahServices.js";

type AuthenticatedRequest = Request & {
  user?: { id?: string; _id?: string; email?: string };
};

const getUserId = (req: AuthenticatedRequest) => req.user?.id || req.user?._id;

const generateBookingReference = () =>
  `WCU-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

// =====================================================
// GET MAKKAH HOTELS
// GET /api/custom-umrah/hotels/makkah
// =====================================================

export const getMakkahHotels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, minStars, maxPrice } = req.query;

    const query: Record<string, unknown> = {
      umrahCity: "makkah",
      isUmrahHotel: true,
      status: "active",
    };

    if (category) {
      query.category = String(category);
    }

    if (minStars) {
      query.stars = { $gte: Number(minStars) };
    }

    const hotels = await Hotel.find(query).sort({
      stars: -1,
      pricePerNight: 1,
    });

    // Filter by maxPrice if provided (check roomTypes pricePerPerson)
    let filteredHotels = hotels;
    if (maxPrice) {
      const max = Number(maxPrice);
      filteredHotels = hotels.filter((hotel) => {
        if (!hotel.roomTypes || hotel.roomTypes.length === 0) return true;
        return hotel.roomTypes.some((room) => room.pricePerPerson <= max);
      });
    }

    res.status(200).json({
      success: true,
      count: filteredHotels.length,
      hotels: filteredHotels,
    });
  } catch (error) {
    console.error("❌ Get Makkah Hotels Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Makkah hotels",
    });
  }
};

// =====================================================
// GET MADINAH HOTELS
// GET /api/custom-umrah/hotels/madinah
// =====================================================

export const getMadinahHotels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, minStars, maxPrice } = req.query;

    const query: Record<string, unknown> = {
      umrahCity: "madinah",
      isUmrahHotel: true,
      status: "active",
    };

    if (category) {
      query.category = String(category);
    }

    if (minStars) {
      query.stars = { $gte: Number(minStars) };
    }

    const hotels = await Hotel.find(query).sort({
      stars: -1,
      pricePerNight: 1,
    });

    // Filter by maxPrice if provided
    let filteredHotels = hotels;
    if (maxPrice) {
      const max = Number(maxPrice);
      filteredHotels = hotels.filter((hotel) => {
        if (!hotel.roomTypes || hotel.roomTypes.length === 0) return true;
        return hotel.roomTypes.some((room) => room.pricePerPerson <= max);
      });
    }

    res.status(200).json({
      success: true,
      count: filteredHotels.length,
      hotels: filteredHotels,
    });
  } catch (error) {
    console.error("❌ Get Madinah Hotels Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Madinah hotels",
    });
  }
};

// =====================================================
// GET SERVICES (VISA, TRANSPORT)
// GET /api/custom-umrah/services
// =====================================================

export const getServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type } = req.query;

    if (type && !["visa", "transport"].includes(String(type))) {
      res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
      return;
    }

    const activeServices = getActiveServices();

    if (type) {
      const services = activeServices[type as keyof typeof activeServices];
      res.status(200).json({
        success: true,
        count: services.length,
        services,
      });
      return;
    }

    const allServices = [...activeServices.visa, ...activeServices.transport];

    res.status(200).json({
      success: true,
      count: allServices.length,
      services: allServices,
      groupedServices: activeServices,
    });
  } catch (error) {
    console.error("❌ Get Services Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

// =====================================================
// CALCULATE CUSTOM UMRAH PRICE
// POST /api/custom-umrah/calculate-price
// =====================================================

export const calculatePrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      adults = 1,
      children = 0,
      infants = 0,
      departureDate,
      returnDate,
      makkahNights: userMakkahNights,
      madinahNights: userMadinahNights,
      makkahHotelId,
      makkahRoomTypeId,
      madinahHotelId,
      madinahRoomTypeId,
      hotelStays, // NEW: Support for multiple hotel stays
      flightId,
      visaId,
      transportId,
      ziyaratId,
    } = req.body;

    const adultCount = Math.max(1, Number(adults));
    const childCount = Math.max(0, Number(children));
    const infantCount = Math.max(0, Number(infants));
    const totalPassengers = adultCount + childCount + infantCount;

    const breakdown: Record<string, unknown> = {
      adults: adultCount,
      children: childCount,
      infants: infantCount,
      totalPassengers,
    };

    let totalAmount = 0;

    // Calculate total nights from dates
    let calculatedNights = 0;
    if (departureDate && returnDate) {
      const depDate = new Date(departureDate);
      const retDate = new Date(returnDate);
      calculatedNights = Math.max(
        1,
        Math.ceil(
          (retDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );
      breakdown.nights = calculatedNights;
    }

    // Use user-provided night distribution if available, otherwise split equally
    const makkahNights =
      userMakkahNights !== undefined && userMakkahNights !== null
        ? Number(userMakkahNights)
        : Math.ceil(calculatedNights / 2);

    const madinahNights =
      userMadinahNights !== undefined && userMadinahNights !== null
        ? Number(userMadinahNights)
        : Math.floor(calculatedNights / 2);

    breakdown.makkahNights = makkahNights;
    breakdown.madinahNights = madinahNights;

    // Flight pricing (if provided)
    if (flightId) {
      const umrahGroup = await Group.findOne({ id: "umrah" });
      if (umrahGroup) {
        let foundFlight: any = null;
        for (const route of umrahGroup.routes) {
          const flight = route.flights.find((f) => f.id === flightId);
          if (flight) {
            foundFlight = flight;
            break;
          }
        }

        if (foundFlight) {
          const flightPrice =
            foundFlight.adultPrice * adultCount +
            foundFlight.childPrice * childCount +
            0;

          breakdown.flight = {
            id: foundFlight.id,
            airline: foundFlight.airline,
            flightNumber: foundFlight.flightNumber,
            adultPrice: foundFlight.adultPrice,
            childPrice: foundFlight.childPrice,
            infantPrice: foundFlight.infantPrice,
            totalPrice: flightPrice,
          };

          totalAmount += flightPrice;
        }
      }
    }

    // NEW: Process multiple hotel stays if provided
    if (hotelStays && Array.isArray(hotelStays) && hotelStays.length > 0) {
      const processedStays = [];

      for (let i = 0; i < hotelStays.length; i++) {
        const stay = hotelStays[i];

        if (!stay.hotelId) {
          continue;
        }

        const hotel = await Hotel.findOne({
          id: stay.hotelId,
          status: "active",
          isUmrahHotel: true,
        });

        if (!hotel) {
          continue;
        }

        let roomType = null;
        if (stay.roomTypeId && hotel.roomTypes) {
          roomType = hotel.roomTypes.find((r) => r.id === stay.roomTypeId);
        }

        const pricePerNight = roomType
          ? roomType.pricePerNight || hotel.pricePerNight
          : hotel.pricePerNight;

        // Calculate price per person for the entire stay
        const pricePerPersonForStay = pricePerNight * stay.nights;

        // Adults and children pay full price; infants stay free.
        const hotelPrice =
          pricePerPersonForStay * adultCount +
          pricePerPersonForStay * childCount;

        processedStays.push({
          id: stay.id,
          stayNumber: i + 1,
          city: stay.city,
          hotelId: hotel.id,
          hotelName: hotel.name,
          starRating: hotel.stars,
          roomType: roomType?.type || "Standard",
          checkInDate: stay.checkInDate,
          checkOutDate: stay.checkOutDate,
          nights: stay.nights,
          pricePerNight,
          pricePerPerson: pricePerPersonForStay,
          totalPrice: hotelPrice,
        });

        totalAmount += hotelPrice;
      }

      if (processedStays.length > 0) {
        breakdown.hotelStays = processedStays;
      }
    }

    // LEGACY: Makkah Hotel (with child/infant discounts) - kept for backward compatibility
    if (makkahHotelId && (!hotelStays || hotelStays.length === 0)) {
      const hotel = await Hotel.findOne({
        id: makkahHotelId,
        status: "active",
        isUmrahHotel: true,
      });

      if (!hotel) {
        res.status(404).json({
          success: false,
          message: "Makkah hotel not found",
        });
        return;
      }

      let roomType = null;
      if (makkahRoomTypeId && hotel.roomTypes) {
        roomType = hotel.roomTypes.find((r) => r.id === makkahRoomTypeId);
      }

      // Use room type price if available, otherwise use base price PER NIGHT
      const pricePerNight = roomType
        ? roomType.pricePerNight || hotel.pricePerNight
        : hotel.pricePerNight;

      // Calculate price per person for the entire stay
      const pricePerPersonForStay = pricePerNight * makkahNights;

      // Adults and children pay full price; infants stay free.
      const hotelPrice =
        pricePerPersonForStay * adultCount + pricePerPersonForStay * childCount;

      breakdown.makkahHotel = {
        id: hotel.id,
        name: hotel.name,
        starRating: hotel.stars,
        roomType: roomType?.type || "Standard",
        pricePerNight,
        pricePerPerson: pricePerPersonForStay,
        nights: makkahNights,
        totalPrice: hotelPrice,
      };

      totalAmount += hotelPrice;
    }

    // LEGACY: Madinah Hotel (with child/infant discounts) - kept for backward compatibility
    if (madinahHotelId && (!hotelStays || hotelStays.length === 0)) {
      const hotel = await Hotel.findOne({
        id: madinahHotelId,
        status: "active",
        isUmrahHotel: true,
      });

      if (!hotel) {
        res.status(404).json({
          success: false,
          message: "Madinah hotel not found",
        });
        return;
      }

      let roomType = null;
      if (madinahRoomTypeId && hotel.roomTypes) {
        roomType = hotel.roomTypes.find((r) => r.id === madinahRoomTypeId);
      }

      const pricePerNight = roomType
        ? roomType.pricePerNight || hotel.pricePerNight
        : hotel.pricePerNight;

      // Calculate price per person for the entire stay
      const pricePerPersonForStay = pricePerNight * madinahNights;

      // Adults and children pay full price; infants stay free.
      const hotelPrice =
        pricePerPersonForStay * adultCount + pricePerPersonForStay * childCount;

      breakdown.madinahHotel = {
        id: hotel.id,
        name: hotel.name,
        starRating: hotel.stars,
        roomType: roomType?.type || "Standard",
        pricePerNight,
        pricePerPerson: pricePerPersonForStay,
        nights: madinahNights,
        totalPrice: hotelPrice,
      };

      totalAmount += hotelPrice;
    }

    // Visa: adults and children pay full price; infants receive 10% off.
    if (visaId && visaId !== "visa-none") {
      const service = getServiceById("visa", visaId);

      if (service) {
        const visaPrice =
          service.pricePerPerson > 0
            ? service.pricePerPerson * adultCount +
              service.pricePerPerson * childCount +
              service.pricePerPerson * 0.9 * infantCount
            : service.pricePerPackage || 0;

        breakdown.visa = {
          id: service.id,
          name: service.name,
          pricePerPerson: service.pricePerPerson,
          totalPrice: visaPrice,
        };

        totalAmount += visaPrice;
      }
    }

    // Transport: adults and children pay full price; infants are free.
    if (transportId && transportId !== "transport-none") {
      const service = getServiceById("transport", transportId);

      if (service) {
        const transportPrice =
          service.pricePerPerson > 0
            ? service.pricePerPerson * adultCount +
              service.pricePerPerson * childCount
            : service.pricePerPackage || 0;

        breakdown.transport = {
          id: service.id,
          name: service.name,
          pricePerPerson: service.pricePerPerson,
          pricePerPackage: service.pricePerPackage,
          totalPrice: transportPrice,
        };

        totalAmount += transportPrice;
      }
    }

    breakdown.subtotal = totalAmount;
    breakdown.total = totalAmount;
    breakdown.currency = "PKR";
    // Calculate per-person price based on PAYING passengers only (adults + children)
    // Infants don't pay for hotels/transport, only partial visa (10% off)
    const payingPassengers = adultCount + childCount;
    breakdown.pricePerPerson =
      payingPassengers > 0 ? Math.round(totalAmount / payingPassengers) : 0;

    res.status(200).json({
      success: true,
      breakdown,
      totalAmount,
      currency: "PKR",
    });
  } catch (error) {
    console.error("❌ Calculate Price Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate price",
    });
  }
};

// =====================================================
// CREATE CUSTOM UMRAH BOOKING
// POST /api/custom-umrah/bookings
// =====================================================

export const createCustomUmrahBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      // Trip details
      adults = 1,
      children = 0,
      infants = 0,
      pakistanAirport,
      pakistanAirportCity,
      saudiAirport,
      saudiAirportCity,
      departureDate,
      returnDate,

      // Selections
      hotelStays, // NEW: Multiple hotel stays
      flightId,
      makkahHotelId,
      makkahRoomTypeId,
      madinahHotelId,
      madinahRoomTypeId,
      visaId,
      transportId,
      ziyaratId,

      // PNR
      pnr,

      // Customer
      customerName,
      customerEmail,
      customerPhone,

      // Passengers
      passengers,

      // Payment
      paymentMethod,
      payment,

      // Notes
      notes,
    } = req.body;

    // Validation - Check if hotels are provided (either via hotelStays or legacy fields)
    const hasHotelStays =
      hotelStays &&
      Array.isArray(hotelStays) &&
      hotelStays.filter((s) => s.hotelId).length > 0;
    const hasLegacyHotels =
      makkahHotelId &&
      String(makkahHotelId).trim() &&
      madinahHotelId &&
      String(madinahHotelId).trim();

    if (!hasHotelStays && !hasLegacyHotels) {
      res.status(400).json({
        success: false,
        message: "Hotel selections are required",
      });
      return;
    }

    // If using hotelStays, validate that at least one hotel is selected
    if (hasHotelStays) {
      const selectedStays = hotelStays.filter((stay) => stay.hotelId);
      if (selectedStays.length === 0) {
        res.status(400).json({
          success: false,
          message: "At least one hotel must be selected",
        });
        return;
      }
    }

    if (!departureDate || !returnDate) {
      res.status(400).json({
        success: false,
        message: "Departure and return dates are required",
      });
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      res.status(400).json({
        success: false,
        message: "Customer details are required",
      });
      return;
    }

    const adultCount = Math.max(1, Number(adults));
    const childCount = Math.max(0, Number(children));
    const infantCount = Math.max(0, Number(infants));
    const totalPassengers = adultCount + childCount + infantCount;

    if (!Array.isArray(passengers) || passengers.length !== totalPassengers) {
      res.status(400).json({
        success: false,
        message: "Passenger count mismatch",
      });
      return;
    }

    // Validate passenger dates and passport
    for (const p of passengers) {
      // Validate Date of Birth - must be in the past
      if (p.dob || p.dateOfBirth) {
        const dobValue = p.dob || p.dateOfBirth || "";
        const dob = new Date(dobValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dob.setHours(0, 0, 0, 0);

        if (dob >= today) {
          res.status(400).json({
            success: false,
            message: `Invalid date of birth for ${p.firstName} ${p.lastName}. Date must be in the past.`,
          });
          return;
        }
      }

      // Validate Passport Expiry - must be valid for at least 7 months
      if (p.passportExpiry) {
        const expiryValue = p.passportExpiry || "";
        const expiry = new Date(expiryValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        // Calculate 7 months from today
        const sevenMonthsLater = new Date(today);
        sevenMonthsLater.setMonth(sevenMonthsLater.getMonth() + 7);

        if (expiry < sevenMonthsLater) {
          res.status(400).json({
            success: false,
            message: `Passport for ${p.firstName} ${p.lastName} must be valid for at least 7 months from today.`,
          });
          return;
        }
      }
    }

    // Calculate nights
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);
    const nights = Math.max(
      1,
      Math.ceil(
        (retDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const makkahNights = Math.ceil(nights / 2);
    const madinahNights = Math.floor(nights / 2);

    // RECALCULATE PRICE ON SERVER
    let totalAmount = 0;

    // Flight pricing
    let flightSnapshot = null;
    if (flightId) {
      const umrahGroup = await Group.findOne({ id: "umrah" });
      if (umrahGroup) {
        for (const route of umrahGroup.routes) {
          const flight = route.flights.find((f) => f.id === flightId);
          if (flight) {
            const flightPrice =
              flight.adultPrice * adultCount +
              flight.childPrice * childCount +
              0;

            flightSnapshot = {
              id: flight.id,
              airline: flight.airline,
              airlineCode: flight.airlineCode,
              airlineLogo: flight.airlineLogo,
              from: flight.from,
              fromCity: flight.fromCity,
              to: flight.to,
              toCity: flight.toCity,
              flightNumber: flight.flightNumber,
              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,
              duration: flight.duration,
              date: flight.date,
              adultPrice: flight.adultPrice,
              childPrice: flight.childPrice,
              infantPrice: flight.infantPrice,
              class: flight.class,
            };

            totalAmount += flightPrice;
            break;
          }
        }
      }
    }

    // NEW: Process hotel stays if provided (multiple stays support)
    const hotelSnapshots: any[] = [];
    let makkahHotelSnapshot = null;
    let madinahHotelSnapshot = null;

    if (hasHotelStays) {
      for (const stay of hotelStays) {
        if (!stay.hotelId) {
          continue;
        }

        const hotel = await Hotel.findOne({
          id: stay.hotelId,
          status: "active",
          isUmrahHotel: true,
        });

        if (!hotel) {
          continue;
        }

        let roomType = null;
        if (stay.roomTypeId && hotel.roomTypes) {
          roomType = hotel.roomTypes.find((r) => r.id === stay.roomTypeId);
        }

        const pricePerNight = roomType
          ? roomType.pricePerNight || hotel.pricePerNight
          : hotel.pricePerNight;

        // Calculate price per person for the entire stay
        const pricePerPersonForStay = pricePerNight * stay.nights;

        // Adults and children pay full price; infants stay free.
        const hotelPrice =
          pricePerPersonForStay * adultCount +
          pricePerPersonForStay * childCount;

        hotelSnapshots.push({
          id: stay.id,
          city: stay.city,
          checkInDate: stay.checkInDate,
          checkOutDate: stay.checkOutDate,
          nights: stay.nights,
          hotelId: hotel.id,
          hotelName: hotel.name,
          starRating: hotel.stars,
          location: hotel.location,
          distanceFromHaram: hotel.distanceFromHaram,
          distanceFromMasjidNabawi: hotel.distanceFromMasjidNabawi,
          image: hotel.image,
          roomType: roomType?.type || "Standard",
          pricePerNight,
          pricePerPerson: pricePerPersonForStay,
          totalPrice: hotelPrice,
        });

        totalAmount += hotelPrice;
      }
    } else {
      // LEGACY: Process single Makkah and Madinah hotels
      // Makkah hotel pricing
      const makkahHotel = await Hotel.findOne({
        id: makkahHotelId,
        status: "active",
      });

      if (!makkahHotel) {
        res.status(404).json({
          success: false,
          message: "Makkah hotel not found",
        });
        return;
      }

      let makkahRoomType = null;
      if (makkahRoomTypeId && makkahHotel.roomTypes) {
        makkahRoomType = makkahHotel.roomTypes.find(
          (r) => r.id === makkahRoomTypeId,
        );
      }

      const makkahPricePerNight = makkahRoomType
        ? makkahRoomType.pricePerNight || makkahHotel.pricePerNight
        : makkahHotel.pricePerNight;

      // Calculate price per person for the entire stay
      const makkahPricePerPersonForStay = makkahPricePerNight * makkahNights;

      // Adults and children pay full price; infants stay free.
      const makkahPrice =
        makkahPricePerPersonForStay * adultCount +
        makkahPricePerPersonForStay * childCount;

      const makkahHotelSnapshot = {
        id: makkahHotel.id,
        name: makkahHotel.name,
        city: makkahHotel.city,
        starRating: makkahHotel.stars,
        location: makkahHotel.location,
        distanceFromHaram: makkahHotel.distanceFromHaram,
        image: makkahHotel.image,
        roomType: makkahRoomType?.type || "Standard",
        pricePerNight: makkahPricePerNight,
        pricePerPerson: makkahPricePerPersonForStay,
        nights: makkahNights,
        totalPrice: makkahPrice,
      };
      totalAmount += makkahPrice;

      // Madinah hotel pricing
      const madinahHotel = await Hotel.findOne({
        id: madinahHotelId,
        status: "active",
      });

      if (!madinahHotel) {
        res.status(404).json({
          success: false,
          message: "Madinah hotel not found",
        });
        return;
      }

      let madinahRoomType = null;
      if (madinahRoomTypeId && madinahHotel.roomTypes) {
        madinahRoomType = madinahHotel.roomTypes.find(
          (r) => r.id === madinahRoomTypeId,
        );
      }

      const madinahPricePerNight = madinahRoomType
        ? madinahRoomType.pricePerNight || madinahHotel.pricePerNight
        : madinahHotel.pricePerNight;

      // Calculate price per person for the entire stay
      const madinahPricePerPersonForStay = madinahPricePerNight * madinahNights;

      // Adults and children pay full price; infants stay free.
      const madinahPrice =
        madinahPricePerPersonForStay * adultCount +
        madinahPricePerPersonForStay * childCount;

      const madinahHotelSnapshot = {
        id: madinahHotel.id,
        name: madinahHotel.name,
        city: madinahHotel.city,
        starRating: madinahHotel.stars,
        location: madinahHotel.location,
        distanceFromMasjidNabawi: madinahHotel.distanceFromMasjidNabawi,
        image: madinahHotel.image,
        roomType: madinahRoomType?.type || "Standard",
        pricePerNight: madinahPricePerNight,
        pricePerPerson: madinahPricePerPersonForStay,
        nights: madinahNights,
        totalPrice: madinahPrice,
      };
      totalAmount += madinahPrice;

      // Store legacy snapshots in array for consistency
      hotelSnapshots.push(makkahHotelSnapshot, madinahHotelSnapshot);
    }

    // Service snapshots
    let visaSnapshot = null;
    let transportSnapshot = null;
    let ziyaratSnapshot = null;

    if (visaId && visaId !== "visa-none") {
      const service = getServiceById("visa", visaId);

      if (service) {
        const visaPrice =
          service.pricePerPerson > 0
            ? service.pricePerPerson * adultCount +
              service.pricePerPerson * childCount +
              service.pricePerPerson * 0.9 * infantCount
            : service.pricePerPackage || 0;

        visaSnapshot = {
          id: service.id,
          type: "visa",
          name: service.name,
          description: service.description,
          pricePerPerson: service.pricePerPerson,
          totalPrice: visaPrice,
          selected: true,
        };

        totalAmount += visaPrice;
      }
    }

    if (transportId && transportId !== "transport-none") {
      const service = getServiceById("transport", transportId);

      if (service) {
        const transportPrice =
          service.pricePerPerson > 0
            ? service.pricePerPerson * adultCount +
              service.pricePerPerson * childCount
            : service.pricePerPackage || 0;

        transportSnapshot = {
          id: service.id,
          type: "transport",
          name: service.name,
          description: service.description,
          pricePerPerson: service.pricePerPerson,
          pricePerPackage: service.pricePerPackage,
          totalPrice: transportPrice,
          selected: true,
        };

        totalAmount += transportPrice;
      }
    }

    if (ziyaratId && ziyaratId !== "ziyarat-none") {
      const service = getServiceById("ziyarat", ziyaratId);

      if (service) {
        const ziyaratPrice =
          service.pricePerPerson > 0
            ? service.pricePerPerson * adultCount +
              service.pricePerPerson * childCount
            : service.pricePerPackage || 0;

        ziyaratSnapshot = {
          id: service.id,
          type: "ziyarat",
          name: service.name,
          description: service.description,
          pricePerPerson: service.pricePerPerson,
          totalPrice: ziyaratPrice,
          selected: true,
        };

        totalAmount += ziyaratPrice;
      }
    }

    // Create booking
    const bookingReference = generateBookingReference();
    const userId = getUserId(req as AuthenticatedRequest);

    const bookingPayload: any = {
      bookingReference,
      bookingType: "custom-umrah" as const,

      // Group reference (use umrah group)
      groupId: "umrah",
      groupName: "Customized Umrah",
      groupLabel: "Customized Umrah Package",
      groupCountry: "Saudi Arabia",
      groupType: "fixed",

      // Trip details
      customUmrahTripDetails: {
        adults: adultCount,
        children: childCount,
        infants: infantCount,
        pakistanAirport,
        pakistanAirportCity,
        saudiAirport,
        saudiAirportCity,
        departureDate,
        returnDate,
      },

      // Flight
      flightId: flightId || "",
      flightSnapshot,

      // Hotels - Support both multiple stays and legacy format
      hotelStays: hasHotelStays ? hotelSnapshots : undefined,
      // Legacy fields (only set when NOT using hotelStays)
      makkahHotelId: hasHotelStays ? undefined : makkahHotelId,
      makkahHotelSnapshot: hasHotelStays ? undefined : hotelSnapshots[0],
      madinahHotelId: hasHotelStays ? undefined : madinahHotelId,
      madinahHotelSnapshot: hasHotelStays ? undefined : hotelSnapshots[1],

      // Services
      visaServiceId: visaId || "",
      visaSnapshot,
      transportServiceId: transportId || "",
      transportSnapshot,
      ziyaratServiceId: ziyaratId || "",
      ziyaratSnapshot,

      // PNR
      pnr: pnr || "",

      // Customer
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      customer: {
        name: customerName,
        email: customerEmail.toLowerCase(),
        phone: customerPhone,
      },

      // Passengers
      passengers: passengers.map((p: any) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        gender: p.gender || "",
        dob: p.dob || p.dateOfBirth || "",
        dateOfBirth: p.dateOfBirth || p.dob || "",
        nationality: p.nationality || "",
        passportNumber: p.passportNumber || "",
        passportExpiry: p.passportExpiry || "",
        passportCountry: p.passportCountry || "",
        passportUrl: p.passportUrl || "",
        type: p.type || "adult",
      })),

      adults: adultCount,
      children: childCount,
      infants: infantCount,
      passengerCount: totalPassengers,

      // Pricing
      totalAmount,
      amount: totalAmount,
      currency: "PKR",
      baseAmount: totalAmount,

      // Dates
      departureDate,
      returnDate,
      durationDays: nights,

      // Payment
      paymentMethod: paymentMethod || undefined,
      payment: payment || undefined,
      receiptUrl: payment?.receiptUrl || undefined,
      receiptFileName: payment?.receiptFileName || undefined,

      // Status
      status: "pending",
      paymentStatus: "pending",

      // User
      userId,

      // Notes
      notes: notes || "",
      agentRemarks: notes || "",

      // Package reference (for compatibility)
      packageId: "",
      routeId: "",
    };

    const booking = await GroupBooking.create(bookingPayload);

    // SEND EMAIL
    try {
      const { sendEmail } = await import("../utils/email.js");
      const { buildCustomUmrahEmail } =
        await import("../utils/buildCustomUmrahEmail.js");

      const emailBody = buildCustomUmrahEmail(booking.toObject());
      await sendEmail(
        customerEmail,
        `Randhawa Air Travels Int'l - Custom Umrah Booking Request ${booking.bookingReference}`,
        emailBody,
      );
    } catch (emailError) {
      console.error(
        "⚠️ Failed to send Custom Umrah booking email:",
        emailError,
      );
      // Don't fail the booking creation if email fails
    }

    res.status(201).json({
      success: true,
      message: "Custom Umrah booking created successfully",
      booking,
      bookingReference: booking.bookingReference,
    });
  } catch (error: any) {
    console.error("❌ Create Custom Umrah Booking Error:", error);

    if (error?.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create Custom Umrah booking",
      error:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

// =====================================================
// GET CUSTOM UMRAH BOOKING BY REFERENCE
// GET /api/custom-umrah/bookings/:reference
// =====================================================

export const getCustomUmrahBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { reference } = req.params;

    const booking = await GroupBooking.findOne({
      bookingReference: reference,
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Custom Umrah booking not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("❌ Get Custom Umrah Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Custom Umrah booking",
    });
  }
};

// =====================================================
// UPDATE PAYMENT FOR CUSTOM UMRAH BOOKING
// PATCH /api/custom-umrah/bookings/:reference/payment
// =====================================================

export const updateCustomUmrahPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { reference } = req.params;
    const { paymentMethod, receiptUrl, receiptFileName } = req.body;

    // Find booking by reference
    const booking = await GroupBooking.findOne({
      bookingReference: reference,
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Custom Umrah booking not found",
      });
      return;
    }

    // Update payment info
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }

    if (receiptUrl || receiptFileName) {
      booking.payment = {
        ...(booking.payment || {}),
        method: paymentMethod || booking.paymentMethod || "agency",
        receiptUrl,
        receiptFileName,
        submittedAt: new Date(),
      };
      booking.receiptUrl = receiptUrl;
      booking.receiptFileName = receiptFileName;
    }

    booking.paymentStatus = "paid";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment information updated successfully",
      booking: {
        bookingReference: booking.bookingReference,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("❌ Update Custom Umrah Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment information",
    });
  }
};

// =====================================================
// SEND CUSTOM UMRAH BOOKING EMAIL
// POST /api/custom-umrah/bookings/:reference/send-email
// =====================================================

export const sendCustomUmrahBookingEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { reference } = req.params;

    // Find booking by reference
    const booking = await GroupBooking.findOne({
      bookingReference: reference,
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Custom Umrah booking not found",
      });
      return;
    }

    // Get customer email
    const emailAddress = (
      booking.customerEmail ||
      booking.customer?.email ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!emailAddress) {
      res.status(400).json({
        success: false,
        message: "No email address found for this custom Umrah booking",
      });
      return;
    }

    // Build and send email
    const { sendEmail } = await import("../utils/email.js");
    const { buildCustomUmrahEmail } =
      await import("../utils/buildCustomUmrahEmail.js");

    const emailBody = buildCustomUmrahEmail(booking.toObject());
    await sendEmail(
      emailAddress,
      `Randhawa Air Travels Int'l - Custom Umrah Booking Request ${booking.bookingReference}`,
      emailBody,
    );

    res.status(200).json({
      success: true,
      message: "Booking details sent to email successfully",
    });
  } catch (error) {
    console.error("❌ Send Custom Umrah Booking Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send custom Umrah booking details to email.",
    });
  }
};

// =====================================================
// UPDATE CUSTOM UMRAH AGENT REMARKS
// PATCH /api/custom-umrah/bookings/:id
// =====================================================

export const updateCustomUmrahAgentRemarks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { agentRemarks, notes } = req.body;

    // Find booking by ID or reference
    const booking = await GroupBooking.findOne({
      $or: [{ _id: id }, { bookingReference: id }],
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Custom Umrah booking not found",
      });
      return;
    }

    // Update agent remarks
    if (agentRemarks !== undefined) {
      booking.agentRemarks = agentRemarks;
    }
    if (notes !== undefined) {
      booking.notes = notes;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Agent remarks updated successfully",
      booking: {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        agentRemarks: booking.agentRemarks,
        notes: booking.notes,
      },
    });
  } catch (error) {
    console.error("❌ Update Custom Umrah Agent Remarks Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update agent remarks",
    });
  }
};

// =====================================================
// ADD CLIENT REMARK / MESSAGE (WITH OPTIONAL ATTACHMENT)
// POST /api/custom-umrah/bookings/:id/client-remarks
// GUEST BOOKING ALLOWED - Optional authentication
// =====================================================
export const addClientRemarkCustomUmrah = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { message, attachmentUrl, attachmentFileName } = req.body as {
      message?: string;
      attachmentUrl?: string;
      attachmentFileName?: string;
    };

    if (!message || !String(message).trim()) {
      res.status(400).json({ success: false, message: "Message is required" });
      return;
    }

    const booking = await GroupBooking.findOne({
      $or: [{ _id: id }, { bookingReference: id }],
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const remarkId = `remark-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newRemark = {
      id: remarkId,
      message: String(message).trim(),
      attachmentUrl: attachmentUrl ? String(attachmentUrl).trim() : undefined,
      attachmentFileName: attachmentFileName
        ? String(attachmentFileName).trim()
        : undefined,
      createdAt: new Date(),
    };

    if (!booking.clientRemarks) {
      booking.clientRemarks = [];
    }

    booking.clientRemarks.push(newRemark);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Client remark added successfully",
      remark: newRemark,
      booking,
    });
  } catch (error: any) {
    console.error("❌ Add Client Remark (Custom Umrah) Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add client remark",
    });
  }
};

// =====================================================
// ADD ADMIN REPLY TO CLIENT REMARK (CUSTOM UMRAH)
// POST /api/custom-umrah/bookings/:id/admin-reply
// PROTECTED - Admin only
// =====================================================
export const addAdminReplyCustomUmrah = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = String(req.params.id);
    const { message, resolved } = req.body as {
      message?: string;
      resolved?: boolean;
    };

    if (!message || !String(message).trim()) {
      res
        .status(400)
        .json({ success: false, message: "Reply message is required" });
      return;
    }

    const userId = getUserId(authReq);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const booking = await GroupBooking.findOne({
      $or: [{ _id: id }, { bookingReference: id }],
      bookingType: "custom-umrah",
    });

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const adminUser = await User.findById(userId).select("name email");
    const adminName = adminUser?.name?.trim() || "Admin";
    const adminEmail = adminUser?.email?.trim() || "";

    const replyId = `reply-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newReply = {
      id: replyId,
      message: String(message).trim(),
      adminId: userId,
      adminName,
      adminEmail,
      createdAt: new Date(),
      resolved: Boolean(resolved) || false,
    };

    if (!booking.adminReplies) {
      booking.adminReplies = [];
    }

    booking.adminReplies.push(newReply);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Admin reply added successfully",
      reply: newReply,
      booking,
    });
  } catch (error: any) {
    console.error("❌ Add Admin Reply (Custom Umrah) Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add admin reply",
    });
  }
};
