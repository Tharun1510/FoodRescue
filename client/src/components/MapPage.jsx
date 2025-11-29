import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Header from '../components/Header';
import FoodMap from '../components/FoodMap';
import FoodForm from '../components/FoodForm';
import SupportBot from './SupportBot';
import Toast from './Toast';
import api,{socketURL} from '../api';
// 🔔 SOUND URL (A pleasant "Ding")
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";
// Helper: Calculate distance in KM (Haversine Formula)
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

const deg2rad = (deg) => deg * (Math.PI/180);
const MapPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '', latitude: '', longitude: '' });
  const [toastMessage, setToastMessage] = useState(null);
  
  // Socket Ref
  const socket = useRef(null);

  // 1. TRACK USER LOCATION (Real-Time)
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Keep form updated with latest location
        setNewItem(prev => ({ ...prev, latitude, longitude }));
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. DEFINE FETCH FUNCTION
  const fetchFood = async () => {
    if (!userLocation) return;
    try {
      const res = await api.get(`/api/food/nearby`, {
        params: { lat: userLocation.lat, lng: userLocation.lng }
      });
      setFoodItems(res.data);
    } catch (err) { console.error(err); }
  };

  // 3. SETUP SOCKET LISTENER
  useEffect(() => {
    // Connect to backend
    socket.current = io(socketURL);

    // Listen for 'food-added' event from server
    socket.current.on('food-added', (newFood) => {
      console.log("⚡ Socket Event Received:", newFood);
      
      if (userLocation) {
        // Calculate Distance
        const dist = getDistanceFromLatLonInKm(
          userLocation.lat, userLocation.lng,
          newFood.latitude, newFood.longitude
        );

        console.log(`📏 Distance to food: ${dist.toFixed(2)} km`);

        // IF WITHIN 5 KM -> NOTIFY
        if (dist <= 5) {
          // Play Sound
          const audio = new Audio(NOTIFICATION_SOUND_URL);
          audio.play().catch(e => console.log("Audio block:", e));
          
          // Show Toast
          setToastMessage(`New "${newFood.title}" listed ${dist.toFixed(1)}km away!`);
          
          // Refresh map to show the new pin
          fetchFood();
        }
      }
    });

    return () => socket.current.disconnect();
  }, [userLocation]); // Re-run if user moves

  // Initial Fetch when location is found
  useEffect(() => { fetchFood(); }, [userLocation?.lat, userLocation?.lng]);

  // 4. MANUAL DRAG UPDATE
  const handleManualLocationUpdate = (newLoc) => {
    setUserLocation(newLoc);
    setNewItem(prev => ({ ...prev, latitude: newLoc.lat, longitude: newLoc.lng }));
  };

  // 5. HANDLE CAMERA UPLOAD (AI)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAnalyzing(true);
    setShowForm(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        try {
            const res = await api.post('/api/food/analyze', { imageBase64: base64 });
            setNewItem(prev => ({ ...prev, ...res.data, price: res.data.discountPrice }));
        } catch (e) { alert("AI Failed"); } 
        finally { setAnalyzing(false); }
    }
  };

  // 6. SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/food', newItem);
      setShowForm(false);
      setNewItem(prev => ({ ...prev, title: '', description: '', price: '' })); 
      // We don't need to manually fetchFood here because the Socket will trigger it!
      alert("✅ Food Listed Successfully!");
    } catch (error) { alert("Error listing food"); }
  };

  if (!userLocation) return <div className="h-screen flex items-center justify-center font-bold text-green-700 animate-pulse">🍩 Locating nearby donuts...</div>;

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <Header 
        foodCount={foodItems.length}
        onFileChange={handleImageUpload}
      />
      
      {/* Show Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <FoodMap 
        userLocation={userLocation} 
        foodItems={foodItems} 
        refreshData={fetchFood}
        onLocationUpdate={handleManualLocationUpdate}
      />
      
      <FoodForm 
        visible={showForm} 
        analyzing={analyzing} 
        formData={newItem}
        setFormData={setNewItem} 
        onSubmit={handleSubmit} 
        onCancel={() => setShowForm(false)}
      />

      <SupportBot />
    </div>
  );
};

export default MapPage;