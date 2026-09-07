import mongoose, { Document, Schema } from "mongoose";

export interface IGroupTicketBooking extends Document {
  bookingReference: string;
  userId?: string;
  ticketId: string;
  ticketSnapshot: any;
  customer: any;
  passengers: any[];
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  currency: string;
  agentRemarks?: string;
  payment?: Record<string, unknown>;
  status: string;
  paymentStatus: string;
}

const GroupTicketBookingSchema = new Schema<IGroupTicketBooking>(
  {
    bookingReference: { type: String, required: true, unique: true },
    userId: { type: String, index: true },
    ticketId: { type: String, required: true },
    ticketSnapshot: { type: Schema.Types.Mixed, required: true },
    customer: { type: Schema.Types.Mixed, required: true },
    passengers: { type: Schema.Types.Mixed, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    infants: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    agentRemarks: String,
    payment: Schema.Types.Mixed,
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export default mongoose.model<IGroupTicketBooking>(
  "GroupTicketBooking",
  GroupTicketBookingSchema,
);
