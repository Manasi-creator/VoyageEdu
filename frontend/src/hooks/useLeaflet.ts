import { useEffect, useState } from 'react';

/**
 * Hook to wait for Leaflet.js to be loaded from CDN
 */
export const useLeaflet = () => {
  // Initialize state by checking if Leaflet is already loaded
  const [isLoaded, setIsLoaded] = useState(() => {
    const loaded = typeof window !== 'undefined' && !!window.L;
    if (loaded) {
      console.log('✅ Leaflet.js is already loaded');
    }
    return loaded;
  });

  useEffect(() => {
    // Check if Leaflet is already loaded (double check)
    if (window.L && !isLoaded) {
      console.log('✅ Leaflet.js detected, setting loaded state');
      setIsLoaded(true);
      return;
    }
    
    // If already loaded, no need to poll
    if (isLoaded) {
      return;
    }

    console.log('⏳ Waiting for Leaflet.js to load from CDN...');

    // Poll for Leaflet to be available
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.L) {
        console.log(`✅ Leaflet.js loaded after ${attempts * 100}ms`);
        setIsLoaded(true);
        clearInterval(checkInterval);
      } else if (attempts > 100) {
        // Stop after 10 seconds (100 * 100ms)
        clearInterval(checkInterval);
        console.error('❌ Leaflet.js failed to load from CDN after 10 seconds');
      }
    }, 100);

    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.L) {
        console.error('❌ Leaflet.js failed to load from CDN - timeout');
      }
    }, 15000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  return isLoaded;
};

