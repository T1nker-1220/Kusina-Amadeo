"use client";

import { toast } from '@/components/ui/Toast';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message);
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message);
    },
    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message);
    },
    dismiss: () => {
      toast.dismiss();
    }
  };

  return showToast;
};
