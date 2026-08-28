import mongoose, { Document, Schema } from "mongoose";

export interface IFlight extends Document {
  id: string;

  airline: string;
  airlineCode: string;
  airlineLogo: string;

  flightNumber: string;

  from: string;
  fromCity: string;

  to: string;
  toCity: string;

  departureDate: string;
  departureTime: string;

  arrivalDate: string;
  arrivalTime: string;

  duration: string;

  cabin: string;
  class: string;

  price: number;
  childPrice: number;
  infantPrice: number;

  currency: string;

  stops: number;
  stopCity: string;

  seatsLeft: number;

  baggage: string;

  meal: boolean;

  status: "active" | "inactive";
}

const flightSchema = new Schema<IFlight>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

    flightNumber: {
      type: String,
      required: true,
      trim: true,
    },

    from: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
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
      index: true,
    },

    toCity: {
      type: String,
      required: true,
      trim: true,
    },

    departureDate: {
      type: String,
      required: true,
      index: true,
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
      lowercase: true,
      default: "economy",
    },

    class: {
      type: String,
      required: true,
      default: "Economy",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    childPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    infantPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "PKR",
      uppercase: true,
    },

    stops: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    stopCity: {
      type: String,
      default: "",
      trim: true,
    },

    seatsLeft: {
      type: Number,
      required: true,
      min: 0,
    },

    baggage: {
      type: String,
      default: "",
    },

    meal: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Flight = mongoose.model<IFlight>("Flight", flightSchema);

export default Flight;
