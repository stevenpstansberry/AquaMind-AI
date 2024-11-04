import React from 'react';
import config from '../../config/index.json';
import { useAuth } from '../../util/AuthContext';

const MainHero = () => {
  const { mainHero } = config;
  const { isLoggedIn } = useAuth(); // Access isLoggedIn and logout function

  return (
    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div className="sm:text-center lg:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">{mainHero.title}</span>{' '}
          <span className="block text-[#1876D2] xl:inline">
            {mainHero.subtitle}
          </span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          {mainHero.description}
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          {isLoggedIn ? (
            <div className="rounded-full shadow">
              <a
                href={mainHero.loggedInAction.href}
                className="w-full flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#1876D2] hover:bg-[#145ea8] md:py-4 md:text-lg md:px-12"
              >
                {mainHero.loggedInAction.text}
              </a>
            </div>
          ) : (
            <>
              {/* Primary action button (Register) */}
              <div className="rounded-full shadow">
                <a
                  href={mainHero.primaryAction.href}
                  className="w-full flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#1876D2] hover:bg-[#145ea8] md:py-4 md:text-lg md:px-12"
                >
                  {mainHero.primaryAction.text}
                </a>
              </div>
              {/* Secondary action button (Sign In) */}
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href={mainHero.secondaryAction.href}
                  className="w-full flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-full text-[black] bg-white border-[#1876D2] hover:bg-gray-100 md:py-4 md:text-lg md:px-12"
                >
                  {mainHero.secondaryAction.text}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainHero;