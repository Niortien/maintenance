'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: '10px',
          background: '#111827',
          color: '#f9fafb',
          border: '1px solid #374151',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#f59e0b', secondary: '#111827' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#111827' },
        },
      }}
    />
  );
}
