// =====================================================
// GROUP FLIGHT DATA
// =====================================================

export interface GroupFlightData {
  id: string;

  groupId: string;
  flightId: string;

  routeKey: string;

  // Flight display data
  airline: string;
  airlineCode: string;
  airlineLogo: string;

  from: string;
  fromCity: string;

  to: string;
  toCity: string;

  flightNumber: string;

  departureDate: string;
  departureTime: string;

  arrivalDate: string;
  arrivalTime: string;

  duration: string;

  baggage: string;
  meal: boolean;

  price: number;
  childPrice: number;
  infantPrice: number;

  seatsLeft: number;

  stops: number;
  stopCity: string;

  cabin: string;
  class: string;

  currency: string;
  status: string;
}

// =====================================================
// GROUP FLIGHTS
// =====================================================

export const GROUP_FLIGHT_DATA: GroupFlightData[] = [
  // ===================================================
  // KSA — LAHORE → JEDDAH
  // ===================================================

  {
    id: "gf-ksa-sv-lhe-jed-1",
    groupId: "ksa",
    flightId: "sv-lhe-jed-1",
    routeKey: "Lahore → Jeddah",

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
    id: "gf-ksa-pk-lhe-jed-1",
    groupId: "ksa",
    flightId: "pk-lhe-jed-1",
    routeKey: "Lahore → Jeddah",

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
    id: "gf-ksa-g9-lhe-jed-1",
    groupId: "ksa",
    flightId: "g9-lhe-jed-1",
    routeKey: "Lahore → Jeddah",

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

  // ===================================================
  // KSA — LAHORE → RIYADH
  // ===================================================

  {
    id: "gf-ksa-sv-lhe-ruh-1",
    groupId: "ksa",
    flightId: "sv-lhe-ruh-1",
    routeKey: "Lahore → Riyadh",

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
    id: "gf-ksa-pk-lhe-ruh-1",
    groupId: "ksa",
    flightId: "pk-lhe-ruh-1",
    routeKey: "Lahore → Riyadh",

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

  // ===================================================
  // KSA — MULTAN → JEDDAH
  // ===================================================

  {
    id: "gf-ksa-sv-mux-jed-1",
    groupId: "ksa",
    flightId: "sv-mux-jed-1",
    routeKey: "Multan → Jeddah",

    airline: "Saudi Airlines",
    airlineCode: "SV",
    airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

    from: "MUX",
    fromCity: "Multan",

    to: "JED",
    toCity: "Jeddah",

    flightNumber: "SV 730",

    departureDate: "2026-09-03",
    departureTime: "16:45",

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

  // ===================================================
  // UAE — KARACHI → SHARJAH
  // ===================================================

  {
    id: "gf-uae-g9-khi-shj-1",
    groupId: "uae",
    flightId: "g9-khi-shj-1",
    routeKey: "Karachi → Sharjah",

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
    id: "gf-uae-pk-khi-shj-1",
    groupId: "uae",
    flightId: "pk-khi-shj-1",
    routeKey: "Karachi → Sharjah",

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

  // ===================================================
  // UAE — ISLAMABAD → DUBAI
  // ===================================================

  {
    id: "gf-uae-ek-isb-dxb-1",
    groupId: "uae",
    flightId: "ek-isb-dxb-1",
    routeKey: "Islamabad → Dubai",

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
    id: "gf-uae-g9-isb-dxb-1",
    groupId: "uae",
    flightId: "g9-isb-dxb-1",
    routeKey: "Islamabad → Dubai",

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
    id: "gf-uae-pk-isb-dxb-1",
    groupId: "uae",
    flightId: "pk-isb-dxb-1",
    routeKey: "Islamabad → Dubai",

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

  // ===================================================
  // OMAN — SIALKOT → MUSCAT
  // ===================================================

  {
    id: "gf-oman-wy-skt-mct-1",
    groupId: "oman",
    flightId: "wy-skt-mct-1",
    routeKey: "Sialkot → Muscat",

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
];
