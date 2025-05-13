// src/components/ShareInstructionsModal.jsx
import React from 'react';

const ShareInstructionsModal = ({ title, instructions, onCancel, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <div className="bg-white w-full max-w-[90vw] sm:max-w-[400px] mx-4 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="font-serialb text-lg mb-4">{title}</h3>
          <p className="text-sm text-gray-700 mb-6">{instructions}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            {onContinue && (
              <button
                onClick={onContinue}
                className="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareInstructionsModal;
