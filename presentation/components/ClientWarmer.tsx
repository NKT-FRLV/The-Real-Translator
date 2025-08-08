'use client';
import { warmupServerConnection } from '@/api/translate-stream';
import { useEffect } from 'react';

export const ClientWarmer: React.FC = () => {
  useEffect(() => {
    // ⚡ Warm up the API connection on app load
    warmupServerConnection('/api/translate-stream', 1000);

    // Small delay to not interfere with initial page load
    const timer = setTimeout(warmupServerConnection, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // This component renders nothing - it's just for side effects
  return null;
}; 