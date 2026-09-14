import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// TRANSPORT VEHICLE MODEL
// Managed by admin — prices & vehicles updatable anytime
// =====================================================

export interface ITransportVehicle extends Document {
  id: string;
  name: string;
  description: string;
  vehicleType: "car" | "staria" | "starx" | "hiace" | "bus" | "none";
  minPassengers: number;
  maxPassengers: number;
  /** Price per person in SAR */
  pricePerPerson: number;
  /** Fixed package price in SAR (0 = use pricePerPerson) */
  pricePerPackage: number;
  currency: string;
  inclusions: string[];
  status: "active" | "inactive";
  displayOrder: number;
}

const transportVehicleSchema = new Schema<ITransportVehicle>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "staria", "starx", "hiace", "bus", "none"],
      required: true,
    },
    minPassengers: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPassengers: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    pricePerPackage: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "SAR",
      uppercase: true,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const TransportVehicle = mongoose.model<ITransportVehicle>(
  "TransportVehicle",
  transportVehicleSchema,
);

export default TransportVehicle;
