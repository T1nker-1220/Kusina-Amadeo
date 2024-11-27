'use client';

import { Toaster, toast as hotToast } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#059669',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#dc2626',
          },
        },
      }}
    />
  );
};

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  dismiss: () => hotToast.dismiss(),
};

// Export the toast utility as default
export default toast;
