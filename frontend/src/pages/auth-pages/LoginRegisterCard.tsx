// src/pages/LoginRegisterCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Typography, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { Link, useLocation } from 'react-router-dom';
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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: 400, padding: 4, textAlign: 'center', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        {/* Add Bubbles Inside the Card */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20px',
            left: '-30px',
            width: '120px',
            height: '120px',
            backgroundColor: '#1CB2B7',
            borderRadius: '50%',
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '90px',
            right: '-30px',
            width: '100px',
            height: '100px',
            backgroundColor: '#48cae4',
            borderRadius: '50%',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '-60px',
            right: '-90px',
            width: '200px',
            height: '200px',
            backgroundColor: '#0077b6',
            borderRadius: '50%',
            opacity: 0.1,
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />
          <Box
          sx={{
            position: 'absolute',
            bottom: '-80px',
            left: '-50px',
            width: '200px',
            height: '200px',
            backgroundColor: '#0077b6',
            borderRadius: '50%',
            opacity: 0.1,
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />
        
        {/* Content inside the card */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: theme.palette.primary.main }}>
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
                color: activeTab === 0 ? theme.palette.primary.main : '#1CB2B7',
              }}
            />
            <Tab
              label="Register"
              sx={{
                color: activeTab === 1 ? theme.palette.primary.main : '#1CB2B7',
              }}
            />
          </Tabs>

          {/* Content changes based on activeTab */}
          <Box sx={{ marginTop: 2 }}>
            {activeTab === 0 ? (
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
                  component={Link} to="/register"
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
        </Box>
      </Card>
    </Box>
  );
};

export default LoginRegisterCard;
