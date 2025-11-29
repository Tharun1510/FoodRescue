🍩 Hyper-Local Food Rescue AI Platform

A real-time, geo-spatial MERN stack application that connects restaurants with surplus food to hungry users nearby. Powered by Google Gemini AI Agents.

🚀 Key Features

🤖 AI-Powered Automation

Vision Agent (Snap-to-List): Restaurants take a photo of food, and the AI (Gemini 1.5 Flash) automatically identifies the item, writes a description, and estimates a discount price.

Chef Agent (Sous-Chef): When a user claims an item, the AI instantly generates a creative recipe to make with that specific food.

🗺️ Real-Time Geo-Spatial Logic

Live GPS Tracking: Uses navigator.watchPosition to track the user's exact location in real-time.

Geospatial Queries: MongoDB $near queries filter food items within a 5km radius.

Draggable Pin: Users can manually adjust their location pin for precision.

⚡ Real-Time Interactions

Socket.io Notifications: Users within 5km receive an instant "New Food Alert" sound and notification when a restaurant posts an item.

Live Updates: Maps refresh instantly without reloading the page.

🛡️ Security & Support

Firebase Authentication: Secure Google & Email login for partners.

Support Chatbot: A built-in bot that tracks orders using a 4-digit Pickup Code.

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, React-Leaflet (Maps), Firebase Auth.

Backend: Node.js, Express.js, Socket.io.

Database: MongoDB Atlas (GeoJSON storage).

AI Models: Google Gemini 1.5 Flash (via Google Gen AI SDK).

⚙️ Installation & Setup

1. Clone the Repository

git clone [https://github.com/your-username/food-rescue.git](https://github.com/your-username/food-rescue.git)
cd food-rescue


2. Backend Setup

cd server
npm install


Create a .env file in the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_key


Start the server:

npm run dev
# Server runs on http://localhost:5000


3. Frontend Setup

Open a new terminal:

cd client
npm install


Create a .env file in the client folder:

VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id


Start the client:

npm run dev
# Client runs on http://localhost:5173


📸 Usage

Login: Sign in as a Partner (using Google or Email).

List Food: Click the Camera icon, upload a food photo. Watch the AI auto-fill the form!

Claim Food: Switch to a different browser (Guest mode), locate the pin on the map, and click "Claim".

Get Recipe: View the generated pickup code and chef's recipe card.

Track: Use the Support Bot at the bottom right to track your order code.

🔮 Future Improvements

Payment Gateway (Stripe) integration.

Driver delivery tracking.

Rating system for restaurants.

Built with ❤️ using MERN + AI