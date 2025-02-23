// src/utils/gridUtils.js
export const snapToGrid = (value, gridSize) => {
    return Math.round(value / gridSize) * gridSize;
  };
  
  export const snapPositionToGrid = (position, gridSize) => {
    return {
      x: snapToGrid(position.x, gridSize),
      y: snapToGrid(position.y, gridSize)
    };
  };