import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// ROOM TYPE (for Custom Umrah hotels)
// =====================================================

export interface IHotelRoomType {
  id: string;
  type: string;
  occupancy: number;
  pricePerPerson: number;
  pricePerNight: number;
}

export interface IHotel extends Document {
  id: string;

  name: string;
  stars: number;
  location: string;

  city: string;
  country: string;

  image: string;
  amenities: string[];

  pricePerNight: number;
  currency: string;

  status: "active" | "inactive";

  // =====================================================
  // Custom Umrah specific fields (optional)
  // =====================================================

  distanceFromHaram?: string;
  distanceFromMasjidNabawi?: string;
  images?: string[];
  category?: "budget" | "standard" | "premium" | "luxury";
  roomTypes?: IHotelRoomType[];
  umrahCity?: "makkah" | "madinah";
  isUmrahHotel?: boolean;
}

const hotelSchema = new Schema<IHotel>(
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

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    amenities: {
      type: [String],
      default: [],
    },

    pricePerNight: {
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

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    // =====================================================
    // Custom Umrah specific fields (optional)
    // =====================================================

    distanceFromHaram: {
      type: String,
      default: "",
      trim: true,
    },

    distanceFromMasjidNabawi: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: ["budget", "standard", "premium", "luxury"],
      index: true,
    },

    roomTypes: {
      type: [
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          occupancy: { type: Number, required: true },
          pricePerPerson: { type: Number, required: true },
          pricePerNight: { type: Number, required: true },
        },
      ],
      default: [],
    },

    umrahCity: {
      type: String,
      enum: ["makkah", "madinah"],
      lowercase: true,
      index: true,
    },

    isUmrahHotel: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
