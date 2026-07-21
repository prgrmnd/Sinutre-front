import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { WarningCircle, CheckCircle, Info } from '@phosphor-icons/react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextData {
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      <div className="toast toast-top toast-end z-[9999]">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`alert shadow-lg text-white flex items-center gap-3 ${
              toast.type === 'error' ? 'alert-error' : 
              toast.type === 'success' ? 'alert-success' : 
              'alert-info'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={24} weight="fill" />}
            {toast.type === 'error' && <WarningCircle size={24} weight="fill" />}
            {toast.type === 'info' && <Info size={24} weight="fill" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);