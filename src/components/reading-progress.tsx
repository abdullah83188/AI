import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(Math.max(scrollPercent, 0), 100));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <Progress 
        value={progress} 
        className="h-1 rounded-none bg-transparent"
        style={{
          background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
        }}
      />
    </div>
  );
}