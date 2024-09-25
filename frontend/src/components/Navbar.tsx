// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1, // Replaces the old `useStyles` for flex grow
          }}
        >
          Aquamind AI
        </Typography>

        <Button color="inherit">
          <Link
            to="/"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px', // Adjust the margin here
            }}
          >
            Dashboard
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to="/aquariums"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
          >
            Aquariums
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to="/metrics"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
          >
            Metrics
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to="/alerts"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
          >
            Alerts
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to="/ai-insights"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
          >
            AI Insights
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to="/settings"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
          >
            Settings
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
