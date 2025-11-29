import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = ({ foodCount, onFileChange }) => {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  // 1. LISTEN FOR LOGIN STATUS
  // This runs automatically whenever someone logs in or out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 2. LOGOUT FUNCTION
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully!");
  };

  return (
    <div className="bg-green-600 p-4 text-white shadow-md z-10 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">🍩 Food Rescue AI</h1>
        <p className="text-xs">Found {foodCount} items nearby</p>
      </div>
      
      {/* 3. CONDITIONAL RENDERING */}
      {user ? (
        /* IF LOGGED IN: Show Camera & Logout */
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerCamera}
            className="bg-white text-green-700 px-2 py-3  rounded-full font-bold shadow  flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <span className='cursor-pointer'>📸</span> List Food
          </button>
          <button onClick={handleLogout} className=" bg-red-800 text-xs text-green-100  hover:text-white rounded-full px-4 py-2 shadow cursor-pointer">
            Logout
          </button>
        </div>
      ) : (
        /* IF NOT LOGGED IN: Show Login Button */
        <Link 
          to="/login"
          className="bg-green-800 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-green-900 border border-green-500"
        >
          Partner Login
        </Link>
      )}
      
      {/* Hidden Input (Only works if logged in user clicks the button above) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={onFileChange} 
      />
    </div>
  );
};

export default Header;