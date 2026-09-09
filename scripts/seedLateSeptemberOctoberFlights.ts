import "dotenv/config";
import mongoose from "mongoose";
import Flight from "../src/models/flight.model.js";
import { connectDB } from "../src/config/database.js";

const airlines = [
  {
    airline: "PIA",
    airlineCode: "PK",
    airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",
    priceOffset: 0,
    baggage: "20+7 KG",
    meal: true,
  },
  {
    airline: "Air Arabia",
    airlineCode: "G9",
    airlineLogo: "https://images.kiwi.com/airlines/64/G9.png",
    priceOffset: -6000,
    baggage: "20 KG",
    meal: false,
  },
];

const routes = [
  {
    from: "KHI",
    fromCity: "Karachi",
    to: "ISB",
    toCity: "Islamabad",
    duration: "2h 0m",
    basePrice: 28000,
    flightPrefix: "PK",
    flightBase: 301,
  },
  {
    from: "ISB",
    fromCity: "Islamabad",
    to: "KHI",
    toCity: "Karachi",
    duration: "2h 0m",
    basePrice: 28000,
    flightPrefix: "PK",
    flightBase: 302,
  },
  {
    from: "ISB",
    fromCity: "Islamabad",
    to: "LHE",
    toCity: "Lahore",
    duration: "1h 0m",
    basePrice: 18000,
    flightPrefix: "PK",
    flightBase: 303,
  },
  {
    from: "LHE",
    fromCity: "Lahore",
    to: "ISB",
    toCity: "Islamabad",
    duration: "1h 0m",
    basePrice: 18000,
    flightPrefix: "PK",
    flightBase: 304,
  },
  {
    from: "LHE",
    fromCity: "Lahore",
    to: "DXB",
    toCity: "Dubai",
    duration: "3h 20m",
    basePrice: 78000,
    flightPrefix: "PK",
    flightBase: 305,
  },
  {
    from: "DXB",
    fromCity: "Dubai",
    to: "JED",
    toCity: "Jeddah",
    duration: "3h 0m",
    basePrice: 72000,
    flightPrefix: "G9",
    flightBase: 306,
  },
  {
    from: "KHI",
    fromCity: "Karachi",
    to: "DXB",
    toCity: "Dubai",
    duration: "2h 20m",
    basePrice: 65000,
    flightPrefix: "PK",
    flightBase: 307,
  },
  {
    from: "ISB",
    fromCity: "Islamabad",
    to: "DXB",
    toCity: "Dubai",
    duration: "3h 0m",
    basePrice: 82000,
    flightPrefix: "PK",
    flightBase: 308,
  },
];

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const createFlights = () => {
  const records: Record<string, unknown>[] = [];
  const start = new Date("2026-09-25T12:00:00Z");
  const end = new Date("2026-10-31T12:00:00Z");

  for (const route of routes) {
    for (const airline of airlines) {
      for (
        const cursor = new Date(start);
        cursor <= end;
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      ) {
        const date = formatDate(cursor);
        const basePrice = route.basePrice + airline.priceOffset;
        const hour = airline.airlineCode === "PK" ? 8 : 14;
        const minute = route.from === "KHI" ? 15 : 30;
        const departureTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        records.push({
          id: `mc-${airline.airlineCode.toLowerCase()}-${route.from.toLowerCase()}-${route.to.toLowerCase()}-${date}`,
          airline: airline.airline,
          airlineCode: airline.airlineCode,
          airlineLogo: airline.airlineLogo,
          from: route.from,
          fromCity: route.fromCity,
          to: route.to,
          toCity: route.toCity,
          flightNumber: `${airline.airlineCode} ${route.flightBase}`,
          departureDate: date,
          departureTime,
          arrivalDate: date,
          arrivalTime: `${String(hour + 2).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
          duration: route.duration,
          baggage: airline.baggage,
          meal: airline.meal,
          price: basePrice,
          childPrice: Math.round(basePrice * 0.85),
          infantPrice: Math.round(basePrice * 0.1),
          seatsLeft: 25,
          stops: 0,
          stopCity: "",
          cabin: "economy",
          class: "Economy",
          currency: "PKR",
          status: "active",
        });
      }
    }
  }

  return records;
};

const run = async () => {
  await connectDB();
  const records = createFlights();
  const operations = records.map((record) => ({
    updateOne: {
      filter: { id: record.id },
      update: { $set: record },
      upsert: true,
    },
  }));
  const result = await Flight.bulkWrite(operations, { ordered: false });
  console.log(
    `✅ Upserted ${result.upsertedCount} and updated ${result.modifiedCount} late-September/October flights.`,
  );
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("❌ Multi-city flight seed failed:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
