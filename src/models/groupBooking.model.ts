import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// BOOKING TYPE
// =====================================================

export type GroupBookingType =
  | "customized-flight"
  | "fixed-package"
  | "custom-umrah";

// =====================================================
// BOOKING STATUS
// =====================================================

export type GroupBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

// =====================================================
// PAYMENT STATUS
// =====================================================

export type GroupBookingPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

// =====================================================
// GROUP TYPE
// =====================================================

export type GroupType = "fixed" | "customized";

// =====================================================
// PAYMENT METHOD
// =====================================================

export type GroupPaymentMethod = "agency" | "bank";

// =====================================================
// CUSTOMER
// =====================================================

export interface IGroupBookingCustomer {
  name?: string;
  email?: string;
  phone?: string;

  [key: string]: unknown;
}

// =====================================================
// PAYMENT
// =====================================================

export interface IGroupBookingPayment {
  method?: GroupPaymentMethod;

  transactionId?: string;

  paymentReference?: string;

  bankName?: string;

  accountName?: string;

  receiptFileName?: string;

  receiptUrl?: string;

  amount?: number;

  currency?: string;

  submittedAt?: Date;

  [key: string]: unknown;
}

// =====================================================
// PASSENGER
// =====================================================

export interface IGroupBookingPassenger {
  title?: string;

  firstName: string;
  lastName: string;

  gender?: "male" | "female" | "other" | "";

  dob?: string;

  // Backward-compatible field
  dateOfBirth?: string;

  nationality?: string;

  passportNumber?: string;

  passportExpiry?: string;

  passportCountry?: string;

  passportUrl?: string;

  type?: "adult" | "child" | "infant";

  [key: string]: unknown;
}

// =====================================================
// ROUTE SNAPSHOT
// =====================================================

export interface IGroupBookingRouteSnapshot {
  id?: string;

  label?: string;

  from?: string;

  fromCity?: string;

  to?: string;

  toCity?: string;

  [key: string]: unknown;
}

// =====================================================
// FLIGHT SNAPSHOT
// =====================================================

export interface IGroupBookingFlightSnapshot {
  id?: string;

  airline?: string;

  airlineCode?: string;

  airlineLogo?: string;

  from?: string;

  fromCity?: string;

  to?: string;

  toCity?: string;

  flightNumber?: string;

  departureTime?: string;

  arrivalTime?: string;

  duration?: string;

  date?: string;

  baggage?: unknown;

  meal?: unknown;

  adultPrice?: number;

  childPrice?: number;

  infantPrice?: number;

  seatsLeft?: number;

  stops?: number;

  stopCity?: string;

  class?: string;

  [key: string]: unknown;
}

// =====================================================
// CUSTOM UMRAH TRIP DETAILS
// =====================================================

export interface ICustomUmrahTripDetails {
  adults: number;
  children: number;
  infants: number;

  pakistanAirport?: string;
  pakistanAirportCity?: string;

  saudiAirport?: string;
  saudiAirportCity?: string;

  departureDate?: string;
  returnDate?: string;

  [key: string]: unknown;
}

// =====================================================
// CUSTOM UMRAH HOTEL SNAPSHOT
// =====================================================

export interface ICustomUmrahHotelSnapshot {
  id?: string;
  name?: string;
  city?: string;
  starRating?: number;
  location?: string;
  distanceFromHaram?: string;
  image?: string;
  roomType?: string;
  pricePerPerson?: number;
  pricePerNight?: number;
  nights?: number;
  totalPrice?: number;

  [key: string]: unknown;
}

// =====================================================
// CUSTOM UMRAH SERVICE SNAPSHOT
// =====================================================

export interface ICustomUmrahServiceSnapshot {
  id?: string;
  type?: string;
  name?: string;
  title?: string;
  description?: string;
  pricePerPerson?: number;
  pricePerPackage?: number;
  totalPrice?: number;
  selected: boolean;

  [key: string]: unknown;
}

// =====================================================
// PACKAGE SNAPSHOT
// =====================================================

export interface IGroupBookingPackageSnapshot {
  id?: string;

  name?: string;

  makkahHotel?: unknown;

  madinahHotel?: unknown;

  hotelName?: string;

  airline?: string;

  airlineCode?: string;

  airlineLogo?: string;

  sector?: unknown;

  durationDays?: number;

  depFrom?: string;

  depTo?: string;

  depDate?: string;

  depTime?: string;

  arrTime?: string;

  retFrom?: string;

  retTo?: string;

  retDate?: string;

  retDepTime?: string;

  retArrTime?: string;

  sharingPrice?: number;

  quadPrice?: number;

  triplePrice?: number;

  doublePrice?: number;

  pricePerPerson?: number;

  availableSeats?: number;

  description?: string;

  inclusions?: unknown;

  exclusions?: unknown;

  [key: string]: unknown;
}

// =====================================================
// MAIN GROUP BOOKING
// =====================================================

export interface IGroupBooking extends Document {
  // ---------------------------------------------------
  // BASIC
  // ---------------------------------------------------

  bookingReference: string;

  bookingType: GroupBookingType;

  // ---------------------------------------------------
  // GROUP
  // ---------------------------------------------------

  groupId: string;

  groupName: string;

  groupLabel?: string;

  groupCountry?: string;

  groupDescription?: string;

  groupType: GroupType;

  // ---------------------------------------------------
  // ROUTE / SECTOR
  // ---------------------------------------------------

  routeId: string;

  routeLabel?: string;

  sector?: string;

  // ---------------------------------------------------
  // FLIGHT
  // ---------------------------------------------------

  flightId: string;

  flightNumber?: string;

  airline?: string;

  airlineCode?: string;

  airlineLogo?: string;

  from?: string;

  fromCode?: string;

  fromCity?: string;

  to?: string;

  toCode?: string;

  toCity?: string;

  departureDate?: string;

  departureTime?: string;

  arrivalDate?: string;

  arrivalTime?: string;

  duration?: string;

  baggage?: string;

  meal?: boolean;

  stops?: number;

  stopCities?: string[];

  stopCity?: string;

  cabin?: string;

  class?: string;

  // ---------------------------------------------------
  // PACKAGE
  // ---------------------------------------------------

  packageId: string;

  packageName?: string;

  packageType?: string;

  // ---------------------------------------------------
  // CUSTOM UMRAH SPECIFIC FIELDS
  // ---------------------------------------------------

  // Trip details
  customUmrahTripDetails?: ICustomUmrahTripDetails;

  // Hotels - NEW: Support multiple hotel stays
  hotelStays?: ICustomUmrahHotelSnapshot[];

  // Hotels - LEGACY: Single Makkah/Madinah hotels (for backward compatibility)
  makkahHotelId?: string;
  makkahHotelSnapshot?: ICustomUmrahHotelSnapshot;

  madinahHotelId?: string;
  madinahHotelSnapshot?: ICustomUmrahHotelSnapshot;

  // Services
  visaServiceId?: string;
  visaSnapshot?: ICustomUmrahServiceSnapshot;

  transportServiceId?: string;
  transportSnapshot?: ICustomUmrahServiceSnapshot;

  ziyaratServiceId?: string;
  ziyaratSnapshot?: ICustomUmrahServiceSnapshot;

  // PNR (optional)
  pnr?: string;
  pnrStatus?: string;

  // ---------------------------------------------------
  // FIXED PACKAGE DIRECT SUMMARY
  // ---------------------------------------------------

  returnDate?: string;

  returnDepartureTime?: string;

  returnArrivalTime?: string;

  durationDays?: number;

  // ---------------------------------------------------
  // CUSTOMER
  // ---------------------------------------------------

  customer: IGroupBookingCustomer;

  customerName: string;

  customerEmail: string;

  customerPhone: string;

  // ---------------------------------------------------
  // PASSENGERS
  // ---------------------------------------------------

  passengers: IGroupBookingPassenger[];

  adults: number;

  children: number;

  infants: number;

  passengerCount: number;

  totalPassengers?: number;

  // ---------------------------------------------------
  // PRICING
  // ---------------------------------------------------

  adultPrice: number;

  childPrice: number;

  infantPrice: number;

  baseAmount?: number;

  taxes?: number;

  fees?: number;

  extrasTotal?: number;

  coupon?: string;

  couponDiscount?: number;

  totalAmount: number;

  amount: number;

  currency: string;

  // ---------------------------------------------------
  // PAYMENT
  // ---------------------------------------------------

  paymentMethod?: GroupPaymentMethod;

  payment?: IGroupBookingPayment;

  receiptFileName?: string;

  receiptUrl?: string;

  // ---------------------------------------------------
  // SNAPSHOTS
  // ---------------------------------------------------

  routeSnapshot: IGroupBookingRouteSnapshot | null;

  flightSnapshot: IGroupBookingFlightSnapshot | null;

  packageSnapshot: IGroupBookingPackageSnapshot | null;

  // ---------------------------------------------------
  // STATUS
  // ---------------------------------------------------

  status: GroupBookingStatus;

  paymentStatus: GroupBookingPaymentStatus;

  // ---------------------------------------------------
  // USER
  // ---------------------------------------------------

  userId?: mongoose.Types.ObjectId;

  // ---------------------------------------------------
  // NOTES / REMARKS
  // ---------------------------------------------------

  notes?: string;

  agentRemarks?: string;

  // ---------------------------------------------------
  // CLIENT-ADMIN MESSAGING SYSTEM
  // ---------------------------------------------------

  clientRemarks?: Array<{
    id?: string;
    message: string;
    attachmentUrl?: string; // Cloudinary image URL
    attachmentFileName?: string;
    createdAt?: Date;
  }>;

  adminReplies?: Array<{
    id?: string;
    message: string;
    adminId?: string;
    adminName: string; // Admin's name from login (e.g., "Admin1", "Admin2")
    adminEmail?: string;
    createdAt?: Date;
    resolved?: boolean; // Mark if this reply resolves the issue
  }>;

  // ---------------------------------------------------
  // CONFIRMATION
  // ---------------------------------------------------

  confirmationReference?: string;

  confirmedAt?: Date;

  // ---------------------------------------------------
  // TIMESTAMPS
  // ---------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// =====================================================
// CUSTOMER SCHEMA
// =====================================================

const GroupBookingCustomerSchema = new Schema<IGroupBookingCustomer>(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// PAYMENT SCHEMA
// =====================================================

const GroupBookingPaymentSchema = new Schema<IGroupBookingPayment>(
  {
    method: {
      type: String,
      enum: ["agency", "bank"],
    },

    transactionId: {
      type: String,
      trim: true,
    },

    paymentReference: {
      type: String,
      trim: true,
    },

    bankName: {
      type: String,
      trim: true,
    },

    accountName: {
      type: String,
      trim: true,
    },

    receiptFileName: {
      type: String,
      trim: true,
    },

    receiptUrl: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "PKR",
      trim: true,
      uppercase: true,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// PASSENGER SCHEMA
// =====================================================

const GroupBookingPassengerSchema = new Schema<IGroupBookingPassenger>(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    nationality: {
      type: String,
      default: "",
      trim: true,
    },

    passportNumber: {
      type: String,
      default: "",
      trim: true,
    },

    passportExpiry: {
      type: String,
      default: "",
    },

    passportCountry: {
      type: String,
      default: "",
      trim: true,
    },

    passportUrl: {
      type: String,
      default: "",
      trim: true,
      required: [true, "Passport image is required for all passengers"],
    },

    type: {
      type: String,
      enum: ["adult", "child", "infant"],
      default: "adult",
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// CUSTOM UMRAH TRIP DETAILS SCHEMA
// =====================================================

const CustomUmrahTripDetailsSchema = new Schema<ICustomUmrahTripDetails>(
  {
    adults: {
      type: Number,
      default: 1,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
      min: 0,
    },

    infants: {
      type: Number,
      default: 0,
      min: 0,
    },

    pakistanAirport: {
      type: String,
      default: "",
      trim: true,
    },

    pakistanAirportCity: {
      type: String,
      default: "",
      trim: true,
    },

    saudiAirport: {
      type: String,
      default: "",
      trim: true,
    },

    saudiAirportCity: {
      type: String,
      default: "",
      trim: true,
    },

    departureDate: {
      type: String,
      default: "",
    },

    returnDate: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// CUSTOM UMRAH HOTEL SNAPSHOT SCHEMA
// =====================================================

const CustomUmrahHotelSnapshotSchema = new Schema<ICustomUmrahHotelSnapshot>(
  {
    id: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    starRating: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },

    distanceFromHaram: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    roomType: {
      type: String,
      default: "",
    },

    pricePerPerson: {
      type: Number,
      default: 0,
    },

    pricePerNight: {
      type: Number,
      default: 0,
    },

    nights: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// CUSTOM UMRAH SERVICE SNAPSHOT SCHEMA
// =====================================================

const CustomUmrahServiceSnapshotSchema =
  new Schema<ICustomUmrahServiceSnapshot>(
    {
      id: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      title: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      pricePerPerson: {
        type: Number,
        default: 0,
      },

      pricePerPackage: {
        type: Number,
        default: 0,
      },

      totalPrice: {
        type: Number,
        default: 0,
      },

      selected: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
      strict: false,
    },
  );

// =====================================================
// ROUTE SNAPSHOT SCHEMA
// =====================================================

const GroupBookingRouteSnapshotSchema = new Schema<IGroupBookingRouteSnapshot>(
  {
    id: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    from: {
      type: String,
      default: "",
    },

    fromCity: {
      type: String,
      default: "",
    },

    to: {
      type: String,
      default: "",
    },

    toCity: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
    strict: false,
  },
);

// =====================================================
// FLIGHT SNAPSHOT SCHEMA
// =====================================================

const GroupBookingFlightSnapshotSchema =
  new Schema<IGroupBookingFlightSnapshot>(
    {
      id: {
        type: String,
        default: "",
      },

      airline: {
        type: String,
        default: "",
      },

      airlineCode: {
        type: String,
        default: "",
        uppercase: true,
      },

      airlineLogo: {
        type: String,
        default: "",
      },

      from: {
        type: String,
        default: "",
      },

      fromCity: {
        type: String,
        default: "",
      },

      to: {
        type: String,
        default: "",
      },

      toCity: {
        type: String,
        default: "",
      },

      flightNumber: {
        type: String,
        default: "",
      },

      departureTime: {
        type: String,
        default: "",
      },

      arrivalTime: {
        type: String,
        default: "",
      },

      duration: {
        type: String,
        default: "",
      },

      date: {
        type: String,
        default: "",
      },

      baggage: {
        type: Schema.Types.Mixed,
        default: null,
      },

      meal: {
        type: Schema.Types.Mixed,
        default: null,
      },

      adultPrice: {
        type: Number,
        default: 0,
      },

      childPrice: {
        type: Number,
        default: 0,
      },

      infantPrice: {
        type: Number,
        default: 0,
      },

      seatsLeft: {
        type: Number,
        default: 0,
      },

      stops: {
        type: Number,
        default: 0,
      },

      stopCity: {
        type: String,
        default: "",
      },

      class: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
      strict: false,
    },
  );

// =====================================================
// PACKAGE SNAPSHOT SCHEMA
// =====================================================

const GroupBookingPackageSnapshotSchema =
  new Schema<IGroupBookingPackageSnapshot>(
    {
      id: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      makkahHotel: {
        type: Schema.Types.Mixed,
        default: null,
      },

      madinahHotel: {
        type: Schema.Types.Mixed,
        default: null,
      },

      hotelName: {
        type: String,
        default: "",
      },

      airline: {
        type: String,
        default: "",
      },

      airlineCode: {
        type: String,
        default: "",
        uppercase: true,
      },

      airlineLogo: {
        type: String,
        default: "",
      },

      sector: {
        type: Schema.Types.Mixed,
        default: null,
      },

      durationDays: {
        type: Number,
        default: 0,
      },

      depFrom: {
        type: String,
        default: "",
      },

      depTo: {
        type: String,
        default: "",
      },

      depDate: {
        type: String,
        default: "",
      },

      depTime: {
        type: String,
        default: "",
      },

      arrTime: {
        type: String,
        default: "",
      },

      retFrom: {
        type: String,
        default: "",
      },

      retTo: {
        type: String,
        default: "",
      },

      retDate: {
        type: String,
        default: "",
      },

      retDepTime: {
        type: String,
        default: "",
      },

      retArrTime: {
        type: String,
        default: "",
      },

      sharingPrice: {
        type: Number,
        default: 0,
      },

      quadPrice: {
        type: Number,
        default: 0,
      },

      triplePrice: {
        type: Number,
        default: 0,
      },

      doublePrice: {
        type: Number,
        default: 0,
      },

      pricePerPerson: {
        type: Number,
        default: 0,
      },

      availableSeats: {
        type: Number,
        default: 0,
      },

      description: {
        type: String,
        default: "",
      },

      inclusions: {
        type: Schema.Types.Mixed,
        default: null,
      },

      exclusions: {
        type: Schema.Types.Mixed,
        default: null,
      },
    },
    {
      _id: false,
      strict: false,
    },
  );

// =====================================================
// MAIN GROUP BOOKING SCHEMA
// =====================================================

const GroupBookingSchema = new Schema<IGroupBooking>(
  {
    // -------------------------------------------------
    // BOOKING REFERENCE
    // -------------------------------------------------

    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // -------------------------------------------------
    // BOOKING TYPE
    // -------------------------------------------------

    bookingType: {
      type: String,
      enum: ["customized-flight", "fixed-package", "custom-umrah"],
      required: true,
      index: true,
    },

    // -------------------------------------------------
    // GROUP
    // -------------------------------------------------

    groupId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    groupName: {
      type: String,
      required: true,
      trim: true,
    },

    groupLabel: {
      type: String,
      default: "",
      trim: true,
    },

    groupCountry: {
      type: String,
      default: "",
      trim: true,
    },

    groupDescription: {
      type: String,
      default: "",
      trim: true,
    },

    groupType: {
      type: String,
      enum: ["fixed", "custom"],
      required: true,
      index: true,
    },

    // -------------------------------------------------
    // ROUTE
    // -------------------------------------------------

    routeId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    routeLabel: {
      type: String,
      default: "",
      trim: true,
    },

    sector: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------------------------
    // FLIGHT
    // -------------------------------------------------

    flightId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    flightNumber: {
      type: String,
      default: "",
      trim: true,
    },

    airline: {
      type: String,
      default: "",
      trim: true,
    },

    airlineCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    airlineLogo: {
      type: String,
      default: "",
      trim: true,
    },

    from: {
      type: String,
      default: "",
      trim: true,
    },

    fromCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    fromCity: {
      type: String,
      default: "",
      trim: true,
    },

    to: {
      type: String,
      default: "",
      trim: true,
    },

    toCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    toCity: {
      type: String,
      default: "",
      trim: true,
    },

    departureDate: {
      type: String,
      default: "",
    },

    departureTime: {
      type: String,
      default: "",
    },

    arrivalDate: {
      type: String,
      default: "",
    },

    arrivalTime: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    baggage: {
      type: String,
      default: "",
    },

    meal: {
      type: Boolean,
      default: false,
    },

    stops: {
      type: Number,
      default: 0,
    },

    stopCities: {
      type: [String],
      default: [],
    },

    stopCity: {
      type: String,
      default: "",
    },

    cabin: {
      type: String,
      default: "Economy",
    },

    class: {
      type: String,
      default: "Economy",
    },

    // -------------------------------------------------
    // PACKAGE
    // -------------------------------------------------

    packageId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    packageName: {
      type: String,
      default: "",
      trim: true,
    },

    packageType: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------------------------
    // CUSTOM UMRAH SPECIFIC FIELDS
    // -------------------------------------------------

    customUmrahTripDetails: {
      type: CustomUmrahTripDetailsSchema,
      default: null,
    },

    // Hotels - NEW: Support multiple hotel stays
    hotelStays: {
      type: [CustomUmrahHotelSnapshotSchema],
      default: null,
    },

    // Hotels - LEGACY: Single Makkah/Madinah hotels (for backward compatibility)
    makkahHotelId: {
      type: String,
      default: "",
      trim: true,
    },

    makkahHotelSnapshot: {
      type: CustomUmrahHotelSnapshotSchema,
      default: null,
    },

    madinahHotelId: {
      type: String,
      default: "",
      trim: true,
    },

    madinahHotelSnapshot: {
      type: CustomUmrahHotelSnapshotSchema,
      default: null,
    },

    visaServiceId: {
      type: String,
      default: "",
      trim: true,
    },

    visaSnapshot: {
      type: CustomUmrahServiceSnapshotSchema,
      default: null,
    },

    transportServiceId: {
      type: String,
      default: "",
      trim: true,
    },

    transportSnapshot: {
      type: CustomUmrahServiceSnapshotSchema,
      default: null,
    },

    ziyaratServiceId: {
      type: String,
      default: "",
      trim: true,
    },

    ziyaratSnapshot: {
      type: CustomUmrahServiceSnapshotSchema,
      default: null,
    },

    pnr: {
      type: String,
      default: "",
      trim: true,
    },

    pnrStatus: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------------------------
    // RETURN / PACKAGE SUMMARY
    // -------------------------------------------------

    returnDate: {
      type: String,
      default: "",
    },

    returnDepartureTime: {
      type: String,
      default: "",
    },

    returnArrivalTime: {
      type: String,
      default: "",
    },

    durationDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // -------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------

    customer: {
      type: GroupBookingCustomerSchema,
      default: {},
    },

    customerName: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },

    customerEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      required: true,
    },

    customerPhone: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },

    // -------------------------------------------------
    // PASSENGERS
    // -------------------------------------------------

    passengers: {
      type: [GroupBookingPassengerSchema],
      default: [],
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
      min: 0,
    },

    infants: {
      type: Number,
      default: 0,
      min: 0,
    },

    passengerCount: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPassengers: {
      type: Number,
      default: 0,
      min: 0,
    },

    // -------------------------------------------------
    // PRICING
    // -------------------------------------------------

    adultPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    childPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    baseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },

    fees: {
      type: Number,
      default: 0,
      min: 0,
    },

    extrasTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    coupon: {
      type: String,
      default: "",
      trim: true,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
      trim: true,
    },

    // -------------------------------------------------
    // PAYMENT
    // -------------------------------------------------

    paymentMethod: {
      type: String,
      enum: ["agency", "bank"],
    },

    payment: {
      type: GroupBookingPaymentSchema,
    },

    receiptFileName: {
      type: String,
      default: "",
      trim: true,
    },

    receiptUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------------------------
    // SNAPSHOTS
    // -------------------------------------------------

    routeSnapshot: {
      type: GroupBookingRouteSnapshotSchema,
      default: null,
    },

    flightSnapshot: {
      type: GroupBookingFlightSnapshotSchema,
      default: null,
    },

    packageSnapshot: {
      type: GroupBookingPackageSnapshotSchema,
      default: null,
    },

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    // -------------------------------------------------
    // USER
    // -------------------------------------------------

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    // -------------------------------------------------
    // NOTES / REMARKS
    // -------------------------------------------------

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    agentRemarks: {
      type: String,
      default: "",
      trim: true,
    },

    // -------------------------------------------------
    // CLIENT-ADMIN MESSAGING SYSTEM
    // -------------------------------------------------

    clientRemarks: {
      type: [
        {
          _id: false,
          id: {
            type: String,
          },
          adminId: {
            type: String,
          },
          message: {
            type: String,
            required: true,
            trim: true,
          },
          attachmentUrl: {
            type: String,
            default: "",
            trim: true,
          },
          attachmentFileName: {
            type: String,
            default: "",
            trim: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },

    adminReplies: {
      type: [
        {
          _id: false,
          id: {
            type: String,
          },
          message: {
            type: String,
            required: true,
            trim: true,
          },
          adminName: {
            type: String,
            required: true,
            trim: true,
          },
          adminEmail: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          resolved: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    // -------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------

    confirmationReference: {
      type: String,
      default: "",
      trim: true,
    },

    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// INDEXES
// =====================================================

GroupBookingSchema.index({
  groupId: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  groupType: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  routeId: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  flightId: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  packageId: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  customerEmail: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  userId: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  status: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

GroupBookingSchema.index({
  bookingType: 1,
  createdAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

export default mongoose.model<IGroupBooking>(
  "GroupBooking",
  GroupBookingSchema,
);
