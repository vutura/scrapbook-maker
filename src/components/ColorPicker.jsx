// src/components/ColorPicker.jsx
import { useRef } from 'react';

const ColorPicker = ({ currentColor, onColorChange }) => {
  const dropdownRef = useRef(null);

  const colors = [
    { hex: '#FFE4E6', name: 'Pink' },
    { hex: '#E0F2FE', name: 'Light Blue' },
    { hex: '#DCF9E7', name: 'Mint' },
    { hex: '#FEF9C3', name: 'Light Yellow' },
    { hex: '#F3E8FF', name: 'Lavender' },
  
  ];

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      style={{ zIndex: 1050 }}
    >
      {/* Color button */}
      <button
        className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{ backgroundColor: currentColor || '#FFE4E6' }}
        aria-label="Change theme color"
      />
      
      {/* Dropdown menu */}
      <div 
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 
                   transition-all duration-200 absolute right-0 mt-2 py-2 w-40 
                   bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ zIndex: 1051 }}
      >
        <div className="px-4 py-2 border-b border-gray-100">
          <span className="font-serialb text-sm text-gray-600">Change theme:</span>
        </div>
        
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onColorChange(color.hex)}
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
    </div>
  );
};

export default ColorPicker;