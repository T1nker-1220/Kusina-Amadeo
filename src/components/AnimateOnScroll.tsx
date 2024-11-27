"use client";

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import clsx from 'clsx';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation: 'fade-in' | 'slide-up' | 'slide-down' | 'scale' | 'slide-left' | 'slide-right';
  delay?: 100 | 200 | 300 | 400 | 500;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const AnimateOnScroll = ({
  children,
  animation,
  delay,
  className,
  threshold,
  rootMargin,
  triggerOnce = true,
}: AnimateOnScrollProps) => {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div
      ref={elementRef}
      className={clsx(
        isVisible && `animate-${animation}`,
        delay && `delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};
