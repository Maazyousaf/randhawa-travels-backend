import Group from "../models/group.model.js";
import { GROUP_FLIGHT_DATA, GroupFlightData } from "./groupFlightData.js";

// =====================================================
// SEED GROUPS
// =====================================================

export const seedGroups = async (): Promise<void> => {
  try {
    // ===================================================
    // BUILD ROUTES FROM STATIC FLIGHT DATA
    // ===================================================

    const buildRoutes = (groupId: string) => {
      const groupFlights = GROUP_FLIGHT_DATA.filter(
        (flight: GroupFlightData) =>
          flight.groupId === groupId && flight.status === "active",
      );

      const routeMap = new Map<string, GroupFlightData[]>();

      for (const flight of groupFlights) {
        if (!flight.routeKey) continue;

        const existing = routeMap.get(flight.routeKey) ?? [];

        existing.push(flight);

        routeMap.set(flight.routeKey, existing);
      }

      return Array.from(routeMap.entries()).map(
        ([routeKey, flights], index) => {
          const firstFlight = flights[0];

          return {
            id: `${groupId}-route-${index + 1}`,

            label: routeKey,

            from: firstFlight.from,
            fromCity: firstFlight.fromCity,

            to: firstFlight.to,
            toCity: firstFlight.toCity,

            active: true,

            flights: flights.map((flight) => ({
              id: flight.flightId,

              airline: flight.airline,
              airlineCode: flight.airlineCode,
              airlineLogo: flight.airlineLogo || "",

              from: flight.from,
              fromCity: flight.fromCity,

              to: flight.to,
              toCity: flight.toCity,

              flightNumber: flight.flightNumber,

              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,

              duration: flight.duration,

              date: flight.departureDate,

              baggage: flight.baggage || "",

              meal: Boolean(flight.meal),

              adultPrice: Number(flight.price) || 0,
              childPrice: Number(flight.childPrice) || 0,
              infantPrice: Number(flight.infantPrice) || 0,

              seatsLeft: Number(flight.seatsLeft) || 0,

              stops: Number(flight.stops) || 0,
              stopCity: flight.stopCity || "",

              class: flight.class || "Economy",

              active: flight.status === "active",
            })),
          };
        },
      );
    };

    // ===================================================
    // BUILD ROUTES - Only for KSA (Custom Umrah)
    // ===================================================

    const ksaRoutes = buildRoutes("ksa");

    // ===================================================
    // UMRAH FIXED PACKAGES
    // ===================================================

    const umrahPackages = [
      {
        id: "umrah-sep-7-days",
        name: "7 Days Umrah Package",

        makkahHotel: "Swiss Makkah",
        madinahHotel: "Emaar Royal Hotel",

        hotelName: "Swiss Makkah / Emaar Royal",

        airline: "Saudi Airlines",
        airlineCode: "SV",
        airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

        sector: "Lahore → Jeddah → Lahore",

        durationDays: 7,

        depFrom: "LHE",
        depTo: "JED",

        depDate: "2026-09-05",
        depTime: "08:30",

        arrTime: "11:45",

        retFrom: "JED",
        retTo: "LHE",

        retDate: "2026-09-11",

        retDepTime: "14:00",
        retArrTime: "20:30",

        sharingPrice: 95000,
        quadPrice: 105000,
        triplePrice: 115000,
        doublePrice: 130000,

        pricePerPerson: 95000,

        availableSeats: 18,

        description:
          "7 days Umrah package with accommodation in Makkah and Madinah.",

        inclusions: [
          "Return airfare",
          "Makkah hotel accommodation",
          "Madinah hotel accommodation",
          "Airport transfer",
          "Ziyarat",
          "Umrah assistance",
        ],

        exclusions: [
          "Personal expenses",
          "Travel insurance",
          "Visa charges if applicable",
        ],

        active: true,
      },

      {
        id: "umrah-sep-10-days",
        name: "10 Days Umrah Package",

        makkahHotel: "Makkah Hotel",
        madinahHotel: "Anwar Al Madinah",

        hotelName: "Makkah Hotel / Anwar Al Madinah",

        airline: "PIA",
        airlineCode: "PK",
        airlineLogo: "https://images.kiwi.com/airlines/64/PK.png",

        sector: "Lahore → Jeddah → Lahore",

        durationDays: 10,

        depFrom: "LHE",
        depTo: "JED",

        depDate: "2026-09-05",
        depTime: "14:00",

        arrTime: "17:30",

        retFrom: "JED",
        retTo: "LHE",

        retDate: "2026-09-14",

        retDepTime: "16:00",
        retArrTime: "22:00",

        sharingPrice: 88000,
        quadPrice: 98000,
        triplePrice: 108000,
        doublePrice: 125000,

        pricePerPerson: 88000,

        availableSeats: 22,

        description:
          "10 days economical Umrah package suitable for families and groups.",

        inclusions: [
          "Return airfare",
          "Makkah accommodation",
          "Madinah accommodation",
          "Airport transfers",
          "Ziyarat",
          "Umrah guidance",
        ],

        exclusions: [
          "Personal expenses",
          "Travel insurance",
          "Visa charges if applicable",
        ],

        active: true,
      },

      {
        id: "umrah-sep-14-days",
        name: "14 Days Umrah Package",

        makkahHotel: "Hilton Makkah Convention Hotel",
        madinahHotel: "Pullman Zamzam Madina",

        hotelName: "Hilton Makkah / Pullman Zamzam",

        airline: "Saudi Airlines",
        airlineCode: "SV",
        airlineLogo: "https://images.kiwi.com/airlines/64/SV.png",

        sector: "Multan → Jeddah → Multan",

        durationDays: 14,

        depFrom: "MUX",
        depTo: "JED",

        depDate: "2026-09-03",
        depTime: "16:45",

        arrTime: "19:30",

        retFrom: "JED",
        retTo: "MUX",

        retDate: "2026-09-16",

        retDepTime: "21:00",
        retArrTime: "02:00+1",

        sharingPrice: 178000,
        quadPrice: 188000,
        triplePrice: 198000,
        doublePrice: 220000,

        pricePerPerson: 178000,

        availableSeats: 10,

        description:
          "14 days premium Umrah package with comfortable accommodation in Makkah and Madinah.",

        inclusions: [
          "Return airfare",
          "Premium Makkah accommodation",
          "Premium Madinah accommodation",
          "Airport transfers",
          "Ziyarat",
          "Umrah assistance",
          "Group coordinator",
        ],

        exclusions: [
          "Personal expenses",
          "Travel insurance",
          "Visa charges if applicable",
        ],

        active: true,
      },
    ];

    // ===================================================
    // CUSTOM UMRAH ROUTES (for build-your-own package)
    // ===================================================

    const customUmrahRoutes = buildRoutes("ksa");

    // ===================================================
    // GROUP DOCUMENTS - ONLY 2 GROUPS
    // ===================================================

    const groups = [
      {
        id: "umrah",
        name: "Umrah",
        label: "Fixed Umrah Packages 2026",
        country: "Saudi Arabia",
        type: "fixed" as const,

        image:
          "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1400&q=80",

        color: "from-emerald-600 to-green-900",

        description:
          "Saudi Airlines · LHE-JED-LHE · 15 days · Visa & transport included",

        active: true,

        routes: [],
        packages: umrahPackages,
      },

      {
        id: "custom-umrah",
        name: "Custom Umrah",
        label: "Customized Umrah Package",
        country: "Saudi Arabia",
        type: "customized" as const,

        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwnk9PrdpiQsgKsBaTJ54pb8p5ByxDxrHYmjb8qBbHw&s=10",

        color: "from-green-600 to-emerald-900",

        description:
          "Create your personalized Umrah experience with flexible options for flights, hotels, and servicessssssssssssssssssssssssssss",

        active: true,

        routes: customUmrahRoutes,
        packages: [],
      },
    ];

    // ===================================================
    // IMPORTANT:
    // REPLACE routes COMPLETELY
    // ===================================================

    for (const group of groups) {
      await Group.findOneAndUpdate(
        { id: group.id },
        {
          $set: {
            name: group.name,
            label: group.label,
            country: group.country,
            type: group.type,
            image: group.image,
            color: group.color,
            description: group.description,
            active: group.active,

            // VERY IMPORTANT
            routes: group.routes,

            // Keep packages in sync too
            packages: group.packages,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    // ===================================================
    // VERIFY DATABASE DATA
    // ===================================================

    const verifyUmrah = await Group.findOne({
      id: "umrah",
    }).select("id routes packages");

    const verifyCustomUmrah = await Group.findOne({
      id: "custom-umrah",
    }).select("id routes");
  } catch (error) {
    console.error("❌ Group seeding failed:", error);
    throw error;
  }
};
