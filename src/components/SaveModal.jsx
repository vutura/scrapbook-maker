// src/components/SaveModal.jsx
import React, { useState, useEffect } from 'react';
import ShareInstructionsModal from './ShareInstructionsModal';
import { analyzeStickerColors } from '../utils/colorUtils';
import { generateRandomGradients } from '../utils/gradientGenerator';

const SaveModal = ({ onClose, generatePreview, placedStickers }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [randomGradients, setRandomGradients] = useState(() => generateRandomGradients(6));
  const [customGradientPreset, setCustomGradientPreset] = useState(null);

  // Export settings
  const [settings, setSettings] = useState({
    backgroundType: 'gradient', // 'gradient' | 'solid' | 'none'
    background: '#FFE4E6',
    gradientStart: '#F4B185',
    gradientEnd: '#F9C846',
    gradientAngle: '45',
    quality: 'standard', // 'standard' | 'high'
    format: 'png'        // 'png' | 'jpeg'
  });

  const [showTwitterInstructions, setShowTwitterInstructions] = useState(false);
  const [showPinterestInstructions, setShowPinterestInstructions] = useState(false);
  const [showInstagramInstructions, setShowInstagramInstructions] = useState(false);

  useEffect(() => {
    setRandomGradients(generateRandomGradients(7));
  }, []);

  useEffect(() => {
    const analyzeColors = async () => {
      if (placedStickers.length === 0) return;
      try {
        const [startColor, endColor] = await analyzeStickerColors(placedStickers);
        setCustomGradientPreset({
          name: 'From Your Creation',
          gradient: `linear-gradient(45deg, ${startColor} 0%, ${endColor} 100%)`,
          colors: [startColor, endColor]
        });
        setSettings(s => ({
          ...s,
          gradientStart: startColor,
          gradientEnd: endColor
        }));
      } catch (err) {
        console.error('Error analyzing sticker colors:', err);
      }
    };
    analyzeColors();
  }, [placedStickers]);

  useEffect(() => {
    updatePreview();

  }, [settings]);

  const handleRefreshGradients = () => {
    setRandomGradients(generateRandomGradients(7));
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
      const dataUrl = await generatePreview(options);
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Error generating preview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    try {
      const filename = `scrapbook-${new Date().toISOString().split('T')[0]}.${settings.format}`;
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!previewUrl) return;
    try {
      const blob = await fetch(previewUrl).then(r => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleTwitterClick = () => {
    if (!previewUrl) {
      alert('Please wait for the preview to generate before sharing to Twitter.');
      return;
    }
    setShowTwitterInstructions(true);
  };
  const handlePinterestClick = () => {
    if (!previewUrl) {
      alert('Please wait for the preview to generate before sharing to Pinterest.');
      return;
    }
    setShowPinterestInstructions(true);
  };
  const handleInstagramClick = () => {
    if (!previewUrl) {
      alert('Please wait for the preview to generate before sharing to Instagram.');
      return;
    }
    setShowInstagramInstructions(true);
  };

  const proceedToTwitter = () => {
    const shareUrl =
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}` +
      `&text=${encodeURIComponent('⋆ check out my scrapbook creation ! ⋆˚꩜｡')}`;
    window.open(shareUrl, '_blank');
    setShowTwitterInstructions(false);
  };
  // Pinterest & Instagram have no auto-redirect: user needs to go to site manually to post their creation

  return (
    <>
      {/* ===== Main Save Modal ===== */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-white w-[800px] rounded-2xl shadow-xl relative overflow-hidden">
          {/* Top gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200" />
          <div className="p-8">
            <h2 className="font-serialb text-2xl mb-6 text-pink-500 text-center">
              Save Your Creation
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* === Left Column: Export Settings === */}
              <div className="space-y-6">
                {/* Background Type */}
                <div>
                  <h3 className="font-serialb text-base mb-3 text-gray-700">Background</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() =>
                        setSettings(s => ({
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
                      onClick={() => setSettings(s => ({ ...s, backgroundType: 'solid' }))}
                      className={`px-4 py-2 rounded-full text-sm ${
                        settings.backgroundType === 'solid'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      Solid Color
                    </button>
                    <button
                      onClick={() => setSettings(s => ({ ...s, backgroundType: 'none' }))}
                      className={`px-4 py-2 rounded-full text-sm ${
                        settings.backgroundType === 'none'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      Transparent
                    </button>
                  </div>

                  {/* Solid Color Options */}
                  {settings.backgroundType === 'solid' && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {['#FFE4E6','#E0F2FE','#DCF9E7','#FEF9C3','#F3E8FF'].map(color => (
                          <button
                            key={color}
                            onClick={() => {
                              setSettings(s => ({ ...s, background: color }));
                              setShowCustomColor(false);
                            }}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              settings.background === color && !showCustomColor
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {/* Custom Color Picker */}
                        <button
                          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-xl relative ${
                            showCustomColor ? 'border-gray-800 scale-110' : 'border-gray-200 hover:scale-105'
                          }`}
                          title="Custom Color"
                          style={{ backgroundColor: settings.background }}
                        >
                          🎨
                          <input
                            type="color"
                            value={settings.background}
                            onChange={e => {
                              setSettings(s => ({ ...s, background: e.target.value }));
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
                        {/* Custom-from-creation preset */}
                        {customGradientPreset && (
                          <button
                            onClick={() =>
                              setSettings(s => ({
                                ...s,
                                gradientStart: customGradientPreset.colors[0],
                                gradientEnd: customGradientPreset.colors[1],
                                gradientAngle: '45'
                              }))
                            }
                            className="h-12 rounded-lg border-2 border-pink-300 transition-all hover:scale-[1.02] relative"
                            style={{ background: customGradientPreset.gradient }}
                          >
                            <span className="absolute -top-2 left-1.5 text-xs bg-pink-100 px-2 py-0.5 rounded-full text-pink-800 font-serialb">
                              Colors From Your Creation
                            </span>
                          </button>
                        )}
                        {/* Random gradients */}
                        {randomGradients.map((grad, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              setSettings(s => ({
                                ...s,
                                gradientStart: grad.colors[0],
                                gradientEnd: grad.colors[1],
                                gradientAngle: grad.gradient.match(/\d+/)?.[0] || '45'
                              }))
                            }
                            className="h-12 rounded-lg border-2 border-gray-200 hover:border-pink-200 transition-all hover:scale-[1.02]"
                            style={{ background: grad.gradient }}
                          />
                        ))}
                      </div>

                      {/* Manual gradient inputs */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-serialb text-sm mb-2 text-gray-600">Custom Gradient</h4>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={settings.gradientStart}
                              onChange={e => setSettings(s => ({ ...s, gradientStart: e.target.value }))}
                              className="w-12 h-8 rounded cursor-pointer"
                              title="Start Color"
                            />
                            <input
                              type="color"
                              value={settings.gradientEnd}
                              onChange={e => setSettings(s => ({ ...s, gradientEnd: e.target.value }))}
                              className="w-12 h-8 rounded cursor-pointer"
                              title="End Color"
                            />
                            <select
                              value={settings.gradientAngle}
                              onChange={e => setSettings(s => ({ ...s, gradientAngle: e.target.value }))}
                              className="flex-1 rounded border px-2 text-sm"
                            >
                              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
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
                      onClick={() => setSettings(s => ({ ...s, quality: 'standard' }))}
                      className={`px-4 py-2 rounded-full text-sm ${
                        settings.quality === 'standard'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setSettings(s => ({ ...s, quality: 'high' }))}
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
                      onClick={() => setSettings(s => ({ ...s, format: 'png' }))}
                      className={`px-4 py-2 rounded-full text-sm ${
                        settings.format === 'png'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => setSettings(s => ({ ...s, format: 'jpeg' }))}
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

              {/* === Preview & Sharing === */}
              <div>
                <div
                  className={`rounded-xl p-4 mb-4 ${
                    settings.backgroundType === 'none' ? 'bg-[url("/checkered-bg.png")]' : ''
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
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Preview not available
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {/* Download & Copy */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownload}
                      className="bg-pink-500 text-white p-4 rounded-xl font-serialb hover:bg-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex flex-col items-center gap-1.5"
                    >
                      <span className="text-2xl">💾</span>
                      <span>Save to Device</span>
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      className="bg-white p-4 rounded-xl font-serialb border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex flex-col items-center gap-1.5 relative"
                    >
                      <span className="text-2xl">📋</span>
                      <span className="text-gray-700">Copy to Clipboard</span>
                      {copyStatus && (
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-pink-500 font-serialb whitespace-nowrap">
                          {copyStatus}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Social Sharing */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-serialb text-sm text-gray-600 mb-3 text-center">
                      Share with Others
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleTwitterClick}
                        className="p-2 rounded-lg hover:bg-white transition-all duration-300 flex flex-col items-center gap-1 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          🐦
                        </span>
                        <span className="text-xs text-gray-600">Twitter</span>
                      </button>
                      <button
                        onClick={handlePinterestClick}
                        className="p-2 rounded-lg hover:bg-white transition-all duration-300 flex flex-col items-center gap-1 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          📌
                        </span>
                        <span className="text-xs text-gray-600">Pinterest</span>
                      </button>
                      <button
                        onClick={handleInstagramClick}
                        className="p-2 rounded-lg hover:bg-white transition-all duration-300 flex flex-col items-center gap-1 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                          📸
                        </span>
                        <span className="text-xs text-gray-600">Instagram</span>
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="bg-gray-50/70 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">
                      Your creation will be exported as a{' '}
                      <span className="font-serialb">{settings.format.toUpperCase()}</span>
                      {settings.quality === 'high' ? ' in high quality' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full border border-gray-300 font-serialb hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Share Instructions Modals ===== */}
      {showTwitterInstructions && (
        <ShareInstructionsModal
          title="How to Share on Twitter"
          instructions={`To share on Twitter, first download your image or click "Copy to Clipboard", then attach your creation in the auto-generated tweet! (˶˃ ᵕ ˂˶) .ᐟ.ᐟ`}
          onCancel={() => setShowTwitterInstructions(false)}
          onContinue={proceedToTwitter}
        />
      )}
      {showPinterestInstructions && (
        <ShareInstructionsModal
          title="How to Share on Pinterest"
          instructions={`To share on Pinterest, first download your image or click "Copy to Clipboard", then go to Pinterest.com and upload your creation there! (˶˃ ᵕ ˂˶) .ᐟ.ᐟ`}
          onCancel={() => setShowPinterestInstructions(false)}
        />
      )}
      {showInstagramInstructions && (
        <ShareInstructionsModal
          title="How to Share on Instagram"
          instructions={`To share on Instagram, first download your image or click "Copy to Clipboard", then go to Instagram.com and upload your creation there! (˶˃ ᵕ ˂˶) .ᐟ.ᐟ`}
          onCancel={() => setShowInstagramInstructions(false)}
        />
      )}
    </>
  );
};

export default SaveModal;
