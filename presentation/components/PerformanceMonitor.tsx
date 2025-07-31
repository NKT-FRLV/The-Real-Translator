'use client';
import { useEffect, useState } from 'react';

interface PerformanceStats {
  avgTtft: number;
  avgSpeed: number;
  totalRequests: number;
  errors: number;
  lastUpdate: string;
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    avgTtft: 0,
    avgSpeed: 0,
    totalRequests: 0,
    errors: 0,
    lastUpdate: new Date().toLocaleTimeString(),
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) return;

    // Listen for performance events from the streaming hook
    const handlePerformanceUpdate = (event: CustomEvent) => {
      const { ttft, tokensPerSecond, error } = event.detail;
      
      setStats(prev => {
        const totalRequests = prev.totalRequests + 1;
        const errors = prev.errors + (error ? 1 : 0);
        
        const avgTtft = ttft 
          ? (prev.avgTtft * (totalRequests - 1) + ttft) / totalRequests
          : prev.avgTtft;
          
        const avgSpeed = tokensPerSecond 
          ? (prev.avgSpeed * (totalRequests - 1) + tokensPerSecond) / totalRequests
          : prev.avgSpeed;
        
        return {
          avgTtft: Math.round(avgTtft),
          avgSpeed: Math.round(avgSpeed * 10) / 10,
          totalRequests,
          errors,
          lastUpdate: new Date().toLocaleTimeString(),
        };
      });
    };

    window.addEventListener('translation-performance', handlePerformanceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('translation-performance', handlePerformanceUpdate as EventListener);
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700"
        >
          📊 Perf
        </button>
      ) : (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">⚡ Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Avg TTFT:</span>
              <span className={stats.avgTtft < 500 ? 'text-green-400' : stats.avgTtft < 1000 ? 'text-yellow-400' : 'text-red-400'}>
                {stats.avgTtft}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Avg Speed:</span>
              <span className={stats.avgSpeed > 50 ? 'text-green-400' : stats.avgSpeed > 20 ? 'text-yellow-400' : 'text-red-400'}>
                {stats.avgSpeed} tok/s
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Requests:</span>
              <span>{stats.totalRequests}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Errors:</span>
              <span className={stats.errors === 0 ? 'text-green-400' : 'text-red-400'}>
                {stats.errors}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Updated:</span>
              <span className="text-gray-400">{stats.lastUpdate}</span>
            </div>
          </div>
          
          <button
            onClick={() => setStats({
              avgTtft: 0,
              avgSpeed: 0,
              totalRequests: 0,
              errors: 0,
              lastUpdate: new Date().toLocaleTimeString(),
            })}
            className="mt-2 text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 w-full"
          >
            🗑️ Reset Stats
          </button>
        </div>
      )}
    </div>
  );
}; 