/**
 * @file AccountCard.tsx
 * @author Steven Stansberry
 * @location /src/pages/auth-pages/AccountCard.tsx
 * @description 
 * This component renders a card with tabs that toggle between "Sign In" and "Register" modes. The card allows 
 * users to either sign in or register using Google (OAuth) or email. 
 */

import React, { useState } from 'react';
import { Card, Tabs, Tab, Typography, Button, Box, Snackbar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import {  GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { registerUser, OAuthGoogle } from '../../services/APIServices';
import { useAuth } from '../../util/AuthContext';






/**
 * Generates a random hex string of the given length.
 * Uses the Web Crypto API
 */
const generateRandomHex = (length: number) => {
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};


interface LoginResponse {
  email: string;
  token: string;
}



/**
 * AccountCard component renders a login/register interface with toggling tabs.
 * It supports both Google and email-based sign-in/register methods.
 * 
 * @returns {JSX.Element} The rendered login/register card component.
 */
const AccountCard: React.FC = () => {

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize activeTab based on the URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialMode); // 0 -> Login, 1 -> Register


  /**
   * Handler to change between Sign In and Register tabs.
   * 
   * @param {React.SyntheticEvent} event - The event triggered when a tab is selected.
   * @param {number} newValue - The new active tab index.
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };





  /**
   * Handles the response from Google Login.
   * Decodes the JWT credential and prints the decoded information to the console.
   * 
   * @param {any} response - The response from the Google Login.
   */
  const handleGoogleResponse = async (googleResponse: any) => {
    try {
      // const decodedToken = jwtDecode(googleResponse.credential); // Decodes the token
      
      // const email = (decodedToken as any).email;
      // const firstName = (decodedToken as any).given_name;
  
      // // Generate a random password and username
      // const password = generateRandomHex(32); 
      // const username = generateRandomHex(8);  
  
      // const subscribe = false;
      // const createdAt = new Date();
  
      // const user = {
      //   username,
      //   email,
      //   first_name: firstName,
      //   password,
      //   subscribe: subscribe ? 'true' : 'false',
      //   created_at: createdAt.toISOString(),
      // };
  
      // console.log("User Object:", user);


      // // Call the registerUser API function
      // const registerUserResponse = await registerUser(user);
      // console.log(registerUserResponse); 


      const userToStore = {
        email,
      }


      // Call login from AuthContext and store the token and email
      const { token } = registerUserResponse as LoginResponse;
      login({ user: userToStore, token });

      // Navigate to dashboard after successful registration
      navigate('/aquariums');

    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  };

  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Link to="/" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <ArrowBackIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
      </Link>
      <Card sx={{ width: 400, padding: 4, textAlign: 'center', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        {/* Add Decorative Bubbles Inside the Card */}
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
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          <Box sx={{ marginTop: 4, flexGrow: 1 }}> 
            {activeTab === 0 ? (
              <>
                <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  text='signin_with'
                />

                <Button
                  variant="outlined"  
                  fullWidth
                  component={Link}
                  to="/signin"
                  sx={{ 
                    backgroundColor: 'white', 
                    color: '#3c4043',           
                    borderColor: '#dadce0',    
                    borderWidth: '1px',        
                    borderStyle: 'solid',      
                    marginBottom: 2, 
                    marginTop: 1,
                    paddingLeft: '33px',  
                    textTransform: 'none', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: '100%',      
                    boxSizing: 'border-box', 
                    '&:hover': {
                      backgroundColor: '#f8faff',
                      borderColor: '#dadce0',  
                      borderWidth: '1px',     
                      paddingLeft: '33px'    
                    }
                  }}
                >
                  <Box sx={{ position: 'absolute', left: 9 }}>
                    <EmailIcon />
                  </Box>
                  Sign in with Email
                </Button>
              </>

            ) : (
              <>
                <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  text='continue_with'
                />
  
                <Button
                  variant="outlined"  
                  fullWidth
                  component={Link}
                  to="/register"
                  sx={{ 
                    backgroundColor: 'white', 
                    color: '#3c4043',           
                    borderColor: '#dadce0',    
                    borderWidth: '1px',        
                    borderStyle: 'solid',      
                    marginBottom: 2, 
                    marginTop: 1,
                    paddingLeft: '33px',  
                    textTransform: 'none', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: '100%',      
                    boxSizing: 'border-box', 
                    '&:hover': {
                      backgroundColor: '#f8faff',
                      borderColor: '#dadce0',  
                      borderWidth: '1px',     
                      paddingLeft: '33px'    
                    }
                  }}
                >
                  <Box sx={{ position: 'absolute', left: 9 }}>
                    <EmailIcon />
                  </Box>
                  Continue with Email
                </Button>
              </>
            )}
          </Box>
  
          {/* Typography moved to the bottom of the Card */}
          <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
            {activeTab === 0 ? "Don't have an account?" : "Already have an account?"}{' '}
            <Link
              to={activeTab === 0 ? "/account?mode=register" : "#"}
              onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
              style={{ textDecoration: 'underline', color: '#1876D2' }}
            >
              {activeTab === 0 ? "Register" : "Sign In"}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};


              /*
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
                  component={Link} to="/signin"
                  sx={{ marginBottom: 2, textTransform: 'none' }}
                >
                  Sign In with Email
                </Button>
              </>
                */

export default AccountCard;
