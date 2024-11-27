"use client";

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useGesture } from '@/hooks/useGesture';
import clsx from 'clsx';

interface SwipeableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const SwipeableDrawer = ({
  isOpen,
  onClose,
  children,
  position = 'bottom',
  size = 'md'
}: SwipeableDrawerProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const sizes = {
    sm: position === 'bottom' ? 'h-1/4' : 'w-64',
    md: position === 'bottom' ? 'h-1/2' : 'w-80',
    lg: position === 'bottom' ? 'h-3/4' : 'w-96',
    full: position === 'bottom' ? 'h-[calc(100%-2rem)]' : 'w-full'
  };

  const { elementRef, deltaY, deltaX, isSwiping } = useGesture({
    onSwipeDown: () => {
      if (position === 'bottom') {
        handleClose();
      }
    },
    onSwipeLeft: () => {
      if (position === 'right') {
        handleClose();
      }
    },
    onSwipeRight: () => {
      if (position === 'left') {
        handleClose();
      }
    },
    threshold: 50,
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Calculate transform based on swipe
  const getTransform = () => {
    if (!isSwiping) return '';
    
    switch (position) {
      case 'bottom':
        return `translateY(${Math.max(0, deltaY)}px)`;
      case 'left':
        return `translateX(${Math.min(0, deltaX)}px)`;
      case 'right':
        return `translateX(${Math.max(0, deltaX)}px)`;
      default:
        return '';
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom={clsx({
              'translate-y-full': position === 'bottom',
              '-translate-x-full': position === 'left',
              'translate-x-full': position === 'right',
            })}
            enterTo="translate-y-0 translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-y-0 translate-x-0"
            leaveTo={clsx({
              'translate-y-full': position === 'bottom',
              '-translate-x-full': position === 'left',
              'translate-x-full': position === 'right',
            })}
          >
            <div
              ref={elementRef as any}
              className={clsx(
                'fixed bg-white dark:bg-gray-800 shadow-xl transition-transform',
                sizes[size],
                {
                  'bottom-0 left-0 right-0 rounded-t-2xl': position === 'bottom',
                  'top-0 left-0 bottom-0': position === 'left',
                  'top-0 right-0 bottom-0': position === 'right',
                }
              )}
              style={{
                transform: getTransform(),
              }}
            >
              {/* Drag handle for bottom drawer */}
              {position === 'bottom' && (
                <div className="w-full h-1.5 flex items-center justify-center p-4">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>
              )}
              
              <div className="p-4 h-full overflow-y-auto">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SwipeableDrawer;
