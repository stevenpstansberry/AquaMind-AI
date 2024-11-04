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
import { getDetailsById, getAllDetails } from '../services/APIServices';
import { useAuth } from '../util/AuthContext';
import { About, Canvas, Divider, Features, Header, LazyShow, MainHero, MainHeroImage, Pricing, Product, Wave } from '../components/home-components';
import '../styles/main.css';

const Home: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getAllDetails("plants");
        setDetails(response);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);

  const renderDetails = () => {
    if (!details) return <p>Loading details...</p>;
    return <pre>{JSON.stringify(details, null, 2)}</pre>;
  };

  return (
    <div className={`bg-background grid gap-y-16 overflow-hidden`}>
      <div className={`relative bg-background`}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>
      <Canvas />
      <LazyShow>
        <>
          <Product />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <Features />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <About />
        </>
      </LazyShow>
    </div>
  );
};

export default Home;