/**
 * @file RegisterEmailCard.tsx
 * @author Steven Stansberry
 * @location /src/pages/auth-pages/RegisterEmailCard.tsx
 * @description 
 * This component provides the registration form for new users using their email. It includes fields for 
 * email, password, and full name, along with options to subscribe to newsletters and CAPTCHA-like confirmation.
 * The component also handles form validation, user registration via API, and feedback through a snackbar notification.
 */

import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Checkbox, FormControlLabel, Box, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/APIServices';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../interfaces/Auth';
import bcrypt from 'bcryptjs';

/**
 * RegisterEmailCard component renders a registration form that allows new users to sign up using their email, 
 * with form validation and user feedback provided through a snackbar.
 * 
 * @returns {JSX.Element} The rendered registration form component.
 */
const RegisterEmailCard: React.FC = () => {
  // States for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();

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
   * Handles the form submission process. It validates the input fields and calls the register API if valid.
   * 
   * @function handleSubmit
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      showSnackbar('All fields must be filled', 'warning');
      return;
    }

    // Check for valid email format
    if (!isValidEmail(email)) {
      showSnackbar('Please enter a valid email address', 'warning');
      return;
    }

    try {
      const userId = uuidv4(); // Generate a unique user ID
      const createdAt = new Date(); // Get the current timestamp
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const user = {
        id: userId,
        username,
        email,
        firstName,
        password: hashedPassword,
        subscribe,
        createdAt,
      }
      // Call the registerUser API function
      const response = await registerUser({ email, password, full_name: firstName });
      console.log(response);

      showSnackbar('Registration successful!', 'success');

      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);
      showSnackbar('Error registering user', 'error');
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
            Register with email
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

          {/* Username field */}
          <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

          {/* First Name field */}
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          {/* CAPTCHA-like checkbox */}
          <Box sx={{ textAlign: 'left', marginTop: 2, marginBottom: 2 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="I'm not a robot"
            />
          </Box>

          {/* Subscribe to newsletter checkbox */}
          <Box sx={{ textAlign: 'left', marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
              }
              label="Email me Aquamind news and tips. You can opt out at any time."
            />
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button color="inherit" variant="text" component={Link} to="/account?mode=register">
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

export default RegisterEmailCard;
