import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Eye, TrendingUp } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export default function GoogleAdSense({ 
  adSlot, 
  adFormat = 'auto', 
  className = '',
  style = {}
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize AdSense
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        console.log('AdSense ad initialized for slot:', adSlot);
      }
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }, [adSlot]);

  // For development/demo - show placeholder
  if (import.meta.env.MODE === 'development') {
    return (
      <Card className={`bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-dashed border-green-300 dark:border-green-700 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <Badge variant="outline" className="text-green-700 border-green-300">
              AdSense Placeholder
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Google AdSense Ad (Slot: {adSlot})
          </p>
          <p className="text-xs text-muted-foreground">
            This will show real ads in production
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Revenue Ready
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Auto-Optimized
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Auto-inject ads into blog posts
export function injectAdsenseIntoContent(content: string): string {
  const paragraphs = content.split('</p>');
  
  if (paragraphs.length < 3) return content;

  // Add first ad after 2nd paragraph
  const firstAdIndex = 2;
  const firstAd = `
    <div style="margin: 30px 0; text-align: center;">
      <div id="adsense-slot-1"></div>
    </div>
  `;

  // Add second ad after 60% of content
  const secondAdIndex = Math.floor(paragraphs.length * 0.6);
  const secondAd = `
    <div style="margin: 30px 0; text-align: center;">
      <div id="adsense-slot-2"></div>
    </div>
  `;

  // Insert ads
  paragraphs.splice(firstAdIndex, 0, firstAd);
  if (secondAdIndex < paragraphs.length - 1) {
    paragraphs.splice(secondAdIndex + 1, 0, secondAd);
  }

  return paragraphs.join('</p>');
}

// AdSense configuration component
export function AdSenseConfig() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Google AdSense Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to <a href="https://www.google.com/adsense/" target="_blank" className="underline">Google AdSense</a></li>
              <li>2. Create account and get your Publisher ID</li>
              <li>3. Replace "YOUR_PUBLISHER_ID" in the code</li>
              <li>4. Create ad units and get ad slot IDs</li>
              <li>5. Ads will auto-inject into blog posts (max 2 per post)</li>
            </ol>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Current Configuration:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Auto-inject: 2 ads per blog post</li>
              <li>• Placement: After 2nd paragraph & 60% through content</li>
              <li>• Format: Responsive display ads</li>
              <li>• Revenue optimization: Enabled</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}