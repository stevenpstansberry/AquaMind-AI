// src/pages/LoginRegisterCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Typography, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { Link, useParams, useLocation } from 'react-router-dom';
import {  useTheme } from '@mui/material/styles';

const LoginRegisterCard: React.FC = () => {
  // State to toggle between login and register modes
  const [activeTab, setActiveTab] = useState(0); // 0 -> Login, 1 -> Register


  const theme = useTheme();


  // Get the current URL location
  const location = useLocation();

  // Set the active tab based on the query parameter
  useEffect(() => {
    // Parse the query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode'); // Get the 'mode' parameter value

    if (mode === 'register') {
      setActiveTab(1); // Switch to Register tab if 'mode' is 'register'
      console.log(location);
    } else {
      setActiveTab(0); // Default to Sign In tab
    }
  }, [location]);

  // Handler to change between tabs
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Card sx={{ width: 400, margin: 'auto', padding: 4, textAlign: 'center', borderRadius: 4 }}>
      {/* Logo */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2,  }}>
        Aquamind 
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Welcome!
      </Typography>

      {/* Tabs for switching between Sign In and Register */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
      <Tab
          label="Sign In"
          sx={{
            color: activeTab === 0 ? theme.palette.primary.main : "#1CB2B7", 
          }}
        />
        <Tab
          label="Register"
          sx={{
            color: activeTab === 1 ? theme.palette.primary.main : "#1CB2B7", 
          }}
        />
      </Tabs>

      {/* Content changes based on activeTab */}
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 ? (
          // Login UI
          <>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{ marginBottom: 2, textTransform: 'none' }}
            >
              Sign In with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EmailIcon />}
              sx={{ marginBottom: 2, textTransform: 'none' }}
            >
              Sign In with Email
            </Button>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Don't have an account?{' '}
              <Link to="#" onClick={() => setActiveTab(1)}>
                Register
              </Link>
            </Typography>
          </>
        ) : (
          // Register UI
          <>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{ marginBottom: 2, textTransform: 'none' }}
            >
              Register with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EmailIcon />}
              sx={{ marginBottom: 2, textTransform: 'none' }}
            >
              Register with Email
            </Button>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Already have an account?{' '}
              <Link to="#" onClick={() => setActiveTab(0)}>
                Sign In
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
};

export default LoginRegisterCard;
