import mongoose from "mongoose";
import GroupTicket from "../src/models/groupTicket.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/randhawa";

const TICKET_DATA = [
  {
    id: "gt-airblue-mux-jed-01",
    type: "umrah",
    airline: "Airblue",
    airlineCode: "PA",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Airblue_logo.svg/1280px-Airblue_logo.svg.png",
    sector: "MUX-JED-MUX",
    outboundDate: "2026-09-18",
    outboundTime: "00:45 - 04:10",
    returnDate: "2026-10-15",
    returnTime: "04:10 - 11:25",
    baggage: "20+7 KG",
    meal: true,
    totalSeats: 20,
    seatsLeft: 15,
    fare: 152000,
    currency: "PKR",
    active: true,
  },
  {
    id: "gt-airblue-mux-jed-02",
    type: "umrah",
    airline: "Airblue",
    airlineCode: "PA",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Airblue_logo.svg/1280px-Airblue_logo.svg.png",
    sector: "MUX-JED-MUX",
    outboundDate: "2026-09-20",
    outboundTime: "00:45 - 04:10",
    returnDate: "2026-10-17",
    returnTime: "04:10 - 11:25",
    baggage: "20+7 KG",
    meal: true,
    totalSeats: 20,
    seatsLeft: 8,
    fare: 152000,
    currency: "PKR",
    active: true,
  },
  {
    id: "gt-salamair-mux-mct-jed-01",
    type: "umrah",
    airline: "SalamAir",
    airlineCode: "OV",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/SalamAir.png",
    sector: "MUX-MCT-JED / JED-MCT-MUX",
    outboundDate: "2026-09-16",
    outboundTime: "04:00 - 05:45",
    returnDate: "2026-10-06",
    returnTime: "08:30 - 11:00",
    baggage: "5+20 KG",
    meal: false,
    totalSeats: 30,
    seatsLeft: 15,
    fare: 142000,
    currency: "PKR",
    active: true,
  },
  {
    id: "gt-salamair-mux-mct-jed-02",
    type: "umrah",
    airline: "SalamAir",
    airlineCode: "OV",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/SalamAir.png",
    sector: "MUX-MCT-JED / JED-MCT-MUX",
    outboundDate: "2026-09-23",
    outboundTime: "04:00 - 05:45",
    returnDate: "2026-10-13",
    returnTime: "08:30 - 11:00",
    baggage: "5+20 KG",
    meal: false,
    totalSeats: 30,
    seatsLeft: 12,
    fare: 142000,
    currency: "PKR",
    active: true,
  },
  {
    id: "gt-flydubai-mux-jed-01",
    type: "umrah",
    airline: "flydubai",
    airlineCode: "FZ",
    airlineLogo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Fly_Dubai_logo_2010_03.svg/1280px-Fly_Dubai_logo_2010_03.svg.png",
    sector: "MUX-DXB-JED / JED-DXB-MUX",
    outboundDate: "2026-09-25",
    outboundTime: "02:20 - 08:15",
    returnDate: "2026-10-15",
    returnTime: "10:30 - 18:20",
    baggage: "20+7 KG",
    meal: true,
    totalSeats: 25,
    seatsLeft: 18,
    fare: 165000,
    currency: "PKR",
    active: true,
  },
  {
    id: "gt-airarabia-mux-jed-01",
    type: "umrah",
    airline: "Air Arabia",
    airlineCode: "G9",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Air_Arabia_Logo.svg",
    sector: "MUX-SHJ-JED / JED-SHJ-MUX",
    outboundDate: "2026-09-28",
    outboundTime: "03:00 - 09:10",
    returnDate: "2026-10-18",
    returnTime: "11:00 - 19:10",
    baggage: "20+7 KG",
    meal: false,
    totalSeats: 25,
    seatsLeft: 9,
    fare: 148000,
    currency: "PKR",
    active: true,
  },
];

async function seedGroupTickets() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing tickets
    await GroupTicket.deleteMany({});
    console.log("🗑️ Cleared existing group tickets");

    // Insert new tickets
    const result = await GroupTicket.insertMany(TICKET_DATA);
    console.log(`✅ Seeded ${result.length} group tickets successfully`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedGroupTickets();
