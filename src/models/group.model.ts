import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// GROUP TYPES
// =====================================================

export type GroupType = "fixed" | "customized";

// =====================================================
// FLIGHT OPTION
// Used by Custom Groups
// =====================================================

export interface IGroupFlight {
  id: string;

  airline: string;
  airlineCode: string;
  airlineLogo: string;

  from: string;
  fromCity: string;

  to: string;
  toCity: string;

  flightNumber: string;

  departureTime: string;
  arrivalTime: string;

  duration: string;

  date: string;

  baggage: string;

  meal: boolean;

  adultPrice: number;
  childPrice: number;
  infantPrice: number;

  seatsLeft: number;

  stops: number;
  stopCity?: string;

  class: string;

  active: boolean;
}

// =====================================================
// FIXED PACKAGE
// Used by Umrah / Fixed Groups
// =====================================================

export interface IGroupPackage {
  id: string;

  name: string;

  // ---------------------------------------------------
  // Package / Hotel
  // ---------------------------------------------------

  makkahHotel?: string;
  madinahHotel?: string;

  hotelName?: string;

  // ---------------------------------------------------
  // Airline
  // ---------------------------------------------------

  airline: string;
  airlineCode: string;
  airlineLogo: string;

  // ---------------------------------------------------
  // Sector
  // ---------------------------------------------------

  sector: string;

  // ---------------------------------------------------
  // Duration
  // ---------------------------------------------------

  durationDays: number;

  // ---------------------------------------------------
  // Departure
  // ---------------------------------------------------

  depFrom: string;
  depTo: string;

  depDate: string;
  depTime: string;

  arrTime: string;

  // ---------------------------------------------------
  // Return
  // ---------------------------------------------------

  retFrom?: string;
  retTo?: string;

  retDate?: string;

  retDepTime?: string;
  retArrTime?: string;

  // ---------------------------------------------------
  // Room / Sharing Prices
  // ---------------------------------------------------

  sharingPrice?: number;
  quadPrice?: number;
  triplePrice?: number;
  doublePrice?: number;

  // ---------------------------------------------------
  // General Package Price
  // ---------------------------------------------------

  pricePerPerson?: number;

  // ---------------------------------------------------
  // Availability
  // ---------------------------------------------------

  availableSeats: number;

  // ---------------------------------------------------
  // Extra Information
  // ---------------------------------------------------

  description?: string;

  inclusions?: string[];

  exclusions?: string[];

  active: boolean;
}

// =====================================================
// ROUTE
// Used by Custom Groups
// Example:
// Lahore → Jeddah
// Lahore → Riyadh
// Lahore → Sharjah
// =====================================================

export interface IGroupRoute {
  id: string;

  label: string;

  from: string;
  fromCity: string;

  to: string;
  toCity: string;

  flights: IGroupFlight[];

  active: boolean;
}

// =====================================================
// MAIN GROUP
// =====================================================

export interface IGroup extends Document {
  // ---------------------------------------------------
  // Basic Information
  // ---------------------------------------------------

  id: string;

  name: string;

  label: string;

  country: string;

  type: GroupType;

  image?: string;

  description?: string;

  color?: string;

  // ---------------------------------------------------
  // Group Configuration
  // ---------------------------------------------------

  active: boolean;

  // ---------------------------------------------------
  // Routes
  // ---------------------------------------------------

  routes: IGroupRoute[];

  // ---------------------------------------------------
  // Fixed Packages
  // ---------------------------------------------------

  packages: IGroupPackage[];

  // ---------------------------------------------------
  // Timestamps
  // ---------------------------------------------------

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// FLIGHT SCHEMA
// =====================================================

const GroupFlightSchema = new Schema<IGroupFlight>(
  {
    id: {
      type: String,
      required: true,
    },

    airline: {
      type: String,
      required: true,
      trim: true,
    },

    airlineCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    airlineLogo: {
      type: String,
      default: "",
    },

    from: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    fromCity: {
      type: String,
      required: true,
      trim: true,
    },

    to: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    toCity: {
      type: String,
      required: true,
      trim: true,
    },

    flightNumber: {
      type: String,
      required: true,
      trim: true,
    },

    departureTime: {
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

    date: {
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

    adultPrice: {
      type: Number,
      required: true,
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

    seatsLeft: {
      type: Number,
      default: 0,
      min: 0,
    },

    stops: {
      type: Number,
      default: 0,
      min: 0,
    },

    stopCity: {
      type: String,
      default: "",
    },

    class: {
      type: String,
      default: "Economy",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// PACKAGE SCHEMA
// =====================================================

const GroupPackageSchema = new Schema<IGroupPackage>(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    makkahHotel: {
      type: String,
      default: "",
    },

    madinahHotel: {
      type: String,
      default: "",
    },

    hotelName: {
      type: String,
      default: "",
    },

    airline: {
      type: String,
      required: true,
      trim: true,
    },

    airlineCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    airlineLogo: {
      type: String,
      default: "",
    },

    sector: {
      type: String,
      required: true,
      trim: true,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },

    depFrom: {
      type: String,
      required: true,
    },

    depTo: {
      type: String,
      required: true,
    },

    depDate: {
      type: String,
      required: true,
    },

    depTime: {
      type: String,
      required: true,
    },

    arrTime: {
      type: String,
      required: true,
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
      min: 0,
    },

    quadPrice: {
      type: Number,
      min: 0,
    },

    triplePrice: {
      type: Number,
      min: 0,
    },

    doublePrice: {
      type: Number,
      min: 0,
    },

    pricePerPerson: {
      type: Number,
      min: 0,
    },

    availableSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    inclusions: {
      type: [String],
      default: [],
    },

    exclusions: {
      type: [String],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// ROUTE SCHEMA
// =====================================================

const GroupRouteSchema = new Schema<IGroupRoute>(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    from: {
      type: String,
      required: true,
      uppercase: true,
    },

    fromCity: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
      uppercase: true,
    },

    toCity: {
      type: String,
      required: true,
    },

    flights: {
      type: [GroupFlightSchema],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// MAIN GROUP SCHEMA
// =====================================================

const GroupSchema = new Schema<IGroup>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["fixed", "custom"],
      required: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    routes: {
      type: [GroupRouteSchema],
      default: [],
    },

    packages: {
      type: [GroupPackageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// EXPORT
// =====================================================

export default mongoose.model<IGroup>("Group", GroupSchema);
