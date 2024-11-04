import React from 'react';
import FishStrokeIcon from '../../assets/Icons/FishStrokeIcon';
import HealthStrokeIcon from '../../assets/Icons/HealthStroke';
import LightbulbStroke from '../../assets/Icons/LightbulbStroke';
import WrenchStroke from '../../assets/Icons/WrenchStroke';

const Features = () => {
  const features = {
    title: "Advanced Aquarium Management",
    subtitle: "Your All-in-One Solution for Intelligent Aquarium Care",
    description: "Discover the cutting-edge features that make managing your aquarium simple, efficient, and enjoyable. With AI-driven insights, health checks, and customizable options, Aquamind empowers you to maintain a thriving aquatic environment.",
    items: [
      {
        name: "Intelligent AI Feedback",
        description: "Get real-time, AI-driven feedback on your aquariums to optimize their conditions and ensure a balanced ecosystem.",
        icon: <LightbulbStroke />
      },
      {
        name: "Health & Compatibility Checks",
        description: "Receive detailed health checks on your tank's water quality, fish, and plant compatibility to prevent potential issues.",
        icon: <HealthStrokeIcon />
      },
      {
        name: "Manage Fish & Plants Easily",
        description: "Keep track of your fish and plants with ease. Manage and monitor their wellbeing with an intuitive interface.",
        icon: <FishStrokeIcon />
      },
      {
        name: "Add Custom Equipment",
        description: "Enhance your tank by adding and managing custom equipment like filters, heaters, and lighting for tailored care.",
        icon: <WrenchStroke />
      }
    ]
  };

  return (
    <div className={`py-12 bg-background`} id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className={`text-base text-primary font-semibold tracking-wide uppercase`}>
            {features.title}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {features.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {features.description}
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.items.map((feature) => (
              <div
                key={feature.name}
                className="relative transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md bg-background text-tertiary border-primary border-4 transition-colors duration-300 hover:bg-primary hover:text-white`}
                  >
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 transition-colors duration-300 hover:text-primary">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 transition-colors duration-300 hover:text-gray-700">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
