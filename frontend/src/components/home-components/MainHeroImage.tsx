import React from 'react';
import aquariumBackground from '../../assets/images/aquariumBackground.jpg';
import config from '../../config/index.json';

const MainHeroImage = () => {
  const { mainHero } = config;
  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img
        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full clipped-image"
        src={aquariumBackground}
        alt="Aquarium background"
      />
    </div>
  );
};

export default MainHeroImage;
