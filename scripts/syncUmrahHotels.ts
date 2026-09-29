import "dotenv/config";
import mongoose from "mongoose";
import Hotel from "../src/models/hotel.model.js";
import { connectDB } from "../src/config/database.js";
import { STATIC_HOTELS } from "../src/utils/staticHotels.js";

const syncUmrahHotels = async () => {
  await connectDB();

  const hotels = STATIC_HOTELS.filter(
    (city) => city.id === "makkah" || city.id === "madinah",
  ).flatMap((city) => city.hotels);

  for (const hotel of hotels) {
    const city = hotel.umrahCity;
    if (!city) continue;

    await Hotel.updateOne(
      { id: hotel.id },
      {
        $set: {
          name: hotel.name,
          pricePerNight: hotel.pricePerNight,
          roomTypes: hotel.roomTypes || [],
          distanceFromHaram: hotel.distanceFromHaram || "",
          distanceFromMasjidNabawi: hotel.distanceFromMasjidNabawi || "",
          currency: "PKR",
          city,
          umrahCity: city,
          isUmrahHotel: true,
        },
        $setOnInsert: {
          id: hotel.id,
          stars: hotel.stars,
          location: hotel.location,
          country: hotel.country,
          image: hotel.image,
          amenities: hotel.amenities,
          status: "active",
          images: hotel.images || [],
          category: hotel.category,
        },
      },
      { upsert: true },
    );
  }

  console.log(`Synced ${hotels.length} Makkah/Madinah Umrah hotels.`);
};

syncUmrahHotels()
  .catch((error) => {
    console.error("Failed to sync Umrah hotels:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
