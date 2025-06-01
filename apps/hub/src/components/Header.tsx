import React from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header 
      className='fixed top-0 left-0 right-0 z-10 transition-all duration-300 bg-white dark:bg-gray-950 shadow-md'
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <BsLightningChargeFill className="text-purple-600 text-2xl mr-2" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Quikpad
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;