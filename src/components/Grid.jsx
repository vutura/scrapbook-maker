// src/components/Grid.jsx
import React from 'react';

const Grid = ({ visible, size = 20, color = 'rgba(0, 0, 0, 0.1)' }) => {
  if (!visible) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
};

export default Grid;

export const snapToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};