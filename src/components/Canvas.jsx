// src/components/Canvas.jsx
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import PlacedSticker from './PlacedSticker';
import OptionsPanel from './OptionsPanel';
import SaveModal from './SaveModal';
import Grid from './Grid';
import { useCommandHistory } from '../hooks/useCommandHistory';
import { useCanvasOptimization, useErrorHandling } from '../hooks/useOptimizedRendering';
import { MoveStickerCommand, RotateStickerCommand, ResizeStickerCommand } from '../commands/StickerCommands';
import { snapToGrid, snapPositionToGrid } from '../utils/gridUtils';
import sketchbookBase from '../assets/images/sketchbook_base.png';

const Canvas = ({ activeStickerId, setActiveStickerId }) => {
  const [placedStickers, setPlacedStickers] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);

  // We'll use our own local 'isGeneratingPreview' to reflect the async states
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const canvasRef = useRef(null);
  const previewTimeout = useRef(null);

  const { executeCommand, undo, redo, canUndo, canRedo } = useCommandHistory();
  const { scheduleUpdate } = useCanvasOptimization();
  const { addError, addNotification } = useErrorHandling();

  const handleClearCanvas = () => {
    setPlacedStickers([]);
    setActiveStickerId(null);
    addNotification('Canvas cleared', 'info');
  };

  const generatePreview = async (options) => {
    try {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return null;

      setIsGeneratingPreview(true);
      if (previewTimeout.current) {
        clearTimeout(previewTimeout.current);
      }

      return await new Promise((resolve, reject) => {
        previewTimeout.current = setTimeout(async () => {
          try {

            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.left = '-9999px';
            wrapper.style.top = '-9999px';
            wrapper.style.width = canvasElement.offsetWidth + 'px';
            wrapper.style.height = canvasElement.offsetHeight + 'px';

            if (options.backgroundType === 'gradient') {
              wrapper.style.background = options.background; // already linear-gradient(...)
            } else if (options.backgroundType === 'solid') {
              wrapper.style.backgroundColor = options.background;
            }

            const clone = canvasElement.cloneNode(true);
            wrapper.appendChild(clone);
            document.body.appendChild(wrapper);

            const html2canvasOptions = {
              backgroundColor: options.backgroundType === 'none' ? null : null, 
              scale: options.quality === 'high' ? 2 : 1,
              useCORS: true,
              allowTaint: true,
              logging: false,
              foreignObjectRendering: false,
              removeContainer: true
            };

            const canvas = await html2canvas(wrapper, html2canvasOptions);
            document.body.removeChild(wrapper);

            const dataUrl =
              options.format === 'jpeg'
                ? canvas.toDataURL('image/jpeg', 0.9)
                : canvas.toDataURL('image/png');

            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        }, 300); // 300ms debounce
      });

    } catch (error) {
      addError(new Error('Failed to generate preview'));
      console.error('Error generating preview:', error);
      throw error;
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const stickerData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!stickerData || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const stickerId = Date.now().toString();

      // Create a temporary image to get natural dimensions
      const img = new Image();
      img.onload = () => {
        const finalWidth = img.naturalWidth;
        const finalHeight = img.naturalHeight;

        const x = showGrid
          ? snapToGrid(e.clientX - canvasRect.left - finalWidth / 2, gridSize)
          : e.clientX - canvasRect.left - finalWidth / 2;

        const y = showGrid
          ? snapToGrid(e.clientY - canvasRect.top - finalHeight / 2, gridSize)
          : e.clientY - canvasRect.top - finalHeight / 2;

        const initialSticker = {
          id: stickerId,
          sticker: stickerData,
          position: {
            id: stickerId,
            x,
            y,
            width: finalWidth,
            height: finalHeight,
            rotation: 0,
            opacity: 1,
            zIndex: placedStickers.length + 1
          }
        };

        setPlacedStickers((prev) => [...prev, initialSticker]);
        setActiveStickerId(stickerId);
        addNotification('Sticker added successfully', 'success');
      };

      img.src = stickerData.src;
    } catch (error) {
      addError(new Error('Failed to add sticker'));
      console.error('Error handling sticker drop:', error);
    }
  };

  const deleteSticker = (id) => {
    setPlacedStickers((stickers) =>
      stickers.filter((sticker) => sticker.position.id !== id)
    );
    setActiveStickerId(null);
    addNotification('Sticker deleted', 'info');
  };

  const updateStickerPosition = (id, newPosition) => {
    const currentSticker = placedStickers.find(
      (sticker) => sticker.position.id === id
    );
    if (!currentSticker) return;

    let command;
    if ('x' in newPosition || 'y' in newPosition) {
      // Move
      const snappedPosition = showGrid
        ? snapPositionToGrid(newPosition, gridSize)
        : newPosition;

      command = new MoveStickerCommand(
        id,
        { x: currentSticker.position.x, y: currentSticker.position.y },
        {
          x: snappedPosition.x ?? currentSticker.position.x,
          y: snappedPosition.y ?? currentSticker.position.y
        },
        (theId, pos) => {
          setPlacedStickers((stickers) =>
            stickers.map((st) =>
              st.position.id === theId
                ? { ...st, position: { ...st.position, ...pos } }
                : st
            )
          );
        }
      );
    } else if ('rotation' in newPosition) {
      // Rotate
      command = new RotateStickerCommand(
        id,
        currentSticker.position.rotation,
        newPosition.rotation,
        (theId, pos) => {
          setPlacedStickers((stickers) =>
            stickers.map((st) =>
              st.position.id === theId
                ? { ...st, position: { ...st.position, ...pos } }
                : st
            )
          );
        }
      );
    } else if ('width' in newPosition || 'height' in newPosition) {
      // Resize
      command = new ResizeStickerCommand(
        id,
        { width: currentSticker.position.width, height: currentSticker.position.height },
        {
          width: newPosition.width ?? currentSticker.position.width,
          height: newPosition.height ?? currentSticker.position.height
        },
        (theId, pos) => {
          setPlacedStickers((stickers) =>
            stickers.map((st) =>
              st.position.id === theId
                ? { ...st, position: { ...st.position, ...pos } }
                : st
            )
          );
        }
      );
    } else {
      // Direct update
      setPlacedStickers((stickers) =>
        stickers.map((st) =>
          st.position.id === id
            ? { ...st, position: { ...st.position, ...newPosition } }
            : st
        )
      );
    }

    if (command) {
      executeCommand(command);
    }
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleZIndexChange = (stickerId, direction) => {
    setPlacedStickers((stickers) => {
      const newStickers = [...stickers];
      const currentIndex = newStickers.findIndex(
        (s) => s.position.id === stickerId
      );
      if (currentIndex === -1) return stickers;

      if (direction === 'forward' && currentIndex < newStickers.length - 1) {
        // Swap forward
        const nextSticker = newStickers[currentIndex + 1];
        const currentZIndex = newStickers[currentIndex].position.zIndex;
        const nextZIndex = nextSticker.position.zIndex;

        newStickers[currentIndex] = {
          ...newStickers[currentIndex],
          position: { ...newStickers[currentIndex].position, zIndex: nextZIndex }
        };
        newStickers[currentIndex + 1] = {
          ...newStickers[currentIndex + 1],
          position: { ...newStickers[currentIndex + 1].position, zIndex: currentZIndex }
        };

        [newStickers[currentIndex], newStickers[currentIndex + 1]] = [
          newStickers[currentIndex + 1],
          newStickers[currentIndex]
        ];
      } else if (direction === 'backward' && currentIndex > 0) {
        // Swap backward
        const prevSticker = newStickers[currentIndex - 1];
        const currentZIndex = newStickers[currentIndex].position.zIndex;
        const prevZIndex = prevSticker.position.zIndex;

        newStickers[currentIndex] = {
          ...newStickers[currentIndex],
          position: { ...newStickers[currentIndex].position, zIndex: prevZIndex }
        };
        newStickers[currentIndex - 1] = {
          ...newStickers[currentIndex - 1],
          position: { ...newStickers[currentIndex - 1].position, zIndex: currentZIndex }
        };

        [newStickers[currentIndex], newStickers[currentIndex - 1]] = [
          newStickers[currentIndex - 1],
          newStickers[currentIndex]
        ];
      }
      return newStickers;
    });
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.key === 'Delete' && activeStickerId) {
        deleteSticker(activeStickerId);
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (!e.shiftKey) {
              undo();
              e.preventDefault();
            }
            break;
          case 'y':
            redo();
            e.preventDefault();
            break;
          case '[':
            if (activeStickerId) {
              handleZIndexChange(activeStickerId, 'backward');
            }
            e.preventDefault();
            break;
          case ']':
            if (activeStickerId) {
              handleZIndexChange(activeStickerId, 'forward');
            }
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [activeStickerId, undo, redo]);

  return (
    <div className="relative">
      <OptionsPanel
        onUndo={undo}
        onRedo={redo}
        onClear={handleClearCanvas}
        onSave={handleSave}
        onToggleGrid={() => setShowGrid((prev) => !prev)}
        showGrid={showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        showPanel={placedStickers.length > 0}
      />

      <div
        ref={canvasRef}
        className="relative w-[1400px] h-[846px] canvas-container"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Grid 
          visible={showGrid} 
          size={gridSize} 
          color="rgba(0, 0, 0, 0.1)"
        />

        <img
          src={sketchbookBase}
          alt="Empty sketchbook"
          className="w-full h-full object-contain select-none"
          draggable="false"
        />

        {placedStickers.map((placed) => (
          <PlacedSticker
            key={placed.position.id}
            id={placed.position.id}
            sticker={placed.sticker}
            position={placed.position}
            isActive={activeStickerId === placed.position.id}
            onSelect={() => setActiveStickerId(placed.position.id)}
            onPositionChange={(newPos) => updateStickerPosition(placed.position.id, newPos)}
            onDelete={() => deleteSticker(placed.position.id)}
            onZIndexChange={(direction) => handleZIndexChange(placed.position.id, direction)}
            snapToGrid={showGrid ? gridSize : null}
          />
        ))}
      </div>

      {showSaveModal && (
        <SaveModal
          onClose={() => setShowSaveModal(false)}
          generatePreview={generatePreview}
          placedStickers={placedStickers}
        />
      )}
    </div>
  );
};

export default Canvas;
