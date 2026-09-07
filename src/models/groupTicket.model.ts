import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// GROUP TICKET INTERFACE
// =====================================================

export interface IGroupTicket extends Document {
  id: string;
  type: "umrah";
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  sector: string;
  outboundDate: string;
  outboundTime: string;
  returnDate: string;
  returnTime: string;
  baggage: string;
  meal: boolean;
  totalSeats: number;
  seatsLeft: number;
  fare: number;
  currency: string;
  active: boolean;
}

// =====================================================
// GROUP TICKET SCHEMA
// =====================================================

const groupTicketSchema = new Schema<IGroupTicket>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["umrah"],
      default: "umrah",
    },

    airline: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    airlineCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    airlineLogo: {
      type: String,
      default: "",
      trim: true,
    },

    sector: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    outboundDate: {
      type: String,
      required: true,
    },

    outboundTime: {
      type: String,
      required: true,
    },

    returnDate: {
      type: String,
      required: true,
    },

    returnTime: {
      type: String,
      required: true,
    },

    baggage: {
      type: String,
      default: "20 KG",
      trim: true,
    },

    meal: {
      type: Boolean,
      default: false,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    seatsLeft: {
      type: Number,
      required: true,
      min: 0,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const GroupTicket = mongoose.model<IGroupTicket>("GroupTicket", groupTicketSchema);

export default GroupTicket;
