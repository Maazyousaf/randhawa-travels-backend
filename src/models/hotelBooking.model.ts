import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// Guest Passport Details
// =====================================================

export interface IHotelGuest {
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  nationality: string;

  passportNumber: string;
  passportExpiry: string;
  passportIssueCountry?: string;

  // Cloudinary URLs
  passportUrl?: string;

  type: "adult" | "child" | "infant";
}

// =====================================================
// Contact
// =====================================================

export interface IHotelBookingContact {
  email: string;
  phone: string;
  countryCode?: string;
}

// =====================================================
// Payment
// =====================================================

export interface IHotelBookingPayment {
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
// Hotel Booking
// =====================================================

export interface IHotelBooking extends Document {
  // User
  userId: mongoose.Types.ObjectId;

  // Request
  requestId: string;

  // Booking status
  status: "pending" | "confirmed" | "cancelled" | "rejected";

  // Payment status
  paymentStatus: "pending" | "submitted" | "verified" | "rejected";

  // Selected hotel
  hotelId: string;

  hotelName: string;
  stars: number;
  location: string;

  city: string;
  country: string;

  hotelImage: string;
  amenities: string[];

  // Booking details
  checkIn: string;
  checkOut: string;
  nights: number;

  rooms: number;
  adults: number;
  children: number;

  // Guest details (passport info for all guests)
  guests: IHotelGuest[];

  // Contact details
  contact: IHotelBookingContact;

  // Pricing
  pricePerNight: number;
  totalAmount: number;
  currency: string;

  // Payment
  paymentMethod?: "agency" | "bank";
  payment?: IHotelBookingPayment;

  // Backward-compatible receipt fields
  receiptFileName?: string;
  receiptUrl?: string;

  // Special requests
  specialRequests?: string;

  // Optional user remarks
  agentRemarks?: string;

  // Confirmation
  confirmationReference?: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// Guest Schema
// =====================================================

const HotelGuestSchema = new Schema<IHotelGuest>(
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

    passportIssueCountry: {
      type: String,
      trim: true,
    },

    // Cloudinary - Passport image URL is required
    passportUrl: {
      type: String,
      trim: true,
      required: [true, "Passport image is required for all guests"],
    },

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

const HotelBookingContactSchema = new Schema<IHotelBookingContact>(
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
  },
  {
    _id: false,
  },
);

// =====================================================
// Payment Schema
// =====================================================

const HotelBookingPaymentSchema = new Schema<IHotelBookingPayment>(
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
// Main Hotel Booking Schema
// =====================================================

const HotelBookingSchema = new Schema<IHotelBooking>(
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
    // Selected Hotel
    // -----------------------------------------------

    hotelId: {
      type: String,
      required: true,
      index: true,
    },

    hotelName: {
      type: String,
      required: true,
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    location: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    country: {
      type: String,
      required: true,
    },

    hotelImage: {
      type: String,
      default: "",
    },

    amenities: {
      type: [String],
      default: [],
    },

    // -----------------------------------------------
    // Booking Details
    // -----------------------------------------------

    checkIn: {
      type: String,
      required: true,
    },

    checkOut: {
      type: String,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    rooms: {
      type: Number,
      required: true,
      min: 1,
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

    // -----------------------------------------------
    // Guests (with passport details)
    // -----------------------------------------------

    guests: {
      type: [HotelGuestSchema],
      required: true,
      validate: {
        validator: (value: IHotelGuest[]) => value.length > 0,
        message: "At least one guest is required",
      },
    },

    // -----------------------------------------------
    // Contact
    // -----------------------------------------------

    contact: {
      type: HotelBookingContactSchema,
      required: true,
    },

    // -----------------------------------------------
    // Pricing
    // -----------------------------------------------

    pricePerNight: {
      type: Number,
      required: true,
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
      type: HotelBookingPaymentSchema,
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
    // Special Requests
    // -----------------------------------------------

    specialRequests: {
      type: String,
      trim: true,
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

export default mongoose.model<IHotelBooking>(
  "HotelBooking",
  HotelBookingSchema,
);
