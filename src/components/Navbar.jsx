// src/components/Navbar.jsx
import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import AboutModal from './AboutModal';
import CreationsModal from './CreationsModal';

const Navbar = ({ currentColor, onColorChange }) => {
  const [showCreations, setShowCreations] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <nav 
      className="relative bg-transparent py-4 px-4 navbar" 
      style={{ zIndex: 9999 }}
    >
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-3 sm:gap-6">
        <h1 className="font-serialb text-sm sm:text-base">
          scrapbook maker ｡𖦹°‧
        </h1>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <button 
            className="font-serialb text-sm sm:text-base hover:opacity-70 transition-all duration-300 ease-in-out"
            onClick={() => setShowAbout(true)}
          >
            about
          </button>

          <button 
            className="font-serialb text-sm sm:text-base hover:opacity-70 transition-all duration-300 ease-in-out"
            onClick={() => setShowCreations(true)}
          >
            creations
          </button>

          <div 
            className="relative"
            style={{ zIndex: 9999 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ColorPicker 
              currentColor={currentColor}
              onColorChange={onColorChange}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showCreations && <CreationsModal onClose={() => setShowCreations(false)} />}
    </nav>
  );
};

export default Navbar;
