import TransportVehicle from "../models/transportVehicle.model.js";

// =====================================================
// SEED TRANSPORT VEHICLES
// Initial data based on pricing rules:
//   1–2  pax  → Car (SAR 340/person)
//   3–5  pax  → Staria Taxi (SAR 390/person)
//   6–8  pax  → Star-X Taxi + Bus (SAR 410/person)
//   9–10 pax  → Hiace + Bus (SAR 410/person)
//   Bus always SAR 30/person (standalone option for large groups)
// =====================================================

const SEED_VEHICLES = [
  {
    id: "transport-none",
    name: "No Transport",
    description: "I will arrange my own transportation",
    vehicleType: "none" as const,
    minPassengers: 0,
    maxPassengers: 999,
    pricePerPerson: 0,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [],
    status: "active" as const,
    displayOrder: 0,
  },
  {
    id: "transport-car-1to2",
    name: "Private Car",
    description: "Comfortable private car for 1–2 passengers",
    vehicleType: "car" as const,
    minPassengers: 1,
    maxPassengers: 2,
    pricePerPerson: 340,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [
      "Private car",
      "Air-conditioned",
      "Professional driver",
    ],
    status: "active" as const,
    displayOrder: 1,
  },
  {
    id: "transport-staria-3to5",
    name: "Staria Taxi",
    description: "Spacious Staria taxi van for 3–5 passengers",
    vehicleType: "staria" as const,
    minPassengers: 3,
    maxPassengers: 5,
    pricePerPerson: 390,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [
      "Staria van",
      "Air-conditioned",
      "Professional driver",
      "Extra luggage space",
    ],
    status: "active" as const,
    displayOrder: 2,
  },
  {
    id: "transport-starx-6to8",
    name: "Star-X Taxi + Bus",
    description: "Star-X taxi with bus support for 6–8 passengers",
    vehicleType: "starx" as const,
    minPassengers: 6,
    maxPassengers: 8,
    pricePerPerson: 410,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [
      "Star-X taxi",
      "Bus support",
      "Air-conditioned",
      "Professional driver",
    ],
    status: "active" as const,
    displayOrder: 3,
  },
  {
    id: "transport-hiace-9to10",
    name: "Hiace + Bus",
    description: "Toyota Hiace with bus support for 9–10 passengers",
    vehicleType: "hiace" as const,
    minPassengers: 9,
    maxPassengers: 10,
    pricePerPerson: 410,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [
      "Toyota Hiace",
      "Bus support",
      "Air-conditioned",
      "Professional driver",
    ],
    status: "active" as const,
    displayOrder: 4,
  },
  {
    id: "transport-bus",
    name: "Bus",
    description: "Shared bus service — SAR 30 per person",
    vehicleType: "bus" as const,
    minPassengers: 1,
    maxPassengers: 999,
    pricePerPerson: 30,
    pricePerPackage: 0,
    currency: "SAR",
    inclusions: [
      "Shared bus",
      "Air-conditioned",
      "Professional driver",
    ],
    status: "active" as const,
    displayOrder: 5,
  },
];

export const seedTransportVehicles = async () => {
  try {
    const count = await TransportVehicle.countDocuments();
    if (count > 0) {
      return; // Already seeded
    }

    await TransportVehicle.insertMany(SEED_VEHICLES);
    console.log(
      `✅ Seeded ${SEED_VEHICLES.length} transport vehicles`,
    );
  } catch (error) {
    console.error("❌ Transport vehicle seed error:", error);
  }
};
