import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, InputBase } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../util/ThemeContext';

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

const Navbar: React.FC = () => {
  const [elevated, setElevated] = useState(false);
  const { toggleTheme, isDarkMode } = useThemeContext(); 
  const theme = useTheme();


  // Scroll event handler to add shadow to navbar
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
            color: "inherit",
            fontWeight: 'bold',
            flexGrow: 1, // Push other items to the right
          }}
        >
          Aquamind AI
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none' }}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/aquariums" sx={{ textTransform: 'none' }}>
            Aquariums
          </Button>
          <Button color="inherit" component={Link} to="/metrics" sx={{ textTransform: 'none' }}>
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
          </Button>


        {/* Toggle Theme Button */}
        <Button
          color="inherit"
          onClick={toggleTheme}
          sx={{ textTransform: 'none' }}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
        </Box>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>



        {/* Sign In / Register */}
        <Button component={Link} to="/login?mode=signin" sx={{ textTransform: 'none', color: 'inherit' }}>
          Sign In
        </Button>
        <Button
          component={Link}
          to="/login?mode=register"
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.text.secondary,
            borderRadius: '20px',
            ml: 2,
            '&:hover': {
              backgroundColor: 'black',
            },
          }}
        >
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
