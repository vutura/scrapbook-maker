// src/components/ColorPicker.jsx
import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = ({ currentColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const colors = [
    { hex: '#FFE4E6', name: 'Pink' },
    { hex: '#E0F2FE', name: 'Light Blue' },
    { hex: '#DCF9E7', name: 'Mint' },
    { hex: '#FEF9C3', name: 'Light Yellow' },
    { hex: '#F3E8FF', name: 'Lavender' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (color) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className="relative"
      style={{ zIndex: 9999 }}
    >
      {/* Color button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{ 
          backgroundColor: currentColor || '#FFE4E6',
          zIndex: 9999 
        }}
        aria-label="Change theme color"
      />
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 py-2 w-40 
                     bg-white rounded-lg shadow-lg border border-gray-200
                     z-[9999]"
          style={{
            position: 'absolute',
            top: '100%', 
            right: 0,
            zIndex: 9999
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="font-serialb text-sm text-gray-600">Change theme:</span>
          </div>
          
          {colors.map((color) => (
            <button
              key={color.hex}
              onClick={(e) => {
                e.stopPropagation();
                handleColorSelect(color.hex);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-4 h-4 rounded-full mr-3 border border-gray-200"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-serialt text-sm text-gray-800 flex-grow text-left">
                {color.name}
              </span>
              {currentColor === color.hex && (
                <span className="text-gray-600 ml-2">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;