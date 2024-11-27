"use client";

import { useEffect, useRef, useState } from 'react';

interface GestureState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  isSwiping: boolean;
}

interface UseGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

export const useGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false,
}: UseGestureProps = {}) => {
  const [state, setState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    direction: null,
    distance: 0,
    isSwiping: false,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setState({
        startX: touch.clientX,
        startY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        direction: null,
        distance: 0,
        isSwiping: true,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      const deltaX = touch.clientX - state.startX;
      const deltaY = touch.clientY - state.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Determine swipe direction
      let direction: GestureState['direction'] = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      setState(prev => ({
        ...prev,
        deltaX,
        deltaY,
        direction,
        distance,
      }));
    };

    const handleTouchEnd = () => {
      if (state.distance >= threshold) {
        switch (state.direction) {
          case 'left':
            onSwipeLeft?.();
            break;
          case 'right':
            onSwipeRight?.();
            break;
          case 'up':
            onSwipeUp?.();
            break;
          case 'down':
            onSwipeDown?.();
            break;
        }
      }

      setState(prev => ({
        ...prev,
        isSwiping: false,
      }));
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventScroll, state.startX, state.startY]);

  return { elementRef, ...state };
};
