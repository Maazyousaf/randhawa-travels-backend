import { Request, Response } from "express";
import FlightBooking from "../models/flightBooking.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";
import { buildBookingEmail } from "../utils/buildBookingEmail.js";
import { buildFlightBookingEmail } from "../utils/buildFlightBookingEmail.js";
import crypto from "crypto";

// =====================================================
// GENERATE BOOKING REFERENCE
// =====================================================

const generateFlightBookingReference = () =>
  `WF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

// =====================================================
// CREATE FLIGHT BOOKING
// =====================================================

export const createFlightBooking = async (req: Request, res: Response) => {
  try {
    // =================================================
    // GET LOGGED-IN USER (OPTIONAL - for authenticated users)
    // =================================================

    const user = (req as any).user;

    const userId = user?.id || user?._id;

    // Get user from database if authenticated
    const loggedInUser = userId
      ? await User.findById(userId).select("name email phone")
      : null;

    // =================================================
    // GET BOOKING DATA FROM FRONTEND
    // =================================================

    const {
      requestId,

      flightId,

      airline,
      airlineCode,
      airlineLogo,

      flightNumber,

      from,
      fromCode,

      to,
      toCode,

      departureDate,
      departureTime,

      arrivalDate,
      arrivalTime,

      duration,

      cabin,
      class: flightClass,

      baggage,
      meal,

      stops,
      stopCities,

      adults,
      children,
      infants,

      passengers,

      // Contact email/phone are NOT trusted from frontend.
      // Email + phone will always come from logged-in user.
      contact,

      extras,

      adultPrice,
      childPrice,
      infantPrice,

      baseAmount,
      taxes,
      fees,
      extrasTotal,

      coupon,
      couponDiscount,

      totalAmount,
      currency,

      // Payment
      paymentMethod,
      payment,

      // Backward-compatible receipt fields
      receiptFileName,
      receiptUrl,

      agentRemarks,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!flightId) {
      return res.status(400).json({
        ok: false,
        message: "Flight ID is required",
      });
    }

    if (!requestId) {
      return res.status(400).json({
        ok: false,
        message: "Request ID is required",
      });
    }

    if (!passengers || !Array.isArray(passengers)) {
      return res.status(400).json({
        ok: false,
        message: "Passengers are required",
      });
    }

    if (passengers.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "At least one passenger is required",
      });
    }

    // =================================================
    // CONTACT EMAIL/PHONE VALIDATION
    // Must come from the booking form payload, NOT from auth user
    // =================================================

    const contactEmail = String(
      contact?.email || req.body?.email || req.body?.customer?.email || "",
    )
      .trim()
      .toLowerCase();

    const contactPhone = String(
      contact?.phone || req.body?.phone || req.body?.customer?.phone || "",
    ).trim();

    if (!contactEmail) {
      return res.status(400).json({
        ok: false,
        message: "Email is required for the booking contact",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return res.status(400).json({
        ok: false,
        message: "A valid email address is required for the booking contact",
      });
    }

    if (!contactPhone) {
      return res.status(400).json({
        ok: false,
        message: "Phone number is required for the booking contact",
      });
    }

    if (contactPhone.replace(/\D/g, "").length < 7) {
      return res.status(400).json({
        ok: false,
        message: "A valid phone number is required for the booking contact",
      });
    }

    // =================================================
    // VALIDATE EACH PASSENGER (including passport image)
    // =================================================

    for (const [index, passenger] of passengers.entries()) {
      const passportUrl = String(
        passenger?.passportUrl || passenger?.passportImage || "",
      ).trim();

      if (!passenger?.firstName || !String(passenger.firstName).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Passenger ${index + 1}: First name is required`,
        });
      }

      if (!passenger?.lastName || !String(passenger.lastName).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Passenger ${index + 1}: Last name is required`,
        });
      }

      if (
        !passenger?.passportNumber ||
        !String(passenger.passportNumber).trim()
      ) {
        return res.status(400).json({
          ok: false,
          message: `Passenger ${index + 1}: Passport number is required`,
        });
      }

      if (!passenger?.nationality || !String(passenger.nationality).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Passenger ${index + 1}: Nationality is required`,
        });
      }

      // Passport image is mandatory
      if (!passportUrl) {
        return res.status(400).json({
          ok: false,
          message: `Passenger ${index + 1}: Passport image is required. Please upload a passport image.`,
        });
      }

      // Validate Date of Birth - must be in the past
      if (passenger.dob) {
        const dobValue = passenger.dob || "";
        const dob = new Date(dobValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dob.setHours(0, 0, 0, 0);

        if (dob >= today) {
          return res.status(400).json({
            ok: false,
            message: `Passenger ${index + 1} (${passenger.firstName} ${passenger.lastName}): Date of birth must be in the past.`,
          });
        }
      }

      // Validate Passport Expiry - must be valid for at least 7 months
      if (passenger.passportExpiry) {
        const expiryValue = passenger.passportExpiry || "";
        const expiry = new Date(expiryValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        // Calculate 7 months from today
        const sevenMonthsLater = new Date(today);
        sevenMonthsLater.setMonth(sevenMonthsLater.getMonth() + 7);

        if (expiry < sevenMonthsLater) {
          return res.status(400).json({
            ok: false,
            message: `Passenger ${index + 1} (${passenger.firstName} ${passenger.lastName}): Passport must be valid for at least 7 months from today.`,
          });
        }
      }
    }

    if (baseAmount === undefined || totalAmount === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Booking amount is required",
      });
    }

    // =================================================
    // PAYMENT METHOD VALIDATION
    // =================================================

    if (paymentMethod && !["agency", "bank"].includes(paymentMethod)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid payment method",
      });
    }

    // =================================================
    // CHECK DUPLICATE REQUEST ID
    // =================================================

    const existingBooking = await FlightBooking.findOne({
      requestId,
    });

    if (existingBooking) {
      return res.status(409).json({
        ok: false,
        message: "A booking request with this ID already exists",
        booking: existingBooking,
      });
    }

    // =================================================
    // CONTACT FROM BOOKING FORM (NOT from auth user)
    // =================================================

    const bookingContact = {
      email: contactEmail,
      phone: contactPhone,

      // These optional fields can still come from
      // the booking form if your frontend provides them.
      countryCode: contact?.countryCode || "+92",

      emergencyName: contact?.emergencyName || undefined,

      emergencyPhone: contact?.emergencyPhone || undefined,
    };

    // =================================================
    // PREPARE PASSENGERS
    // =================================================

    const bookingPassengers = passengers.map((passenger: any) => ({
      firstName: String(passenger.firstName || "").trim(),

      lastName: String(passenger.lastName || "").trim(),

      gender: passenger.gender || "",

      dob: passenger.dob || "",

      nationality: String(passenger.nationality || "").trim(),

      passportNumber: String(passenger.passportNumber || "").trim(),

      passportExpiry: String(passenger.passportExpiry || "").trim(),

      passportCountry: String(
        passenger.passportCountry || passenger.passportIssueCountry || "",
      ).trim(),

      passportIssueCountry: String(
        passenger.passportIssueCountry || passenger.passportCountry || "",
      ).trim(),

      type: passenger.type,

      // Cloudinary URLs
      passportUrl: String(
        passenger.passportUrl || passenger.passportImage || "",
      ).trim(),

      // selfieUrl: passenger.selfieUrl || undefined,
    }));
    // =================================================
    // PREPARE PAYMENT DATA
    // =================================================

    const paymentData = payment
      ? {
          method: payment.method || paymentMethod || undefined,

          transactionId: payment.transactionId || undefined,

          paymentReference: payment.paymentReference || undefined,

          bankName: payment.bankName || undefined,

          accountName: payment.accountName || undefined,

          // Cloudinary receipt URL
          receiptFileName:
            payment.receiptFileName || receiptFileName || undefined,

          receiptUrl: payment.receiptUrl || receiptUrl || undefined,

          amount:
            payment.amount !== undefined
              ? Number(payment.amount)
              : Number(totalAmount),

          currency: payment.currency || currency || "PKR",

          submittedAt: payment.submittedAt
            ? new Date(payment.submittedAt)
            : payment.receiptUrl || receiptUrl
              ? new Date()
              : undefined,
        }
      : paymentMethod || receiptUrl || receiptFileName
        ? {
            method: paymentMethod || undefined,

            receiptFileName: receiptFileName || undefined,

            receiptUrl: receiptUrl || undefined,

            amount: Number(totalAmount),

            currency: currency || "PKR",

            submittedAt: receiptUrl ? new Date() : undefined,
          }
        : undefined;

    // =================================================
    // DETERMINE PAYMENT STATUS
    // =================================================

    const finalReceiptUrl = paymentData?.receiptUrl || receiptUrl;

    const finalPaymentStatus = finalReceiptUrl ? "submitted" : "pending";

    // =================================================
    // GENERATE BOOKING REFERENCE (for guest search)
    // =================================================

    const bookingReference = generateFlightBookingReference();

    // =================================================
    // CREATE FLIGHT BOOKING
    // =================================================

    const booking = await FlightBooking.create({
      // ---------------------------------------------
      // User (Optional for guest bookings)
      // ---------------------------------------------

      userId: userId || undefined,

      // ---------------------------------------------
      // Request
      // ---------------------------------------------

      requestId,

      // ---------------------------------------------
      // Booking Reference (for guest search)
      // ---------------------------------------------

      bookingReference,

      // ---------------------------------------------
      // Booking Status
      // ---------------------------------------------

      status: "pending",

      // ---------------------------------------------
      // Payment Status
      // ---------------------------------------------

      paymentStatus: finalPaymentStatus,

      // ---------------------------------------------
      // Flight
      // ---------------------------------------------

      flightId,

      airline,

      airlineCode,

      airlineLogo,

      flightNumber,

      from,

      fromCode,

      to,

      toCode,

      departureDate,

      departureTime,

      arrivalDate,

      arrivalTime,

      duration,

      cabin,

      class: flightClass,

      baggage,

      meal: meal ?? false,

      stops: stops ?? 0,

      stopCities: Array.isArray(stopCities) ? stopCities : [],

      // ---------------------------------------------
      // Passenger Counts
      // ---------------------------------------------

      adults: adults ?? 1,

      children: children ?? 0,

      infants: infants ?? 0,

      // ---------------------------------------------
      // Passenger Details
      // ---------------------------------------------

      passengers: bookingPassengers,

      // ---------------------------------------------
      // Contact
      // ---------------------------------------------

      contact: bookingContact,

      // -----------------------------------------------
      // Customer Info (for search and notifications)
      // -----------------------------------------------

      customerName: bookingPassengers[0]
        ? `${bookingPassengers[0].firstName} ${bookingPassengers[0].lastName}`
        : "Guest",

      customerEmail: contactEmail,

      customerPhone: contactPhone,

      // -----------------------------------------------
      // Extras
      // -----------------------------------------------

      extras: extras ?? {
        extraBaggage: false,
        insurance: false,
        seatSelection: false,
        meal: false,
        flexibleTicket: false,
        refundProtection: false,
      },

      // -----------------------------------------------
      // Pricing
      // -----------------------------------------------

      adultPrice: adultPrice ?? 0,

      childPrice: childPrice ?? 0,

      infantPrice: infantPrice ?? 0,

      baseAmount: Number(baseAmount),

      taxes: taxes ?? 0,

      fees: fees ?? 0,

      extrasTotal: extrasTotal ?? 0,

      coupon: coupon ?? "",

      couponDiscount: couponDiscount ?? 0,

      totalAmount: Number(totalAmount),

      currency: currency ?? "PKR",

      // ---------------------------------------------
      // Payment
      // ---------------------------------------------

      paymentMethod: paymentData?.method || paymentMethod || undefined,

      payment: paymentData,

      // ---------------------------------------------
      // Backward-Compatible Receipt
      // ---------------------------------------------

      receiptFileName:
        paymentData?.receiptFileName || receiptFileName || undefined,

      receiptUrl: paymentData?.receiptUrl || receiptUrl || undefined,

      // ---------------------------------------------
      // Remarks
      // ---------------------------------------------

      agentRemarks: agentRemarks || undefined,
    });

    // =================================================
    // RESPONSE
    // =================================================
    // NOTE: Email will be sent when user clicks "Confirm Booking Request" button
    // via the sendBookingEmail() endpoint

    return res.status(201).json({
      ok: true,

      message: "Flight booking request submitted successfully",

      booking: {
        id: booking._id,

        requestId: booking.requestId,

        bookingReference: booking.bookingReference,

        status: booking.status,

        paymentStatus: booking.paymentStatus,

        paymentMethod: booking.paymentMethod,

        payment: booking.payment,

        totalAmount: booking.totalAmount,

        currency: booking.currency,

        createdAt: booking.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create Flight Booking Error:", error);

    // =================================================
    // DUPLICATE KEY ERROR
    // =================================================

    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "A booking with this request ID already exists",
      });
    }

    // =================================================
    // MONGOOSE VALIDATION ERROR
    // =================================================

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: "Booking validation failed",
        error:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      });
    }

    // =================================================
    // SERVER ERROR
    // =================================================

    return res.status(500).json({
      ok: false,

      message: "Failed to create flight booking",

      error:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

// =====================================================
// GET MY FLIGHT BOOKINGS
// =====================================================

export const getMyFlightBookings = async (req: Request, res: Response) => {
  try {
    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const user = (req as any).user;

    const userId = user?.id || user?._id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Authentication required",
      });
    }

    // =================================================
    // GET USER BOOKINGS
    // =================================================

    const bookings = await FlightBooking.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      ok: true,

      count: bookings.length,

      bookings,
    });
  } catch (error: any) {
    console.error("Get My Flight Bookings Error:", error);

    return res.status(500).json({
      ok: false,

      message: "Failed to fetch flight bookings",
    });
  }
};

// =====================================================
// GET SINGLE FLIGHT BOOKING
// =====================================================

export const getFlightBookingById = async (req: Request, res: Response) => {
  try {
    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const user = (req as any).user;

    const userId = user?.id || user?._id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Authentication required",
      });
    }

    // =================================================
    // GET BOOKING ID
    // =================================================

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Booking ID is required",
      });
    }

    // =================================================
    // FIND BOOKING
    // =================================================
    //
    // IMPORTANT:
    // userId is included so a logged-in user
    // cannot access another user's booking.
    //

    const booking = await FlightBooking.findOne({
      _id: id,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: "Flight booking not found",
      });
    }

    return res.status(200).json({
      ok: true,

      booking,
    });
  } catch (error: any) {
    console.error("Get Flight Booking Error:", error);

    return res.status(500).json({
      ok: false,

      message: "Failed to fetch flight booking",
    });
  }
};

// =====================================================
// SEND BOOKING CONFIRMATION EMAIL
// POST /api/flight-bookings/send-email
// =====================================================

export const sendBookingEmail = async (req: Request, res: Response) => {
  try {
    // =================================================
    // VALIDATE INPUT
    // =================================================

    const { requestId } = req.body;

    if (!requestId) {
      return res
        .status(400)
        .json({ ok: false, message: "requestId is required" });
    }

    // =================================================
    // FIND BOOKING BY REQUEST ID (works for both guest and authenticated bookings)
    // =================================================

    const booking = await FlightBooking.findOne({ requestId });

    if (!booking) {
      return res.status(404).json({ ok: false, message: "Booking not found" });
    }

    const toEmail = booking.contact?.email;

    if (!toEmail) {
      return res.status(400).json({
        ok: false,
        message: "No email address found for this booking",
      });
    }

    // Build email body using shared utility
    const emailBody = buildBookingEmail(booking);

    // =================================================
    // SEND — reuse existing sendEmail utility
    // =================================================

    await sendEmail(
      toEmail,
      `Randhawa Air Travels Int'l - Flight Booking Request ${booking.requestId}`,
      emailBody,
    );

    return res.status(200).json({
      ok: true,
      message: "Booking request details sent to your email successfully.",
    });
  } catch (error: any) {
    console.error("Send Booking Email Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Unable to send booking details to email.",
    });
  }
};

// =====================================================
// DELETE FLIGHT BOOKING
// DELETE /api/flight-bookings/:id
// Only allowed within 4 hours of creation
// =====================================================

export const deleteFlightBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const booking = await FlightBooking.findOne({ _id: id, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Flight booking not found" });
    }

    // 4-hour window check
    const fourHours = 4 * 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(booking.createdAt).getTime();

    if (elapsed > fourHours) {
      return res.status(403).json({
        ok: false,
        message:
          "Delete window expired. You can only delete within 4 hours of booking.",
      });
    }

    await FlightBooking.deleteOne({ _id: id, userId });

    return res
      .status(200)
      .json({ ok: true, message: "Flight booking deleted successfully" });
  } catch (error: any) {
    console.error("Delete Flight Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to delete flight booking" });
  }
};

// =====================================================
// CANCEL FLIGHT BOOKING
// PATCH /api/flight-bookings/:id/cancel
// =====================================================

export const cancelFlightBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const booking = await FlightBooking.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status: "cancelled" } },
      { new: true },
    );

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Flight booking not found" });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Flight booking cancelled", booking });
  } catch (error: any) {
    console.error("Cancel Flight Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to cancel flight booking" });
  }
};

// =====================================================
// UPDATE FLIGHT BOOKING (within 4-hour window)
// PATCH /api/flight-bookings/:id
// =====================================================

export const updateFlightBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const booking = await FlightBooking.findOne({ _id: id, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Flight booking not found" });
    }

    // 4-hour window check
    const fourHours = 4 * 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(booking.createdAt).getTime();

    if (elapsed > fourHours) {
      return res.status(403).json({
        ok: false,
        message:
          "Edit window expired. You can only edit within 4 hours of booking.",
      });
    }

    // Only allow safe fields to be updated
    const allowedFields = [
      "passengers",
      "contact",
      "extras",
      "agentRemarks",
      "paymentMethod",
      "payment",
      "receiptFileName",
      "receiptUrl",
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updated = await FlightBooking.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json({ ok: true, message: "Flight booking updated", booking: updated });
  } catch (error: any) {
    console.error("Update Flight Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to update flight booking" });
  }
};
