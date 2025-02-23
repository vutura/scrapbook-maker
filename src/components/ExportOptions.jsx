// src/components/ExportOptions.jsx
import React, { useState } from 'react';

const ExportOptions = ({ onExport }) => {
  const [settings, setSettings] = useState({
    width: 1400,
    height: 846,
    format: 'png',
    quality: 0.9,
    scale: 1
  });

  const presetSizes = [
    { name: 'Original', width: 1400, height: 846 },
    { name: 'Instagram', width: 1080, height: 1080 },
    { name: 'Twitter', width: 1200, height: 675 },
    { name: 'Facebook', width: 1200, height: 630 },
    { name: 'Pinterest', width: 1000, height: 1500 },
  ];

  const handlePresetSelect = (preset) => {
    setSettings(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }));
  };

  return (
    <div className="space-y-6">
      {/* Size Presets */}
      <div>
        <h3 className="font-serialb text-base mb-3 text-gray-700">Export Size</h3>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`px-4 py-2 rounded-full text-sm ${
                settings.width === preset.width && settings.height === preset.height
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Width (px)</label>
          <input
            type="number"
            value={settings.width}
            onChange={e => setSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 rounded border"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Height (px)</label>
          <input
            type="number"
            value={settings.height}
            onChange={e => setSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 rounded border"
          />
        </div>
      </div>

      {/* Quality Settings */}
      <div>
        <h3 className="font-serialb text-base mb-3 text-gray-700">Quality</h3>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.quality}
          onChange={e => setSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Lower quality</span>
          <span>Higher quality</span>
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <h3 className="font-serialb text-base mb-3 text-gray-700">Format</h3>
        <div className="flex gap-2">
          {['png', 'jpeg', 'webp'].map(format => (
            <button
              key={format}
              onClick={() => setSettings(prev => ({ ...prev, format }))}
              className={`px-4 py-2 rounded-full text-sm uppercase ${
                settings.format === format
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Options */}
      <div>
        <h3 className="font-serialb text-base mb-3 text-gray-700">Scale</h3>
        <div className="flex gap-2">
          {[0.5, 1, 2].map(scale => (
            <button
              key={scale}
              onClick={() => setSettings(prev => ({ ...prev, scale }))}
              className={`px-4 py-2 rounded-full text-sm ${
                settings.scale === scale
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {scale}x
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onExport(settings)}
        className="w-full bg-pink-500 text-white py-3 rounded-lg font-serialb
                 hover:bg-pink-600 transition-all duration-300"
      >
        Export
      </button>
    </div>
  );
};

export default ExportOptions;