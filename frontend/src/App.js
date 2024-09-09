/**
 * @fileoverview Main application component for the AquaMind-AI
 * 
 * @file src/App.js
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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
          <div className="content">
            {/* Public Routes */}
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />


            {/*  Private Routes*/}
            <Route 
              


            
            />
          
            {/* Protected Public Routes */}

            <Route 
            
            
            />


            </Routes>

          </div>
    
    
    
    </BrowserRouter>

  );
}

export default App;
