import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DragPreview = () => {
  const [previewData, setPreviewData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleDragStart(e) {
      try {
        const stickerData = JSON.parse(e.dataTransfer.getData('application/json'));
        setPreviewData(stickerData);
      } catch (err) {
        console.error('Invalid sticker data');
      }
    }

    function handleDrag(e) {
      if (e.clientX === 0 && e.clientY === 0) return; 
      setPosition({
        x: e.clientX - 50,
        y: e.clientY - 50
      });
    }

    function handleDragEnd() {
      setPreviewData(null);
    }

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drag', handleDrag);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drag', handleDrag);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  if (!previewData) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '100px',
        height: '100px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img
        src={previewData.src}
        alt={previewData.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 0.8,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      />
    </div>,
    document.body
  );
};

export default DragPreview;