// src/components/SaveModal.jsx
import React, { useState, useEffect } from 'react';
import { analyzeStickerColors } from '../utils/colorUtils';
import { generateRandomGradients } from '../utils/gradientGenerator';

const SaveModal = ({ onClose, generatePreview, placedStickers }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');
  const [showCustomColor, setShowCustomColor] = useState(false);

  // We'll load 6 random gradients for the UI
  const [randomGradients, setRandomGradients] = useState(() => generateRandomGradients(6));
  const [customGradientPreset, setCustomGradientPreset] = useState(null);

  // The user's chosen export settings
  const [settings, setSettings] = useState({
    backgroundType: 'gradient',
    background: '#FFE4E6',
    gradientStart: '#F4B185',
    gradientEnd: '#F9C846',
    gradientAngle: '45',
    quality: 'standard', // 'standard' or 'high'
    format: 'png'       // 'png' or 'jpeg'
  });

  // Re-generate random gradients when modal opens
  useEffect(() => {
    setRandomGradients(generateRandomGradients(7));
  }, []);

  // Example: analyzing sticker colors if you want to set a "From Your Creation" gradient
  useEffect(() => {
    const analyzeColors = async () => {
      if (placedStickers.length > 0) {
        try {
          console.log('Analyzing stickers:', placedStickers);
          const [startColor, endColor] = await analyzeStickerColors(placedStickers);
          console.log('Analyzed colors:', startColor, endColor);

          setCustomGradientPreset({
            name: 'From Your Creation',
            gradient: `linear-gradient(45deg, ${startColor} 0%, ${endColor} 100%)`,
            colors: [startColor, endColor]
          });

          setSettings((s) => ({
            ...s,
            gradientStart: startColor,
            gradientEnd: endColor
          }));
        } catch (err) {
          console.error('Error analyzing sticker colors:', err);
        }
      }
    };

    analyzeColors();
  }, [placedStickers]);

  // Every time settings change, re-generate the preview
  useEffect(() => {
    updatePreview();
  }, [settings]);

  const handleRefreshGradients = () => {
    setRandomGradients(generateRandomGradients(6));
  };

  const updatePreview = async () => {
    setIsLoading(true);
    try {
      const options = {
        ...settings,
        background:
          settings.backgroundType === 'gradient'
            ? `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientStart}, ${settings.gradientEnd})`
            : settings.background
      };
      const newPreview = await generatePreview(options); // WAIT for the data URL
      setPreviewUrl(newPreview);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const filename = `scrapbook-${new Date().toISOString().split('T')[0]}.${settings.format}`;
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handlePinterestShare = () => {
    if (!previewUrl) {
      alert('Please wait for the preview to generate before sharing to Pinterest.');
      return;
    }
    fetch(previewUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        const shareUrl =
          `https://pinterest.com/pin/create/button/` +
          `?url=${encodeURIComponent(window.location.href)}` +
          `&media=${encodeURIComponent(imageUrl)}` +
          `&description=${encodeURIComponent('My scrapbook creation')}`;

        window.open(
          shareUrl,
          'Share to Pinterest',
          'width=750,height=550,top=100,left=100,toolbar=0,location=0,menubar=0'
        );
        setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
      })
      .catch((err) => {
        console.error('Failed to share to Pinterest:', err);
        alert(
          'Sorry, there was an error sharing to Pinterest. Please try downloading and sharing manually.'
        );
      });
  };

  const handleCopyToClipboard = async () => {
    try {
      const blob = await fetch(previewUrl).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-[800px] rounded-2xl shadow-xl relative overflow-hidden">
        {/* Pink gradient line at the top */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200" />
        
        <div className="p-8">
          <h2 className="font-serialb text-2xl mb-6 text-pink-500 text-center">
            Save Your Creation
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Background Type Selection */}
              <div>
                <h3 className="font-serialb text-base mb-3 text-gray-700">Background</h3>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        backgroundType: 'gradient',
                        ...(customGradientPreset && {
                          gradientStart: customGradientPreset.colors[0],
                          gradientEnd: customGradientPreset.colors[1]
                        })
                      }))
                    }
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.backgroundType === 'gradient'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, backgroundType: 'solid' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.backgroundType === 'solid'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    Solid Color
                  </button>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, backgroundType: 'none' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.backgroundType === 'none'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    Transparent
                  </button>
                </div>

                {/* Solid Colors */}
                {settings.backgroundType === 'solid' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {['#FFE4E6','#E0F2FE','#DCF9E7','#FEF9C3','#F3E8FF'].map((colorVal) => (
                        <button
                          key={colorVal}
                          onClick={() => {
                            setSettings((s) => ({ ...s, background: colorVal }));
                            setShowCustomColor(false);
                          }}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            settings.background === colorVal && !showCustomColor
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: colorVal }}
                        />
                      ))}

                      {/* Custom color input */}
                      <button
                        className={`w-10 h-10 rounded-full border-2 transition-all
                          flex items-center justify-center text-xl relative
                          ${
                            showCustomColor
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-200 hover:scale-105'
                          }`}
                        title="Custom Color"
                        style={{ backgroundColor: settings.background }}
                      >
                        🎨
                        <input
                          type="color"
                          value={settings.background}
                          onChange={(e) => {
                            setSettings((s) => ({
                              ...s,
                              background: e.target.value
                            }));
                            setShowCustomColor(true);
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Gradient Options */}
                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-serialb text-sm text-gray-600">Choose Gradient</h4>
                      <button
                        onClick={handleRefreshGradients}
                        className="p-2 rounded-full hover:bg-pink-50 transition-colors text-xl"
                        title="Generate new gradients"
                      >
                        ↻
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* If we have a custom gradient from sticker analysis, show it first */}
                      {customGradientPreset && (
                        <button
                          onClick={() => {
                            setSettings((s) => ({
                              ...s,
                              gradientStart: customGradientPreset.colors[0],
                              gradientEnd: customGradientPreset.colors[1],
                              gradientAngle: '45'
                            }));
                          }}
                          className="h-12 rounded-lg border-2 border-pink-300 
                            transition-all hover:scale-[1.02] relative"
                          style={{ background: customGradientPreset.gradient }}
                        >
                          <span
                            className="absolute -top-2 left-1.5 text-xs bg-pink-100 
                              px-2 py-0.5 rounded-full text-pink-800 font-serialb"
                          >
                            Colors From Your Creation
                          </span>
                        </button>
                      )}
                      {/* Display random generated gradients */}
                      {randomGradients.map((gradient, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSettings((s) => ({
                              ...s,
                              gradientStart: gradient.colors[0],
                              gradientEnd: gradient.colors[1],
                              gradientAngle:
                                gradient.gradient.match(/\d+/)?.[0] || '45'
                            }));
                          }}
                          className="h-12 rounded-lg border-2 border-gray-200 hover:border-pink-200 
                            transition-all hover:scale-[1.02]"
                          style={{ background: gradient.gradient }}
                        />
                      ))}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-serialb text-sm mb-2 text-gray-600">
                        Custom Gradient
                      </h4>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={settings.gradientStart}
                            onChange={(e) =>
                              setSettings((s) => ({
                                ...s,
                                gradientStart: e.target.value
                              }))
                            }
                            className="w-12 h-8 rounded cursor-pointer"
                            title="Start Color"
                          />
                          <input
                            type="color"
                            value={settings.gradientEnd}
                            onChange={(e) =>
                              setSettings((s) => ({
                                ...s,
                                gradientEnd: e.target.value
                              }))
                            }
                            className="w-12 h-8 rounded cursor-pointer"
                            title="End Color"
                          />
                          <select
                            value={settings.gradientAngle}
                            onChange={(e) =>
                              setSettings((s) => ({
                                ...s,
                                gradientAngle: e.target.value
                              }))
                            }
                            className="flex-1 rounded border px-2 text-sm"
                          >
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                              <option key={angle} value={angle}>
                                {angle}°
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Selection */}
              <div>
                <h3 className="font-serialb text-base mb-3 text-gray-700">Quality</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings((s) => ({ ...s, quality: 'standard' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.quality === 'standard'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, quality: 'high' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.quality === 'high'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    High Quality
                  </button>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <h3 className="font-serialb text-base mb-3 text-gray-700">Format</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings((s) => ({ ...s, format: 'png' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.format === 'png'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, format: 'jpeg' }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      settings.format === 'jpeg'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    JPEG
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview and Share */}
            <div>
              {/* Preview Area */}
              <div
                className={`rounded-xl p-4 mb-4 ${
                  settings.backgroundType === 'none'
                    ? 'bg-[url("/checkered-bg.png")]'
                    : ''
                }`}
                style={{
                  background:
                    settings.backgroundType === 'gradient'
                      ? `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientStart}, ${settings.gradientEnd})`
                      : settings.backgroundType === 'solid'
                      ? settings.background
                      : undefined
                }}
              >
                <div className="aspect-[1.65/1] rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Generating preview...
                    </div>
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Preview not available
                    </div>
                  )}
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-4">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="bg-pink-500 text-white p-4 rounded-xl font-serialb
                      hover:bg-pink-600 transition-all duration-300
                      shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                      flex flex-col items-center gap-1.5"
                  >
                    <span className="text-2xl">💾</span>
                    <span>Save to Device</span>
                  </button>

                  <button
                    onClick={handleCopyToClipboard}
                    className="bg-white p-4 rounded-xl font-serialb border border-gray-200
                      hover:bg-gray-50 transition-all duration-300
                      shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                      flex flex-col items-center gap-1.5 relative"
                  >
                    <span className="text-2xl">📋</span>
                    <span className="text-gray-700">Copy to Clipboard</span>
                    {copyStatus && (
                      <span
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 
                          text-xs text-pink-500 font-serialb whitespace-nowrap"
                      >
                        {copyStatus}
                      </span>
                    )}
                  </button>
                </div>

                {/* Social Sharing Options */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-serialb text-sm text-gray-600 mb-3 text-center">
                    Share with Others
                  </h4>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        name: 'Facebook',
                        icon: '📘',
                        action: () =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href
                            )}`,
                            '_blank'
                          )
                      },
                      {
                        name: 'Twitter',
                        icon: '🐦',
                        action: () =>
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                              window.location.href
                            )}&text=⋆ check out my scrapbook creation ! ⋆˚꩜｡`,
                            '_blank'
                          )
                      },
                      { name: 'Pinterest', icon: '📌', action: handlePinterestShare },
                      {
                        name: 'Instagram',
                        icon: '📸',
                        action: () =>
                          alert('Save the image and share it on Instagram!')
                      }
                    ].map((platform) => (
                      <button
                        key={platform.name}
                        onClick={platform.action}
                        className="p-2 rounded-lg hover:bg-white transition-all duration-300
                          flex flex-col items-center gap-1 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          {platform.icon}
                        </span>
                        <span className="text-xs text-gray-600">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File info */}
                <div className="bg-gray-50/70 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">
                    Your creation will be exported as a{' '}
                    <span className="font-serialb">
                      {settings.format.toUpperCase()}
                    </span>
                    {settings.quality === 'high' ? ' in high quality' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-gray-300 font-serialb
                hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
