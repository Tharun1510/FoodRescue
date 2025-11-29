import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// 1. IMPORT THE NEW MODAL
import ClaimModal from './ClaimModal';
import api from '../api';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const FoodMap = ({ userLocation, foodItems, refreshData }) => {
  // 2. NEW STATE FOR MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // 3. OPEN MODAL FUNCTION (Replaces the direct API call)
  const openClaimModal = (item) => {
    setSelectedItem(item);
    setSuccessData(null); // Clear old data
    setModalOpen(true);   // Show popup
  };

  // 4. CONFIRM FUNCTION (Called when user clicks "Yes" in modal)
  const handleConfirmClaim = async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.put(`/api/food/${selectedItem._id}/claim`);
      
      // Save data to show in the Success screen of the modal
      setSuccessData({
        pickupCode: res.data.pickupCode,
        recipe: res.data.recipe
      });
      
      // Update the map in the background
      if (refreshData) refreshData();
      
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const groupItemsByLocation = (items) => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.location.coordinates[1]}-${item.location.coordinates[0]}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.values(groups);
  };

  const groupedFood = groupItemsByLocation(foodItems);

  return (
    <div className="flex-1 z-0 relative">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <Marker position={[userLocation.lat, userLocation.lng]}><Popup>🏠 You are here</Popup></Marker>
        
        {groupedFood.map((group, index) => {
          const position = [group[0].location.coordinates[1], group[0].location.coordinates[0]];
          
          return (
            <Marker key={index} position={position}>
              <Popup>
                <div className="w-48 max-h-60 overflow-y-auto">
                  {group.length > 1 && (
                    <div className="bg-yellow-100 p-1 text-xs text-center font-bold mb-2 border border-yellow-300 rounded">
                       Found {group.length} items here!
                    </div>
                  )}
                  {group.map((item, i) => (
                    <div key={item._id} className={`mb-3 pb-3 ${i !== group.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-green-700 font-bold">${item.price}</span>
                        
                        {/* 5. BUTTON NOW OPENS MODAL */}
                        <button 
                          onClick={() => openClaimModal(item)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition"
                        >
                          Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 6. RENDER THE MODAL COMPONENT */}
      <ClaimModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmClaim}
        title={selectedItem?.title}
        loading={loading}
        successData={successData}
      />
    </div>
  );
};

export default FoodMap;