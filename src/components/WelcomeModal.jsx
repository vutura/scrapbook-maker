// src/components/WelcomeModal.jsx
import React, { useState } from 'react';

const ShortcutKey = ({ children }) => (
  <span className="bg-pink-50 px-2 py-0.5 rounded text-sm text-pink-600 border border-pink-100">
    {children}
  </span>
);

const WelcomeModal = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('neverShowWelcome', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-[720px] rounded-2xl shadow-xl relative overflow-hidden">
        {/* Pink gradient line at the top */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200" />
        
        {/* Content container with custom scrollbar */}
        <div 
          className="p-8 max-h-[80vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#F9A8D4 #FFF1F2'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-serialb text-2xl mb-2 text-pink-500">
              Welcome to Scrapbook Maker!
            </h2>
            <p className="font-serialt text-gray-600">
            Create, customize, and cherish your own virtual scrapbook! ✨
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {/* Getting Started */}
            <div className="bg-pink-50/70 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 font-serialb">
                  1
                </span>
                <div>
                  <h3 className="font-serialb text-base mb-2 text-pink-600">Getting Started</h3>
                  <p className="font-serialt text-gray-600 leading-relaxed">
                    Open the sticker panel by clicking the arrow on the right side 
                    of your screen. You'll find a collection of stickers ready to 
                    bring your scrapbook to life.
                  </p>
                </div>
              </div>
            </div>

            {/* Working with Stickers */}
            <div className="bg-pink-50/70 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 font-serialb">
                  2
                </span>
                <div>
                  <h3 className="font-serialb text-base mb-2 text-pink-600">Working with Stickers</h3>
                  <div className="space-y-2">
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Placing:</span> Simply drag any sticker from the panel onto your canvas
                    </p>
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Transforming:</span> Click a sticker to reveal its controls
                    </p>
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Resizing:</span> Use the corner handles to adjust the size
                    </p>
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Rotating:</span> Use the outer corner points to rotate
                    </p>
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Moving:</span> Click and drag to reposition
                    </p>
                    <p className="font-serialt text-gray-600">
                      <span className="font-serialb">Canvas buttons:</span> After placing a sticker, control buttons will appear on the left side of your screen. These buttons allow you to undo and redo actions, save your project, clear the canvas, or toggle the grid.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-pink-50/70 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 font-serialb">
                  3
                </span>
                <div>
                  <h3 className="font-serialb text-base mb-2 text-pink-600">Keyboard Shortcuts</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serialt text-gray-600">Undo last action</span>
                      <div className="flex items-center gap-1">
                        <ShortcutKey>Ctrl</ShortcutKey>
                        <span>+</span>
                        <ShortcutKey>Z</ShortcutKey>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serialt text-gray-600">Redo last action</span>
                      <div className="flex items-center gap-1">
                        <ShortcutKey>Ctrl</ShortcutKey>
                        <span>+</span>
                        <ShortcutKey>Y</ShortcutKey>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serialt text-gray-600">Move layer forward</span>
                      <div className="flex items-center gap-1">
                        <ShortcutKey>Ctrl</ShortcutKey>
                        <span>+</span>
                        <ShortcutKey>]</ShortcutKey>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serialt text-gray-600">Move layer backward</span>
                      <div className="flex items-center gap-1">
                        <ShortcutKey>Ctrl</ShortcutKey>
                        <span>+</span>
                        <ShortcutKey>&#91;</ShortcutKey>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serialt text-gray-600">Delete selected sticker</span>
                      <ShortcutKey>Delete</ShortcutKey>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Note: On Mac, use <ShortcutKey>⌘</ShortcutKey> instead of <ShortcutKey>Ctrl</ShortcutKey>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with checkbox and button */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Don't show again checkbox */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-pink-500 
                         focus:ring-pink-500 focus:ring-offset-0
                         cursor-pointer"
              />
              Don't show this again
            </label>

            {/* Start button */}
            <button
              onClick={handleClose}
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-serialb
                       hover:bg-pink-600 transition-all duration-300
                       shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;