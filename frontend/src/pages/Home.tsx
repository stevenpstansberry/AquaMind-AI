/**
 * @fileoverview This component represents the homepage of the application. It displays a personalized
 * greeting if the user is logged in; otherwise, it shows a generic welcome message.
 * 
 * @file src/pages/Home.tsx
 * @component
 * @requires ../util/AuthContext
 * 
 * @description The `Home` component checks if a user is logged in by retrieving user data from
 * localStorage using a service function. If a user is logged in, it displays a greeting with the
 * user's name. Otherwise, it displays a generic welcome message.
 * 
 * @returns {React.ReactElement} The rendered Home component.
 * @function
 * @exports Home
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../util/AuthContext';


const Home: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function



  return (
    <div>
      {isLoggedIn ? <h1>Hello, {user?.email}!</h1> : <h1>Welcome to the homepage!</h1>}
    </div>
  );
};

export default Home;
