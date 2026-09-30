export interface StaticHotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  mapUrl?: string;
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

const toPkr = (sar: number) => Number((sar * 74.5).toFixed(2));

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
        name: "M Hotel Makkah by Millennium",
        stars: 5,
        location: "Ibrahim Al Khalil Road",
        mapUrl: "https://maps.app.goo.gl/7hMk2ziPzsCNtefSA",
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/269695526.jpg?k=823f6ed6dd9528a5dc6530881fb728e36e208c44bce0d220f534e2578eca6e36&o=",
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
        pricePerNight: toPkr(210),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "2500 meter with shuttle service every 20 minutes",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/269695526.jpg?k=823f6ed6dd9528a5dc6530881fb728e36e208c44bce0d220f534e2578eca6e36&o=",
        ],
        category: "luxury",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "millennium-quad-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(210),
          },
          {
            id: "millennium-bed-sharing",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(60),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-hilton-convention",
        name: "MAAZER ALTAQWA",
        stars: 5,
        location: "Al Taqwa Road",
        mapUrl: "https://maps.app.goo.gl/6hvnscoLnMXFhpSU7",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjPeKyl4U2tcedire0SWuQjtXw8sYfnGY_oMbEr6IaQR5xzbK_oAKk6K4&s=10",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Laundry",
          "Air Conditioning",
          "Safe",
          "TV",
        ],
        pricePerNight: toPkr(60),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "2500 meter with shuttle bus service",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjPeKyl4U2tcedire0SWuQjtXw8sYfnGY_oMbEr6IaQR5xzbK_oAKk6K4&s=10",
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
            pricePerNight: toPkr(60),
          },
          {
            id: "hilton-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(12),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-safwah-royale",
        name: "NUMBER ONE",
        stars: 5,
        location: "Ibrahim Al Khalil Road",
        mapUrl: "https://maps.app.goo.gl/5QiDJYskbQQZoqEL7",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRMTU94Goliq-n2Ndb2tI7r0RdCGC1BLGk2PAOY_j25DMhlSVYJjQNyIE&s=10",
        amenities: [
          "Free WiFi",
          "Breakfast Buffet",
          "24/7 Room Service",
          "Concierge",
          "Laundry",
          "Premium Bedding",
        ],
        pricePerNight: toPkr(95),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "1100 METER",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRMTU94Goliq-n2Ndb2tI7r0RdCGC1BLGk2PAOY_j25DMhlSVYJjQNyIE&s=10",
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
            pricePerNight: toPkr(95),
          },
          {
            id: "safwah-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(25),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-anjum",
        name: "MASARAT SILVER",
        stars: 4,
        location: "Ibrahim Al Khalil Road",
        mapUrl: "https://maps.app.goo.gl/zSqBmsLPKQF4aCk47",
        image: "https://i.ytimg.com/vi/M4rQMyRgMfI/maxresdefault.jpg",
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
        distanceFromHaram: "650 METER",
        images: ["https://i.ytimg.com/vi/M4rQMyRgMfI/maxresdefault.jpg"],
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
        mapUrl: "https://maps.app.goo.gl/7dAMVmH1rT5ddPw9A",
        image:
          "https://badr-al-massa-hotel.hotels-mecca.com/data/Photos/OriginalPhoto/14739/1473972/1473972622/mecca-al-massa-bader-hotel-photo-1.JPEG",
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
          "https://badr-al-massa-hotel.hotels-mecca.com/data/Photos/OriginalPhoto/14739/1473972/1473972622/mecca-al-massa-bader-hotel-photo-1.JPEG",
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
        ],
      },
      {
        id: "makkah-elaf-kinda",
        name: "SWISS ALKHALIL",
        stars: 4,
        location: "Ibrahim Al Khalil Road",
        mapUrl: "https://maps.app.goo.gl/FYS7L72USKwKgBkP7",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBVkS_ISBNSddui6iOqO7rvr9Lmt8ukYPtat5I_t0bJnuoMWUGo2sADVE&s=10",
        amenities: ["Free WiFi", "Breakfast", "Air Conditioning", "TV", "Safe"],
        pricePerNight: toPkr(270),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "500 METER",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBVkS_ISBNSddui6iOqO7rvr9Lmt8ukYPtat5I_t0bJnuoMWUGo2sADVE&s=10",
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
            pricePerPerson: toPkr(80),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-buloorat-al-durrah",
        name: "BULOORAT AL DURRAH",
        stars: 4,
        location: "Ibrahim Al Khalil Road",
        mapUrl: "https://maps.app.goo.gl/3moEi9YTpwCtb7La8",
        image: "https://tiviho.com/media/hotel_image/unnamed_1.webp",
        amenities: ["Free WiFi", "Room Service", "Air Conditioning", "TV"],
        pricePerNight: toPkr(300),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "450 METER",
        images: ["https://tiviho.com/media/hotel_image/unnamed_1.webp"],
        category: "premium",
        isUmrahHotel: true,
        umrahCity: "makkah",
        roomTypes: [
          {
            id: "buloorat-room",
            type: "Room (Up to 4 persons)",
            occupancy: 4,
            pricePerPerson: 0,
            pricePerNight: toPkr(300),
          },
          {
            id: "buloorat-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(100),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "makkah-al-marwa",
        name: "EMAAR WORTH ELITE",
        stars: 3,
        location: "Ibrahim Al Khalil Road, Kabootar Chowk",
        mapUrl: "https://maps.app.goo.gl/fhRWfFHzwS22aXUDA",
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/629334303.jpg?k=5f4ab742d81a78ea810038ff7c7fd1e158a06fc0025f3f1b115f2114daefffc0&o=",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle to Haram",
        ],
        pricePerNight: toPkr(410),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "450 METER",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/629334303.jpg?k=5f4ab742d81a78ea810038ff7c7fd1e158a06fc0025f3f1b115f2114daefffc0&o=",
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
            pricePerNight: toPkr(410),
          },
        ],
      },
      {
        id: "makkah-dar-al-taqwa",
        name: "DIYAFAT MUBARAK",
        stars: 3,
        location: "Ibrahim Al Khalil Road, Kabootar Chowk",
        mapUrl: "https://maps.app.goo.gl/sDyCLVej9broasXM6",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncezXaNfegIJd9YEBx9V6CWYbcfq2LBnXNqiVhKHwjvsm9XHW3WqmfAk&s=10",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle Service",
        ],
        pricePerNight: toPkr(450),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "250 METER",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncezXaNfegIJd9YEBx9V6CWYbcfq2LBnXNqiVhKHwjvsm9XHW3WqmfAk&s=10",
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
            pricePerNight: toPkr(450),
          },
        ],
      },
      {
        id: "makkah-marsa-jaria",
        name: "MARSA JARIA",
        stars: 3,
        location: "Ibrahim Al Khalil Road, Kabootar Chowk",
        mapUrl: "https://maps.app.goo.gl/VjpJwcA7EJUBJZyH7",
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/661517782.jpg?k=99c02dce3c75f99cf41347413c69d5dae494242a4c8e1a22b019604072169e88&o=",
        amenities: ["WiFi", "Air Conditioning", "Shuttle Service"],
        pricePerNight: toPkr(470),
        city: "makkah",
        country: "Saudi Arabia",
        distanceFromHaram: "200 METER",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/661517782.jpg?k=99c02dce3c75f99cf41347413c69d5dae494242a4c8e1a22b019604072169e88&o=",
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
            pricePerNight: toPkr(470),
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
        location: "Qurban Road, Masjid Bilal side",
        mapUrl: "https://maps.app.goo.gl/thwpcSxLjxodfzzDA",
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/554827241.jpg?k=8f193f921c22472b2b6bc639bedeebc510782a4bd74279ddd3e3e2acb9f028fd&o=",
        amenities: [
          "Free WiFi",
          "Breakfast Buffet",
          "24/7 Room Service",
          "Laundry",
          "Gym",
          "Air Conditioning",
        ],
        pricePerNight: toPkr(120),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1200 METER",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/554827241.jpg?k=8f193f921c22472b2b6bc639bedeebc510782a4bd74279ddd3e3e2acb9f028fd&o=",
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
            pricePerNight: toPkr(120),
          },
          {
            id: "pullman-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(25),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-oberoi",
        name: "SHAMS AL MADINAH",
        stars: 5,
        location: "Qurban Road, Masjid Bilal side",
        mapUrl: "https://maps.app.goo.gl/thwpcSxLjxodfzzDA",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQi8gS9yRKsdQi-zw__iYYZb8X1eylD0agsQp7BBcDLS5n0yF-we4elmI&s=10",
        amenities: [
          "Free WiFi",
          "Gourmet Breakfast",
          "Concierge Service",
          "Butler Service",
          "Premium Laundry",
          "Air Conditioning",
        ],
        pricePerNight: toPkr(120),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1200 METER",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQi8gS9yRKsdQi-zw__iYYZb8X1eylD0agsQp7BBcDLS5n0yF-we4elmI&s=10",
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
            pricePerNight: toPkr(120),
          },
          {
            id: "oberoi-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(25),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-anwar",
        name: "SHAZA ALMONAWARA HOTEL",
        stars: 4,
        location: "Near Top Ten, Uhud Road",
        mapUrl: "https://maps.app.goo.gl/pkYuUfm9ZZatKzLHA",
        image:
          "https://pix10.agoda.net/hotelImages/63098304/0/793ad10684def6905acfe66c4d4f65cc.png?ce=0&s=414x232",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Room Service",
          "Air Conditioning",
          "TV",
          "Safe",
        ],
        pricePerNight: toPkr(180),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "1000 METER",
        images: [
          "https://pix10.agoda.net/hotelImages/63098304/0/793ad10684def6905acfe66c4d4f65cc.png?ce=0&s=414x232",
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
            pricePerNight: toPkr(180),
          },
          {
            id: "anwar-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(40),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-hilton",
        name: "ZAHRATTAIBA-3",
        stars: 5,
        location: "Masjid Bilal side",
        image:
          "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/899557171.jpg?k=d6ab7b154c74bcb61a166ceb8d06acd4279de82fdfaa458a7122b6041cd03dbb&o=",
        amenities: [
          "Free WiFi",
          "Breakfast",
          "Pool",
          "Fitness Center",
          "Room Service",
        ],
        pricePerNight: toPkr(200),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "600 METER",
        images: [
          "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/899557171.jpg?k=d6ab7b154c74bcb61a166ceb8d06acd4279de82fdfaa458a7122b6041cd03dbb&o=",
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
            pricePerNight: toPkr(200),
          },
          {
            id: "hilton-madinah-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(45),
            pricePerNight: 0,
          },
        ],
      },
      {
        id: "madinah-dar-al-iman",
        name: "KUNOOZ AL TAQWA",
        stars: 4,
        location: "Al Fazal Bin Utba Road",
        mapUrl: "https://maps.app.goo.gl/nX2xgKLT3CKEbyAdA",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4MNpF-HI5T3ykAZm7RC7LnGLpdjKXMj842gOQR7InpRBX-LuBHbgU-iQ8&s=10",
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
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4MNpF-HI5T3ykAZm7RC7LnGLpdjKXMj842gOQR7InpRBX-LuBHbgU-iQ8&s=10",
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
        name: "ERGWAN AL MADINA HOTEL",
        stars: 3,
        location: "Markazia",
        mapUrl: "https://maps.app.goo.gl/tnhRLoHYqqjeyvLz9",
        image:
          "https://meezabgroup.com/wp-content/uploads/2026/09/ERGWAN-AL-MADINAH-Main.jpg",
        amenities: [
          "WiFi",
          "Breakfast",
          "Air Conditioning",
          "TV",
          "Shuttle Service",
        ],
        pricePerNight: toPkr(320),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "300 METER",
        images: [
          "https://meezabgroup.com/wp-content/uploads/2026/09/ERGWAN-AL-MADINAH-Main.jpg",
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
            pricePerNight: toPkr(320),
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
        name: "ODST AL MADINAH HOTEL",
        stars: 3,
        location: "Markazia",
        mapUrl: "https://maps.app.goo.gl/YFrMFHPBUnj1AvLf8",
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/154960069.jpg?k=3cbce3bd954494542e1c24927025da62f7eb356d7d9d484c3ffbfe4c1c7a4b29&o=",
        amenities: ["WiFi", "Breakfast", "Air Conditioning", "TV", "Shuttle"],
        pricePerNight: toPkr(440),
        city: "madinah",
        country: "Saudi Arabia",
        distanceFromMasjidNabawi: "100 METER",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/154960069.jpg?k=3cbce3bd954494542e1c24927025da62f7eb356d7d9d484c3ffbfe4c1c7a4b29&o=",
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
            pricePerNight: toPkr(440),
          },
          {
            id: "crown-bed",
            type: "Bed Sharing (5-6 persons)",
            occupancy: 5,
            pricePerPerson: toPkr(0),
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
