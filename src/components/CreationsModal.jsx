// src/components/CreationsModal.jsx
import React from 'react';

const CreationsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-[90vw] sm:max-w-[400px] rounded-2xl shadow-xl relative overflow-hidden">
        {/* Pink gradient line at the top */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200" />
        
        <div className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div className="text-center space-y-4">
            <h2 className="font-serialb text-2xl text-pink-500">Creations</h2>
            <p className="font-serialt text-gray-600 text-lg">
              Coming soon!! ✨
            </p>
            <p className="font-serialt text-gray-500 text-sm">
              Save and browse your creations feature is on its way~
            </p>
          </div>

          {/* Close button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="font-serialb px-6 py-2 rounded-full border border-gray-300
                       hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationsModal;