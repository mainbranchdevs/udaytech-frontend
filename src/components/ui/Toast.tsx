import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const variantStyles: Record<ToastVariant, { bg: string; color: string; icon: string }> = {
  success: { bg: 'var(--success-light)', color: 'var(--success)',  icon: '✓' },
  error:   { bg: 'var(--danger-light)',  color: 'var(--danger)',   icon: '✕' },
  info:    { bg: 'var(--brand-100)',     color: 'var(--brand-700)', icon: 'ℹ' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++nextId;
    setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:bottom-4 md:top-auto z-[200] flex flex-col gap-2 items-center md:items-end pointer-events-none">
        {toasts.map((t) => {
          const s = variantStyles[t.variant];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2 px-4 py-3 animate-[slideIn_0.2s_ease-out]"
              style={{
                background: s.bg,
                color: s.color,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                minWidth: '200px',
                maxWidth: '360px',
              }}
            >
              <span className="text-base font-bold shrink-0">{s.icon}</span>
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
