/**
 * Seed Transport Vehicles
 *
 * Prices stored in PKR (frontend uses PKR as base currency and converts).
 * SAR equivalents for reference:
 *   Car       340 SAR → 25,330 PKR  (1-2 persons)
 *   Staria    390 SAR → 29,055 PKR  (3-5 persons)
 *   Star-X    410 SAR → 30,545 PKR  (6-8 persons)
 *   Bus        30 SAR →  2,235 PKR  per person (6-8 and 9-10)
 *   Hiace     450 SAR → 33,525 PKR  (9-10 persons)  ← admin can update
 *
 * Run: npm run seed-transport-vehicles
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

const transportVehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    vehicleType: {
      type: String,
      enum: ["car", "staria", "starx", "hiace", "bus", "none"],
      required: true,
    },
    minPassengers: { type: Number, required: true, min: 0 },
    maxPassengers: { type: Number, required: true, min: 0 },
    pricePerPerson: { type: Number, required: true, min: 0, default: 0 },
    pricePerPackage: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "PKR", uppercase: true },
    inclusions: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const TransportVehicle =
  mongoose.models.TransportVehicle ||
  mongoose.model("TransportVehicle", transportVehicleSchema);

// =====================================================
// VEHICLES — prices in PKR (1 SAR ≈ 74.5 PKR)
// =====================================================
const vehicles = [
  // 1-2 persons → Car (340 SAR = 25,330 PKR fixed package)
  {
    id: "transport-car-1-2",
    name: "Car",
    description: "Car for 1-2 passengers. Jeddah → Makkah.",
    vehicleType: "car",
    minPassengers: 1,
    maxPassengers: 2,
    pricePerPerson: 0,
    pricePerPackage: 25330, // PKR — 340 SAR × 74.5
    currency: "PKR",
    inclusions: ["Air-conditioned", "Professional driver", "Jeddah to Makkah"],
    status: "active",
    displayOrder: 1,
  },

  // 3-5 persons → Staria Taxi (390 SAR = 29,055 PKR fixed package)
  {
    id: "transport-staria-3-5",
    name: "Staria Taxi",
    description: "Staria taxi for 3-5 passengers. Jeddah → Makkah.",
    vehicleType: "staria",
    minPassengers: 3,
    maxPassengers: 5,
    pricePerPerson: 0,
    pricePerPackage: 29055, // PKR — 390 SAR × 74.5
    currency: "PKR",
    inclusions: ["Air-conditioned", "Professional driver", "Jeddah to Makkah"],
    status: "active",
    displayOrder: 2,
  },

  // 6-8 persons → Star-X Taxi (410 SAR = 30,545 PKR fixed package)
  {
    id: "transport-starx-6-8",
    name: "Star-X Taxi",
    description: "Star-X taxi for 6-8 passengers. Jeddah → Makkah.",
    vehicleType: "starx",
    minPassengers: 6,
    maxPassengers: 8,
    pricePerPerson: 0,
    pricePerPackage: 30545, // PKR — 410 SAR × 74.5
    currency: "PKR",
    inclusions: ["Air-conditioned", "Professional driver", "Jeddah to Makkah"],
    status: "active",
    displayOrder: 3,
  },

  // 6-10 persons → Bus (30 SAR/person = 2,235 PKR/person)
  {
    id: "transport-bus-6-10",
    name: "Bus",
    description: "Bus for 6-10 passengers. 30 SAR per person.",
    vehicleType: "bus",
    minPassengers: 6,
    maxPassengers: 10,
    pricePerPerson: 2235, // PKR — 30 SAR × 74.5
    pricePerPackage: 0,
    currency: "PKR",
    inclusions: ["Air-conditioned", "Professional driver", "Jeddah to Makkah"],
    status: "active",
    displayOrder: 4,
  },
];

// IDs to KEEP — everything else gets deleted
const keepIds = vehicles.map((v) => v.id);

async function seed() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Delete ALL old transport vehicles that are NOT in our new list
  // (removes duplicates, old hardcoded ones, "transport-none", etc.)
  const deleted = await TransportVehicle.deleteMany({
    id: { $nin: keepIds },
  });
  console.log(`🗑️  Deleted ${deleted.deletedCount} old/extra vehicle(s)`);

  let created = 0;
  let updated = 0;

  for (const v of vehicles) {
    const existing = await TransportVehicle.findOne({ id: v.id });
    if (existing) {
      await TransportVehicle.findOneAndUpdate({ id: v.id }, { $set: v });
      console.log(`🔄 Updated: ${v.name} (${v.id})`);
      updated++;
    } else {
      await TransportVehicle.create(v);
      console.log(`✅ Created: ${v.name} (${v.id})`);
      created++;
    }
  }

  console.log(`\n🎉 Done! Created: ${created}, Updated: ${updated}, Deleted: ${deleted.deletedCount}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
