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

import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginRegisterCard from './pages/auth-pages/AccountCard';
import { ThemeContextProvider } from './util/ThemeContext'; 
import { AuthProvider } from './util/AuthContext';
import { AquariumProvider } from './util/AquariumContext';
import PrivateRoute from './routes/PrivateRoute';
import RegisterEmailCard from './pages/auth-pages/RegisterEmailCard';
import SignInEmailCard from './pages/auth-pages/SigninEmailCard';
import ReactGA from 'react-ga';
import Home from './pages/Home'; 
import Navbar from './components/Navbar'; 
import { Settings } from './pages/Pages';
import Aquariums from './pages/Aquariums';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const clientID = process.env.REACT_APP_CLIENT_ID;



// Initialize Google Analytics
const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
if (measurementId) {
  ReactGA.initialize(measurementId);
}

// Define a Layout component to conditionally render Navbar
const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const location = useLocation();

  // Specify paths where the Navbar should be hidden (e.g., "/login")
  const hideNavbarPaths = ['/account', '/register', '/signin',];

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
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <GoogleOAuthProvider clientId={clientID as string}>
      <AuthProvider>
        <AquariumProvider>
          <ThemeContextProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />

                  {/* Private Routes */}
                  
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/metrics" element={<Home />} />
                  <Route path="/alerts" element={<Home />} />
                  <Route path="/ai-insights" element={<Home />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/aquariums" element={<Aquariums />} />
                  </Route>

                  {/* Protected Public Routes */}
                  <Route path="/account" element={<LoginRegisterCard />} />
                  <Route path="/register" element={<RegisterEmailCard />} />
                  <Route path="/signin" element={<SignInEmailCard />} />
                  {/* Future Routes */}
                </Routes>
              </Layout>
          </ThemeContextProvider>  
        </AquariumProvider>  
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;