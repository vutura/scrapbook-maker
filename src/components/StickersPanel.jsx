// src/components/StickersPanel.jsx
import { useState, useEffect, useMemo } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { stickersConfig } from '../config/stickers';
import { filterStickers, enhanceSticker } from '../utils/search';
import { useErrorHandling } from '../hooks/useOptimizedRendering';


const StickersPanel = () => {
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addError, addNotification } = useErrorHandling();

  // Filtered stickers based on search and category
  const filteredStickers = useMemo(() => {
    let stickers = [];

    try {
      if (selectedCategory === 'all') {
        stickers = stickersConfig.categories.flatMap((cat) => cat.stickers);
      } else {
        const category = stickersConfig.categories.find(
          (cat) => cat.id === selectedCategory
        );
        stickers = category ? category.stickers : [];
      }

      if (searchTerm) {
        stickers = stickers.filter((sticker) =>
          sticker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sticker.alt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return stickers;
    } catch (error) {
      addError(new Error('Error filtering stickers'));
      return [];
    }
  }, [selectedCategory, searchTerm, addError]);

  const handlePanelToggle = () => {
    if (!isPanelVisible) {
      setIsPanelVisible(true);
    } else if (!isPanelExpanded) {
      setIsPanelExpanded(true);
    } else {
      setIsPanelExpanded(false);
      setIsPanelVisible(false);
    }
  };

  const getArrowRotation = () => {
    if (!isPanelVisible) {
      return 'rotate-180';
    } else if (isPanelExpanded) {
      return '';
    } else {
      return 'rotate-180';
    }
  };

  const handleStickerDragStart = (e, sticker) => {
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(sticker));
      
      // Set custom drag image
      const img = new Image();
      img.src = sticker.src;
      e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
      
      addNotification('Drag sticker to canvas', 'info');
    } catch (error) {
      addError(new Error('Failed to start drag'));
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full flex items-center stickers-panel" style={{ zIndex: 9999 }}>
      {/* Toggle Button */}
      <button
        onClick={handlePanelToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm 
                   px-3 py-6 rounded-l-lg shadow-md border border-r-0 border-gray-100
                   hover:bg-white/90 transition-all duration-300"
        style={{
          right: isPanelVisible ? (isPanelExpanded ? '480px' : '320px') : '0',
          zIndex: 10000, // Increased from 900
        }}
        aria-label={isPanelVisible ? 'Adjust stickers panel' : 'Show stickers panel'}
      >
        <span
          className={`transform transition-transform duration-300 block ${getArrowRotation()}`}
        >
          →
        </span>
      </button>
  
      {/* Panel Container */}
      <div
        className={`h-[90vh] bg-white/70 backdrop-blur-md rounded-l-2xl 
                    shadow-lg border border-r-0 border-gray-100
                    transition-all duration-300 ease-in-out
                    ${isPanelExpanded ? 'w-[480px]' : 'w-80'}
                    ${isPanelVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ zIndex: 9999 }}
      >
        <div className="h-full flex flex-col p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stickers..."
              className="w-full px-4 py-2 rounded-full bg-white/80 border border-gray-100
                       focus:outline-none focus:ring-2 focus:ring-pink-100
                       placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap
                        transition-colors duration-200 flex-shrink-0
                        ${selectedCategory === 'all'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-white/80 hover:bg-pink-50'
                        }`}
            >
              All Stickers
            </button>
            {stickersConfig.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1 rounded-full text-sm whitespace-nowrap
                          transition-colors duration-200 flex-shrink-0
                          ${selectedCategory === category.id
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-white/80 hover:bg-pink-50'
                          }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Stickers Grid */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div
              className={`grid gap-4 p-1 ${
                isPanelExpanded ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              {filteredStickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="aspect-square bg-white/60 rounded-lg p-2
                             hover:shadow-md hover:bg-white/80 hover:-translate-y-0.5
                             transition-all duration-200"
                  draggable="true"
                  onDragStart={(e) => handleStickerDragStart(e, sticker)}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.alt}
                    className="w-full h-full object-contain select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredStickers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No stickers found for your search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickersPanel;