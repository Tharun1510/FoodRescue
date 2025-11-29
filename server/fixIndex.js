import mongoose from "mongoose";
import dotenv from "dotenv"
import connectDB from './config/db.js';
import foodItem from "./models/foodItem.js";
dotenv.config();
const fixIndex = async () => {
  try {
    await connectDB();
    console.log('🔧 Connected. Checking Indexes...');

    // 1. Drop existing indexes to start fresh
    await foodItem.collection.dropIndexes();
    console.log('❌ Old Indexes Dropped.');

    // 2. Create the 2dsphere index explicitly
    await foodItem.collection.createIndex({ location: "2dsphere" });
    console.log('✅ NEW "2dsphere" Index Created Successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

fixIndex();