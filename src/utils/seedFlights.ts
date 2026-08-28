import Flight from "../models/flight.model.js";

export async function seedFlights(): Promise<void> {
  try {
    const count = await Flight.countDocuments();

    if (count > 0) {
      console.log("✅ Flights already exist.");
      return;
    }

    await Flight.insertMany([
      // ==========================================
      // LAHORE - JEDDAH
      // ==========================================

      {
        id: "sv-lhe-jed-1",
        airline: "Saudi Airlines",
        airlineCode: "SV",
        airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

        from: "LHE",
        fromCity: "Lahore",
        to: "JED",
        toCity: "Jeddah",

        flightNumber: "SV 718",

        departureDate: "2026-09-05",
        departureTime: "08:30",

        arrivalDate: "2026-09-05",
        arrivalTime: "11:45",

        duration: "4h 15m",

        baggage: "23+7 KG",
        meal: true,

        price: 95000,
        childPrice: 85000,
        infantPrice: 15000,

        seatsLeft: 18,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "pk-lhe-jed-1",
        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        from: "LHE",
        fromCity: "Lahore",
        to: "JED",
        toCity: "Jeddah",

        flightNumber: "PK 853",

        departureDate: "2026-09-05",
        departureTime: "14:00",

        arrivalDate: "2026-09-05",
        arrivalTime: "17:30",

        duration: "4h 30m",

        baggage: "20+7 KG",
        meal: true,

        price: 88000,
        childPrice: 78000,
        infantPrice: 12000,

        seatsLeft: 22,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "g9-lhe-jed-1",
        airline: "Air Arabia",
        airlineCode: "G9",
        airlineLogo: "https://images.kiwi.com/airlines/64/G9.png",

        from: "LHE",
        fromCity: "Lahore",
        to: "JED",
        toCity: "Jeddah",

        flightNumber: "G9 409",

        departureDate: "2026-09-07",
        departureTime: "03:00",

        arrivalDate: "2026-09-07",
        arrivalTime: "07:30",

        duration: "5h 30m",

        baggage: "20+7 KG",
        meal: false,

        price: 82000,
        childPrice: 72000,
        infantPrice: 10000,

        seatsLeft: 30,
        stops: 1,
        stopCity: "Sharjah",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // LAHORE - RIYADH
      // ==========================================

      {
        id: "sv-lhe-ruh-1",
        airline: "Saudi Airlines",
        airlineCode: "SV",
        airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

        from: "LHE",
        fromCity: "Lahore",
        to: "RUH",
        toCity: "Riyadh",

        flightNumber: "SV 720",

        departureDate: "2026-09-10",
        departureTime: "10:00",

        arrivalDate: "2026-09-10",
        arrivalTime: "13:15",

        duration: "4h 15m",

        baggage: "23+7 KG",
        meal: true,

        price: 92000,
        childPrice: 82000,
        infantPrice: 14000,

        seatsLeft: 15,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "pk-lhe-ruh-1",
        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        from: "LHE",
        fromCity: "Lahore",
        to: "RUH",
        toCity: "Riyadh",

        flightNumber: "PK 857",

        departureDate: "2026-09-12",
        departureTime: "23:00",

        arrivalDate: "2026-09-13",
        arrivalTime: "02:30+1",

        duration: "4h 30m",

        baggage: "20+7 KG",
        meal: true,

        price: 85000,
        childPrice: 75000,
        infantPrice: 12000,

        seatsLeft: 28,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // KARACHI - SHARJAH
      // ==========================================

      {
        id: "g9-khi-shj-1",
        airline: "Air Arabia",
        airlineCode: "G9",
        airlineLogo: "https://images.kiwi.com/airlines/64/G9.png",

        from: "KHI",
        fromCity: "Karachi",
        to: "SHJ",
        toCity: "Sharjah",

        flightNumber: "G9 207",

        departureDate: "2026-09-08",
        departureTime: "09:30",

        arrivalDate: "2026-09-08",
        arrivalTime: "11:45",

        duration: "3h 15m",

        baggage: "20+7 KG",
        meal: false,

        price: 75000,
        childPrice: 65000,
        infantPrice: 10000,

        seatsLeft: 35,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "pk-khi-shj-1",
        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        from: "KHI",
        fromCity: "Karachi",
        to: "SHJ",
        toCity: "Sharjah",

        flightNumber: "PK 215",

        departureDate: "2026-09-08",
        departureTime: "15:00",

        arrivalDate: "2026-09-08",
        arrivalTime: "17:20",

        duration: "3h 20m",

        baggage: "20+7 KG",
        meal: true,

        price: 78000,
        childPrice: 68000,
        infantPrice: 11000,

        seatsLeft: 20,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // ISLAMABAD - DUBAI
      // ==========================================

      {
        id: "ek-isb-dxb-1",
        airline: "Emirates",
        airlineCode: "EK",
        airlineLogo: "https://images.kiwi.com/airlines/64/EK.png",

        from: "ISB",
        fromCity: "Islamabad",
        to: "DXB",
        toCity: "Dubai",

        flightNumber: "EK 623",

        departureDate: "2026-09-15",
        departureTime: "07:45",

        arrivalDate: "2026-09-15",
        arrivalTime: "09:45",

        duration: "3h 0m",

        baggage: "30+7 KG",
        meal: true,

        price: 110000,
        childPrice: 99000,
        infantPrice: 18000,

        seatsLeft: 12,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "g9-isb-dxb-1",
        airline: "Air Arabia",
        airlineCode: "G9",
        airlineLogo: "https://images.kiwi.com/airlines/64/G9.png",

        from: "ISB",
        fromCity: "Islamabad",
        to: "DXB",
        toCity: "Dubai",

        flightNumber: "G9 563",

        departureDate: "2026-09-15",
        departureTime: "02:10",

        arrivalDate: "2026-09-15",
        arrivalTime: "04:35",

        duration: "3h 25m",

        baggage: "20+7 KG",
        meal: false,

        price: 88000,
        childPrice: 78000,
        infantPrice: 12000,

        seatsLeft: 25,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "pk-isb-dxb-1",
        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        from: "ISB",
        fromCity: "Islamabad",
        to: "DXB",
        toCity: "Dubai",

        flightNumber: "PK 215",

        departureDate: "2026-09-18",
        departureTime: "19:30",

        arrivalDate: "2026-09-18",
        arrivalTime: "21:55",

        duration: "3h 25m",

        baggage: "20+7 KG",
        meal: true,

        price: 92000,
        childPrice: 82000,
        infantPrice: 13000,

        seatsLeft: 18,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // FAISALABAD - SHARJAH
      // ==========================================

      {
        id: "g9-fsb-shj-1",
        airline: "Air Arabia",
        airlineCode: "G9",
        airlineLogo: "https://images.kiwi.com/airlines/64/G9.png",

        from: "FSB",
        fromCity: "Faisalabad",
        to: "SHJ",
        toCity: "Sharjah",

        flightNumber: "G9 563",

        // UPDATED FROM 2026-08-03
        departureDate: "2026-09-03",
        departureTime: "02:10",

        // UPDATED FROM 2026-08-03
        arrivalDate: "2026-09-03",
        arrivalTime: "04:35",

        duration: "3h 25m",

        baggage: "20+7 KG",
        meal: false,

        price: 110000,
        childPrice: 100000,
        infantPrice: 15000,

        seatsLeft: 8,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      {
        id: "pk-fsb-shj-1",
        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        from: "FSB",
        fromCity: "Faisalabad",
        to: "SHJ",
        toCity: "Sharjah",

        flightNumber: "PK 237",

        // UPDATED FROM 2026-08-10
        departureDate: "2026-09-10",
        departureTime: "14:30",

        // UPDATED FROM 2026-08-10
        arrivalDate: "2026-09-10",
        arrivalTime: "17:00",

        duration: "3h 30m",

        baggage: "20+7 KG",
        meal: true,

        price: 105000,
        childPrice: 95000,
        infantPrice: 14000,

        seatsLeft: 15,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // MULTAN - JEDDAH
      // ==========================================

      {
        id: "sv-mux-jed-1",
        airline: "Saudi Airlines",
        airlineCode: "SV",
        airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

        from: "MUX",
        fromCity: "Multan",
        to: "JED",
        toCity: "Jeddah",

        flightNumber: "SV 730",

        // UPDATED FROM 2026-08-03
        departureDate: "2026-09-03",
        departureTime: "16:45",

        // UPDATED FROM 2026-08-03
        arrivalDate: "2026-09-03",
        arrivalTime: "19:30",

        duration: "3h 45m",

        baggage: "23+7 KG",
        meal: true,

        price: 178000,
        childPrice: 178000,
        infantPrice: 34000,

        seatsLeft: 10,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },

      // ==========================================
      // SIALKOT - MUSCAT
      // ==========================================

      {
        id: "wy-skt-mct-1",
        airline: "Oman Air",
        airlineCode: "WY",
        airlineLogo: "https://images.kiwi.com/airlines/64/WY.png",

        from: "SKT",
        fromCity: "Sialkot",
        to: "MCT",
        toCity: "Muscat",

        flightNumber: "WY 261",

        departureDate: "2026-09-20",
        departureTime: "06:00",

        arrivalDate: "2026-09-20",
        arrivalTime: "08:45",

        duration: "3h 45m",

        baggage: "23+7 KG",
        meal: true,

        price: 80000,
        childPrice: 70000,
        infantPrice: 12000,

        seatsLeft: 20,
        stops: 0,
        stopCity: "",

        cabin: "economy",
        class: "Economy",

        currency: "PKR",
        status: "active",
      },
    ]);
  } catch (error) {
    console.error("❌ Flight seeding failed:", error);
    throw error;
  }
}
