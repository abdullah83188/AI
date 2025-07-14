import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Mouse, RefreshCw } from 'lucide-react';

interface ClickEvent {
  timestamp: number;
  element: string;
  href?: string;
  status: 'success' | 'error' | 'pending';
  error?: string;
}

export default function ClickTracker() {
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    if (!isTracking) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track links and buttons
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        const link = target.closest('a') || target.closest('button');
        const href = link?.getAttribute('href') || link?.getAttribute('data-href');
        const text = link?.textContent?.trim() || 'Unknown';
        
        const clickEvent: ClickEvent = {
          timestamp: Date.now(),
          element: text,
          href,
          status: 'pending'
        };

        setClicks(prev => [clickEvent, ...prev.slice(0, 19)]); // Keep last 20 clicks

        // Check if it's a navigation link
        if (href && href.startsWith('/')) {
          setTimeout(() => {
            // Check if URL changed (navigation successful)
            const currentPath = window.location.pathname + window.location.search;
            if (currentPath === href || currentPath.includes(href)) {
              setClicks(prev => prev.map(c => 
                c.timestamp === clickEvent.timestamp 
                  ? { ...c, status: 'success' as const }
                  : c
              ));
            } else {
              setClicks(prev => prev.map(c => 
                c.timestamp === clickEvent.timestamp 
                  ? { ...c, status: 'error' as const, error: 'Navigation failed' }
                  : c
              ));
            }
          }, 500);
        } else {
          // For buttons and other elements
          setTimeout(() => {
            setClicks(prev => prev.map(c => 
              c.timestamp === clickEvent.timestamp 
                ? { ...c, status: 'success' as const }
                : c
            ));
          }, 200);
        }
      }
    };

    // Also track JavaScript errors
    const handleError = (event: ErrorEvent) => {
      const errorClick: ClickEvent = {
        timestamp: Date.now(),
        element: 'JavaScript Error',
        status: 'error',
        error: event.message
      };
      setClicks(prev => [errorClick, ...prev.slice(0, 19)]);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('error', handleError);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('error', handleError);
    };
  }, [isTracking]);

  const clearClicks = () => setClicks([]);

  const errorCount = clicks.filter(c => c.status === 'error').length;
  const successCount = clicks.filter(c => c.status === 'success').length;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Mouse className="h-4 w-4" />
            Click Tracker
            <Badge variant={errorCount > 0 ? 'destructive' : 'default'}>
              {errorCount} errors
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTracking(!isTracking)}
              className="h-6 text-xs"
            >
              {isTracking ? 'Stop' : 'Start'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearClicks}
              className="h-6 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {clicks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Click on any link or button to track it
              </p>
            ) : (
              clicks.map((click, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {click.status === 'success' && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    {click.status === 'error' && (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    {click.status === 'pending' && (
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{click.element}</div>
                    {click.href && (
                      <div className="text-muted-foreground truncate">
                        {click.href}
                      </div>
                    )}
                    {click.error && (
                      <div className="text-red-600 text-xs mt-1">
                        {click.error}
                      </div>
                    )}
                    <div className="text-muted-foreground text-xs">
                      {new Date(click.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}