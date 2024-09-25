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
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginRegisterCard from './pages/auth-pages/LoginRegisterCard';
import { ThemeContextProvider } from './util/ThemeContext'; 
import RegisterEmailCard from './pages/auth-pages/RegisterEmailCard';


// Component Imports
import Home from './pages/Home'; 
import Navbar from './components/Navbar'; 

// Define a Layout component to conditionally render Navbar
const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const location = useLocation();

  // Specify paths where the Navbar should be hidden (e.g., "/login")
  const hideNavbarPaths = ['/login', '/register'];

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      
      {/* Render the main content */}
      <div className="content">{children}</div>
    </>
  );
};


const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Layout>
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

            {/* Protected Public Routes */}
            <Route path="/login" element={<LoginRegisterCard />} />
            <Route path="/register" element={<RegisterEmailCard />} />
            {/* Future Routes */}
          </Routes>
        </Layout>
      </Router>
    /</ThemeContextProvider>  
  );
};

export default App;