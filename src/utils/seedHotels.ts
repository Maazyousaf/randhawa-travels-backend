import Hotel from "../models/hotel.model.js";
import { STATIC_HOTELS, getAllHotels } from "./staticHotels.js";

export const seedHotels = async () => {
  try {
    // Check if hotels already exist
    const existingCount = await Hotel.countDocuments();

    if (existingCount > 0) {
      // Check if any hotel has uppercase city (old format)
      const oldFormatHotel = await Hotel.findOne({
        city: { $regex: /^[A-Z]/ }, // Starts with uppercase
      });

      if (oldFormatHotel) {
        await Hotel.deleteMany({});

        // Get all hotels from static data
        const allHotels = getAllHotels();

        // Transform and insert hotels
        const hotelDocuments = allHotels.map((hotel) => {
          const parentCity = STATIC_HOTELS.find((c) =>
            c.hotels.some((h) => h.id === hotel.id),
          );

          return {
            id: hotel.id,
            name: hotel.name,
            stars: hotel.stars,
            location: hotel.location,
            city: parentCity?.id || hotel.city.toLowerCase(),
            country: hotel.country,
            image: hotel.image,
            amenities: hotel.amenities,
            pricePerNight: hotel.pricePerNight,
            currency: "PKR",
            status: "active",
            distanceFromHaram: hotel.distanceFromHaram || "",
            distanceFromMasjidNabawi: hotel.distanceFromMasjidNabawi || "",
            images: hotel.images || [],
            category: hotel.category || undefined,
            roomTypes: hotel.roomTypes || [],
            umrahCity: hotel.umrahCity || undefined,
            isUmrahHotel: hotel.isUmrahHotel || false,
          };
        });

        await Hotel.insertMany(hotelDocuments);
        return;
      }

      // Existing hotels found - upsert only Custom Umrah hotels

      // Get only Custom Umrah hotels (Makkah + Madinah)
      const allHotels = getAllHotels();
      const customUmrahHotels = allHotels.filter(
        (hotel) => hotel.isUmrahHotel === true,
      );

      let upsertedCount = 0;
      let newlyAddedCount = 0;

      for (const hotel of customUmrahHotels) {
        const parentCity = STATIC_HOTELS.find((c) =>
          c.hotels.some((h) => h.id === hotel.id),
        );

        const hotelDocument = {
          id: hotel.id,
          name: hotel.name,
          stars: hotel.stars,
          location: hotel.location,
          city: parentCity?.id || hotel.city.toLowerCase(),
          country: hotel.country,
          image: hotel.image,
          amenities: hotel.amenities,
          pricePerNight: hotel.pricePerNight,
          currency: "PKR",
          status: "active",
          distanceFromHaram: hotel.distanceFromHaram || "",
          distanceFromMasjidNabawi: hotel.distanceFromMasjidNabawi || "",
          images: hotel.images || [],
          category: hotel.category || undefined,
          roomTypes: hotel.roomTypes || [],
          umrahCity: hotel.umrahCity || undefined,
          isUmrahHotel: hotel.isUmrahHotel || false,
        };

        // Upsert: update if exists, insert if not
        const result = await Hotel.updateOne(
          { id: hotel.id },
          { $set: hotelDocument },
          { upsert: true },
        );

        upsertedCount++;
        if (result.upsertedCount > 0) {
          newlyAddedCount++;
        }
      }

      // Count Custom Umrah hotels in DB
      const umrahHotelsCount = await Hotel.countDocuments({
        isUmrahHotel: true,
      });
      const makkahCount = await Hotel.countDocuments({
        umrahCity: "makkah",
        isUmrahHotel: true,
      });
      const madinahCount = await Hotel.countDocuments({
        umrahCity: "madinah",
        isUmrahHotel: true,
      });

      const totalCount = await Hotel.countDocuments();
      return;
    }

    // No hotels exist - insert all
    const allHotels = getAllHotels();

    const hotelDocuments = allHotels.map((hotel) => {
      const parentCity = STATIC_HOTELS.find((c) =>
        c.hotels.some((h) => h.id === hotel.id),
      );

      return {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        location: hotel.location,
        city: parentCity?.id || hotel.city.toLowerCase(),
        country: hotel.country,
        image: hotel.image,
        amenities: hotel.amenities,
        pricePerNight: hotel.pricePerNight,
        currency: "PKR",
        status: "active",
        distanceFromHaram: hotel.distanceFromHaram || "",
        distanceFromMasjidNabawi: hotel.distanceFromMasjidNabawi || "",
        images: hotel.images || [],
        category: hotel.category || undefined,
        roomTypes: hotel.roomTypes || [],
        umrahCity: hotel.umrahCity || undefined,
        isUmrahHotel: hotel.isUmrahHotel || false,
      };
    });

    await Hotel.insertMany(hotelDocuments);

    // Count Custom Umrah hotels
    const umrahHotelsCount = await Hotel.countDocuments({
      isUmrahHotel: true,
    });
    const makkahCount = await Hotel.countDocuments({
      umrahCity: "makkah",
      isUmrahHotel: true,
    });
    const madinahCount = await Hotel.countDocuments({
      umrahCity: "madinah",
      isUmrahHotel: true,
    });
  } catch (error) {
    console.error("❌ Error seeding hotels:", error);
    throw error;
  }
};
