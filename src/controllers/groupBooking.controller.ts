import { Request, Response } from "express";
import crypto from "crypto";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import GroupBooking, {
  type IGroupBookingPayment,
  type GroupBookingPaymentStatus,
  type GroupBookingStatus,
} from "../models/groupBooking.model.js";
import { sendEmail } from "../utils/email.js";
import { buildGroupBookingEmail } from "../utils/buildGroupBookingEmail.js";

type AuthenticatedRequest = Request & {
  user?: { id?: string; _id?: string; email?: string };
};
type FrontendBookingType = "flight" | "customized" | "package" | "fixed";
type DatabaseBookingType = "customized-flight" | "fixed-package";
type IncomingPayment = {
  method?: "agency" | "bank";
  transactionId?: string;
  paymentReference?: string;
  bankName?: string;
  accountName?: string;
  receiptFileName?: string;
  receiptUrl?: string;
  amount?: number;
  currency?: string;
  submittedAt?: string | Date;
};
type IncomingPassenger = {
  title?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  passportIssueCountry?: string;
  passportUrl?: string;
  type?: "adult" | "child" | "infant";
  [key: string]: unknown;
};
type BookingBody = {
  groupId?: string;
  bookingType?: FrontendBookingType;
  routeId?: string;
  flightId?: string;
  packageId?: string;
  customer?: Record<string, unknown>;
  passengers?: IncomingPassenger[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  adults?: number;
  children?: number;
  infants?: number;
  totalAmount?: number;
  amount?: number;
  currency?: string;
  notes?: string;
  agentRemarks?: string;
  paymentMethod?: "agency" | "bank";
  payment?: IncomingPayment;
  receiptFileName?: string;
  receiptUrl?: string;
};

const generateBookingReference = () =>
  `WG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
const toNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};
const getUserId = (req: AuthenticatedRequest) => req.user?.id || req.user?._id;
const normalizeBookingType = (
  type: FrontendBookingType,
): DatabaseBookingType =>
  type === "flight" || type === "customized"
    ? "customized-flight"
    : "fixed-package";
const byId = (id: string) =>
  /^[a-f\d]{24}$/i.test(id)
    ? { $or: [{ _id: id }, { bookingReference: id }] }
    : { bookingReference: id };

// =====================================================
// CREATE GROUP BOOKING
// IMPORTANT: NO EMAIL IS SENT HERE.
// Email is sent only by sendGroupBookingEmail().
// =====================================================
export const createGroupBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as BookingBody;
    const {
      groupId,
      bookingType,
      routeId,
      flightId,
      packageId,
      customer,
      passengers,
      customerName,
      customerEmail,
      customerPhone,
      adults,
      children,
      infants,
      totalAmount,
      amount,
      currency,
      notes,
      agentRemarks,
      paymentMethod,
      payment,
      receiptFileName,
      receiptUrl,
    } = body;
    if (!groupId) {
      res.status(400).json({ success: false, message: "groupId is required" });
      return;
    }
    if (!bookingType) {
      res
        .status(400)
        .json({ success: false, message: "bookingType is required" });
      return;
    }

    const normalizedBookingType = normalizeBookingType(bookingType);
    const group = await Group.findOne({ id: groupId, active: true });
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }

    let selectedRoute: Record<string, unknown> | null = null;
    let selectedFlight: Record<string, unknown> | null = null;
    let selectedPackage: Record<string, unknown> | null = null;

    if (
      bookingType === "flight" ||
      bookingType === "customized" ||
      (bookingType as string) === "customized-flight"
    ) {
      if (!routeId) {
        res.status(400).json({
          success: false,
          message: "routeId is required for flight booking",
        });
        return;
      }
      if (!flightId) {
        res.status(400).json({
          success: false,
          message: "flightId is required for flight booking",
        });
        return;
      }
      const route = group.routes.find(
        (item) => item.id === routeId && item.active === true,
      );
      if (!route) {
        res.status(404).json({ success: false, message: "Route not found" });
        return;
      }
      const flight = route.flights.find(
        (item) => item.id === flightId && item.active === true,
      );
      if (!flight) {
        res.status(404).json({ success: false, message: "Flight not found" });
        return;
      }
      if (flight.seatsLeft <= 0) {
        res.status(400).json({
          success: false,
          message: "No seats available for this flight",
        });
        return;
      }
      selectedRoute = {
        id: route.id,
        label: route.label,
        from: route.from,
        fromCity: route.fromCity,
        to: route.to,
        toCity: route.toCity,
      };
      selectedFlight = {
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
        baggage: flight.baggage,
        meal: flight.meal,
        adultPrice: flight.adultPrice,
        childPrice: flight.childPrice,
        infantPrice: flight.infantPrice,
        seatsLeft: flight.seatsLeft,
        stops: flight.stops,
        stopCity: flight.stopCity,
        class: flight.class,
      };
    }

    if (
      bookingType === "package" ||
      bookingType === "fixed" ||
      (bookingType as string) === "fixed-package"
    ) {
      if (!packageId) {
        res.status(400).json({
          success: false,
          message: "packageId is required for package booking",
        });
        return;
      }
      const selected = group.packages.find(
        (item) => item.id === packageId && item.active === true,
      );
      if (!selected) {
        res.status(404).json({ success: false, message: "Package not found" });
        return;
      }
      if (selected.availableSeats <= 0) {
        res.status(400).json({
          success: false,
          message: "No seats available for this package",
        });
        return;
      }
      selectedPackage = {
        id: selected.id,
        name: selected.name,
        makkahHotel: selected.makkahHotel,
        madinahHotel: selected.madinahHotel,
        hotelName: selected.hotelName,
        airline: selected.airline,
        airlineCode: selected.airlineCode,
        airlineLogo: selected.airlineLogo,
        sector: selected.sector,
        durationDays: selected.durationDays,
        depFrom: selected.depFrom,
        depTo: selected.depTo,
        depDate: selected.depDate,
        depTime: selected.depTime,
        arrTime: selected.arrTime,
        retFrom: selected.retFrom,
        retTo: selected.retTo,
        retDate: selected.retDate,
        retDepTime: selected.retDepTime,
        retArrTime: selected.retArrTime,
        sharingPrice: selected.sharingPrice,
        quadPrice: selected.quadPrice,
        triplePrice: selected.triplePrice,
        doublePrice: selected.doublePrice,
        pricePerPerson: selected.pricePerPerson,
        availableSeats: selected.availableSeats,
        description: selected.description,
        inclusions: selected.inclusions,
        exclusions: selected.exclusions,
      };
    }

    const adultCount = Math.max(1, Math.floor(toNumber(adults, 1)));
    const childCount = Math.max(0, Math.floor(toNumber(children, 0)));
    const infantCount = Math.max(0, Math.floor(toNumber(infants, 0)));
    const passengerCount = adultCount + childCount + infantCount;
    if (!Array.isArray(passengers) || passengers.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one passenger is required",
      });
      return;
    }
    if (passengers.length !== passengerCount) {
      res.status(400).json({
        success: false,
        message: "Passenger list count does not match passenger counts",
      });
      return;
    }

    // =================================================
    // VALIDATE EACH PASSENGER (including passport image)
    // =================================================

    for (const [index, passenger] of passengers.entries()) {
      const passportUrl = String(
        passenger?.passportUrl || passenger?.passportImage || "",
      ).trim();

      if (!passenger?.firstName || !String(passenger.firstName).trim()) {
        res.status(400).json({
          success: false,
          message: `Passenger ${index + 1}: First name is required`,
        });
        return;
      }

      if (!passenger?.lastName || !String(passenger.lastName).trim()) {
        res.status(400).json({
          success: false,
          message: `Passenger ${index + 1}: Last name is required`,
        });
        return;
      }

      if (
        !passenger?.passportNumber ||
        !String(passenger.passportNumber).trim()
      ) {
        res.status(400).json({
          success: false,
          message: `Passenger ${index + 1}: Passport number is required`,
        });
        return;
      }

      if (!passenger?.nationality || !String(passenger.nationality).trim()) {
        res.status(400).json({
          success: false,
          message: `Passenger ${index + 1}: Nationality is required`,
        });
        return;
      }

      // Passport image is mandatory
      if (!passportUrl) {
        res.status(400).json({
          success: false,
          message: `Passenger ${index + 1}: Passport image is required. Please upload a passport image.`,
        });
        return;
      }

      // Validate Date of Birth - must be in the past
      if (passenger.dob || passenger.dateOfBirth) {
        const dobValue = passenger.dob || passenger.dateOfBirth || "";
        const dob = new Date(dobValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dob.setHours(0, 0, 0, 0);

        if (dob >= today) {
          res.status(400).json({
            success: false,
            message: `Passenger ${index + 1} (${passenger.firstName} ${passenger.lastName}): Date of birth must be in the past.`,
          });
          return;
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
          res.status(400).json({
            success: false,
            message: `Passenger ${index + 1} (${passenger.firstName} ${passenger.lastName}): Passport must be valid for at least 7 months from today.`,
          });
          return;
        }
      }
    }

    const normalizedPassengers = passengers.map((p) => ({
      title: p.title || "",
      firstName: String(p.firstName || "").trim(),
      lastName: String(p.lastName || "").trim(),
      gender: p.gender || "",
      dob: p.dob || p.dateOfBirth || "",
      dateOfBirth: p.dateOfBirth || p.dob || "",
      nationality: p.nationality || "",
      passportNumber: p.passportNumber || "",
      passportExpiry: p.passportExpiry || "",
      passportCountry: p.passportCountry || p.passportIssueCountry || "",
      passportUrl: String(p.passportUrl || p.passportImage || "").trim(),
      type: p.type || "adult",
    }));

    // =================================================
    // CUSTOMER EMAIL/PHONE VALIDATION
    // Must come from the booking form payload, NOT from auth user
    // =================================================

    const customerData =
      customer && typeof customer === "object"
        ? {
            ...customer,
            name: String(
              customer.name ||
                customerName ||
                [customer.firstName, customer.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                "",
            ),
            email: String(customer.email || customerEmail || "").toLowerCase(),
            phone: String(customer.phone || customerPhone || ""),
          }
        : {
            name: customerName || "",
            email: customerEmail || "",
            phone: customerPhone || "",
          };

    const finalCustomerName = String(
      customerName ||
        String(customerData.name || "") ||
        [(customer as any)?.firstName, (customer as any)?.lastName]
          .filter(Boolean)
          .join(" ") ||
        "",
    ).trim();

    const finalCustomerEmail = String(
      customerEmail || String(customerData.email || "").toLowerCase(),
    ).trim();

    const finalCustomerPhone = String(
      customerPhone || String(customerData.phone || ""),
    ).trim();

    if (!finalCustomerName) {
      res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
      return;
    }

    if (!finalCustomerEmail) {
      res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalCustomerEmail)) {
      res.status(400).json({
        success: false,
        message: "A valid customer email address is required",
      });
      return;
    }

    if (!finalCustomerPhone) {
      res.status(400).json({
        success: false,
        message: "Customer phone number is required",
      });
      return;
    }

    if (finalCustomerPhone.replace(/\D/g, "").length < 7) {
      res.status(400).json({
        success: false,
        message: "A valid customer phone number is required",
      });
      return;
    }

    const finalAmount = toNumber(totalAmount ?? amount, 0);
    if (finalAmount < 0) {
      res.status(400).json({ success: false, message: "Invalid total amount" });
      return;
    }
    if (paymentMethod && !["agency", "bank"].includes(paymentMethod)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid payment method" });
      return;
    }

    let paymentData: IGroupBookingPayment | undefined;
    if (payment) {
      const method = payment.method || paymentMethod;
      const rName = payment.receiptFileName || receiptFileName;
      const rUrl = payment.receiptUrl || receiptUrl;
      paymentData = {
        method,
        transactionId: payment.transactionId,
        paymentReference: payment.paymentReference,
        bankName: payment.bankName,
        accountName: payment.accountName,
        receiptFileName: rName,
        receiptUrl: rUrl,
        amount:
          payment.amount !== undefined ? Number(payment.amount) : finalAmount,
        currency: payment.currency || currency || "PKR",
        submittedAt: payment.submittedAt
          ? new Date(payment.submittedAt)
          : rUrl
            ? new Date()
            : undefined,
      };
    } else if (paymentMethod || receiptUrl || receiptFileName) {
      paymentData = {
        method: paymentMethod,
        receiptFileName,
        receiptUrl,
        amount: finalAmount,
        currency: currency || "PKR",
        submittedAt: receiptUrl ? new Date() : undefined,
      };
    }

    const finalReceiptUrl = paymentData?.receiptUrl || receiptUrl;
    const finalPaymentStatus: GroupBookingPaymentStatus = finalReceiptUrl
      ? "paid"
      : "pending";
    const bookingReference = generateBookingReference();
    const userId = getUserId(req as AuthenticatedRequest);
    const groupName = String(group.name || "");
    const groupLabel = String((group as any).label || groupName);
    const groupCountry = String((group as any).country || "");
    const groupDescription = String((group as any).description || "");
    const routeLabel = String(selectedRoute?.label || routeId || "");
    const sector = routeLabel;
    const flightData = selectedFlight || {};
    const packageData = selectedPackage || {};
    const finalAirline = String(
      flightData.airline || packageData.airline || "",
    );
    const finalAirlineCode = String(
      flightData.airlineCode || packageData.airlineCode || "",
    );
    const finalAirlineLogo = String(
      flightData.airlineLogo || packageData.airlineLogo || "",
    );
    const finalFrom = String(flightData.from || "");
    const finalFromCity = String(
      flightData.fromCity || packageData.depFrom || "",
    );
    const finalTo = String(flightData.to || "");
    const finalToCity = String(flightData.toCity || packageData.depTo || "");
    const sectorParts = String(packageData.sector || "").split("-");
    const sectorFromCode = sectorParts[0] || "";
    const sectorToCode = sectorParts[1] || "";
    const finalFromCode =
      finalFrom.length === 3
        ? finalFrom.toUpperCase()
        : sectorFromCode.toUpperCase();
    const finalToCode =
      finalTo.length === 3 ? finalTo.toUpperCase() : sectorToCode.toUpperCase();
    const finalFlightNumber = String(
      flightData.flightNumber ||
        (packageData.airlineCode ? `${packageData.airlineCode} Umrah` : ""),
    );
    const finalDepartureDate = String(
      flightData.date || packageData.depDate || "",
    );
    const finalDepartureTime = String(
      flightData.departureTime || packageData.depTime || "",
    );
    const finalArrivalDate = String(
      packageData.retDate || finalDepartureDate || "",
    );
    const finalArrivalTime = String(
      flightData.arrivalTime || packageData.arrTime || "",
    );
    const finalDuration = String(
      flightData.duration ||
        (packageData.durationDays ? `${packageData.durationDays} days` : ""),
    );
    const finalBaggage = String(flightData.baggage || "23+7 KG");
    const finalMeal = Boolean(flightData.meal ?? true);
    const finalStops = Number(flightData.stops || 0);
    const finalStopCity = String(flightData.stopCity || "");
    const finalClass = String(flightData.class || "Economy");
    const finalPackageName = String(packageData.name || "");
    const finalPackageType =
      normalizedBookingType === "fixed-package" ? "fixed-package" : "";

    const bookingPayload = {
      bookingReference,
      bookingType: normalizedBookingType,
      groupId: group.id,
      groupName,
      groupLabel,
      groupCountry,
      groupDescription,
      groupType: group.type,
      routeId: routeId || "",
      routeLabel,
      sector,
      flightId: flightId || "",
      flightNumber: finalFlightNumber,
      airline: finalAirline,
      airlineCode: finalAirlineCode,
      airlineLogo: finalAirlineLogo,
      from: finalFrom,
      fromCity: finalFromCity,
      to: finalTo,
      toCity: finalToCity,
      fromCode: finalFromCode,
      toCode: finalToCode,
      departureDate: finalDepartureDate,
      departureTime: finalDepartureTime,
      arrivalDate: finalArrivalDate,
      arrivalTime: finalArrivalTime,
      duration: finalDuration,
      baggage: finalBaggage,
      meal: finalMeal,
      stops: finalStops,
      stopCities: finalStopCity ? [finalStopCity] : [],
      stopCity: finalStopCity,
      cabin: finalClass,
      class: finalClass,
      packageId: packageId || "",
      packageName: finalPackageName,
      packageType: finalPackageType,
      returnDate: String(packageData.retDate || ""),
      returnDepartureTime: String(packageData.retDepTime || ""),
      returnArrivalTime: String(packageData.retArrTime || ""),
      durationDays: Number(packageData.durationDays || 0),
      customer: customerData,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      customerPhone: finalCustomerPhone,
      passengers: normalizedPassengers,
      adults: adultCount,
      children: childCount,
      infants: infantCount,
      passengerCount,
      totalPassengers: passengerCount,
      adultPrice: Number(
        flightData.adultPrice ||
          packageData.sharingPrice ||
          packageData.pricePerPerson ||
          0,
      ),
      childPrice: Number(flightData.childPrice || 0),
      infantPrice: Number(flightData.infantPrice || 0),
      baseAmount: finalAmount,
      taxes: 0,
      fees: 0,
      extrasTotal: 0,
      coupon: "",
      couponDiscount: 0,
      totalAmount: finalAmount,
      amount: finalAmount,
      currency: currency || "PKR",
      paymentMethod: paymentData?.method,
      payment: paymentData,
      receiptFileName: paymentData?.receiptFileName || receiptFileName || "",
      receiptUrl: paymentData?.receiptUrl || receiptUrl || "",
      routeSnapshot: selectedRoute,
      flightSnapshot: selectedFlight,
      packageSnapshot: selectedPackage,
      status: "pending" as GroupBookingStatus,
      paymentStatus: finalPaymentStatus,
      userId,
      notes: notes || agentRemarks || "",
      agentRemarks: agentRemarks || notes || "",
    };

    const booking = await GroupBooking.create(bookingPayload as any);

    if (selectedFlight && group.type === "customized" && routeId && flightId) {
      const requestedSeats = Math.max(passengerCount, 1);
      const route = group.routes.find((item) => item.id === routeId);
      const flight = route?.flights.find((item) => item.id === flightId);
      if (flight) {
        flight.seatsLeft = Math.max(0, flight.seatsLeft - requestedSeats);
        await group.save();
      }
    }
    if (selectedPackage && group.type === "fixed" && packageId) {
      const requestedSeats = Math.max(passengerCount, 1);
      const packageItem = group.packages.find((item) => item.id === packageId);
      if (packageItem) {
        packageItem.availableSeats = Math.max(
          0,
          packageItem.availableSeats - requestedSeats,
        );
        await group.save();
      }
    }

    // =================================================
    // RESPONSE
    // =================================================
    // NOTE: Email will be sent when user clicks "Confirm Booking Request" button
    // via the sendGroupBookingEmail() endpoint

    res.status(201).json({
      success: true,
      message: "Group booking created successfully",
      booking,
      bookingReference: booking.bookingReference,
    });
  } catch (error: any) {
    console.error("❌ Create Group Booking Error:", error);
    if (error?.code === 11000) {
      res.status(409).json({
        success: false,
        message: "A group booking with this reference already exists",
      });
      return;
    }
    if (error?.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Group booking validation failed",
        error:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Failed to create group booking",
      error:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

// =====================================================
// SEND GROUP BOOKING EMAIL
// POST /api/group-bookings/send-email
// THIS IS THE ONLY FUNCTION IN THIS CONTROLLER THAT SENDS
// THE GROUP BOOKING EMAIL.
// =====================================================
export const sendGroupBookingEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bookingReference } = req.body as { bookingReference?: string };
    const reference = String(bookingReference || "").trim();
    if (!reference) {
      res
        .status(400)
        .json({ success: false, message: "bookingReference is required" });
      return;
    }
    const booking = await GroupBooking.findOne({ bookingReference: reference });
    if (!booking) {
      res
        .status(404)
        .json({ success: false, message: "Group booking not found" });
      return;
    }
    const emailAddress = String(
      booking.customerEmail || booking.customer?.email || "",
    )
      .trim()
      .toLowerCase();
    if (!emailAddress) {
      res.status(400).json({
        success: false,
        message: "No email address found for this group booking",
      });
      return;
    }
    const emailBody = buildGroupBookingEmail(booking);
    await sendEmail(
      emailAddress,
      `Randhawa Air Travels Int'l - Group Booking Request ${booking.bookingReference}`,
      emailBody,
    );
    res.status(200).json({
      success: true,
      message: "Group booking details sent to your email successfully.",
    });
  } catch (error) {
    console.error("❌ Send Group Booking Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to send group booking details to email.",
    });
  }
};

// =====================================================
// GET SINGLE BOOKING
// =====================================================
export const getGroupBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const booking = await GroupBooking.findOne(byId(id));
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("❌ Get Group Booking Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking" });
  }
};

// =====================================================
// GET BOOKING BY REFERENCE
// =====================================================
export const getGroupBookingByReference = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const booking = await GroupBooking.findOne({
      bookingReference: req.params.reference,
    });
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("❌ Get Booking By Reference Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking" });
  }
};

// =====================================================
// GET MY BOOKINGS
// =====================================================
export const getMyGroupBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = getUserId(authReq);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Find by userId (now ObjectId, not String)
    const bookings = await GroupBooking.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("❌ Get My Group Bookings Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
};

// =====================================================
// GET ALL GROUP BOOKINGS
// =====================================================
export const getGroupBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      status,
      bookingType,
      groupId,
      page = "1",
      limit = "20",
    } = req.query;
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));
    const query: Record<string, unknown> = {};
    if (status) query.status = String(status);
    if (bookingType) {
      const type = String(bookingType);
      query.bookingType =
        type === "flight" || type === "customized"
          ? "customized-flight"
          : type === "package" || type === "fixed"
            ? "fixed-package"
            : type;
    }
    if (groupId) query.groupId = String(groupId);
    const skip = (pageNumber - 1) * limitNumber;
    const [bookings, total] = await Promise.all([
      GroupBooking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      GroupBooking.countDocuments(query),
    ]);
    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      bookings,
    });
  } catch (error) {
    console.error("❌ Get Group Bookings Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
};

// =====================================================
// UPDATE BOOKING STATUS
// =====================================================
export const updateGroupBookingStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body as {
      status?: string;
      paymentStatus?: string;
    };
    const allowedStatuses: readonly GroupBookingStatus[] = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];
    const allowedPaymentStatuses: readonly GroupBookingPaymentStatus[] = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];
    if (status && !allowedStatuses.includes(status as GroupBookingStatus)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid booking status" });
      return;
    }
    if (
      paymentStatus &&
      !allowedPaymentStatuses.includes(
        paymentStatus as GroupBookingPaymentStatus,
      )
    ) {
      res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
      return;
    }
    if (!status && !paymentStatus) {
      res.status(400).json({
        success: false,
        message: "status or paymentStatus is required",
      });
      return;
    }
    const updateData: Partial<{
      status: GroupBookingStatus;
      paymentStatus: GroupBookingPaymentStatus;
    }> = {};
    if (status) updateData.status = status as GroupBookingStatus;
    if (paymentStatus)
      updateData.paymentStatus = paymentStatus as GroupBookingPaymentStatus;
    const booking = await GroupBooking.findOneAndUpdate(
      byId(String(id)),
      { $set: updateData },
      { new: true, runValidators: true },
    );
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Update Group Booking Status Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update booking status" });
  }
};

// =====================================================
// UPDATE PAYMENT INFO
// IMPORTANT: NO EMAIL IS SENT HERE.
// =====================================================
export const updateGroupBookingPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const {
      paymentMethod,
      receiptUrl,
      receiptFileName,
      transactionId,
      bankName,
    } = req.body as {
      paymentMethod?: "agency" | "bank";
      receiptUrl?: string;
      receiptFileName?: string;
      transactionId?: string;
      bankName?: string;
    };
    const query = byId(id);
    const booking = await GroupBooking.findOne(query);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    const paymentUpdate: Record<string, unknown> = {};
    if (paymentMethod) {
      paymentUpdate.paymentMethod = paymentMethod;
      paymentUpdate["payment.method"] = paymentMethod;
    }
    if (receiptUrl) {
      paymentUpdate.receiptUrl = receiptUrl;
      paymentUpdate["payment.receiptUrl"] = receiptUrl;
      paymentUpdate["payment.submittedAt"] = new Date();
    }
    if (receiptFileName) {
      paymentUpdate.receiptFileName = receiptFileName;
      paymentUpdate["payment.receiptFileName"] = receiptFileName;
    }
    if (transactionId) paymentUpdate["payment.transactionId"] = transactionId;
    if (bankName) paymentUpdate["payment.bankName"] = bankName;
    const finalReceiptUrl = receiptUrl || booking.receiptUrl;
    paymentUpdate.paymentStatus = finalReceiptUrl ? "paid" : "pending";
    const updated = await GroupBooking.findOneAndUpdate(
      query,
      { $set: paymentUpdate },
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    // Deliberately no sendEmail() here. Use /send-email explicitly when needed.
    res.status(200).json({
      success: true,
      message: "Payment information updated successfully",
      booking: updated,
    });
  } catch (error) {
    console.error("❌ Update Group Booking Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment information",
    });
  }
};

// =====================================================
// UPDATE BOOKING PASSENGERS
// PATCH /api/group-bookings/:id/passengers
// Allows updating ONLY passenger data and agent remarks
// =====================================================
export const updateGroupBookingPassengers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { passengers, agentRemarks, notes } = req.body as {
      passengers?: any[];
      agentRemarks?: string;
      notes?: string;
    };

    const booking = await GroupBooking.findOne(byId(id));

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    // Update only passengers and remarks
    if (passengers && Array.isArray(passengers)) {
      booking.passengers = passengers;
      booking.passengerCount = passengers.length;
      booking.totalPassengers = passengers.length;
    }

    if (agentRemarks !== undefined) {
      booking.agentRemarks = agentRemarks;
    }

    if (notes !== undefined) {
      booking.notes = notes;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Update Group Booking Passengers Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

// =====================================================
// CANCEL BOOKING
// =====================================================
export const cancelGroupBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const booking = await GroupBooking.findOneAndUpdate(
      byId(String(req.params.id)),
      { $set: { status: "cancelled" as GroupBookingStatus } },
      { new: true, runValidators: true },
    );
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Cancel Group Booking Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel booking" });
  }
};

// =====================================================
// UPDATE AGENT REMARKS
// PATCH /api/group-bookings/:id/remarks
// =====================================================
export const updateGroupBookingRemarks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { agentRemarks, notes } = req.body as {
      agentRemarks?: string;
      notes?: string;
    };

    const remarksValue = String(agentRemarks || notes || "").trim();

    const query = byId(id);
    const booking = await GroupBooking.findOne(query);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const updateData: Record<string, unknown> = {
      agentRemarks: remarksValue,
      notes: remarksValue,
    };

    const updated = await GroupBooking.findOneAndUpdate(query, updateData, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Agent remarks updated successfully",
      booking: updated,
    });
  } catch (error: any) {
    console.error("❌ Update Group Booking Remarks Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update agent remarks",
    });
  }
};

// =====================================================
// DELETE GROUP BOOKING
// DELETE /api/group-bookings/:id
// Only allowed within 4 hours of creation
// =====================================================
export const deleteGroupBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const booking = await GroupBooking.findOne(byId(id));

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    // 4-hour window check
    const fourHours = 4 * 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(booking.createdAt).getTime();

    if (elapsed > fourHours) {
      res.status(403).json({
        success: false,
        message:
          "Delete window expired. You can only delete within 4 hours of booking.",
      });
      return;
    }

    await GroupBooking.deleteOne(byId(id));

    res
      .status(200)
      .json({ success: true, message: "Group booking deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Group Booking Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete group booking" });
  }
};

// =====================================================
// ADD CLIENT REMARK / MESSAGE (WITH OPTIONAL ATTACHMENT)
// POST /api/group-bookings/:id/client-remarks
// GUEST BOOKING ALLOWED - Optional authentication
// =====================================================
export const addClientRemark = async (
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

    const query = byId(id);
    const booking = await GroupBooking.findOne(query);

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
    console.error("❌ Add Client Remark Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add client remark",
    });
  }
};

// =====================================================
// ADD ADMIN REPLY TO CLIENT REMARK
// POST /api/group-bookings/:id/admin-reply
// PROTECTED - Admin only
// =====================================================
export const addAdminReply = async (
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

    const query = byId(id);
    const booking = await GroupBooking.findOne(query);

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
    console.error("❌ Add Admin Reply Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add admin reply",
    });
  }
};
