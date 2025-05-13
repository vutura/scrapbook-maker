// src/utils/colorUtils.js

export const getImageColors = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          const colors = new Map();
          
          for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            
            if (a < 200 || (r > 250 && g > 250 && b > 250)) continue;
            
            const quantizedColor = quantizeColor(r, g, b);
            colors.set(quantizedColor, (colors.get(quantizedColor) || 0) + 1);
          }
          
          const sortedColors = Array.from(colors.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([color]) => color)
            .filter(color => color !== '#FFFFFF');
          
          resolve(sortedColors.slice(0, 2));
        } catch (error) {
          console.error('Error processing image:', error);
          reject(error);
        }
      };
  
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageUrl;
    });
  };
  
  const quantizeColor = (r, g, b) => {
    const step = 32;
    r = Math.round(r / step) * step;
    g = Math.round(g / step) * step;
    b = Math.round(b / step) * step;
    return rgbToHex(r, g, b);
  };
  
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.min(255, Math.max(0, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  export const analyzeStickerColors = async (stickers) => {
    try {
      if (!stickers || stickers.length === 0) {
        return ['#FFE4E6', '#F9A8D4'];
      }
  
      console.log('Processing stickers:', stickers.map(s => s.sticker.src));
  
      const colorPromises = stickers.map(sticker => 
        getImageColors(sticker.sticker.src).catch(error => {
          console.error('Error processing sticker:', error);
          return null;
        })
      );
  
      const allColors = await Promise.all(colorPromises);
      
      const validColors = allColors
        .filter(colors => colors !== null && colors.length > 0)
        .flat()
        .filter(color => color && color !== '#FFFFFF'); 
  
      console.log('Found colors:', validColors);
  
      return [
        validColors[0] || '#F4B185', 
        validColors[1] || '#F9C846' 
      ];
    } catch (error) {
      console.error('Error analyzing sticker colors:', error);
      return ['#F4B185', '#F9C846']; 
    }
  };