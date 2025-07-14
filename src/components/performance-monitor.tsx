import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Database, Globe, Wifi, Monitor, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  networkStatus: 'online' | 'offline';
  renderTime: number;
  cacheStatus: 'hit' | 'miss' | 'stale';
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    networkStatus: 'online',
    renderTime: 0,
    cacheStatus: 'hit'
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (import.meta.env.MODE === 'development') {
      setIsVisible(true);
    }

    const measurePerformance = () => {
      // Measure page load time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

      // Measure memory usage (if available)
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 0;

      // Measure API response time
      const apiStart = performance.now();
      fetch('/api/posts')
        .then(() => {
          const apiResponseTime = performance.now() - apiStart;
          
          setMetrics({
            loadTime: Math.round(loadTime),
            apiResponseTime: Math.round(apiResponseTime),
            memoryUsage,
            networkStatus: navigator.onLine ? 'online' : 'offline',
            renderTime: Math.round(performance.now()),
            cacheStatus: 'hit'
          });
        })
        .catch(() => {
          setMetrics(prev => ({
            ...prev,
            cacheStatus: 'miss',
            networkStatus: 'offline'
          }));
        });
    };

    measurePerformance();
    const interval = setInterval(measurePerformance, 30000); // Update every 30 seconds

    // Listen for network status changes
    const handleOnline = () => setMetrics(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, networkStatus: 'offline' }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getPerformanceScore = () => {
    let score = 100;
    if (metrics.loadTime > 1000) score -= 20;
    if (metrics.apiResponseTime > 500) score -= 20;
    if (metrics.memoryUsage > 80) score -= 20;
    if (metrics.networkStatus === 'offline') score -= 30;
    if (metrics.cacheStatus === 'miss') score -= 10;
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const refreshMetrics = () => {
    window.location.reload();
  };

  if (!isVisible) return null;

  const score = getPerformanceScore();

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Performance Monitor
            <Badge variant="outline" className={getScoreColor(score)}>
              {score}%
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Real-time performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Load Time
              </span>
              <span className="font-mono">{metrics.loadTime}ms</span>
            </div>
            <Progress value={Math.min((metrics.loadTime / 2000) * 100, 100)} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                API Response
              </span>
              <span className="font-mono">{metrics.apiResponseTime}ms</span>
            </div>
            <Progress value={Math.min((metrics.apiResponseTime / 1000) * 100, 100)} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Memory Usage
              </span>
              <span className="font-mono">{metrics.memoryUsage}%</span>
            </div>
            <Progress value={metrics.memoryUsage} className="h-1" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <Badge variant={metrics.networkStatus === 'online' ? 'default' : 'destructive'} className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                {metrics.networkStatus}
              </Badge>
              <Badge variant={metrics.cacheStatus === 'hit' ? 'default' : 'secondary'} className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {metrics.cacheStatus}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshMetrics}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}