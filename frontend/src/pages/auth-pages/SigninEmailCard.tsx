/**
 * @file SigninEmailCard.tsx
 * @author Steven Stansberry
 * @location /src/pages/auth-pages/SigninEmailCard.tsx
 * @description 
 * This component provides a sign-in form for users to log in using their email and password. It includes form validation,
 * password visibility toggling, and user feedback through a snackbar notification. It also integrates with an authentication 
 * context to store the logged-in user's details.
 */

import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Checkbox, FormControlLabel, Box, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/APIServices';
import { useAuth } from '../../util/AuthContext';

/**
 * SignInEmailCard component renders a login form for users to authenticate using their email and password.
 * It provides feedback via a snackbar and uses context to manage login state.
 * 
 * @returns {JSX.Element} The rendered sign-in form component.
 */
const SignInEmailCard: React.FC = () => {
  // States for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();
  const { login } = useAuth();

  // Define type for Snackbar severity and state
  type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

  interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }

  /**
   * Toggles the password visibility in the form.
   * 
   * @function handleClickShowPassword
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Displays a Snackbar message to provide feedback to the user.
   * 
   * @function showSnackbar
   * @param {string} message - The message to display.
   * @param {SnackbarSeverity} severity - The severity level of the message ('success', 'error', 'warning', 'info').
   */
  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Closes the Snackbar notification.
   * 
   * @function handleCloseSnackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Validates if the provided email address has a proper format.
   * 
   * @function isValidEmail
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email is valid, otherwise false.
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Defines the expected response structure from the login API.
   * @typedef {Object} LoginResponse
   * @property {string} email - The email address of the logged-in user.
   * @property {string} token - The authentication token provided by the server.
   */
  interface LoginResponse {
    email: string;
    token: string;
  }

  /**
   * Handles form submission for login. It validates the inputs and performs the API call to log the user in.
   * On successful login, it navigates to the dashboard and stores the user's token in the context.
   * 
   * @function handleSubmit
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check for empty fields
    if (!email || !password) {
      showSnackbar('Please fill in all fields', 'warning');
      return;
    }

    // Check for valid email format
    if (!isValidEmail(email)) {
      showSnackbar('Please enter a valid email address', 'warning');
      return;
    }

    try {
      // Make API call to login the user
      const response = await loginUser({ email, password });


      // Call login from AuthContext and store the token and email
      const { token } = response as LoginResponse;
      login({ email, token });

      // Show success and navigate to dashboard if login is successful
      showSnackbar('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      // Handle API errors and show error message
      showSnackbar('Login failed. Please check your credentials.', 'error');
      console.error('Error logging in:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
      {/* Bubbles inside the card */}
      <Card sx={{ width: 400, margin: 'auto', padding: 4, textAlign: 'center', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative Bubbles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-40px',
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
            top: '50px',
            right: '-60px',
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
            bottom: '-125px',
            left: '50%',
            width: '200px',
            height: '200px',
            backgroundColor: '#0077b6',
            borderRadius: '50%',
            opacity: 0.1,
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />

        {/* Form content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Aquamind
          </Typography>
          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Sign in with email
          </Typography>

          {/* Email field */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password field with toggle visibility */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Minimum of 7 characters"
          />

          {/* CAPTCHA-like checkbox */}
          <Box sx={{ textAlign: 'left', marginTop: 2, marginBottom: 2 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="I'm not a robot"
            />
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button color="inherit" variant="text" component={Link} to="/account?mode=signin">
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'black',
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignInEmailCard;
