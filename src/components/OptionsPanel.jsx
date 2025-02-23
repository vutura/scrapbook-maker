// src/components/OptionsPanel.jsx
import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute left-full ml-2 px-3 py-1 bg-white rounded shadow-lg text-sm whitespace-nowrap z-50">
          {text}
        </div>
      )}
    </div>
  );
};

const OptionsPanel = ({ 
  onUndo, 
  onRedo, 
  onClear, 
  onSave,
  onToggleGrid,
  showGrid,
  canUndo, 
  canRedo, 
  showPanel 
}) => {
  if (!showPanel) return null;

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2"
      style={{ zIndex: 900 }}
    >
      <Tooltip text="Undo last action (Ctrl+Z)">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`bg-white/70 backdrop-blur-sm px-4 py-3 rounded-r-lg shadow-md border border-l-0 border-gray-100
                     transition-all duration-300 flex items-center justify-center text-xl
                     ${canUndo 
                       ? 'hover:bg-white/90 hover:text-pink-600 cursor-pointer' 
                       : 'opacity-40 cursor-not-allowed'}`}
        >
          ↶
        </button>
      </Tooltip>

      <Tooltip text="Redo last action (Ctrl+Y)">
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`bg-white/70 backdrop-blur-sm px-4 py-3 rounded-r-lg shadow-md border border-l-0 border-gray-100
                     transition-all duration-300 flex items-center justify-center text-xl
                     ${canRedo 
                       ? 'hover:bg-white/90 hover:text-pink-600 cursor-pointer' 
                       : 'opacity-40 cursor-not-allowed'}`}
        >
          ↷
        </button>
      </Tooltip>

      <Tooltip text="Save your creation">
        <button
          onClick={onSave}
          className="bg-white/70 backdrop-blur-sm px-4 py-3 rounded-r-lg shadow-md border border-l-0 border-gray-100
                    hover:bg-white/90 hover:text-pink-600 transition-all duration-300 flex items-center justify-center text-xl"
        >
          💾
        </button>
      </Tooltip>

      <Tooltip text="Clear all stickers">
        <button
          onClick={onClear}
          className="bg-white/70 backdrop-blur-sm px-4 py-3 rounded-r-lg shadow-md border border-l-0 border-gray-100
                    hover:bg-white/90 hover:text-pink-600 transition-all duration-300 flex items-center justify-center text-xl"
        >
          ×
        </button>
      </Tooltip>

      <Tooltip text={showGrid ? "Hide alignment grid" : "Show alignment grid"}>
        <button
          onClick={onToggleGrid}
          className={`bg-white/70 backdrop-blur-sm px-4 py-3 rounded-r-lg shadow-md border border-l-0 border-gray-100
                     hover:bg-white/90 hover:text-pink-600 transition-all duration-300 flex items-center justify-center text-xl
                     ${showGrid ? 'text-pink-600' : ''}`}
        >
          #
        </button>
      </Tooltip>
    </div>
  );
};

export default OptionsPanel;