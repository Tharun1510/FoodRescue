import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hi! I'm the FoodRescue Agent. Enter your Pickup Code to find your food location.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const code = input.trim();
    const newMessages = [...messages, { text: code, isBot: false }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend API
      const res = await api.post('/api/food/track', { code });
      
      // 3. Bot Response (Success)
      const { title, latitude, longitude } = res.data;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      setMessages(prev => [...prev, { 
        text: ` Your Item "${title}" is located here.`, 
        isBot: true,
        link: mapsLink 
      }]);

    } catch (error) {
      // 4. Bot Response (Error)
      setMessages(prev => [...prev, { 
        text: " " + (error.response?.data?.message || "Error finding code."), 
        isBot: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* 1. CHAT WINDOW (Only visible if open) */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-200 animate-fade-in-up">
          {/* Header */}
          <div className="bg-green-600 p-4 text-white flex justify-between items-center">
            <div className="font-bold flex items-center gap-2">
              <span>🤖</span> Support Agent
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-xl">&times;</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.isBot ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none' : 'bg-green-600 text-white rounded-tr-none'}`}>
                  {msg.text}
                  {msg.link && (
                    <a 
                      href={msg.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="block mt-2 text-green-600 font-bold underline bg-green-50 p-2 rounded text-center hover:bg-green-100"
                    >
                      📍 Open in Google Maps
                    </a>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs italic ml-2">Agent is typing...</div>}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500"
              placeholder="Enter 4-digit code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition">
              ➤
            </button>
          </form>
        </div>
      )}

      {/* 2. FLOATING BUTTON (The Icon) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl transition transform hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default SupportBot;