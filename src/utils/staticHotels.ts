export interface StaticHotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  image: string;
  amenities: string[];
  pricePerNight: number;
  city: string;
  country: string;

  // Custom Umrah specific fields (optional)
  distanceFromHaram?: string;
  distanceFromMasjidNabawi?: string;
  images?: string[];
  category?: "budget" | "standard" | "premium" | "luxury";
  roomTypes?: Array<{
    id: string;
    type: string;
    occupancy: number;
    pricePerPerson: number;
    pricePerNight: number;
  }>;
  umrahCity?: "makkah" | "madinah";
  isUmrahHotel?: boolean;
}

export interface HotelCity {
  id: string;
  label: string;
  country: string;
  image: string;
  color: string;
  hotels: StaticHotel[];
}

const toPkr = (sar: number) => Number((sar * 73.92).toFixed(2));

export const STATIC_HOTELS: HotelCity[] = [
  // ===================================================
  // CUSTOM UMRAH HOTELS - MAKKAH
  // ===================================================
  {
    id: "makkah",
    label: "Makkah",
    country: "Saudi Arabia",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600",
    color: "from-emerald-600 to-emerald-900",
    hotels: [
      {
        id: "makkah-swissotel",
        name: "Hidaya tul Kubra",
        stars: 5,
        location: "Abraj Al Bait Complex",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast Included",
          "24/7 Room Service",
          "Laundry Service",
          "Air Conditioning",
          "Mini Bar",
          "Safe Deposit Box",
          "Flat Screen TV",
        ],
        pricePerNight: toPkr(55),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "2500 meter with shuttle bus service",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "swissotel-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(55),
          },
          {
            id: "swissotel-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(15),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-hilton-convention",
        name: "MAAZER ALTAQWA",
        stars: 5,
        location: "King Abdul Aziz Road",
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Laundry",
          "Air Conditioning",
          "Safe",
          "TV",
        ],
        pricePerNight: toPkr(55),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "2500 meter with shuttle bus service",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "hilton-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(55),
          },
          {
            id: "hilton-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(15),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-safwah-royale",
        name: "NUMBER ONE",
        stars: 5,
        location: "Clock Tower, Abraj Al Bait",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast Buffet",
          "24/7 Room Service",
          "Concierge",
          "Laundry",
          "Premium Bedding",
        ],
        pricePerNight: toPkr(105),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "1200 METER",
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "safwah-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(105),
          },
          {
            id: "safwah-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(28),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-anjum",
        name: "MASARAT SILVER",
        stars: 4,
        location: "Ajyad Street",
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Air Conditioning",
          "TV",
          "Mini Fridge",
        ],
        pricePerNight: toPkr(230),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "700 METER",
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        ],
        category: "premium",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "anjum-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(230),
          },
          {
            id: "anjum-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(60),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-movenpick",
        name: "ALMASSA BADER",
        stars: 4,
        location: "Ibrahim Al Khalil Road",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
        amenities: [
          "Free WiFi",
          "Restaurant",
          "Room Service",
          "Air Conditioning",
          "TV",
        ],
        pricePerNight: toPkr(250),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "600 METER",
        images: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
        ],
        category: "premium",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "movenpick-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(250),
          },
          {
            id: "movenpick-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(65),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-elaf-kinda",
        name: "SWISS ALKHALIL",
        stars: 4,
        location: "Aziziyah District",
        image:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
        amenities: ["Free WiFi", "Breakfast", "Air Conditioning", "TV", "Safe"],
        pricePerNight: toPkr(270),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "500 METER",
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
        ],
        category: "standard",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "elaf-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(270),
          },
          {
            id: "elaf-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(70),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-al-marwa",
        name: "EMAAR WORTH ELITE",
        stars: 3,
        location: "Ibrahim Al Khalil Street",
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle to Haram",
        ],
        pricePerNight: toPkr(380),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "450 METER",
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        ],
        category: "standard",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "marwa-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(380),
          },
          {
            id: "marwa-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(100),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-dar-al-taqwa",
        name: "DIYAFAT MUBARAK",
        stars: 3,
        location: "Al Aziziyah",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle Service",
        ],
        pricePerNight: toPkr(400),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "250 METER",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        ],
        category: "budget",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "taqwa-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(400),
          },
          {
            id: "taqwa-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(105),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-marsa-jaria",
        name: "MARSA JARIA",
        stars: 3,
        location: "Makkah",
        image:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600",
        amenities: ["WiFi", "Air Conditioning", "Shuttle Service"],
        pricePerNight: toPkr(450),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "200 METER",
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        ],
        category: "budget",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "marsa-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(450),
          },
          {
            id: "marsa-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(115),
            pricePerNight: 0,
          },
        ],
      },
    ],
  },

  // ===================================================
  // CUSTOM UMRAH HOTELS - MADINAH
  // ===================================================
  {
    id: "madinah",
    label: "Madinah",
    country: "Saudi Arabia",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    color: "from-green-700 to-green-900",
    hotels: [
      {
        id: "madinah-pullman-zamzam",
        name: "RETAJ AL MADINA",
        stars: 5,
        location: "King Fahd Road",
        image:
          "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast Buffet",
          "24/7 Room Service",
          "Laundry",
          "Gym",
          "Air Conditioning",
        ],
        pricePerNight: toPkr(105),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1800 meter with shuttle bus service",
        images: [
          "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "pullman-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(105),
          },
          {
            id: "pullman-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(28),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-oberoi",
        name: "SHAMAS AL MADIAN",
        stars: 5,
        location: "Adjacent to Masjid an-Nabawi",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        amenities: [
          "Free WiFi",
          "Gourmet Breakfast",
          "Concierge Service",
          "Butler Service",
          "Premium Laundry",
          "Air Conditioning",
        ],
        pricePerNight: toPkr(105),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1800 meter with shuttle bus service",
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "oberoi-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(105),
          },
          {
            id: "oberoi-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(28),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-anwar",
        name: "SHAZA MUNAWWARAH",
        stars: 4,
        location: "King Abdul Aziz Road",
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Air Conditioning",
          "TV",
          "Safe",
        ],
        pricePerNight: toPkr(150),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1000 METER",
        images: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        ],
        category: "premium",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "anwar-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(150),
          },
          {
            id: "anwar-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(35),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-hilton",
        name: "ZAHRAT TAIBA-3",
        stars: 5,
        location: "King Faisal Road",
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Pool",
          "Fitness Center",
          "Room Service",
        ],
        pricePerNight: toPkr(180),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "600 METER",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "hilton-madinah-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(180),
          },
          {
            id: "hilton-madinah-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(42),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-dar-al-iman",
        name: "KUNOOZ AL TAQWA",
        stars: 4,
        location: "King Faisal Road",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Air Conditioning",
          "TV",
        ],
        pricePerNight: toPkr(230),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "450 METER",
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
        ],
        category: "standard",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "daraliman-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(230),
          },
          {
            id: "daraliman-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(60),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-al-aqeeq",
        name: "ARJWAN AL MADINA",
        stars: 3,
        location: "Central Area",
        image:
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle Service",
        ],
        pricePerNight: toPkr(270),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "300 METER",
        images: [
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800",
        ],
        category: "standard",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "aqeeq-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(270),
          },
          {
            id: "aqeeq-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(70),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-crown",
        name: "ODST AL MADIAN",
        stars: 3,
        location: "Al Madinah Al Munawarah",
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600",
        amenities: ["WiFi", "Breakfast", "Air Conditioning", "TV", "Shuttle"],
        pricePerNight: toPkr(480),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "150 METER",
        images: [
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
        ],
        category: "budget",
        isUmrahHotel: true,
        umrahCity: "madinah",
        roomTypes: [
          {
            id: "crown-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(480),
          },
          {
            id: "crown-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(125),
            pricePerNight: 0,
          },
        ],
      },
    ],
  },

  // ===================================================
  // EXISTING HOTELS (Keep all existing hotels below)
  // ===================================================
  {
    id: "dubai",
    label: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    color: "from-sky-600 to-sky-900",
    hotels: [
      {
        id: "dxb-1",
        name: "Burj Al Arab Jumeirah",
        stars: 5,
        location: "Jumeirah Beach Road, Dubai",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        amenities: ["Private Beach", "Helipad", "Butler Service"],
        pricePerNight: 80000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-2",
        name: "Atlantis The Palm",
        stars: 5,
        location: "Palm Jumeirah, Dubai",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        amenities: ["Aquaventure Waterpark", "Private Beach", "Spa"],
        pricePerNight: 65000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-3",
        name: "JW Marriott Marquis",
        stars: 5,
        location: "Sheikh Zayed Road, Business Bay",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: ["Rooftop Pool", "Fitness Center", "Fine Dining"],
        pricePerNight: 45000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-4",
        name: "Jumeirah Emirates Towers",
        stars: 5,
        location: "Sheikh Zayed Road, Dubai",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        amenities: ["Business Center", "Pool", "Spa"],
        pricePerNight: 38000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-5",
        name: "Four Seasons Resort Dubai",
        stars: 5,
        location: "Jumeirah Road, Dubai",
        image:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
        amenities: ["Beachfront", "Multiple Pools", "Kids Club"],
        pricePerNight: 55000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-6",
        name: "Hyatt Regency Dubai Creek",
        stars: 4,
        location: "Deira, Dubai Creek",
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
        amenities: ["Pool", "Creek View", "Gym"],
        pricePerNight: 25000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-7",
        name: "Ibis Dubai Mall of the Emirates",
        stars: 3,
        location: "Al Barsha, Dubai",
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
        amenities: ["Free WiFi", "Restaurant", "Metro Access"],
        pricePerNight: 15000,
        city: "Dubai",
        country: "UAE",
      },
      {
        id: "dxb-8",
        name: "Radisson Blu Dubai Downtown",
        stars: 4,
        location: "Downtown Dubai",
        image:
          "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        amenities: ["Burj Khalifa View", "Pool", "Spa"],
        pricePerNight: 30000,
        city: "Dubai",
        country: "UAE",
      },
    ],
  },
  // Note: Makkah and Madinah already added above for Custom Umrah
  // Removing duplicate entry
  {
    id: "istanbul",
    label: "Istanbul",
    country: "Turkey",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600",
    color: "from-red-600 to-red-900",
    hotels: [
      {
        id: "ist-1",
        name: "Four Seasons Hotel Sultanahmet",
        stars: 5,
        location: "Sultanahmet, Istanbul",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        amenities: ["Bosphorus View", "Spa", "Gourmet Dining"],
        pricePerNight: 50000,
        city: "Istanbul",
        country: "Turkey",
      },
      {
        id: "ist-2",
        name: "Çırağan Palace Kempinski",
        stars: 5,
        location: "Beşiktaş, Istanbul",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        amenities: ["Bosphorus Waterfront", "Outdoor Pool", "Spa"],
        pricePerNight: 45000,
        city: "Istanbul",
        country: "Turkey",
      },
      {
        id: "ist-3",
        name: "The Ritz-Carlton Istanbul",
        stars: 5,
        location: "Şişli, Istanbul",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: ["City & Bosphorus View", "Spa", "Fitness Center"],
        pricePerNight: 40000,
        city: "Istanbul",
        country: "Turkey",
      },
      {
        id: "ist-4",
        name: "Hilton Istanbul Bosphorus",
        stars: 5,
        location: "Harbiye, Istanbul",
        image:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
        amenities: ["Bosphorus View", "Pool", "Tennis Courts"],
        pricePerNight: 32000,
        city: "Istanbul",
        country: "Turkey",
      },
      {
        id: "ist-5",
        name: "Wyndham Istanbul Old City",
        stars: 4,
        location: "Fatih, Istanbul",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
        amenities: ["Historic District", "Rooftop Bar", "Free WiFi"],
        pricePerNight: 20000,
        city: "Istanbul",
        country: "Turkey",
      },
      {
        id: "ist-6",
        name: "ibis Istanbul Zeytinburnu",
        stars: 3,
        location: "Zeytinburnu, Istanbul",
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
        amenities: ["Free WiFi", "Restaurant", "Metro Access"],
        pricePerNight: 12000,
        city: "Istanbul",
        country: "Turkey",
      },
    ],
  },
  {
    id: "baku",
    label: "Baku",
    country: "Azerbaijan",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    color: "from-blue-600 to-indigo-900",
    hotels: [
      {
        id: "bak-1",
        name: "Four Seasons Hotel Baku",
        stars: 5,
        location: "Neftchilar Avenue, Baku",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        amenities: ["Caspian Sea View", "Spa", "Rooftop Pool"],
        pricePerNight: 40000,
        city: "Baku",
        country: "Azerbaijan",
      },
      {
        id: "bak-2",
        name: "JW Marriott Absheron Baku",
        stars: 5,
        location: "Azadliq Square, Baku",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: ["City View", "Pool", "Fine Dining"],
        pricePerNight: 30000,
        city: "Baku",
        country: "Azerbaijan",
      },
      {
        id: "bak-3",
        name: "Hilton Baku",
        stars: 5,
        location: "Bul-Bul Avenue, Baku",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        amenities: ["Pool", "Gym", "Spa"],
        pricePerNight: 25000,
        city: "Baku",
        country: "Azerbaijan",
      },
      {
        id: "bak-4",
        name: "Ramada Hotel & Suites Baku",
        stars: 4,
        location: "White City, Baku",
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
        amenities: ["Free WiFi", "Restaurant", "Fitness Center"],
        pricePerNight: 16000,
        city: "Baku",
        country: "Azerbaijan",
      },
      {
        id: "bak-5",
        name: "Park Inn by Radisson Baku",
        stars: 3,
        location: "Narimanov Avenue, Baku",
        image:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600",
        amenities: ["Free WiFi", "Bar", "City Center"],
        pricePerNight: 10000,
        city: "Baku",
        country: "Azerbaijan",
      },
    ],
  },
  {
    id: "malaysia",
    label: "Malaysia",
    country: "Malaysia (Kuala Lumpur)",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600",
    color: "from-teal-600 to-teal-900",
    hotels: [
      {
        id: "kul-1",
        name: "Mandarin Oriental Kuala Lumpur",
        stars: 5,
        location: "KLCC, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
        amenities: ["KLCC View", "Spa", "Pool"],
        pricePerNight: 35000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
      {
        id: "kul-2",
        name: "The Ritz-Carlton Kuala Lumpur",
        stars: 5,
        location: "Bukit Bintang, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
        amenities: ["Petronas Twin Towers View", "Spa", "Pool"],
        pricePerNight: 30000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
      {
        id: "kul-3",
        name: "Grand Hyatt Kuala Lumpur",
        stars: 5,
        location: "Jalan Pinang, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        amenities: ["KLCC Park View", "Pool", "Gym"],
        pricePerNight: 22000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
      {
        id: "kul-4",
        name: "Hilton Kuala Lumpur",
        stars: 5,
        location: "KL Sentral, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        amenities: ["Infinity Pool", "Spa", "Airport Rail Access"],
        pricePerNight: 18000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
      {
        id: "kul-5",
        name: "Sunway Putra Hotel KL",
        stars: 4,
        location: "Chow Kit, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
        amenities: ["Free WiFi", "Pool", "Shopping Mall Access"],
        pricePerNight: 12000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
      {
        id: "kul-6",
        name: "Ibis Kuala Lumpur City Centre",
        stars: 3,
        location: "Jalan Ampang, Kuala Lumpur",
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
        amenities: ["Free WiFi", "Restaurant", "KLCC Proximity"],
        pricePerNight: 8000,
        city: "Kuala Lumpur",
        country: "Malaysia",
      },
    ],
  },
  {
    id: "london",
    label: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600",
    color: "from-slate-600 to-slate-900",
    hotels: [
      {
        id: "lon-1",
        name: "The Savoy London",
        stars: 5,
        location: "Strand, London",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: ["River Thames View", "Spa", "Gourmet Dining"],
        pricePerNight: 120000,
        city: "London",
        country: "United Kingdom",
      },
      {
        id: "lon-2",
        name: "Claridge's Hotel",
        stars: 5,
        location: "Mayfair, London",
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
        amenities: ["Art Deco Design", "Michelin Dining", "Spa"],
        pricePerNight: 95000,
        city: "London",
        country: "United Kingdom",
      },
      {
        id: "lon-3",
        name: "Four Seasons Hotel London at Park Lane",
        stars: 5,
        location: "Park Lane, London",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        amenities: ["Hyde Park View", "Pool", "Spa"],
        pricePerNight: 80000,
        city: "London",
        country: "United Kingdom",
      },
      {
        id: "lon-4",
        name: "The Ritz London",
        stars: 5,
        location: "Piccadilly, London",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        amenities: ["Afternoon Tea", "Fine Dining", "Butler Service"],
        pricePerNight: 70000,
        city: "London",
        country: "United Kingdom",
      },
      {
        id: "lon-5",
        name: "Park Plaza Westminster Bridge",
        stars: 4,
        location: "South Bank, London",
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
        amenities: ["Parliament View", "Pool", "Spa"],
        pricePerNight: 40000,
        city: "London",
        country: "United Kingdom",
      },
    ],
  },
  {
    id: "paris",
    label: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    color: "from-rose-600 to-rose-900",
    hotels: [
      {
        id: "par-1",
        name: "The Ritz Paris",
        stars: 5,
        location: "Place Vendôme, Paris",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        amenities: ["Place Vendôme Views", "Spa", "Michelin Restaurant"],
        pricePerNight: 130000,
        city: "Paris",
        country: "France",
      },
      {
        id: "par-2",
        name: "Four Seasons Hotel George V",
        stars: 5,
        location: "Avenue George V, Paris",
        image:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
        amenities: ["Eiffel Tower Views", "Spa", "Pool"],
        pricePerNight: 110000,
        city: "Paris",
        country: "France",
      },
      {
        id: "par-3",
        name: "Le Bristol Paris",
        stars: 5,
        location: "Rue du Faubourg Saint-Honoré, Paris",
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
        amenities: ["Rooftop Pool", "Garden", "Michelin Dining"],
        pricePerNight: 90000,
        city: "Paris",
        country: "France",
      },
      {
        id: "par-4",
        name: "Sofitel Paris Le Faubourg",
        stars: 5,
        location: "Near Champs-Élysées, Paris",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
        amenities: ["City Center", "Spa", "Fine Dining"],
        pricePerNight: 70000,
        city: "Paris",
        country: "France",
      },
      {
        id: "par-5",
        name: "Mercure Paris Opera Grands Boulevards",
        stars: 4,
        location: "Grands Boulevards, Paris",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
        amenities: ["Opera District", "Restaurant", "Free WiFi"],
        pricePerNight: 45000,
        city: "Paris",
        country: "France",
      },
    ],
  },
];

// Helper to get all hotels as flat array
export const getAllHotels = (): StaticHotel[] => {
  return STATIC_HOTELS.flatMap((city) => city.hotels);
};

// Helper to get hotels by city ID
export const getHotelsByCity = (cityId: string): StaticHotel[] => {
  const city = STATIC_HOTELS.find((c) => c.id === cityId);
  return city ? city.hotels : [];
};

// Helper to get single hotel by ID
export const getHotelById = (hotelId: string): StaticHotel | null => {
  const allHotels = getAllHotels();
  return allHotels.find((h) => h.id === hotelId) || null;
};
