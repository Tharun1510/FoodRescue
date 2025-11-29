import React from 'react';
import { Link } from 'react-router-dom'; // Link is like <a href> but doesn't reload the page

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black text-green-700 flex items-center gap-2">
           FoodRescue
        </div>
        <Link to="/map" className="px-5 py-2.5 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition">
          Launch App
        </Link>
      </nav>

      {/* Hero Section (Center Content) */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-10">
        
        {/* Animated Badge */}
        <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold mb-6 animate-bounce ">
           Stop wasting, start saving.
        </span>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
          Delicious food <br />
          {/* Gradient Text Effect */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 animate-pulse">
            shouldn't go to waste.
          </span>
        </h1>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <Link to="/map" className="px-8 py-4 rounded-full bg-green-600 text-white text-lg font-bold shadow-lg hover:scale-105 transition">
            Find Food Near Me 
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-gray-900">12k+</div>
            <div className="text-gray-500 text-xs font-bold uppercase mt-1">Meals Saved</div>
          </div>
          <div>
            <div className="text-4xl font-black text-gray-900">500+</div>
            <div className="text-gray-500 text-xs font-bold uppercase mt-1">Partners</div>
          </div>
          <div>
            <div className="text-4xl font-black text-gray-900">$45k</div>
            <div className="text-gray-500 text-xs font-bold uppercase mt-1">Money Saved</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;