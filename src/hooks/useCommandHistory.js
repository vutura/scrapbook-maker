// src/hooks/useCommandHistory.js
import { useState, useCallback } from 'react';

export const useCommandHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const executeCommand = useCallback((command) => {
    try {
      const newHistory = history.slice(0, currentIndex + 1);
      command.execute();
      setHistory([...newHistory, command]);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error executing command:', error);
    }
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      try {
        history[currentIndex].undo();
        setCurrentIndex(currentIndex - 1);
      } catch (error) {
        console.error('Error undoing command:', error);
      }
    }
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      try {
        history[currentIndex + 1].execute();
        setCurrentIndex(currentIndex + 1);
      } catch (error) {
        console.error('Error redoing command:', error);
      }
    }
  }, [history, currentIndex]);

  return {
    executeCommand,
    undo,
    redo,
    canUndo: currentIndex >= 0,
    canRedo: currentIndex < history.length - 1
  };
};