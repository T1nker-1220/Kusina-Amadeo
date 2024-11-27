import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  fullScreen = false,
  className 
}: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
      className
    )}>
      {/* Spinner */}
      <div className={cn(
        'w-12 h-12 rounded-full',
        'border-4 border-brand-300 border-t-brand-500',
        'animate-spin'
      )} />
      
      {/* Message */}
      <p className={cn(
        'mt-4 text-brand-600 dark:text-brand-400',
        'animate-pulse font-medium'
      )}>
        {message}
      </p>
    </div>
  );
}
