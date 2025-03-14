
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 'lg',
  showPercentage = true,
  className,
  animated = true,
}) => {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
  };

  useEffect(() => {
    if (animated) {
      // Reset progress to 0 if value becomes 0 (for reset functionality)
      if (value === 0) {
        setProgress(0);
        return;
      }
      
      // Animate to the target percentage
      let start = progress;
      const end = percentage;
      const duration = 1000; // 1 second
      const increment = 10; // Update every 10ms
      const steps = duration / increment;
      const step = (end - start) / steps;
      
      let current = start;
      const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
          clearInterval(timer);
          setProgress(end);
        } else {
          setProgress(current);
        }
      }, increment);
      
      return () => clearInterval(timer);
    } else {
      setProgress(percentage);
    }
  }, [percentage, animated, value, progress]);

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <div 
        className="rounded-full h-full w-full bg-gray-200 dark:bg-gray-700 transition-all duration-300"
        style={{
          background: `conic-gradient(
            #8B5CF6 ${progress}%, 
            #E5E7EB ${progress}%
          )`
        }}
      >
        <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          {showPercentage && (
            <div className="text-center animate-pulse-subtle">
              <span className="text-2xl font-bold text-wishlist-primary dark:text-purple-400">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
