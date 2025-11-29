import { GoogleGenAI } from "@google/genai";
import foodItem from "../models/FoodItem.js";
export const  addFoodItem = async(req,res) =>{
    const{ title, description, price, latitude,longitude } = req.body;
    try {
        const food = await foodItem.create({
            title,
            description,
            price,
            location:{
                type:'Point',
                coordinates:[longitude,latitude],
            },
        });
        const io = req.app.get('socketio');
        io.emit('food-added', {
        title: food.title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    });
        res.status(201).json({message:'Food item added successfully', food});
    } catch (error) {
        res.status(500).json({message:'Server Error', error: error.message});
    }
}
export const getFoodItems = async(req,res)=>{
    try {
        const {lat,lng} = req.query;
    console.log("--------------------------------");
    console.log("DEBUG: Searching for food...");
    console.log(`User Location: Lat: ${lat}, Lng: ${lng}`);
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required!" });
    }
    const allItems = await foodItem.find({});
    console.log(`Total items in DB (anywhere): ${allItems.length}`);
        const items = await foodItem.find({
            isClaimed:false,
           location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000 
        }
      }
        })
        console.log(`Success! Sending ${items.length} items to browser.`);
        res.json(items);
    } catch (error) {
        res.status(500).json({message:'Server Error', error: error.message});
    }
};
export const analyzeImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    console.log("🤖 AI Agent: Analyzing image...");

    if (!process.env.GEMINI_API_KEY) {
      console.error(" ERROR: GEMINI_API_KEY is missing from .env");
      return res.status(500).json({ message: "Server Error: API Key Missing" });
    }

    // 2. Initialize the new Client using the syntax you found
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are a Food Rescue AI Agent. Analyze this image of leftover food.
      Return ONLY a JSON object (no markdown) with fields:
      - title: Short name
      - description: Tasty description with quantity
      - originalPrice: Number
      - discountPrice: Number (70% off)
    `;

    // 3. Use the new 'ai.models.generateContent' syntax
    // We use gemini-1.5-flash because it is fast and supports images well
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
          ]
        }
      ]
    });

    // 4. Handle the response (New SDK returns .text() directly sometimes or needs parsing)
    // The new SDK usually returns response.text() as a getter or property
    let text = response.text; 
    if (!text) {
        text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    }
    // Clean up markdown if the AI adds it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    
    console.log("✅ AI Analysis Complete:", data.title);
    res.json(data);

  } catch (error) {
    console.error(" AI Error:", error.message);
    res.status(500).json({ message: "AI Failed", error: error.message });
  }
};
export const claimFood = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Find the food
    const food = await foodItem.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    if (food.isClaimed) {
      return res.status(400).json({ message: "This item is already claimed!" });
    }

    // 2. Generate Pickup Code (4 digits)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("🔑 DEBUG: Checking API Key...", process.env.GEMINI_API_KEY ? "Exists" : "MISSING");

    console.log(`Claiming Food: ${food.title} with Code: ${code}`);

    // 3. 🤖 AI AGENT 2: The "Sous-Chef"
    // We ask AI for a recipe based on this specific item
   let recipeData = { name: "Enjoy!", steps: ["Eat and be happy."] };
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
          The user just rescued "${food.title}" (${food.description}).
          Suggest a creative, simple recipe using this item.
          Return ONLY a JSON object (no markdown) with this EXACT structure:
          {
            "name": "Recipe Title Here",
            "steps": ["Step 1...", "Step 2...", "Step 3..."]
          }
        `;
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        
        let text = response.text || "{}";
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        recipeData = JSON.parse(text);
      } catch (aiError) {
        console.error("AI Recipe Error:", aiError.message);
      }
    }

    // 4. Save everything to Database
    food.isClaimed = true;
    food.pickupCode = code;
   food.aiRecipe = JSON.stringify(recipeData);
    await food.save();

    res.json({ 
      message: "Claim Successful!", 
      pickupCode: code, 
      recipe: recipeData 
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// 🕵️ @desc   Support Agent: Track Food by Code
export const trackFood = async (req, res) => {
  try {
    const { code } = req.body;
    
    // Find the item that matches this 4-digit code
    const food = await foodItem.findOne({ pickupCode: code });

    if (!food) {
      return res.status(404).json({ message: "I couldn't find that code. Are you sure it's correct?" });
    }

    res.json({
      found: true,
      title: food.title,
      // Remember MongoDB is [Lng, Lat]
      latitude: food.location.coordinates[1],
      longitude: food.location.coordinates[0],
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};