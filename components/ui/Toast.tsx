import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { Notification, NotificationType } from '../../types';

// Simple Event Bus for Toasts
const TOAST_EVENT = 'nuffi:toast';

export const toast = {
  success: (title: string, message: string) => dispatchToast('SUCCESS', title, message),
  error: (title: string, message: string) => dispatchToast('ERROR', title, message),
  warning: (title: string, message: string) => dispatchToast('WARNING', title, message),
  info: (title: string, message: string) => dispatchToast('INFO', title, message),
};

function dispatchToast(type: NotificationType, title: string, message: string) {
  const event = new CustomEvent(TOAST_EVENT, {
    detail: { id: Date.now().toString(), type, title, message }
  });
  window.dispatchEvent(event);
}

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = e.detail as Notification;
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss
      setTimeout(() => {
        removeToast(newToast.id);
      }, 5000);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'ERROR': return <AlertCircle size={20} className="text-red-500" />;
      case 'WARNING': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'INFO': return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBorderColor = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS': return 'border-green-200 bg-green-50';
      case 'ERROR': return 'border-red-200 bg-red-50';
      case 'WARNING': return 'border-amber-200 bg-amber-50';
      case 'INFO': return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className={`w-80 p-4 rounded-xl shadow-lg border flex items-start gap-3 animate-in slide-in-from-right-full duration-300 ${getBorderColor(t.type)}`}
        >
          <div className="shrink-0 mt-0.5">{getIcon(t.type)}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{t.message}</p>
          </div>
          <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};