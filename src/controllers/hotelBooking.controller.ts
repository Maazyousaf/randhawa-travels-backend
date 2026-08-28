import { Request, Response } from "express";
import HotelBooking from "../models/hotelBooking.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";
import { buildHotelBookingEmail } from "../utils/buildHotelBookingEmail.js";

// =====================================================
// CREATE HOTEL BOOKING
// =====================================================

export const createHotelBooking = async (req: Request, res: Response) => {
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

      hotelId,

      checkIn,
      checkOut,
      nights,

      rooms,
      adults,
      children,

      guests,

      contact,

      pricePerNight,
      totalAmount,
      currency,

      // Payment
      paymentMethod,
      payment,

      // Backward-compatible receipt fields
      receiptFileName,
      receiptUrl,

      specialRequests,
      agentRemarks,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!hotelId) {
      return res.status(400).json({
        ok: false,
        message: "Hotel ID is required",
      });
    }

    if (!requestId) {
      return res.status(400).json({
        ok: false,
        message: "Request ID is required",
      });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        ok: false,
        message: "Check-in and check-out dates are required",
      });
    }

    if (!nights || nights < 1) {
      return res.status(400).json({
        ok: false,
        message: "Number of nights must be at least 1",
      });
    }

    if (!rooms || rooms < 1) {
      return res.status(400).json({
        ok: false,
        message: "Number of rooms must be at least 1",
      });
    }

    if (!adults || adults < 1) {
      return res.status(400).json({
        ok: false,
        message: "Number of adults must be at least 1",
      });
    }

    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "At least one guest is required",
      });
    }

    // =================================================
    // CONTACT EMAIL/PHONE VALIDATION
    // Must come from the booking form payload
    // =================================================

    const contactEmail = String(contact?.email || req.body?.email || "")
      .trim()
      .toLowerCase();

    const contactPhone = String(contact?.phone || req.body?.phone || "").trim();

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
    // VALIDATE EACH GUEST (including passport image)
    // =================================================

    for (const [index, guest] of guests.entries()) {
      const passportUrl = String(
        guest?.passportUrl || guest?.passportImage || "",
      ).trim();

      if (!guest?.firstName || !String(guest.firstName).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Guest ${index + 1}: First name is required`,
        });
      }

      if (!guest?.lastName || !String(guest.lastName).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Guest ${index + 1}: Last name is required`,
        });
      }

      if (!guest?.passportNumber || !String(guest.passportNumber).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Guest ${index + 1}: Passport number is required`,
        });
      }

      if (!guest?.nationality || !String(guest.nationality).trim()) {
        return res.status(400).json({
          ok: false,
          message: `Guest ${index + 1}: Nationality is required`,
        });
      }

      // Passport image is mandatory
      if (!passportUrl) {
        return res.status(400).json({
          ok: false,
          message: `Guest ${index + 1}: Passport image is required. Please upload a passport image.`,
        });
      }

      // Validate Date of Birth - must be in the past
      if (guest.dob) {
        const dobValue = guest.dob || "";
        const dob = new Date(dobValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dob.setHours(0, 0, 0, 0);

        if (dob >= today) {
          return res.status(400).json({
            ok: false,
            message: `Guest ${index + 1} (${guest.firstName} ${guest.lastName}): Date of birth must be in the past.`,
          });
        }
      }

      // Validate Passport Expiry - must be valid for at least 7 months
      if (guest.passportExpiry) {
        const expiryValue = guest.passportExpiry || "";
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
            message: `Guest ${index + 1} (${guest.firstName} ${guest.lastName}): Passport must be valid for at least 7 months from today.`,
          });
        }
      }
    }

    if (totalAmount === undefined) {
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

    const existingBooking = await HotelBooking.findOne({
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
    // GET HOTEL DETAILS FROM DATABASE
    // =================================================

    const hotel = await Hotel.findOne({ id: hotelId, status: "active" });

    if (!hotel) {
      return res.status(404).json({
        ok: false,
        message: "Hotel not found",
      });
    }

    // =================================================
    // CONTACT FROM BOOKING FORM (NOT from auth user)
    // =================================================

    const bookingContact = {
      email: contactEmail,
      phone: contactPhone,
      countryCode: contact?.countryCode || "+92",
    };

    // =================================================
    // PREPARE GUESTS
    // =================================================

    const bookingGuests = guests.map((guest: any) => ({
      firstName: String(guest.firstName || "").trim(),

      lastName: String(guest.lastName || "").trim(),

      gender: guest.gender || "",

      dob: guest.dob || "",

      nationality: String(guest.nationality || "").trim(),

      passportNumber: String(guest.passportNumber || "").trim(),

      passportExpiry: String(guest.passportExpiry || "").trim(),

      passportIssueCountry: String(guest.passportIssueCountry || "").trim(),

      type: guest.type || "adult",

      // Cloudinary URLs
      passportUrl: String(
        guest.passportUrl || guest.passportImage || "",
      ).trim(),
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
    // CREATE HOTEL BOOKING
    // =================================================

    const booking = await HotelBooking.create({
      // ---------------------------------------------
      // User (Optional for guest bookings)
      // ---------------------------------------------

      userId: userId || undefined,

      // ---------------------------------------------
      // Request
      // ---------------------------------------------

      requestId,

      // ---------------------------------------------
      // Booking Status
      // ---------------------------------------------

      status: "pending",

      // ---------------------------------------------
      // Payment Status
      // ---------------------------------------------

      paymentStatus: finalPaymentStatus,

      // ---------------------------------------------
      // Hotel
      // ---------------------------------------------

      hotelId: hotel.id,

      hotelName: hotel.name,

      stars: hotel.stars,

      location: hotel.location,

      city: hotel.city,

      country: hotel.country,

      hotelImage: hotel.image,

      amenities: hotel.amenities,

      // ---------------------------------------------
      // Booking Details
      // ---------------------------------------------

      checkIn,

      checkOut,

      nights,

      rooms,

      adults,

      children: children || 0,

      // ---------------------------------------------
      // Guests
      // ---------------------------------------------

      guests: bookingGuests,

      // ---------------------------------------------
      // Contact
      // ---------------------------------------------

      contact: bookingContact,

      // ---------------------------------------------
      // Pricing
      // ---------------------------------------------

      pricePerNight: pricePerNight || hotel.pricePerNight,

      totalAmount: Number(totalAmount),

      currency: currency || "PKR",

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
      // Special Requests
      // ---------------------------------------------

      specialRequests: specialRequests || undefined,

      // ---------------------------------------------
      // Remarks
      // ---------------------------------------------

      agentRemarks: agentRemarks || undefined,
    });

    // =================================================
    // RESPONSE
    // =================================================
    // NOTE: Email will be sent when user clicks "Confirm Booking Request" button
    // via the sendHotelBookingEmail() endpoint

    return res.status(201).json({
      ok: true,

      message: "Hotel booking request submitted successfully",

      booking: {
        id: booking._id,

        requestId: booking.requestId,

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
    console.error("Create Hotel Booking Error:", error);

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

      message: "Failed to create hotel booking",

      error:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

// =====================================================
// GET MY HOTEL BOOKINGS
// =====================================================

export const getMyHotelBookings = async (req: Request, res: Response) => {
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

    const bookings = await HotelBooking.find({
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
    console.error("Get My Hotel Bookings Error:", error);

    return res.status(500).json({
      ok: false,

      message: "Failed to fetch hotel bookings",
    });
  }
};

// =====================================================
// GET SINGLE HOTEL BOOKING
// =====================================================

export const getHotelBookingById = async (req: Request, res: Response) => {
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

    const booking = await HotelBooking.findOne({
      _id: id,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: "Hotel booking not found",
      });
    }

    return res.status(200).json({
      ok: true,

      booking,
    });
  } catch (error: any) {
    console.error("Get Hotel Booking Error:", error);

    return res.status(500).json({
      ok: false,

      message: "Failed to fetch hotel booking",
    });
  }
};

// =====================================================
// SEND BOOKING CONFIRMATION EMAIL
// POST /api/hotel-bookings/send-email
// =====================================================

export const sendHotelBookingEmail = async (req: Request, res: Response) => {
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
    // FIND BOOKING BY REQUEST ID
    // =================================================

    const booking = await HotelBooking.findOne({ requestId });

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

    // Build email body using the email builder
    const emailBody = buildHotelBookingEmail(booking.toObject());

    // =================================================
    // SEND EMAIL
    // =================================================

    await sendEmail(
      toEmail,
      `Randhawa Air Travels Int'l - Hotel Booking Request ${booking.requestId}`,
      emailBody,
    );

    return res.status(200).json({
      ok: true,
      message: "Booking request details sent to your email successfully.",
    });
  } catch (error: any) {
    console.error("Send Hotel Booking Email Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Unable to send booking details to email.",
    });
  }
};

// =====================================================
// DELETE HOTEL BOOKING
// DELETE /api/hotel-bookings/:id
// Only allowed within 4 hours of creation
// =====================================================

export const deleteHotelBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const booking = await HotelBooking.findOne({ _id: id, userId });

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Hotel booking not found" });
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

    await HotelBooking.deleteOne({ _id: id, userId });

    return res
      .status(200)
      .json({ ok: true, message: "Hotel booking deleted successfully" });
  } catch (error: any) {
    console.error("Delete Hotel Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to delete hotel booking" });
  }
};

// =====================================================
// CANCEL HOTEL BOOKING
// PATCH /api/hotel-bookings/:id/cancel
// =====================================================

export const cancelHotelBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const booking = await HotelBooking.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status: "cancelled" } },
      { new: true },
    );

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Hotel booking not found" });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Hotel booking cancelled", booking });
  } catch (error: any) {
    console.error("Cancel Hotel Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to cancel hotel booking" });
  }
};

// =====================================================
// UPDATE HOTEL BOOKING (within 4-hour window)
// PATCH /api/hotel-bookings/:id
// GUEST BOOKING ALLOWED - Optional authentication for payment updates
// =====================================================

export const updateHotelBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;

    const { id } = req.params;

    // For guest bookings (no userId), find by _id only
    // For authenticated bookings, verify userId matches
    const query = userId ? { _id: id, userId } : { _id: id };

    const booking = await HotelBooking.findOne(query);

    if (!booking) {
      return res
        .status(404)
        .json({ ok: false, message: "Hotel booking not found" });
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
      "guests",
      "contact",
      "specialRequests",
      "agentRemarks",
      "paymentMethod",
      "payment",
      "receiptFileName",
      "receiptUrl",
      "paymentStatus", // Allow payment status update for guest bookings
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // Auto-update payment status if receipt is provided
    if (updateData.receiptUrl || updateData.payment?.receiptUrl) {
      updateData.paymentStatus = "submitted";
    }

    // Use same query for update (with or without userId)
    const updated = await HotelBooking.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json({ ok: true, message: "Hotel booking updated", booking: updated });
  } catch (error: any) {
    console.error("Update Hotel Booking Error:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to update hotel booking" });
  }
};
