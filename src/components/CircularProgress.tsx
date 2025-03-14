
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
      const timer = setTimeout(() => {
        setProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <div 
        className="rounded-full h-full w-full bg-gray-200"
        style={{
          background: `conic-gradient(
            #8B5CF6 ${progress}%, 
            #E5E7EB ${progress}%
          )`
        }}
      >
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          {showPercentage && (
            <div className="text-center">
              <span className="text-2xl font-bold text-wishlist-primary">{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
