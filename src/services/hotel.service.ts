import Hotel from "../models/hotel.model.js";
import { STATIC_HOTELS } from "../utils/staticHotels.js";

export interface SearchHotelsParams {
  city?: string;
}

export const searchHotels = async ({ city }: SearchHotelsParams) => {
  try {
    const query: any = { status: "active" };

    if (city) {
      query.city = city;
    }

    const hotels = await Hotel.find(query).sort({ stars: -1, name: 1 }).lean();

    return hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      stars: hotel.stars,
      location: hotel.location,
      city: hotel.city,
      country: hotel.country,
      image: hotel.image,
      amenities: hotel.amenities,
      pricePerNight: hotel.pricePerNight,
    }));
  } catch (error) {
    console.error("❌ Hotel search error:", error);
    throw error;
  }
};

export const getHotelDetails = async (hotelId: string) => {
  try {
    const hotel = await Hotel.findOne({ id: hotelId, status: "active" }).lean();

    if (!hotel) {
      return null;
    }

    return {
      id: hotel.id,
      name: hotel.name,
      stars: hotel.stars,
      location: hotel.location,
      city: hotel.city,
      country: hotel.country,
      image: hotel.image,
      amenities: hotel.amenities,
      pricePerNight: hotel.pricePerNight,
    };
  } catch (error) {
    console.error("❌ Get hotel details error:", error);
    throw error;
  }
};

export const getAllCities = async () => {
  try {
    // Get distinct cities with hotel counts from MongoDB
    const citiesWithCounts = await Hotel.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$city", // This will be lowercase city ID like "dubai"
          country: { $first: "$country" },
          hotelCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map static city data with dynamic hotel counts
    return STATIC_HOTELS.map((city) => {
      // Match by city.id (lowercase) with aggregation _id
      const dbCity = citiesWithCounts.find((c) => c._id === city.id);

      return {
        id: city.id,
        label: city.label,
        country: city.country,
        image: city.image,
        color: city.color,
        hotelCount: dbCity?.hotelCount || 0,
      };
    }).filter((city) => city.hotelCount > 0); // Only return cities with hotels
  } catch (error) {
    console.error("❌ Get cities error:", error);
    throw error;
  }
};
