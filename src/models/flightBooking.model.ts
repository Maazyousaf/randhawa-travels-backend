import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// Passenger
// =====================================================

export interface IFlightPassenger {
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  nationality: string;

  passportNumber: string;
  passportExpiry: string;
  passportCountry?: string;
  passportIssueCountry?: string;

  // Cloudinary URLs
  passportUrl?: string;
  // selfieUrl?: string;

  type: "adult" | "child" | "infant";
}

// =====================================================
// Contact
// =====================================================

export interface IBookingContact {
  email: string;
  phone: string;
  countryCode?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

// =====================================================
// Extras
// =====================================================

export interface IFlightExtras {
  extraBaggage: boolean;
  insurance: boolean;
  seatSelection: boolean;
  meal: boolean;
  flexibleTicket: boolean;
  refundProtection: boolean;
}

// =====================================================
// Payment
// =====================================================

export interface IBookingPayment {
  method?: "agency" | "bank";

  transactionId?: string;
  paymentReference?: string;

  bankName?: string;
  accountName?: string;

  // Cloudinary receipt
  receiptFileName?: string;
  receiptUrl?: string;

  amount?: number;
  currency?: string;

  submittedAt?: Date;
}

// =====================================================
// Flight Booking
// =====================================================

export interface IFlightBooking extends Document {
  // User
  userId: mongoose.Types.ObjectId;

  // Request
  requestId: string;

  // Booking status
  status: "pending" | "confirmed" | "cancelled" | "rejected";

  // Payment status
  paymentStatus: "pending" | "submitted" | "verified" | "rejected";

  // Selected static flight
  flightId: string;

  airline: string;
  airlineCode: string;
  airlineLogo: string;

  flightNumber: string;

  from: string;
  fromCode: string;

  to: string;
  toCode: string;

  departureDate: string;
  departureTime: string;

  arrivalDate: string;
  arrivalTime: string;

  duration: string;

  cabin: string;
  class: string;

  baggage: string;
  meal: boolean;

  stops: number;
  stopCities: string[];

  // Passenger counts
  adults: number;
  children: number;
  infants: number;

  // Passenger details
  passengers: IFlightPassenger[];

  // Contact details
  contact: IBookingContact;

  // Optional extras
  extras: IFlightExtras;

  // Pricing
  adultPrice: number;
  childPrice: number;
  infantPrice: number;

  baseAmount: number;
  taxes: number;
  fees: number;
  extrasTotal: number;

  coupon: string;
  couponDiscount: number;

  totalAmount: number;
  currency: string;

  // Payment
  paymentMethod?: "agency" | "bank";

  payment?: IBookingPayment;

  // Backward-compatible receipt fields
  receiptFileName?: string;
  receiptUrl?: string;

  // Optional user remarks
  agentRemarks?: string;

  // Confirmation
  confirmationReference?: string;
  ticketNumber?: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// Passenger Schema
// =====================================================

const FlightPassengerSchema = new Schema<IFlightPassenger>(
  {
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
    },

    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    passportNumber: {
      type: String,
      required: true,
      trim: true,
    },

    passportExpiry: {
      type: String,
      required: true,
    },

    passportCountry: {
      type: String,
      trim: true,
    },

    // Cloudinary - Passport image URL is required
    passportUrl: {
      type: String,
      trim: true,
      required: [true, "Passport image is required for all passengers"],
    },

    // selfieUrl: {
    //   type: String,
    //   trim: true,
    // },

    type: {
      type: String,
      enum: ["adult", "child", "infant"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// Contact Schema
// =====================================================

const BookingContactSchema = new Schema<IBookingContact>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    countryCode: {
      type: String,
      default: "+92",
    },

    emergencyName: {
      type: String,
      trim: true,
    },

    emergencyPhone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// Extras Schema
// =====================================================

const FlightExtrasSchema = new Schema<IFlightExtras>(
  {
    extraBaggage: {
      type: Boolean,
      default: false,
    },

    insurance: {
      type: Boolean,
      default: false,
    },

    seatSelection: {
      type: Boolean,
      default: false,
    },

    meal: {
      type: Boolean,
      default: false,
    },

    flexibleTicket: {
      type: Boolean,
      default: false,
    },

    refundProtection: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// Payment Schema
// =====================================================

const BookingPaymentSchema = new Schema<IBookingPayment>(
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

    // Receipt file name
    receiptFileName: {
      type: String,
      trim: true,
    },

    // Cloudinary receipt URL
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
  },
);

// =====================================================
// Main Flight Booking Schema
// =====================================================

const FlightBookingSchema = new Schema<IFlightBooking>(
  {
    // -----------------------------------------------
    // User (Optional - for guest bookings)
    // -----------------------------------------------

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    // -----------------------------------------------
    // Request ID
    // -----------------------------------------------

    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // -----------------------------------------------
    // Booking Status
    // -----------------------------------------------

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected"],
      default: "pending",
      index: true,
    },

    // -----------------------------------------------
    // Payment Status
    // -----------------------------------------------

    paymentStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    // -----------------------------------------------
    // Selected Flight
    // -----------------------------------------------

    flightId: {
      type: String,
      required: true,
      index: true,
    },

    airline: {
      type: String,
      required: true,
    },

    airlineCode: {
      type: String,
      required: true,
    },

    airlineLogo: {
      type: String,
      required: true,
    },

    flightNumber: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      required: true,
    },

    fromCode: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    toCode: {
      type: String,
      required: true,
    },

    departureDate: {
      type: String,
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalDate: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    cabin: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      required: true,
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

    // -----------------------------------------------
    // Passengers
    // -----------------------------------------------

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

    passengers: {
      type: [FlightPassengerSchema],
      required: true,
      validate: {
        validator: (value: IFlightPassenger[]) => value.length > 0,
        message: "At least one passenger is required",
      },
    },

    // -----------------------------------------------
    // Contact
    // -----------------------------------------------

    contact: {
      type: BookingContactSchema,
      required: true,
    },

    // -----------------------------------------------
    // Extras
    // -----------------------------------------------

    extras: {
      type: FlightExtrasSchema,

      default: () => ({
        extraBaggage: false,
        insurance: false,
        seatSelection: false,
        meal: false,
        flexibleTicket: false,
        refundProtection: false,
      }),
    },

    // -----------------------------------------------
    // Pricing
    // -----------------------------------------------

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

    baseAmount: {
      type: Number,
      required: true,
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

    currency: {
      type: String,
      default: "PKR",
      trim: true,
      uppercase: true,
    },

    // -----------------------------------------------
    // Payment
    // -----------------------------------------------

    paymentMethod: {
      type: String,
      enum: ["agency", "bank"],
    },

    payment: {
      type: BookingPaymentSchema,
    },

    // -----------------------------------------------
    // Backward-compatible Receipt
    // -----------------------------------------------

    receiptFileName: {
      type: String,
    },

    receiptUrl: {
      type: String,
    },

    // -----------------------------------------------
    // Remarks
    // -----------------------------------------------

    agentRemarks: {
      type: String,
      trim: true,
    },

    // -----------------------------------------------
    // Confirmation
    // -----------------------------------------------

    confirmationReference: {
      type: String,
      trim: true,
    },

    ticketNumber: {
      type: String,
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
// Export
// =====================================================

export default mongoose.model<IFlightBooking>(
  "FlightBooking",
  FlightBookingSchema,
);
