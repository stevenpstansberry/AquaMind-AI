/**
 * @file Navbar.tsx
 * @author Steven Stansberry
 * @location /src/components/Navbar.tsx
 * @description 
 * This file contains the Navbar component for the Aquamind AI application. The Navbar provides
 * navigation links, a search bar, theme toggle functionality, and authentication controls (Sign In/Logout).
 * It also implements a scroll detection feature that dynamically adds a shadow to the AppBar
 * when the user scrolls down.
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, InputBase } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../util/ThemeContext';
import { useAuth } from '../util/AuthContext';

// Styled components for the search bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

/**
 * Navbar component for Aquamind AI. 
 * Provides navigation links, a theme toggle, search bar, and authentication controls.
 */
const Navbar: React.FC = () => {
  const [elevated, setElevated] = useState(false);
  const { toggleTheme, isDarkMode } = useThemeContext(); 
  const theme = useTheme();

  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function

  /**
   * Scroll event handler to add shadow to the navbar when scrolled down.
   */
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setElevated(true);
    } else {
      setElevated(false);
    }
  };

  // Detect scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={elevated ? 4 : 0} // Add shadow when scrolled
      sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, transition: 'box-shadow 0.3s' }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            display: { xs: 'none', sm: 'block' },
            textDecoration: 'none',
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            flexGrow: 1, // Push other items to the right
          }}
        >
          Aquamind AI
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none' }}>
            Dashboard
          </Button> */}
          <Button color="inherit" component={Link} to="/aquariums" sx={{ textTransform: 'none' }}>
            Aquariums
          </Button>
          {/* <Button color="inherit" component={Link} to="/metrics" sx={{ textTransform: 'none' }}>
            Metrics
          </Button>
          <Button color="inherit" component={Link} to="/alerts" sx={{ textTransform: 'none' }}>
            Alerts
          </Button>
          <Button color="inherit" component={Link} to="/ai-insights" sx={{ textTransform: 'none' }}>
            AI Insights
          </Button>
          <Button color="inherit" component={Link} to="/settings" sx={{ textTransform: 'none' }}>
            Settings
          </Button> */}

        {/* Toggle Theme Button */}
        <Button
          color="inherit"
          onClick={toggleTheme}
          sx={{ textTransform: 'none' }}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button> 
        </Box>

        {/* Buffer */}
        <Box sx={{ flexGrow: 72 }} />

        {/* Search Bar */}
        {/* <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search> */}

        {/* Conditional Auth Buttons */}
        {isLoggedIn ? (
          <>
            <Typography sx={{ marginRight: 2 }}>Hello, {user?.email}!</Typography>
            <Button onClick={logout} sx={{ textTransform: 'none', color: 'inherit' }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/account?mode=signin" sx={{ textTransform: 'none', color: 'inherit' }}>
              Sign In
            </Button>
            <Button
              component={Link}
              to="/account?mode=register"
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#1876D2',
                color: "white",
                borderRadius: '20px',
                ml: 2,
                '&:hover': {
                  backgroundColor: 'theme.palette.primary.main',
                },
              }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;