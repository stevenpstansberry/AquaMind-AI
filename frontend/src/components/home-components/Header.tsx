import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-scroll';

import config from '../../config/index.json';

const Menu = () => {
  const { navigation, company, callToAction } = config;
  const { name: companyName, logo } = company;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean | ((prevState: boolean) => boolean)) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <a href="#" aria-label={companyName}>
            <img alt="logo" src={logo} style={{ height: 64 }} />
          </a>
          <div className="menu-icons">
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)} sx={{ display: { xs: 'block', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </div>
            <div style={{ display: 'none' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                spy={true}
                smooth={true}
                duration={1000}
                style={{ margin: '0 16px', cursor: 'pointer', color: '#555', textDecoration: 'none' }}
              >
                {item.name}
              </Link>
            ))}
            <Button href="#" color="primary" variant="outlined">
              {callToAction.text}
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          style={{
            width: 250,
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img alt="logo" src={logo} style={{ height: 40 }} />
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <List>
            {navigation.map((item) => (
              <ListItem component="li" key={item.name}>
                <Link
                  to={item.href}
                  spy={true}
                  smooth={true}
                  duration={1000}
                  style={{ width: '100%', textDecoration: 'none', color: '#333' }}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.name} />
                </Link>
              </ListItem>
            ))}
          </List>
          <Button href={callToAction.href} variant="contained" color="primary" fullWidth>
            {callToAction.text}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Menu;
