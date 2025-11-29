import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import foodItem from './models/foodItem.js';
dotenv.config();
const runDiagnostics = async () => {
  try {
    console.log("---------------------------------------");
    console.log("🕵️  STARTING DIAGNOSTICS...");
    await connectDB();

    // 1. Check if ANY data exists
    const allItems = await foodItem.find({});
    console.log(`\n📊 Total Items in Database: ${allItems.length}`);

    if (allItems.length === 0) {
      console.log("❌ ERROR: Database is empty! You need to run 'node seed.js' again.");
      process.exit(1);
    }

    // 2. Print the first item's coordinates
    const firstItem = allItems[0];
    console.log("📍 First Item Coordinates:", JSON.stringify(firstItem.location));

    // 3. Try the Search Logic MANUALLY
    // We search near Times Square (NYC)
    const testLng = -73.9851;
    const testLat = 40.7588;

    console.log(`\n📡 Testing Search near [${testLng}, ${testLat}]...`);

    const foundItems = await foodItem.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [testLng, testLat]
          },
          $maxDistance: 10000 // 10km
        }
      }
    });

    console.log(`✅ Search Result: Found ${foundItems.length} items.`);
    
    if (foundItems.length > 0) {
      console.log("🎉 SUCCESS: The database logic works perfectly.");
      console.log("👉 If the browser still shows [], check the URL parameters in the browser.");
    } else {
      console.log("⚠️ WARNING: Data exists, but Geospatial search failed. Index might be broken.");
    }

    process.exit(0);
  } catch (error) {
    console.error(`❌ FATAL ERROR: ${error.message}`);
    process.exit(1);
  }
};

runDiagnostics();