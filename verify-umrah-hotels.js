// Quick verification script to check Custom Umrah hotels in MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const hotelSchema = new mongoose.Schema({}, { strict: false, collection: 'hotels' });
const Hotel = mongoose.model('Hotel', hotelSchema);

async function verifyUmrahHotels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Total hotels
    const totalCount = await Hotel.countDocuments();
    console.log(`📊 Total hotels in DB: ${totalCount}\n`);

    // Custom Umrah hotels
    const umrahCount = await Hotel.countDocuments({ isUmrahHotel: true });
    console.log(`🕋 Total Custom Umrah hotels: ${umrahCount}\n`);

    // Makkah hotels
    const makkahHotels = await Hotel.find({ umrahCity: 'makkah', isUmrahHotel: true }).select('id name stars category roomTypes umrahCity distanceFromHaram');
    console.log(`🕋 MAKKAH HOTELS (${makkahHotels.length}):`);
    makkahHotels.forEach(h => {
      console.log(`   ✓ ${h.name} (${h.stars}⭐ ${h.category || 'N/A'}) - ${h.roomTypes?.length || 0} room types - ${h.distanceFromHaram || 'N/A'}`);
    });

    console.log();

    // Madinah hotels
    const madinahHotels = await Hotel.find({ umrahCity: 'madinah', isUmrahHotel: true }).select('id name stars category roomTypes umrahCity distanceFromMasjidNabawi');
    console.log(`🕌 MADINAH HOTELS (${madinahHotels.length}):`);
    madinahHotels.forEach(h => {
      console.log(`   ✓ ${h.name} (${h.stars}⭐ ${h.category || 'N/A'}) - ${h.roomTypes?.length || 0} room types - ${h.distanceFromMasjidNabawi || 'N/A'}`);
    });

    console.log();

    // Check a sample hotel's roomTypes
    const sampleHotel = await Hotel.findOne({ id: 'makkah-swissotel' });
    if (sampleHotel) {
      console.log(`🏨 SAMPLE HOTEL CHECK (${sampleHotel.name}):`);
      console.log(`   - Category: ${sampleHotel.category || 'N/A'}`);
      console.log(`   - Images: ${sampleHotel.images?.length || 0} images`);
      console.log(`   - Room Types: ${sampleHotel.roomTypes?.length || 0}`);
      if (sampleHotel.roomTypes && sampleHotel.roomTypes.length > 0) {
        sampleHotel.roomTypes.forEach(rt => {
          console.log(`     • ${rt.type}: ${rt.pricePerPerson} PKR/person (${rt.occupancy} persons)`);
        });
      }
    }

    console.log('\n✅ Verification complete!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyUmrahHotels();
