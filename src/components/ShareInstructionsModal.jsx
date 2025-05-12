// src/components/ShareInstructionsModal.jsx
import React from 'react';

const ShareInstructionsModal = ({ title, instructions, onCancel, onContinue }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
    <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">
      <h3 className="font-serialb text-lg mb-4">{title}</h3>
      <p className="text-sm mb-6">{instructions}</p>
      <div className="flex justify-end gap-2">
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
);

export default ShareInstructionsModal;
