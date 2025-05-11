// src/App.jsx
import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/Navbar';
import Canvas from './components/Canvas';
import StickersPanel from './components/StickersPanel';
import WelcomeModal from './components/WelcomeModal';
import ErrorNotifications from './components/ErrorNotifications';
import { useErrorHandling } from './hooks/useOptimizedRendering';
import './App.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-serialb text-pink-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#FFE4E6');
  const [showWelcome, setShowWelcome] = useState(null);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const { errors, notifications, addError, addNotification } = useErrorHandling();

  useEffect(() => {
    // Check if this is the first time loading the app
    const neverShow = localStorage.getItem('neverShowWelcome');
    const hasVisited = localStorage.getItem('hasVisitedScrapbook');

    // Only show welcome modal if it hasn't been disabled and hasn't been visited before
    if (import.meta.env.MODE !== 'development') {
      if (neverShow !== 'true' && !hasVisited) {
        // Use a small timeout to ensure initial render is complete
        const timer = setTimeout(() => {
          setShowWelcome(true);
        }, 100);

        return () => clearTimeout(timer);
      } else {
        setShowWelcome(false);
      }
    } else {
      // Always show in development mode
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    if (import.meta.env.MODE !== 'development') {
      localStorage.setItem('hasVisitedScrapbook', 'true');
    }
  };

  const handleGlobalClick = (e) => {
    // Verificar si el clic es en un área específica
    const isSticker = e.target.closest('.placed-sticker');
    const isColorPicker = e.target.closest('[data-color-picker]');
    const isStickersPanel = e.target.closest('.stickers-panel');
    const isNavbar = e.target.closest('.navbar');
    
    // Solo desactivar sticker si se hace clic fuera de estas áreas
    if (!isSticker && !isColorPicker && !isStickersPanel && !isNavbar) {
      setActiveStickerId(null);
    }
  };

  // Renderizado condicional basado en el estado de showWelcome
  if (showWelcome === null) {
    // Mostrar un contenedor vacío mientras se determina si mostrar el modal
    return null;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setActiveStickerId(null);
      }}
    >
      {showWelcome && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-auto"
          style={{ 
            background: 'rgba(0,0,0,0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <WelcomeModal onClose={handleWelcomeClose} />
        </div>
      )}
  
      <div 
        className={`flex flex-col min-h-screen ${showWelcome ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ 
          background: typeof backgroundColor === 'string' && !backgroundColor.includes('gradient') 
            ? backgroundColor 
            : backgroundColor
        }}
        onClick={handleGlobalClick}
      >
        <Navbar 
          currentColor={backgroundColor} 
          onColorChange={setBackgroundColor} 
          className="navbar"
        />
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-4">
            <Canvas 
              activeStickerId={activeStickerId}
              setActiveStickerId={setActiveStickerId}
            />
          </div>
        </div>
        <StickersPanel />

        {/* Error and Notification display */}
        <ErrorNotifications 
          errors={errors}
          notifications={notifications}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;