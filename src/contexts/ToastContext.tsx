import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface ToastContextType {
  toast: {
    error: (title: string, message: string) => void;
    success: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'error' | 'success' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    error: (title: string, message: string) => addToast(title, message, 'error'),
    success: (title: string, message: string) => addToast(title, message, 'success'),
    info: (title: string, message: string) => addToast(title, message, 'info'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-black border border-white p-4 min-w-[320px] max-w-[400px] pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {t.title}
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {t.message}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 right-0 h-px bg-white origin-left"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
