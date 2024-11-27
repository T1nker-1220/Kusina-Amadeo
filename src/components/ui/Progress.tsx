"use client";

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

const Progress = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  animate = true,
  className
}: ProgressProps) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Animate the progress bar
    if (animate) {
      const timeout = setTimeout(() => {
        setWidth((value / max) * 100);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setWidth((value / max) * 100);
    }
  }, [value, max, animate]);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    error: 'bg-red-500'
  };

  return (
    <div className="w-full">
      <div className={clsx('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizes[size], className)}>
        <div
          className={clsx(
            'transition-all duration-500 ease-out rounded-full',
            variants[variant],
            sizes[size]
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {Math.round(width)}%
        </div>
      )}
    </div>
  );
};

export default Progress;
