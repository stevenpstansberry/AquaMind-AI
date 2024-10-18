/**
 * @fileoverview This component represents the homepage of the application. It displays a personalized
 * greeting if the user is logged in; otherwise, it shows a generic welcome message.
 * 
 * @file src/pages/Home.tsx
 * @component
 * @requires ../services/AuthServices
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
import { getUser } from '../services/AuthServices';

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  /**
   * Effect that checks if the user is logged in by looking for user data in localStorage.
   * If user data is found, it sets the `userName` state.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const storedUserName = getUser();
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div>
      {userName ? <h1>Hello, {userName}!</h1> : <h1>Welcome to the homepage!</h1>}
    </div>
  );
};

export default Home;
