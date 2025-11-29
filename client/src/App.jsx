import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './components/MapPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1: When URL is "/", show LandingPage */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route 2: When URL is "/map", show MapPage */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;