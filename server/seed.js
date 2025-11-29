import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import foodItem from "./models/foodItem.js";
connectDB();
const importData = async()=>{
    try {        
    console.log(' Clearing old data...');
    await foodItem.deleteMany();
    console.log('Adding new food items...');
    const items =[
            {
        title: "Times Square Donuts",
        description: "Box of 6 glazed donuts",
        price: 5,
        location: {
          type: "Point",
          coordinates: [-73.9851, 40.7588], // Times Square (Lng, Lat)
          address: "Times Square, NYC"
        }
      },
      {
        title: "Central Park Bagels",
        description: "Bag of day-old bagels",
        price: 3,
        location: {
          type: "Point",
          coordinates: [-73.9665, 40.7812], // Central Park (Lng, Lat)
          address: "Central Park, NYC"
        }
      },
      {
        title: "Far Away Pizza",
        description: "This should NOT show up in search",
        price: 10,
        location: {
          type: "Point",
          coordinates: [-118.2437, 34.0522], // Los Angeles (Far away)
          address: "Los Angeles, CA"
        }
      }
        ];
    await foodItem.insertMany(items);
    console.log('Data Imported Successfully!');
    process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}
importData();