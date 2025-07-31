'use client';
import { useEffect } from 'react';

export const ClientWarmer: React.FC = () => {
  useEffect(() => {
    // ⚡ Warm up the API connection on app load
    const warmupConnection = async () => {
      try {
        await fetch('/api/translate-stream', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(1000) // Quick timeout for warmup
        });
      } catch (error) {
        // Ignore warmup errors - this is just optimization
        console.debug('API warmup completed');
      }
    };

    // Small delay to not interfere with initial page load
    const timer = setTimeout(warmupConnection, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // This component renders nothing - it's just for side effects
  return null;
}; 