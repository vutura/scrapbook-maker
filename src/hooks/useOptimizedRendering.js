// src/hooks/useOptimizedRendering.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useVirtualization = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  useEffect(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );

    setVisibleItems(items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      style: {
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        height: itemHeight
      }
    })));
  }, [scrollTop, items, itemHeight, containerHeight]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    handleScroll
  };
};

export const useErrorHandling = () => {
  const [errors, setErrors] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addError = useCallback((error) => {
    const id = Date.now();
    setErrors(prev => [...prev, { id, message: error.message }]);

    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== id));
    }, 5000);
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  return {
    errors,
    notifications,
    addError,
    addNotification
  };
};

export const useCanvasOptimization = () => {
  const requestIdRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const scheduleUpdate = useCallback((callback) => {
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }

    setIsUpdating(true);
    requestIdRef.current = requestAnimationFrame(() => {
      callback();
      setIsUpdating(false);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return {
    scheduleUpdate,
    isUpdating
  };
};