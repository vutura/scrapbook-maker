// src/utils/gradientGenerator.js
// Array of soft colors to use in gradients
const softColors = [
    '#FCD1D7', // soft pink
    '#FFE7E7', // light pink
    '#FFCAD4', // peachy pink
    '#FFE5D1', // soft peach
    '#FFBFA3', // light coral
    '#FFE3B3', // soft yellow
    '#FBFCDB', // cream
    '#D5ECC2', // soft green
    '#98D576', // light green
    '#C8E6C9', // sage
    '#89F7FE', // light blue
    '#B0E5FF', // sky blue
    '#D4E9FF', // powder blue
    '#B0C9FF', // periwinkle
    '#E9DEFA', // soft purple
    '#E6D0FF', // light lavender
    '#FFF5E7', // vanilla
    '#FFE8CC', // soft orange
    '#EEDDFF', // light purple
    '#CCA7FF'  // medium purple
  ];
  
  // Function to get random color from array
  const getRandomColor = () => {
    return softColors[Math.floor(Math.random() * softColors.length)];
  };
  
  // Function to get random angle
  const getRandomAngle = () => {
    const angles = [45, 60, 90, 120, 135, 180];
    return angles[Math.floor(Math.random() * angles.length)];
  };
  
  // Generate a set of random gradients
  export const generateRandomGradients = (count = 6) => {
    const gradients = [];
    for (let i = 0; i < count; i++) {
      const startColor = getRandomColor();
      let endColor = getRandomColor();
      // Make sure end color is different from start color
      while (endColor === startColor) {
        endColor = getRandomColor();
      }
      
      gradients.push({
        name: `Gradient ${i + 1}`,
        gradient: `linear-gradient(${getRandomAngle()}deg, ${startColor} 0%, ${endColor} 100%)`,
        colors: [startColor, endColor]
      });
    }
    return gradients;
  };