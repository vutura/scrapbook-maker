// src/components/PlacedSticker.jsx
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const calculateRealisticEffect = (x, width, isDragging) => {
    const centerX = 1400 / 2;
    const stickerCenter = x + (width / 2);
    const rightEdge = x + width;
    const leftEdge = x;
    
    const distanceFromCreaseLeft = Math.abs(centerX - rightEdge);
    const distanceFromCreaseRight = Math.abs(centerX - leftEdge);
    const creaseWidth = 250;
    
    if (distanceFromCreaseLeft < creaseWidth || distanceFromCreaseRight < creaseWidth) {
      const isLeftSide = stickerCenter < centerX;
      let bendFactor;
      
      if (isLeftSide) {
        bendFactor = Math.min(1, distanceFromCreaseLeft / creaseWidth);
        return {
          transform: `
            perspective(1500px) 
            translateZ(${-(1 - bendFactor) * 10}px)
            rotateY(${4 - (bendFactor * 4)}deg)
          `,
          transformOrigin: 'right center',
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'all 0.1s ease-out',
          willChange: 'transform',
          shadowGradient: `linear-gradient(to right,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,${0.04 * (1 - bendFactor)}) 75%, 
            rgba(0,0,0,${0.06 * (1 - bendFactor)}) 100%  
        )`
        };
      } else {
        bendFactor = Math.min(1, distanceFromCreaseRight / creaseWidth);
        return {
          transform: `
            perspective(1500px)
            translateZ(${-(1 - bendFactor) * 10}px)
            rotateY(${-4 + (bendFactor * 4)}deg)
          `,
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'all 0.1s ease-out',
          willChange: 'transform',
          shadowGradient: `linear-gradient(to left,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,${0.04 * (1 - bendFactor)}) 75%, 
            rgba(0,0,0,${0.06 * (1 - bendFactor)}) 100%  
        )`
        };
      }
    }
  
    return {
      transition: isDragging ? 'none' : 'all 0.1s ease-out',
      willChange: 'transform',
      shadowGradient: 'none'
    };
  };

const PlacedSticker = ({ 
  sticker, 
  position, 
  onPositionChange, 
  onDelete, 
  onZIndexChange, 
  isActive, 
  onSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [opacity, setOpacity] = useState(position.opacity || 1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [controlBarPosition, setControlBarPosition] = useState({ x: 0, y: 0 });

  const stickerRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const rotationStartPos = useRef({ angle: 0, start: 0 });


  useEffect(() => {
    if (isActive && stickerRef.current) {
        const updatePosition = () => {
            const rect = stickerRef.current.getBoundingClientRect();
            setControlBarPosition({
              x: rect.left + (rect.width / 2),
              y: rect.top - 70
            });
          };

      updatePosition();
      
      if (isDragging || isResizing || isRotating) {
        const rafId = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(rafId);
      }
    }
  }, [isActive, isDragging, isResizing, isRotating, position.x, position.y, position.width, position.height]);

  const getAngle = (center, point) => {
    const radians = Math.atan2(point.y - center.y, point.x - center.x);
    return radians * (180 / Math.PI);
  };

  const handleResizeStart = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const stickerRect = stickerRef.current.getBoundingClientRect();
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: stickerRect.width,
      height: stickerRect.height,
      corner,
      originalRatio: stickerRect.width / stickerRect.height,
    };
  };

  const handleResize = (e) => {
    if (!isResizing) return;

    const dx = e.clientX - resizeStartPos.current.x;
    const dy = e.clientY - resizeStartPos.current.y;
    const { corner, originalRatio } = resizeStartPos.current;

    let newWidth = resizeStartPos.current.width;
    let newHeight = resizeStartPos.current.height;

    if (corner.includes('e')) {
      newWidth = Math.max(50, Math.min(800, resizeStartPos.current.width + dx));
      newHeight = newWidth / originalRatio;
    } else if (corner.includes('w')) {
      newWidth = Math.max(50, Math.min(800, resizeStartPos.current.width - dx));
      newHeight = newWidth / originalRatio;
    }

    onPositionChange({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleRotationStart = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);

    const stickerRect = stickerRef.current.getBoundingClientRect();
    const centerX = stickerRect.left + stickerRect.width / 2;
    const centerY = stickerRect.top + stickerRect.height / 2;

    rotationStartPos.current = {
      angle: position.rotation || 0,
      start: getAngle({ x: centerX, y: centerY }, { x: e.clientX, y: e.clientY }),
    };
  };

  const handleRotation = (e) => {
    if (!isRotating) return;

    const stickerRect = stickerRef.current.getBoundingClientRect();
    const centerX = stickerRect.left + stickerRect.width / 2;
    const centerY = stickerRect.top + stickerRect.height / 2;

    const currentAngle = getAngle(
      { x: centerX, y: centerY },
      { x: e.clientX, y: e.clientY }
    );
    const deltaAngle = currentAngle - rotationStartPos.current.start;
    const newRotation = (rotationStartPos.current.angle + deltaAngle) % 360;

    onPositionChange({ rotation: newRotation });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) {
      onSelect();
    }
    
    if (!isResizing && !isRotating) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    
    onPositionChange({ x: newX, y: newY });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isResizing) {
        handleResize(e);
      } else if (isRotating) {
        handleRotation(e);
      } else if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
      if (isResizing) {
        setIsResizing(false);
      }
      if (isRotating) {
        setIsRotating(false);
      }
    };

    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, isRotating]);

  const handleOpacityChange = (e) => {
    e.stopPropagation();
    const newOpacity = e.target.value / 100;
    setOpacity(newOpacity);
    onPositionChange({ opacity: newOpacity });
  };

  const styles = calculateRealisticEffect(position.x, position.width || 200, isDragging);

  return (
    <div
      ref={stickerRef}
      className={`absolute placed-sticker ${isActive ? 'outline outline-2 outline-pink-300' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width || 200}px`,
        height: `${position.height || 200}px`,
        transform: `rotate(${position.rotation || 0}deg)`,
        zIndex: position.zIndex || 1,
        cursor: 'move',
        userSelect: 'none',
        touchAction: 'none',
        position: 'absolute'
      }}
      onMouseDown={handleMouseDown}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Outer wrapper for flip effect */}
      <div
        className="w-full h-full"
        style={{
          transform: `scaleX(${isFlipped ? -1 : 1})`,
          transformOrigin: 'center center',
          opacity: opacity
        }}
      >
        {/* Inner wrapper for curve effect */}
        <div
          className="w-full h-full"
          style={{
            ...styles,
            transform: styles.transform || '',
          }}
        >
          <img
            src={sticker.src}
            alt={sticker.alt}
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable="false"
          />
          
          {/* Shadow overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: styles.shadowGradient,
              zIndex: 1
            }}
          />
        </div>
      </div>

      {/* Control points */}
      {isActive && (
        <>
          {['nw', 'ne', 'se', 'sw'].map((corner) => (
            <>
              {/* Resize handle */}
              <div
                key={`resize-${corner}`}
                className="absolute w-3 h-3 bg-white border-2 border-pink-300 rounded-full"
                style={{
                  top: corner.includes('n') ? '-6px' : 'auto',
                  bottom: corner.includes('s') ? '-6px' : 'auto',
                  left: corner.includes('w') ? '-6px' : 'auto',
                  right: corner.includes('e') ? '-6px' : 'auto',
                  cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                  pointerEvents: 'auto',
                  zIndex: 99999
                }}
                onMouseDown={(e) => handleResizeStart(e, corner)}
              />
              {/* Rotation handle */}
              <div
                key={`rotate-${corner}`}
                className="absolute w-4 h-4 bg-pink-300 rounded-full"
                style={{
                  top: corner.includes('n') ? '-20px' : 'auto',
                  bottom: corner.includes('s') ? '-20px' : 'auto',
                  left: corner.includes('w') ? '-20px' : 'auto',
                  right: corner.includes('e') ? '-20px' : 'auto',
                  cursor: 'rotate',
                  pointerEvents: 'auto',
                  zIndex: 99999
                }}
                onMouseDown={(e) => handleRotationStart(e, corner)}
              />
            </>
          ))}
        </>
      )}

      {/* Control bar rendered in portal */}
      {isActive && createPortal(
        <div
          className="fixed bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 
                   flex items-center gap-3 whitespace-nowrap transform -translate-x-1/2"
          style={{
            zIndex: 1200,
            left: `${controlBarPosition.x}px`,
            top: `${controlBarPosition.y}px`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Delete button */}
          <button
            onClick={onDelete}
            className="w-6 h-6 rounded-full flex items-center justify-center
                     bg-pink-50 hover:bg-pink-100 text-pink-500 
                     transition-all duration-150 text-sm font-serialb"
          >
            ✕
          </button>

          {/* Opacity slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={opacity * 100}
              onChange={handleOpacityChange}
              className="w-20"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs text-gray-600">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          {/* Flip button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm px-2"
          >
            ⟲
          </button>

          {/* Z-index controls */}
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZIndexChange('backward');
              }}
              className="text-gray-600 hover:text-gray-800 px-1"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZIndexChange('forward');
              }}
              className="text-gray-600 hover:text-gray-800 px-1"
            >
              ↑
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PlacedSticker;