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
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const { errors, notifications, addError, addNotification } = useErrorHandling();

  useEffect(() => {
    if (import.meta.env.MODE !== 'development') {
      const neverShow = localStorage.getItem('neverShowWelcome');
      const hasVisited = localStorage.getItem('hasVisitedScrapbook');
      if (neverShow === 'true' || hasVisited) {
        setShowWelcome(false);
      }
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    if (import.meta.env.MODE !== 'development') {
      localStorage.setItem('hasVisitedScrapbook', 'true');
    }
  };

  const handleGlobalClick = (e) => {
    const isSticker = e.target.closest('.placed-sticker');
    const isPanel = e.target.closest('.stickers-panel');
    const isNavbar = e.target.closest('.navbar');
    
    if (!isSticker && !isPanel && !isNavbar) {
      setActiveStickerId(null);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        setActiveStickerId(null);
      }}
    >
      {showWelcome && <WelcomeModal onClose={handleWelcomeClose} />}
  
      <div 
        className={`flex flex-col min-h-screen ${showWelcome ? 'pointer-events-none blur-sm' : ''}`}
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