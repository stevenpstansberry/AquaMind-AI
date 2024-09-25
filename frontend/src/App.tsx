/**
 * @fileoverview Main application component for the AquaMind-AI
 * 
 * @file src/App.tsx
 * 
 * This file sets up the main routing for the application using React Router, handles user session verification, 
 * and provides public and private routes for various pages.
 * 
 * @component
 * @returns {React.Element} - The main App component containing all routes.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Home from './pages/Home'; 
import Navbar from './components/Navbar'; 

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />

      {/* Define main content area and routing */}
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/aquariums" element={<Home />} />
          <Route path="/metrics" element={<Home />} />
          <Route path="/alerts" element={<Home />} />
          <Route path="/ai-insights" element={<Home />} />
          <Route path="/settings" element={<Home />} />

          {/* Future Routes */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;