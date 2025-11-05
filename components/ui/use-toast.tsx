
'use client'            

import React from 'react';
import { JSX } from 'react/jsx-runtime';

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive';
};


type ToastFn = (toast: Omit<Toast, 'id'>) => void;

type ToastContextType = {
  toasts: Toast[];
  toast: ToastFn;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast: ToastFn = (t) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...t, id }]);
   
    if (t.duration && t.duration > 0) {
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), t.duration);
    }
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    toast: context.toast,
    dismiss: context.dismiss,
    toasts: context.toasts,
  };
};
