import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import {  useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';



const RegisterEmailCard: React.FC = () => {
  // States for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const theme = useTheme();

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here
    console.log({ email, password, fullName, subscribe });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
      {/* Bubbles inside the card */}
      <Card sx={{ width: 400, margin: 'auto', padding: 4, textAlign: 'center', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        {/* Bubble 1 */}
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
        {/* Bubble 2 */}
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
        {/* Bubble 3 */}
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

          {/* Full Name field */}
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            helperText="Will be displayed on your profile"
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
            <Button color="inherit" variant="text" component={Link} to="/login?mode=register">
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
    </Box>
  );
};

export default RegisterEmailCard;
